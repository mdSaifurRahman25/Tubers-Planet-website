import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireUser } from "@/lib/auth/require-user";
import cloudinary from "@/lib/cloudinary/cloudinary";

import {
    uploadImageBuffer,
    type UploadedImage,
} from "@/lib/cloudinary/upload-image";

import connectDatabase from "@/lib/db/connect-db";

import {
    createSourceImageFromFile,
    generateThumbnailImage,
    type SourceImageData,
} from "@/lib/services/generate-thumbnail-image";

import {
    generateThumbnailSchema,
    type GenerateThumbnailData,
} from "@/lib/validations/thumbnail.schema";

import Thumbnail from "@/models/Thumbnail";
import ThumbnailVersion from "@/models/ThumbnailVersion";

export const runtime = "nodejs";
export const maxDuration = 180;

const MAXIMUM_REFERENCE_IMAGE_COUNT = 3;

const MAXIMUM_REFERENCE_IMAGE_SIZE =
    10 * 1024 * 1024;

const allowedReferenceImageTypes =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
    ]);

class RequestValidationError extends Error {
    constructor(message: string) {
        super(message);

        this.name =
            "RequestValidationError";
    }
}

interface ParsedGenerateRequest {
    input: GenerateThumbnailData;
    referenceFiles: File[];
}

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to generate thumbnail";
};

const isUnauthorizedMessage = (
    message: string
): boolean => {
    const normalizedMessage =
        message.toLowerCase();

    return (
        normalizedMessage.includes(
            "unauthorized"
        ) ||
        normalizedMessage.includes(
            "login"
        )
    );
};

const normalizeMimeType = (
    mimeType: string
): string => {
    const normalizedMimeType =
        mimeType
            .split(";")[0]
            ?.trim()
            .toLowerCase();

    if (
        normalizedMimeType ===
        "image/jpg"
    ) {
        return "image/jpeg";
    }

    return normalizedMimeType || "";
};

const validateReferenceImage = (
    file: File
) => {
    const fileName =
        file.name ||
        "Reference image";

    if (file.size === 0) {
        throw new RequestValidationError(
            `"${fileName}" is empty`
        );
    }

    const mimeType =
        normalizeMimeType(
            file.type
        );

    if (
        !allowedReferenceImageTypes.has(
            mimeType
        )
    ) {
        throw new RequestValidationError(
            `"${fileName}" must be a JPG, PNG, or WebP image`
        );
    }

    if (
        file.size >
        MAXIMUM_REFERENCE_IMAGE_SIZE
    ) {
        throw new RequestValidationError(
            `"${fileName}" must be smaller than 10 MB`
        );
    }
};

const getReferenceFiles = (
    formData: FormData
): File[] => {
    const referenceFiles: File[] =
        [];

    const multipleValues =
        formData.getAll(
            "referenceImages"
        );

    for (
        const value of
        multipleValues
    ) {
        if (
            value instanceof File &&
            value.size > 0
        ) {
            referenceFiles.push(
                value
            );
        }
    }

    /*
     * পুরোনো singular field থাকলেও
     * backward compatibility-এর জন্য
     * support করা হচ্ছে।
     */
    if (
        referenceFiles.length === 0
    ) {
        const legacyValue =
            formData.get(
                "referenceImage"
            );

        if (
            legacyValue instanceof
            File &&
            legacyValue.size > 0
        ) {
            referenceFiles.push(
                legacyValue
            );
        }
    }

    if (
        referenceFiles.length >
        MAXIMUM_REFERENCE_IMAGE_COUNT
    ) {
        throw new RequestValidationError(
            "A maximum of 3 reference images is allowed"
        );
    }

    referenceFiles.forEach(
        validateReferenceImage
    );

    return referenceFiles;
};

const parseMultipartRequest = async (
    request: Request
): Promise<ParsedGenerateRequest> => {
    const formData =
        await request.formData();

    const rawInput =
        formData.get("input");

    if (
        typeof rawInput !==
        "string"
    ) {
        throw new RequestValidationError(
            "Thumbnail information is missing"
        );
    }

    let parsedInput: unknown;

    try {
        parsedInput =
            JSON.parse(rawInput);
    } catch {
        throw new RequestValidationError(
            "Invalid thumbnail information"
        );
    }

    const input =
        generateThumbnailSchema.parse(
            parsedInput
        );

    const referenceFiles =
        getReferenceFiles(
            formData
        );

    return {
        input,
        referenceFiles,
    };
};

