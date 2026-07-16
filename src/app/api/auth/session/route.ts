import { NextResponse } from "next/server";

import {
    requireUser,
    UnauthorizedError,
} from "@/lib/auth/require-user";

export const runtime = "nodejs";

export async function GET() {
    try {
        const user = await requireUser();

        return NextResponse.json({
            success: true,
            user,
        });
    } catch (error) {
        if (error instanceof UnauthorizedError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                {
                    status: 401,
                }
            );
        }

        console.error("Session route failed:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to verify session",
            },
            {
                status: 500,
            }
        );
    }
}