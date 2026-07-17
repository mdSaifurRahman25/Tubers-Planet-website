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
import { generateThumbnailImage } from "@/lib/services/generate-thumbnail-image";
import { generateThumbnailSchema } from "@/lib/validations/thumbnail.schema";

import Thumbnail from "@/models/Thumbnail";
import ThumbnailVersion from "@/models/ThumbnailVersion";

export const runtime = "nodejs";
export const maxDuration = 120;

interface RegenerateRouteContext {
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

    return "Unable to regenerate thumbnail";
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
            "Regenerated image cleanup failed:",
            error
        );
    }
};

export async function POST(
    request: Request,
    { params }: RegenerateRouteContext
) {
    let activeThumbnailId:
        | string
        | null = null;

    let createdVersionId:
        | string
        | null = null;

    let uploadedImage:
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

        const requestBody: unknown =
            await request.json();

        const input =
            generateThumbnailSchema.parse(
                requestBody
            );

        await connectDatabase();

        /*
         * প্রথমে thumbnail ownership check।
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
                        "Thumbnail not found or you do not have permission to edit it",
                },
                {
                    status: 404,
                }
            );
        }

        /*
         * Atomic processing lock।
         *
         * একই thumbnail একসঙ্গে একাধিকবার
         * process হওয়া বন্ধ করবে।
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
         * এই thumbnail project-এর সর্বশেষ
         * version number বের করা হচ্ছে।
         *
         * এখানে lean object পুনরায় assign করা
         * হচ্ছে না, তাই TypeScript error হবে না।
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
         * পুরোনো thumbnail-এ version history
         * না থাকলে existing image-কে Version 1
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

            thumbnail.total_versions =
                1;

            await thumbnail.save();

            latestVersionNumber = 1;
        }

        const nextVersionNumber =
            latestVersionNumber + 1;

        /*
         * নতুন regenerated image তৈরি।
         */
        const generatedImage =
            await generateThumbnailImage(
                input,
                "flash"
            );

        /*
         * নতুন image Cloudinary-তে upload।
         */
        uploadedImage =
            await uploadImageBuffer(
                generatedImage.buffer,
                userId
            );

        /*
         * নতুন Regenerate result আলাদা
         * ThumbnailVersion হিসেবে save।
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
                    "flash_regenerate",

                reference_images: [],
            });

        createdVersionId =
            thumbnailVersion._id.toString();

        /*
         * Parent Thumbnail-এর current version
         * snapshot update করা হচ্ছে।
         *
         * পুরোনো image বা version delete হবে না।
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
            uploadedImage.secureUrl;

        thumbnail.cloudinary_public_id =
            uploadedImage.publicId;

        thumbnail.model_used =
            generatedImage.modelUsed;

        thumbnail.generation_mode =
            "flash_regenerate";

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
                    "Thumbnail regenerated successfully",

                thumbnail,

                version:
                    thumbnailVersion,
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Thumbnail regeneration failed:",
            error
        );

        /*
         * Parent update complete না হলে তৈরি হওয়া
         * version document delete করা হবে।
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
                    "Regenerated version cleanup failed:",
                    versionCleanupError
                );
            }
        }

        /*
         * Parent update complete না হলে নতুন
         * uploaded image Cloudinary থেকে cleanup।
         *
         * আগের version-এর কোনো image delete হবে না।
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
                    "Regeneration failure status update failed:",
                    updateError
                );
            }
        }

        if (error instanceof ZodError) {
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
                    isUnauthorizedMessage(
                        message
                    )
                        ? 401
                        : 500,
            }
        );
    }
}