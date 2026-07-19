import { NextResponse } from "next/server";

import {
    deletePasswordResetCookie,
    getPasswordResetToken,
} from "@/lib/auth/password-reset-cookie";
import {
    isPasswordResetServiceError,
    resendPasswordResetRequestOtp,
} from "@/lib/services/password-reset.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control":
        "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
};

/*
 * যেসব error হওয়ার পরে current password-reset
 * cookie আর রাখা উচিত নয়।
 */
const SHOULD_CLEAR_COOKIE_CODES =
    new Set([
        "RESET_REQUEST_NOT_FOUND",
        "RESET_REQUEST_EXPIRED",
        "RESET_AUTHORIZATION_EXPIRED",
        "ACCOUNT_NOT_FOUND",
    ]);

/*
 * Password reset-এর জন্য নতুন OTP পাঠাবে।
 *
 * Flow:
 *
 * 1. Secure httpOnly cookie থেকে reset token নেবে
 * 2. Active reset request খুঁজবে
 * 3. 60-second resend cooldown পরীক্ষা করবে
 * 4. নতুন OTP তৈরি ও hash করবে
 * 5. OTP email পাঠাবে
 * 6. নতুন expiry এবং countdown return করবে
 */
export async function POST() {
    try {
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
            await resendPasswordResetRequestOtp({
                requestToken,
            });

        return NextResponse.json(
            {
                success: true,

                message:
                    "A new password reset code has been sent to your email.",

                phase:
                    "verify-otp",

                maskedEmail:
                    result.maskedEmail,

                otpExpiresAt:
                    result.otpExpiresAt.toISOString(),

                resendAvailableAt:
                    result.resendAvailableAt.toISOString(),

                expiresAt:
                    result.expiresAt.toISOString(),

                /*
                 * নতুন OTP পাঠানোর পরে আবার resend
                 * করার জন্য 60 seconds অপেক্ষা করতে হবে।
                 */
                resendRemainingSeconds:
                    Math.max(
                        0,
                        Math.ceil(
                            (
                                result.resendAvailableAt.getTime() -
                                Date.now()
                            ) /
                            1000
                        )
                    ),

                redirectTo:
                    "/forgot-password/verify",
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

            /*
             * OTP ইতোমধ্যে verify হয়ে থাকলে user-কে
             * নতুন password page-এ পাঠানো হবে।
             */
            const redirectTo =
                error.code ===
                    "RESET_ALREADY_AUTHORIZED"
                    ? "/forgot-password/reset"
                    : SHOULD_CLEAR_COOKIE_CODES.has(
                        error.code
                    )
                        ? "/forgot-password"
                        : undefined;

            /*
             * Resend cooldown থাকলে browser/client-কে
             * Retry-After header দেওয়া হবে।
             */
            const retryAfterSeconds =
                typeof error.details
                    ?.retryAfterSeconds ===
                    "number"
                    ? error.details
                        .retryAfterSeconds
                    : undefined;

            const responseHeaders: Record<
                string,
                string
            > = {
                ...NO_STORE_HEADERS,
            };

            if (
                retryAfterSeconds !==
                undefined
            ) {
                responseHeaders[
                    "Retry-After"
                ] =
                    String(
                        retryAfterSeconds
                    );
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
                        responseHeaders,
                }
            );
        }

        console.error(
            "Resend password reset OTP route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "Unable to resend the password reset code. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}