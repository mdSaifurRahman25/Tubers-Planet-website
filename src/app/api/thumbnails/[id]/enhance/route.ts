import mongoose from "mongoose";
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
    enhanceThumbnailWithPro,
    readSourceImageFromUrl,
    type SourceImageData,
} from "@/lib/services/generate-thumbnail-image";

import { generateThumbnailSchema } from "@/lib/validations/thumbnail.schema";

import Thumbnail from "@/models/Thumbnail";
import ThumbnailVersion from "@/models/ThumbnailVersion";

export const runtime = "nodejs";
export const maxDuration = 180;

interface EnhanceRouteContext {
    params: Promise<{
        id: string;
    }>;
}

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
        this.name = "RequestValidationError";
    }
}

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to enhance thumbnail";
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
        normalizedMessage.includes("login")
    );
};

const normalizeMimeType = (
    mimeType: string
): string => {
    const normalized =
        mimeType
            .split(";")[0]
            ?.trim()
            .toLowerCase();

    if (normalized === "image/jpg") {
        return "image/jpeg";
    }

    return normalized || "";
};

const validateReferenceImage = (
    file: File
) => {
    if (file.size === 0) {
        throw new RequestValidationError(
            `"${file.name || "Reference image"}" is empty`
        );
    }

    const mimeType =
        normalizeMimeType(file.type);

    if (
        !allowedReferenceImageTypes.has(
            mimeType
        )
    ) {
        throw new RequestValidationError(
            `"${file.name || "Reference image"}" must be a JPG, PNG, or WebP file`
        );
    }

    if (
        file.size >
        MAXIMUM_REFERENCE_IMAGE_SIZE
    ) {
        throw new RequestValidationError(
            `"${file.name || "Reference image"}" must be smaller than 10 MB`
        );
    }
};

const getUploadedReferenceFiles = (
    formData: FormData
): File[] => {
    const uploadedFiles: File[] = [];

    /*
     * নতুন multiple-image field।
     */
    const multipleImageValues =
        formData.getAll("referenceImages");

    for (const value of multipleImageValues) {
        if (
            value instanceof File &&
            value.size > 0
        ) {
            uploadedFiles.push(value);
        }
    }

    /*
     * পুরোনো frontend-এর singular field
     * আপাতত support করা হচ্ছে।
     */
    if (uploadedFiles.length === 0) {
        const legacyReferenceImage =
            formData.get("referenceImage");

        if (
            legacyReferenceImage instanceof
            File &&
            legacyReferenceImage.size > 0
        ) {
            uploadedFiles.push(
                legacyReferenceImage
            );
        }
    }

    if (
        uploadedFiles.length >
        MAXIMUM_REFERENCE_IMAGE_COUNT
    ) {
        throw new RequestValidationError(
            "A maximum of 3 reference images is allowed"
        );
    }

    uploadedFiles.forEach(
        validateReferenceImage
    );

    return uploadedFiles;
};

const destroyCloudinaryImage = async (
    publicId: string | undefined,
    errorLabel: string
) => {
    if (!publicId) {
        return;
    }

    try {
        await cloudinary.uploader.destroy(
            publicId,
            {
                resource_type: "image",
                invalidate: true,
            }
        );
    } catch (error) {
        console.error(
            errorLabel,
            error
        );
    }
};

