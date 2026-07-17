import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { requireUser } from "@/lib/auth/require-user";
import { uploadImageBuffer } from "@/lib/cloudinary/upload-image";
import connectDatabase from "@/lib/db/connect-db";
import { generateThumbnailImage } from "@/lib/services/generate-thumbnail-image";
import { generateThumbnailSchema } from "@/lib/validations/thumbnail.schema";
import Thumbnail from "@/models/Thumbnail";

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

const getErrorStatus = (
    message: string
): number => {
    const normalizedMessage =
        message.toLowerCase();

    if (
        normalizedMessage.includes("unauthorized") ||
        normalizedMessage.includes("login")
    ) {
        return 401;
    }

    return 500;
};

export async function POST(request: Request) {
    let thumbnailId: string | null = null;

    try {
        const user = await requireUser();

        const requestBody: unknown =
            await request.json();

        const input =
            generateThumbnailSchema.parse(
                requestBody
            );

        await connectDatabase();

        const thumbnail =
            await Thumbnail.create({
                userId: user._id.toString(),

                title: input.title,
                style: input.style,

                aspect_ratio:
                    input.aspect_ratio,

                color_scheme:
                    input.color_scheme,

                text_overlay:
                    input.text_overlay,

                user_prompt:
                    input.prompt,

                prompt_used: "",

                image_url: "",

                cloudinary_public_id: "",

                isGenerating: true,

                generation_error: "",
            });

        thumbnailId =
            thumbnail._id.toString();

        const generatedImage =
            await generateThumbnailImage(
                input
            );

        const uploadedImage =
            await uploadImageBuffer(
                generatedImage.buffer,
                user._id.toString()
            );

        thumbnail.image_url =
            uploadedImage.secureUrl;

        thumbnail.cloudinary_public_id =
            uploadedImage.publicId;

        thumbnail.prompt_used =
            generatedImage.promptUsed;

        thumbnail.isGenerating = false;

        thumbnail.generation_error = "";

        await thumbnail.save();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Thumbnail generated successfully",
                thumbnail,
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
                        },
                    }
                );
            } catch (updateError: unknown) {
                console.error(
                    "Unable to update failed thumbnail:",
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
                    getErrorStatus(message),
            }
        );
    }
}