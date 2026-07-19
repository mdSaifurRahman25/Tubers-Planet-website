import { NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth/get-current-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control":
        "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
};

/*
 * Current browser session থেকে authenticated
 * user-এর public information return করবে।
 *
 * Session না থাকলে সেটি error নয়।
 * Guest user হিসেবেই 200 response return করবে।
 */
export async function GET() {
    try {
        const user =
            await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                {
                    success: true,
                    message:
                        "No active session",
                },
                {
                    status: 200,
                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message:
                    "Authenticated session found",
                user,
            },
            {
                status: 200,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    } catch (error) {
        console.error(
            "Session route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to verify authentication session",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}