import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/require-user";
import connectDatabase from "@/lib/db/connect-db";
import Thumbnail from "@/models/Thumbnail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to fetch thumbnails";
};

const getStatusCode = (
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

export async function GET() {
    try {
        const user = await requireUser();

        await connectDatabase();

        const thumbnails = await Thumbnail.find({
            userId: user._id.toString(),
        })
            .sort({
                createdAt: -1,
            })
            .lean();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Thumbnails fetched successfully",
                thumbnails,
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Fetching thumbnails failed:",
            error
        );

        const message =
            getErrorMessage(error);

        return NextResponse.json(
            {
                success: false,
                message,
                thumbnails: [],
            },
            {
                status: getStatusCode(message),
            }
        );
    }
}