const parseJsonRequest = async (
    request: Request
): Promise<ParsedGenerateRequest> => {
    const requestBody: unknown =
        await request.json();

    const input =
        generateThumbnailSchema.parse(
            requestBody
        );

    return {
        input,
        referenceFiles: [],
    };
};

const parseGenerateRequest = async (
    request: Request
): Promise<ParsedGenerateRequest> => {
    const contentType =
        request.headers
            .get("content-type")
            ?.toLowerCase() ?? "";

    if (
        contentType.includes(
            "multipart/form-data"
        )
    ) {
        return parseMultipartRequest(
            request
        );
    }

    return parseJsonRequest(
        request
    );
};

const destroyCloudinaryImage = async (
    publicId: string | undefined
) => {
    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type:
                    "image",

                invalidate: true,
            }
        );
    } catch (error) {
        console.error(
            "Generated image cleanup failed:",
            error
        );
    }
};

export async function POST(
    request: Request
) {
    let thumbnailId:
        | string
        | null = null;

    let thumbnailVersionId:
        | string
        | null = null;

    let uploadedImage:
        | UploadedImage
        | null = null;

    let operationCommitted =
        false;

    try {
        const user =
            await requireUser();

        const userId =
            user._id.toString();

        /*
         * JSON অথবা multipart/form-data
         * request parse করা হচ্ছে।
         */
        const {
            input,
            referenceFiles,
        } =
            await parseGenerateRequest(
                request
            );

        /*
         * Uploaded reference imageগুলোকে
         * Gemini inline image data-তে
         * convert করা হচ্ছে।
         *
         * Cloudinary-তে reference image
         * upload করা হবে না।
         */
        let sourceImages:
            SourceImageData[] = [];

        if (
            referenceFiles.length > 0
        ) {
            sourceImages =
                await Promise.all(
                    referenceFiles.map(
                        (
                            referenceFile
                        ) =>
                            createSourceImageFromFile(
                                referenceFile
                            )
                    )
                );
        }

        await connectDatabase();

        /*
         * Parent thumbnail project।
         */
        const thumbnail =
            await Thumbnail.create({
                userId,

                title:
                    input.title,

                description: "",

                style:
                    input.style,

                aspect_ratio:
                    input.aspect_ratio,

                color_scheme:
                    input.color_scheme,

                text_overlay:
                    input.text_overlay,

                image_url: "",

                cloudinary_public_id:
                    "",

                prompt_used: "",

                user_prompt:
                    input.prompt,

                model_used:
                    process.env
                        .GEMINI_FLASH_IMAGE_MODEL ||
                    "gemini-3.1-flash-image",

                generation_mode:
                    "flash_generate",

                current_version_id:
                    null,

                current_version_number:
                    0,

                total_versions: 0,

                isGenerating: true,

                generation_error:
                    "",
            });

        thumbnailId =
            thumbnail._id.toString();

        /*
         * কোনো reference image না থাকলে
         * traditional text-to-image।
         *
         * ১–৩টি image থাকলে
         * reference-guided generation।
         */
        const generatedImage =
            await generateThumbnailImage(
                input,
                "flash",

                sourceImages.length > 0
                    ? sourceImages
                    : undefined
            );

        /*
         * শুধু generated final image
         * Cloudinary-তে save হবে।
         */
        uploadedImage =
            await uploadImageBuffer(
                generatedImage.buffer,
                userId
            );

        /*
         * First Generation = Version 1।
         *
         * Uploaded reference image permanent
         * store করা হচ্ছে না, তাই
         * reference_images array empty থাকবে।
         */
        const thumbnailVersion =
            await ThumbnailVersion.create({
                thumbnailId:
                    thumbnail._id,

                userId,

                version_number: 1,

                title:
                    input.title,

                description: "",

                style:
                    input.style,

                aspect_ratio:
                    input.aspect_ratio,

                color_scheme:
                    input.color_scheme,

                text_overlay:
                    input.text_overlay,

                image_url:
                    uploadedImage.secureUrl,

                cloudinary_public_id:
                    uploadedImage.publicId,

                prompt_used:
                    generatedImage.promptUsed,

                user_prompt:
                    input.prompt,

                model_used:
                    generatedImage.modelUsed,

                generation_mode:
                    "flash_generate",

                reference_images: [],
            });

        thumbnailVersionId =
            thumbnailVersion._id.toString();

        /*
         * Parent snapshot update।
         */
        thumbnail.title =
            input.title;

        thumbnail.description =
            "";

        thumbnail.style =
            input.style;

        thumbnail.aspect_ratio =
            input.aspect_ratio;

        thumbnail.color_scheme =
            input.color_scheme;

        thumbnail.text_overlay =
            input.text_overlay;

        thumbnail.image_url =
            uploadedImage.secureUrl;

        thumbnail.cloudinary_public_id =
            uploadedImage.publicId;

        thumbnail.prompt_used =
            generatedImage.promptUsed;

        thumbnail.user_prompt =
            input.prompt;

        thumbnail.model_used =
            generatedImage.modelUsed;

        thumbnail.generation_mode =
            "flash_generate";

        thumbnail.current_version_id =
            thumbnailVersion._id;

        thumbnail.current_version_number =
            1;

        thumbnail.total_versions =
            1;

        thumbnail.isGenerating =
            false;

        thumbnail.generation_error =
            "";

        await thumbnail.save();

        operationCommitted = true;

        return NextResponse.json(
            {
                success: true,

                message:
                    "Thumbnail generated successfully",

                thumbnail,

                version:
                    thumbnailVersion,

                referenceImageCount:
                    sourceImages.length,
            },
            {
                status: 201,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Thumbnail generation failed:",
            error
        );

        /*
         * Parent update fail হলে newly-created
         * version record cleanup।
         */
        if (
            !operationCommitted &&
            thumbnailVersionId
        ) {
            try {
                await connectDatabase();

                await ThumbnailVersion.findByIdAndDelete(
                    thumbnailVersionId
                );
            } catch (
            versionCleanupError
            ) {
                console.error(
                    "Thumbnail version cleanup failed:",
                    versionCleanupError
                );
            }
        }

        /*
         * Database operation complete না হলে
         * generated final image cleanup।
         *
         * User-uploaded reference image
         * Cloudinary-তে upload হয়নি।
         */
        if (
            !operationCommitted &&
            uploadedImage?.publicId
        ) {
            await destroyCloudinaryImage(
                uploadedImage.publicId
            );
        }

        /*
         * ব্যর্থ parent project-এর status।
         */
        if (
            thumbnailId &&
            !operationCommitted
        ) {
            try {
                await connectDatabase();

                await Thumbnail.findByIdAndUpdate(
                    thumbnailId,
                    {
                        $set: {
                            isGenerating:
                                false,

                            generation_error:
                                getErrorMessage(
                                    error
                                ),

                            image_url: "",

                            cloudinary_public_id:
                                "",

                            current_version_id:
                                null,

                            current_version_number:
                                0,

                            total_versions:
                                0,
                        },
                    }
                );
            } catch (
            updateError
            ) {
                console.error(
                    "Failed thumbnail status update failed:",
                    updateError
                );
            }
        }

        if (
            error instanceof
            RequestValidationError
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error.message,
                },
                {
                    status: 400,
                }
            );
        }

        if (
            error instanceof
            ZodError
        ) {
            return NextResponse.json(
                {
                    success: false,

                    message:
                        error.issues[0]
                            ?.message ??
                        "Invalid thumbnail information",

                    errors:
                        error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        if (
            error instanceof
            SyntaxError
        ) {
            return NextResponse.json(
                {
                    success: false,

                    message:
                        "Invalid JSON request body",
                },
                {
                    status: 400,
                }
            );
        }

        const message =
            getErrorMessage(
                error
            );

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status:
                    isUnauthorizedMessage(
                        message
                    )
                        ? 401
                        : 500,
            }
        );
    }
}