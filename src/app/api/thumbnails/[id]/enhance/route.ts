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
import { enhanceThumbnailWithPro } from "@/lib/services/generate-thumbnail-image";
import { generateThumbnailSchema } from "@/lib/validations/thumbnail.schema";
import Thumbnail from "@/models/Thumbnail";

export const runtime = "nodejs";
export const maxDuration = 180;

interface EnhanceRouteContext {
    params: Promise<{
        id: string;
    }>;
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
    const normalized =
        message.toLowerCase();

    return (
        normalized.includes("unauthorized") ||
        normalized.includes("login")
    );
};

export async function POST(
    request: Request,
    { params }: EnhanceRouteContext
) {
    let uploadedImage:
        | UploadedImage
        | null = null;

    let activeThumbnailId:
        | string
        | null = null;

    try {
        const user = await requireUser();

        const { id } = await params;

        if (!mongoose.isValidObjectId(id)) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid thumbnail ID",
                },
                {
                    status: 400,
                }
            );
        }

        const requestBody: unknown =
            await request.json();

        const input =
            generateThumbnailSchema.parse(
                requestBody
            );

        await connectDatabase();

        const thumbnail =
            await Thumbnail.findOne({
                _id: id,
                userId: user._id.toString(),
            });

        if (!thumbnail) {
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

        if (!thumbnail.image_url) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Generate a Flash thumbnail before using Pro Enhance",
                },
                {
                    status: 400,
                }
            );
        }

        if (thumbnail.isGenerating) {
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

        const oldImageUrl =
            thumbnail.image_url;

        const oldCloudinaryPublicId =
            thumbnail.cloudinary_public_id;

        thumbnail.isGenerating = true;
        thumbnail.generation_error = "";

        await thumbnail.save();

        const generatedImage =
            await enhanceThumbnailWithPro(
                input,
                oldImageUrl
            );

        uploadedImage =
            await uploadImageBuffer(
                generatedImage.buffer,
                user._id.toString()
            );

        thumbnail.title = input.title;
        thumbnail.style = input.style;

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
            uploadedImage.secureUrl;

        thumbnail.cloudinary_public_id =
            uploadedImage.publicId;

        thumbnail.model_used =
            generatedImage.modelUsed;

        thumbnail.generation_mode =
            "pro_enhance";

        thumbnail.isGenerating = false;
        thumbnail.generation_error = "";

        await thumbnail.save();

        if (
            oldCloudinaryPublicId &&
            oldCloudinaryPublicId !==
            uploadedImage.publicId
        ) {
            try {
                await cloudinary.uploader.destroy(
                    oldCloudinaryPublicId,
                    {
                        resource_type: "image",
                        invalidate: true,
                    }
                );
            } catch (cloudinaryError) {
                console.error(
                    "Old Cloudinary image deletion failed:",
                    cloudinaryError
                );
            }
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Thumbnail enhanced with Gemini Pro successfully",
                thumbnail,
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Pro enhancement failed:",
            error
        );

        if (uploadedImage?.publicId) {
            try {
                await cloudinary.uploader.destroy(
                    uploadedImage.publicId,
                    {
                        resource_type: "image",
                        invalidate: true,
                    }
                );
            } catch (cleanupError) {
                console.error(
                    "Pro image cleanup failed:",
                    cleanupError
                );
            }
        }

        if (activeThumbnailId) {
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