export async function POST(
    request: Request,
    { params }: EnhanceRouteContext
) {
    let activeThumbnailId:
        | string
        | null = null;

    let createdVersionId:
        | string
        | null = null;

    let finalUploadedImage:
        | UploadedImage
        | null = null;

    let operationCommitted = false;

    try {
        const user = await requireUser();

        const userId =
            user._id.toString();

        const { id } = await params;

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid thumbnail ID",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Frontend FormData:
         *
         * input              -> JSON string
         * referenceImages    -> 0 থেকে 3টি File
         *
         * পুরোনো referenceImage field-ও
         * backward compatibility-এর জন্য থাকবে।
         */
        const formData =
            await request.formData();

        const rawInput =
            formData.get("input");

        if (typeof rawInput !== "string") {
            throw new RequestValidationError(
                "Enhancement information is missing"
            );
        }

        let parsedInput: unknown;

        try {
            parsedInput =
                JSON.parse(rawInput);
        } catch {
            throw new RequestValidationError(
                "Invalid enhancement information"
            );
        }

        const input =
            generateThumbnailSchema.parse(
                parsedInput
            );

        const uploadedReferenceFiles =
            getUploadedReferenceFiles(
                formData
            );

        await connectDatabase();

        /*
         * Ownership যাচাই।
         */
        const existingThumbnail =
            await Thumbnail.findOne({
                _id: id,
                userId,
            });

        if (!existingThumbnail) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Thumbnail not found or you do not have permission to enhance it",
                },
                {
                    status: 404,
                }
            );
        }

        /*
         * Uploaded reference না থাকলে
         * current thumbnail থাকতে হবে।
         */
        if (
            uploadedReferenceFiles.length ===
            0 &&
            !existingThumbnail.image_url
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Upload a reference image or generate a thumbnail first",
                },
                {
                    status: 400,
                }
            );
        }

        /*
         * Atomic processing lock।
         */
        const thumbnail =
            await Thumbnail.findOneAndUpdate(
                {
                    _id: id,
                    userId,

                    isGenerating: {
                        $ne: true,
                    },
                },
                {
                    $set: {
                        isGenerating: true,
                        generation_error: "",
                    },
                },
                {
                    new: true,
                }
            );

        if (!thumbnail) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This thumbnail is already being processed",
                },
                {
                    status: 409,
                }
            );
        }

        activeThumbnailId =
            thumbnail._id.toString();

        /*
         * সর্বশেষ version number।
         */
        const latestVersion =
            await ThumbnailVersion.findOne({
                thumbnailId:
                    thumbnail._id,

                userId,
            })
                .sort({
                    version_number: -1,
                })
                .select({
                    version_number: 1,
                })
                .exec();

        let latestVersionNumber =
            latestVersion?.version_number ?? 0;

        /*
         * পুরোনো thumbnail-এর version history
         * না থাকলে বর্তমান image-কে Version 1
         * হিসেবে migrate করা হবে।
         */
        if (
            !latestVersion &&
            thumbnail.image_url
        ) {
            const legacyVersion =
                await ThumbnailVersion.create({
                    thumbnailId:
                        thumbnail._id,

                    userId,

                    version_number: 1,

                    title:
                        thumbnail.title,

                    description:
                        thumbnail.description ?? "",

                    style:
                        thumbnail.style,

                    aspect_ratio:
                        thumbnail.aspect_ratio,

                    color_scheme:
                        thumbnail.color_scheme,

                    text_overlay:
                        thumbnail.text_overlay,

                    image_url:
                        thumbnail.image_url,

                    cloudinary_public_id:
                        thumbnail.cloudinary_public_id ??
                        "",

                    prompt_used:
                        thumbnail.prompt_used ?? "",

                    user_prompt:
                        thumbnail.user_prompt ?? "",

                    model_used:
                        thumbnail.model_used ?? "",

                    generation_mode:
                        thumbnail.generation_mode ??
                        "flash_generate",

                    reference_images: [],
                });

            thumbnail.current_version_id =
                legacyVersion._id;

            thumbnail.current_version_number =
                1;

            thumbnail.total_versions = 1;

            await thumbnail.save();

            latestVersionNumber = 1;
        }

        const nextVersionNumber =
            latestVersionNumber + 1;

        /*
         * Uploaded image থাকলে সেগুলোই references।
         *
         * কোনো upload না থাকলে current thumbnail
         * একটি reference হিসেবে ব্যবহৃত হবে।
         */
        let sourceImages:
            SourceImageData[];

        let usedCurrentThumbnailAsReference =
            false;

        if (
            uploadedReferenceFiles.length > 0
        ) {
            sourceImages =
                await Promise.all(
                    uploadedReferenceFiles.map(
                        (
                            referenceFile
                        ) =>
                            createSourceImageFromFile(
                                referenceFile
                            )
                    )
                );
        } else {
            if (!thumbnail.image_url) {
                throw new RequestValidationError(
                    "A reference image is required"
                );
            }

            const currentSourceImage =
                await readSourceImageFromUrl(
                    thumbnail.image_url
                );

            sourceImages = [
                currentSourceImage,
            ];

            usedCurrentThumbnailAsReference =
                true;
        }

        /*
         * Premium final image generation।
         */
        const generatedImage =
            await enhanceThumbnailWithPro(
                input,
                sourceImages
            );

        /*
         * শুধু final generated image
         * Cloudinary-তে permanent থাকবে।
         *
         * User uploaded reference images
         * Cloudinary-তে upload করা হচ্ছে না।
         */
        finalUploadedImage =
            await uploadImageBuffer(
                generatedImage.buffer,
                userId
            );

        /*
         * Reference history metadata।
         *
         * Uploaded files permanentভাবে store না
         * করায় তাদের URL version record-এ রাখা
         * হচ্ছে না।
         *
         * Current thumbnail reference হলে তার
         * existing Cloudinary URL রাখা যাবে।
         */
        const versionReferenceImages =
            usedCurrentThumbnailAsReference &&
                thumbnail.image_url
                ? [
                    {
                        secure_url:
                            thumbnail.image_url,

                        cloudinary_public_id:
                            thumbnail.cloudinary_public_id ??
                            "",

                        original_name: "",

                        mime_type: "",

                        size_bytes: 0,

                        source_type:
                            "current_thumbnail" as const,
                    },
                ]
                : [];

        /*
         * নতুন Premium Enhance version।
         */
        const thumbnailVersion =
            await ThumbnailVersion.create({
                thumbnailId:
                    thumbnail._id,

                userId,

                version_number:
                    nextVersionNumber,

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
                    finalUploadedImage.secureUrl,

                cloudinary_public_id:
                    finalUploadedImage.publicId,

                prompt_used:
                    generatedImage.promptUsed,

                user_prompt:
                    input.prompt,

                model_used:
                    generatedImage.modelUsed,

                generation_mode:
                    "pro_enhance",

                reference_images:
                    versionReferenceImages,
            });

        createdVersionId =
            thumbnailVersion._id.toString();

        /*
         * Parent-এর current/selected version
         * snapshot update।
         *
         * পুরোনো generated image বা version
         * delete করা হচ্ছে না।
         */
        thumbnail.title =
            input.title;

        thumbnail.description = "";

        thumbnail.style =
            input.style;

        thumbnail.aspect_ratio =
            input.aspect_ratio;

        thumbnail.color_scheme =
            input.color_scheme;

        thumbnail.text_overlay =
            input.text_overlay;

        thumbnail.user_prompt =
            input.prompt;

        thumbnail.prompt_used =
            generatedImage.promptUsed;

        thumbnail.image_url =
            finalUploadedImage.secureUrl;

        thumbnail.cloudinary_public_id =
            finalUploadedImage.publicId;

        thumbnail.model_used =
            generatedImage.modelUsed;

        thumbnail.generation_mode =
            "pro_enhance";

        thumbnail.current_version_id =
            thumbnailVersion._id;

        thumbnail.current_version_number =
            nextVersionNumber;

        thumbnail.total_versions =
            nextVersionNumber;

        thumbnail.isGenerating = false;
        thumbnail.generation_error = "";

        await thumbnail.save();

        operationCommitted = true;

        return NextResponse.json(
            {
                success: true,

                message:
                    "Premium enhancement completed successfully",

                thumbnail,

                version:
                    thumbnailVersion,

                referenceImageCount:
                    sourceImages.length,
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Premium enhancement failed:",
            error
        );

        /*
         * Parent update ব্যর্থ হলে তৈরি হওয়া
         * version document cleanup।
         */
        if (
            !operationCommitted &&
            createdVersionId
        ) {
            try {
                await connectDatabase();

                await ThumbnailVersion.findByIdAndDelete(
                    createdVersionId
                );
            } catch (versionCleanupError) {
                console.error(
                    "Enhanced version cleanup failed:",
                    versionCleanupError
                );
            }
        }

        /*
         * Parent update ব্যর্থ হলে নতুন final
         * Cloudinary image orphan হতে দেওয়া হবে না।
         *
         * আগের version-এর image delete হবে না।
         */
        if (
            !operationCommitted &&
            finalUploadedImage?.publicId
        ) {
            await destroyCloudinaryImage(
                finalUploadedImage.publicId,
                "Enhanced image cleanup failed:"
            );
        }

        /*
         * Processing status reset।
         */
        if (
            activeThumbnailId &&
            !operationCommitted
        ) {
            try {
                await connectDatabase();

                await Thumbnail.findByIdAndUpdate(
                    activeThumbnailId,
                    {
                        $set: {
                            isGenerating: false,

                            generation_error:
                                getErrorMessage(error),
                        },
                    }
                );
            } catch (updateError) {
                console.error(
                    "Enhancement failure status update failed:",
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
                    message: error.message,
                },
                {
                    status: 400,
                }
            );
        }

        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,

                    message:
                        error.issues[0]?.message ??
                        "Invalid thumbnail information",

                    errors:
                        error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        const message =
            getErrorMessage(error);

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