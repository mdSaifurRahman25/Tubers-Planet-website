import { NextResponse } from "next/server";

import { createUserSession } from "@/lib/auth/session";
import {
    AuthServiceError,
    loginUser,
} from "@/lib/services/auth.service";
import { loginSchema } from "@/lib/validations/auth.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control":
        "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
};

export async function POST(
    request: Request
) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        const validation =
            loginSchema.safeParse(
                body
            );

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid login information",
                    errors:
                        validation.error.flatten()
                            .fieldErrors,
                },
                {
                    status: 422,
                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        /*
         * Email এবং password যাচাই করবে।
         *
         * Pending/unverified registration মূল users
         * collection-এ থাকে না, তাই সেটি login করতে পারবে না।
         */
        const user =
            await loginUser(
                validation.data
            );

        /*
         * Remember Me অনুযায়ী session duration
         * session helper নির্ধারণ করবে।
         */
        await createUserSession(
            user._id,
            {
                rememberMe:
                    validation.data.rememberMe,
            }
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Logged in successfully",
                user,
            },
            {
                status: 200,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    } catch (error) {
        if (
            error instanceof
            AuthServiceError
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error.message,
                },
                {
                    status:
                        error.statusCode,
                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        console.error(
            "Login route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to log in. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}