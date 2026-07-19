import { NextResponse } from "next/server";

import {
    deletePasswordResetCookie,
    getPasswordResetToken,
} from "@/lib/auth/password-reset-cookie";
import {
    getPasswordResetStatus,
    isPasswordResetServiceError,
} from "@/lib/services/password-reset.service";

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
 * যেসব error-এর পরে current password-reset cookie
 * আর রাখা উচিত নয়।
 */
const SHOULD_CLEAR_COOKIE_CODES =
    new Set([
        "RESET_REQUEST_NOT_FOUND",
        "RESET_REQUEST_EXPIRED",
        "RESET_AUTHORIZATION_EXPIRED",
    ]);

/*
 * Password Reset OTP page অথবা New Password page
 * load হওয়ার সময় current reset request-এর status দেবে।
 */
export async function GET() {
    try {
        /*
         * Raw token secure httpOnly cookie থেকে নেওয়া হবে।
         */
        const requestToken =
            await getPasswordResetToken();

        if (!requestToken) {
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

        const status =
            await getPasswordResetStatus(
                requestToken
            );

        /*
         * Service-এর Date values JSON response-এর জন্য
         * ISO string-এ convert করা হচ্ছে।
         */
        const serializedStatus = {
            phase:
                status.phase,

            maskedEmail:
                status.maskedEmail,

            otpExpiresAt:
                status.otpExpiresAt.toISOString(),

            resendAvailableAt:
                status.resendAvailableAt.toISOString(),

            expiresAt:
                status.expiresAt.toISOString(),

            resetExpiresAt:
                status.resetExpiresAt
                    ? status.resetExpiresAt.toISOString()
                    : null,

            resendRemainingSeconds:
                status.resendRemainingSeconds,

            canResend:
                status.canResend,

            attemptsRemaining:
                status.attemptsRemaining,
        };

        /*
         * Frontend এই redirectTo ব্যবহার করে নিশ্চিত করবে
         * user সঠিক password-reset page-এ আছে।
         */
        const redirectTo =
            status.phase ===
                "set-password"
                ? "/forgot-password/reset"
                : "/forgot-password/verify";

        return NextResponse.json(
            {
                success: true,

                message:
                    status.phase ===
                        "set-password"
                        ? "Your email has been verified. You can now set a new password."
                        : "Your password reset request is active.",

                status:
                    serializedStatus,

                phase:
                    status.phase,

                maskedEmail:
                    status.maskedEmail,

                otpExpiresAt:
                    serializedStatus.otpExpiresAt,

                resendAvailableAt:
                    serializedStatus.resendAvailableAt,

                expiresAt:
                    serializedStatus.expiresAt,

                resetExpiresAt:
                    serializedStatus.resetExpiresAt,

                resendRemainingSeconds:
                    status.resendRemainingSeconds,

                redirectTo,
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

            return NextResponse.json(
                {
                    success: false,

                    message:
                        error.message,

                    code:
                        error.code,

                    details:
                        error.details,

                    redirectTo:
                        "/forgot-password",
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
            "Password reset status route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "Unable to check your password reset session. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}