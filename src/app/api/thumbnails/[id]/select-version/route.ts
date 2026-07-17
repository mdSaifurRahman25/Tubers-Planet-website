import mongoose from "mongoose";
import { NextResponse } from "next/server";
import {
    z,
    ZodError,
} from "zod";

import { requireUser } from "@/lib/auth/require-user";
import connectDatabase from "@/lib/db/connect-db";

import Thumbnail from "@/models/Thumbnail";
import ThumbnailVersion from "@/models/ThumbnailVersion";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface SelectVersionRouteContext {
    params: Promise<{
        id: string;
    }>;
}

const selectVersionSchema =
    z.object({
        versionId: z
            .string()
            .trim()
            .min(
                1,
                "Version ID is required"
            ),
    });

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to select thumbnail version";
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

/**
 * POST /api/thumbnails/[id]/select-version
 *
 * Request body:
 *
 * {
 *   "versionId": "..."
 * }
 *
 * User যে পুরোনো বা নতুন version নির্বাচন করবে,
 * সেটিকে parent Thumbnail-এর current version
 * snapshot হিসেবে set করা হবে।
 */
export async function POST(
    request: Request,
    {
        params,
    }: SelectVersionRouteContext
) {
    try {
        const user =
            await requireUser();

        const userId =
            user._id.toString();

        const { id } =
            await params;

        if (
            !mongoose.isValidObjectId(
                id
            )
        ) {
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

        const {
            versionId,
        } =
            selectVersionSchema.parse(
                requestBody
            );

        if (
            !mongoose.isValidObjectId(
                versionId
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid thumbnail version ID",
                },
                {
                    status: 400,
                }
            );
        }

        await connectDatabase();

        /*
         * Parent thumbnail ownership check।
         */
        const thumbnail =
            await Thumbnail.findOne({
                _id: id,
                userId,
            });

        if (!thumbnail) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Thumbnail not found or you do not have permission to update it",
                },
                {
                    status: 404,
                }
            );
        }

        /*
         * Generate, Regenerate বা Enhance চলাকালে
         * selected version পরিবর্তন করা যাবে না।
         */
        if (
            thumbnail.isGenerating
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "This thumbnail is currently being processed",
                },
                {
                    status: 409,
                }
            );
        }

        /*
         * Version অবশ্যই:
         *
         * 1. এই user-এর হতে হবে
         * 2. এই parent thumbnail-এর হতে হবে
         */
        const selectedVersion =
            await ThumbnailVersion.findOne({
                _id: versionId,

                thumbnailId:
                    thumbnail._id,

                userId,
            });

        if (!selectedVersion) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Thumbnail version not found or it does not belong to this project",
                },
                {
                    status: 404,
                }
            );
        }

        /*
         * Version collection-এর আসল count
         * synchronise করা হচ্ছে।
         */
        const totalVersions =
            await ThumbnailVersion.countDocuments(
                {
                    thumbnailId:
                        thumbnail._id,

                    userId,
                }
            );

        /*
         * Selected version-এর সম্পূর্ণ snapshot
         * parent Thumbnail-এ copy হচ্ছে।
         *
         * এর ফলে:
         *
         * - Generate editor selected image দেখাবে
         * - My Generation card selected image দেখাবে
         * - Download current version ব্যবহার করবে
         * - পরবর্তী Enhance current selected image
         *   reference হিসেবে ব্যবহার করতে পারবে
         */
        thumbnail.title =
            selectedVersion.title;

        thumbnail.description =
            selectedVersion.description ??
            "";

        thumbnail.style =
            selectedVersion.style;

        thumbnail.aspect_ratio =
            selectedVersion.aspect_ratio;

        thumbnail.color_scheme =
            selectedVersion.color_scheme;

        thumbnail.text_overlay =
            selectedVersion.text_overlay;

        thumbnail.image_url =
            selectedVersion.image_url;

        thumbnail.cloudinary_public_id =
            selectedVersion.cloudinary_public_id ??
            "";

        thumbnail.prompt_used =
            selectedVersion.prompt_used ??
            "";

        thumbnail.user_prompt =
            selectedVersion.user_prompt ??
            "";

        thumbnail.model_used =
            selectedVersion.model_used ??
            "";

        thumbnail.generation_mode =
            selectedVersion.generation_mode;

        thumbnail.current_version_id =
            selectedVersion._id;

        thumbnail.current_version_number =
            selectedVersion.version_number;

        thumbnail.total_versions =
            totalVersions;

        thumbnail.isGenerating =
            false;

        thumbnail.generation_error =
            "";

        await thumbnail.save();

        return NextResponse.json(
            {
                success: true,

                message:
                    `Version ${selectedVersion.version_number} is now selected`,

                thumbnail,

                selectedVersion,
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Selecting thumbnail version failed:",
            error
        );

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
                        "Invalid version information",

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