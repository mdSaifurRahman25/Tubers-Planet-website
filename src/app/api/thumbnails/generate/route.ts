import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireUser } from "@/lib/auth/require-user";
import cloudinary from "@/lib/cloudinary/cloudinary";

import {
    uploadImageBuffer,
    type UploadedImage,
} from "@/lib/cloudinary/upload-image";

import connectDatabase from "@/lib/db/connect-db";
import { generateThumbnailImage } from "@/lib/services/generate-thumbnail-image";
import { generateThumbnailSchema } from "@/lib/validations/thumbnail.schema";

import Thumbnail from "@/models/Thumbnail";
import ThumbnailVersion from "@/models/ThumbnailVersion";

export const runtime = "nodejs";
export const maxDuration = 120;

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
        normalizedMessage.includes("login")
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
                resource_type: "image",
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
    let thumbnailId: string | null = null;

    let thumbnailVersionId:
        | string
        | null = null;

    let uploadedImage:
        | UploadedImage
        | null = null;

    try {
        const user = await requireUser();

        const userId =
            user._id.toString();

        const requestBody: unknown =
            await request.json();

        const input =
            generateThumbnailSchema.parse(
                requestBody
            );

        await connectDatabase();

        /*
         * Parent thumbnail project তৈরি হচ্ছে।
         * এখনো কোনো image version তৈরি হয়নি।
         */
        const thumbnail =
            await Thumbnail.create({
                userId,

                title: input.title,
                description: "",

                style: input.style,
                aspect_ratio:
                    input.aspect_ratio,
                color_scheme:
                    input.color_scheme,
                text_overlay:
                    input.text_overlay,

                image_url: "",
                cloudinary_public_id: "",

                prompt_used: "",
                user_prompt: input.prompt,

                model_used:
                    process.env
                        .GEMINI_FLASH_IMAGE_MODEL ||
                    "gemini-3.1-flash-image",

                generation_mode:
                    "flash_generate",

                current_version_id: null,
                current_version_number: 0,
                total_versions: 0,

                isGenerating: true,
                generation_error: "",
            });

        thumbnailId =
            thumbnail._id.toString();

        /*
         * প্রথম image draft তৈরি হচ্ছে।
         */
        const generatedImage =
            await generateThumbnailImage(
                input,
                "flash"
            );

        uploadedImage =
            await uploadImageBuffer(
                generatedImage.buffer,
                userId
            );

        /*
         * প্রথম generation আলাদা version
         * document হিসেবে সংরক্ষণ করা হচ্ছে।
         */
        const thumbnailVersion =
            await ThumbnailVersion.create({
                thumbnailId:
                    thumbnail._id,

                userId,

                version_number: 1,

                title: input.title,
                description: "",

                style: input.style,
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
         * Parent thumbnail-এর selected/current
         * version snapshot update করা হচ্ছে।
         */
        thumbnail.title =
            input.title;

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

        thumbnail.total_versions = 1;

        thumbnail.isGenerating = false;
        thumbnail.generation_error = "";

        await thumbnail.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Thumbnail generated successfully",
                thumbnail,
                version: thumbnailVersion,
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
         * Version তৈরি হওয়ার পরে parent save fail
         * করলে অসম্পূর্ণ version delete হবে।
         */
        if (thumbnailVersionId) {
            try {
                await connectDatabase();

                await ThumbnailVersion.findByIdAndDelete(
                    thumbnailVersionId
                );
            } catch (versionCleanupError) {
                console.error(
                    "Thumbnail version cleanup failed:",
                    versionCleanupError
                );
            }
        }

        /*
         * Database flow complete না হলে uploaded
         * Cloudinary image orphan হওয়া থেকে রক্ষা।
         */
        if (uploadedImage?.publicId) {
            await destroyCloudinaryImage(
                uploadedImage.publicId
            );
        }

        /*
         * Parent project রেখে failure status save
         * করা হচ্ছে, যাতে error trace থাকে।
         */
        if (thumbnailId) {
            try {
                await connectDatabase();

                await Thumbnail.findByIdAndUpdate(
                    thumbnailId,
                    {
                        $set: {
                            isGenerating: false,

                            generation_error:
                                getErrorMessage(error),

                            image_url: "",
                            cloudinary_public_id: "",

                            current_version_id: null,
                            current_version_number: 0,
                            total_versions: 0,
                        },
                    }
                );
            } catch (updateError) {
                console.error(
                    "Failed thumbnail status update failed:",
                    updateError
                );
            }
        }

        if (error instanceof ZodError) {
            return NextResponse.json(
                {
                    success: false,

                    message:
                        error.issues[0]?.message ??
                        "Invalid thumbnail information",

                    errors: error.flatten(),
                },
                {
                    status: 400,
                }
            );
        }

        if (error instanceof SyntaxError) {
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
            getErrorMessage(error);

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status:
                    isUnauthorizedMessage(message)
                        ? 401
                        : 500,
            }
        );
    }
}