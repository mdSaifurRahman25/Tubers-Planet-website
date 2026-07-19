import { NextResponse } from "next/server";

import {
    deletePasswordResetCookie,
    getPasswordResetToken,
} from "@/lib/auth/password-reset-cookie";
import {
    isPasswordResetServiceError,
    verifyPasswordResetRequestOtp,
} from "@/lib/services/password-reset.service";
import {
    verifyPasswordResetOtpSchema,
} from "@/lib/validations/auth.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control":
        "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
};

/*
 * যেসব error-এর পরে current password-reset
 * cookie আর রাখা উচিত নয়।
 */
const SHOULD_CLEAR_COOKIE_CODES =
    new Set([
        "RESET_REQUEST_NOT_FOUND",
        "RESET_REQUEST_EXPIRED",
        "RESET_AUTHORIZATION_EXPIRED",
    ]);

/*
 * Password reset OTP verify করবে।
 *
 * Flow:
 *
 * 1. Request body থেকে 6-digit OTP নেবে
 * 2. Secure httpOnly cookie থেকে reset token নেবে
 * 3. Database-এর hashed token ও OTP যাচাই করবে
 * 4. OTP সঠিক হলে নতুন password দেওয়ার permission দেবে
 * 5. Frontend-কে reset-password page-এ পাঠাবে
 */
export async function POST(
    request: Request
) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        const validation =
            verifyPasswordResetOtpSchema.safeParse(
                body
            );

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,

                    message:
                        "Please enter a valid verification code.",

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
         * Raw password-reset token শুধু secure
         * httpOnly cookie থেকে পাওয়া যাবে।
         */
        const requestToken =
            await getPasswordResetToken();

        if (!requestToken) {
            await deletePasswordResetCookie();

            return NextResponse.json(
                {
                    success: false,

                    message:
                        "Your password reset session was not found. Please start again.",

                    code:
                        "RESET_REQUEST_NOT_FOUND",

                    redirectTo:
                        "/forgot-password",
                },
                {
                    status: 401,
                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        const result =
            await verifyPasswordResetRequestOtp({
                requestToken,

                otp:
                    validation.data.otp,
            });

        return NextResponse.json(
            {
                success: true,

                message:
                    "Your verification code has been confirmed. You can now create a new password.",

                authorized:
                    result.authorized,

                phase:
                    "set-password",

                maskedEmail:
                    result.maskedEmail,

                resetExpiresAt:
                    result.resetExpiresAt.toISOString(),

                expiresAt:
                    result.expiresAt.toISOString(),

                redirectTo:
                    "/forgot-password/reset",
            },
            {
                status: 200,
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
                    success: false,

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
            "Verify password reset OTP route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "Unable to verify your password reset code. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}