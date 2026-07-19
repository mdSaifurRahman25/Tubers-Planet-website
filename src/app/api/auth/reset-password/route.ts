import { NextResponse } from "next/server";

import {
    deletePasswordResetCookie,
    getPasswordResetToken,
} from "@/lib/auth/password-reset-cookie";
import {
    completePasswordReset,
    isPasswordResetServiceError,
} from "@/lib/services/password-reset.service";
import {
    resetPasswordSchema,
} from "@/lib/validations/auth.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control":
        "no-store, no-cache, must-revalidate",
    Pragma:
        "no-cache",
    Expires:
        "0",
};

/*
 * যেসব error হওয়ার পরে current password-reset
 * cookie আর রাখা নিরাপদ বা প্রয়োজনীয় নয়।
 */
const SHOULD_CLEAR_COOKIE_CODES =
    new Set([
        "RESET_REQUEST_NOT_FOUND",
        "RESET_REQUEST_EXPIRED",
        "RESET_AUTHORIZATION_EXPIRED",
        "ACCOUNT_NOT_FOUND",
    ]);

/*
 * Password reset process সম্পন্ন করবে।
 *
 * Flow:
 *
 * 1. New Password ও Confirm Password validate করবে
 * 2. Secure httpOnly cookie থেকে reset token নেবে
 * 3. OTP verification authorization যাচাই করবে
 * 4. নতুন password hash করে User document update করবে
 * 5. User-এর সব পুরোনো login session revoke করবে
 * 6. Temporary reset request ও cookie delete করবে
 * 7. Login page-এ redirect করার তথ্য return করবে
 */
export async function POST(
    request: Request
) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        const validation =
            resetPasswordSchema.safeParse(
                body
            );

        if (!validation.success) {
            return NextResponse.json(
                {
                    success:
                        false,

                    message:
                        "Please correct the password information.",

                    errors:
                        validation.error
                            .flatten()
                            .fieldErrors,
                },
                {
                    status:
                        422,

                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        /*
         * Raw password-reset token শুধু secure
         * httpOnly cookie থেকে নেওয়া হবে।
         */
        const requestToken =
            await getPasswordResetToken();

        if (!requestToken) {
            await deletePasswordResetCookie();

            return NextResponse.json(
                {
                    success:
                        false,

                    message:
                        "Your password reset session was not found. Please start again.",

                    code:
                        "RESET_REQUEST_NOT_FOUND",

                    redirectTo:
                        "/forgot-password",
                },
                {
                    status:
                        401,

                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        /*
         * confirmPassword শুধু validation-এর জন্য।
         *
         * Service layer-এ শুধু নতুন password পাঠানো হবে।
         */
        await completePasswordReset({
            requestToken,

            newPassword:
                validation.data
                    .newPassword,
        });

        /*
         * Password update সফল হওয়ার পরে temporary
         * reset cookie আর রাখা হবে না।
         */
        await deletePasswordResetCookie();

        return NextResponse.json(
            {
                success:
                    true,

                message:
                    "Your password has been reset successfully. You can now sign in with your new password.",

                redirectTo:
                    "/login?passwordReset=success",
            },
            {
                status:
                    200,

                headers:
                    NO_STORE_HEADERS,
            }
        );
    } catch (error) {
        if (
            isPasswordResetServiceError(
                error
            )
        ) {
            if (
                SHOULD_CLEAR_COOKIE_CODES.has(
                    error.code
                )
            ) {
                await deletePasswordResetCookie();
            }

            let redirectTo:
                | string
                | undefined;

            /*
             * OTP verify করা না থাকলে OTP page-এ
             * ফেরত পাঠানো হবে।
             */
            if (
                error.code ===
                "RESET_NOT_AUTHORIZED"
            ) {
                redirectTo =
                    "/forgot-password/verify";
            }

            /*
             * Reset request invalid বা expire হয়ে গেলে
             * নতুন করে Forgot Password শুরু করতে হবে।
             */
            if (
                SHOULD_CLEAR_COOKIE_CODES.has(
                    error.code
                )
            ) {
                redirectTo =
                    "/forgot-password";
            }

            return NextResponse.json(
                {
                    success:
                        false,

                    message:
                        error.message,

                    code:
                        error.code,

                    details:
                        error.details,

                    redirectTo,
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
            "Reset password route failed:",
            error
        );

        return NextResponse.json(
            {
                success:
                    false,

                message:
                    "Unable to reset your password. Please try again.",
            },
            {
                status:
                    500,

                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}