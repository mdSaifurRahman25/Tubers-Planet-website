import { NextResponse } from "next/server";
import mongoose from "mongoose";

import { requireUser } from "@/lib/auth/require-user";
import cloudinary from "@/lib/cloudinary/cloudinary";
import connectDatabase from "@/lib/db/connect-db";
import Thumbnail from "@/models/Thumbnail";

export const runtime = "nodejs";

interface ThumbnailRouteContext {
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

    return "Something went wrong";
};

const getErrorStatus = (
    message: string
): number => {
    const normalizedMessage =
        message.toLowerCase();

    if (
        normalizedMessage.includes(
            "unauthorized"
        ) ||
        normalizedMessage.includes("login")
    ) {
        return 401;
    }

    return 500;
};

/*
 * GET /api/thumbnails/:id
 *
 * শুধু বর্তমানে logged-in user-এর
 * নির্দিষ্ট thumbnail ফেরত দেবে।
 */
export async function GET(
    _request: Request,
    { params }: ThumbnailRouteContext
) {
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

        await connectDatabase();

        const thumbnail =
            await Thumbnail.findOne({
                _id: id,
                userId: user._id.toString(),
            }).lean();

        if (!thumbnail) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Thumbnail not found or you do not have permission to view it",
                },
                {
                    status: 404,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Thumbnail fetched successfully",
                thumbnail,
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Fetching thumbnail failed:",
            error
        );

        const message =
            getErrorMessage(error);

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status: getErrorStatus(message),
            }
        );
    }
}

/*
 * DELETE /api/thumbnails/:id
 *
 * Cloudinary এবং MongoDB—দুই জায়গা
 * থেকেই thumbnail delete করবে।
 */
export async function DELETE(
    _request: Request,
    { params }: ThumbnailRouteContext
) {
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
                        "Thumbnail not found or you do not have permission to delete it",
                },
                {
                    status: 404,
                }
            );
        }

        /*
         * নতুন thumbnail হলে public ID থাকবে।
         * পুরোনো thumbnail হলে নাও থাকতে পারে।
         */
        if (
            thumbnail.cloudinary_public_id
        ) {
            await cloudinary.uploader.destroy(
                thumbnail.cloudinary_public_id,
                {
                    resource_type: "image",
                    invalidate: true,
                }
            );
        }

        await Thumbnail.deleteOne({
            _id: id,
            userId: user._id.toString(),
        });

        return NextResponse.json(
            {
                success: true,
                message:
                    "Thumbnail deleted successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Deleting thumbnail failed:",
            error
        );

        const message =
            getErrorMessage(error);

        return NextResponse.json(
            {
                success: false,
                message,
            },
            {
                status: getErrorStatus(message),
            }
        );
    }
}