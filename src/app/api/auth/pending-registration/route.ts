import { NextResponse } from "next/server";

import {
    deletePendingRegistrationCookie,
    getPendingRegistrationToken,
} from "@/lib/auth/pending-registration-cookie";
import {
    getPendingRegistrationStatus,
    isEmailVerificationServiceError,
} from "@/lib/services/email-verification.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control":
        "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
};

/*
 * Pending registration আর valid না থাকলে
 * browser-এর temporary cookie delete করা হবে।
 */
const shouldDeletePendingCookie = (
    code: string
): boolean => {
    return [
        "PENDING_REGISTRATION_NOT_FOUND",
        "PENDING_REGISTRATION_EXPIRED",
        "EMAIL_ALREADY_REGISTERED",
    ].includes(code);
};

/*
 * OTP verification page load হওয়ার সময়
 * এই API pending registration-এর public status দেবে।
 *
 * এখানে password, OTP hash, token hash অথবা
 * সম্পূর্ণ email return করা হবে না।
 */
export async function GET() {
    try {
        /*
         * Pending registration-এর raw token
         * secure httpOnly cookie থেকে নেওয়া হবে।
         */
        const registrationToken =
            await getPendingRegistrationToken();

        if (!registrationToken) {
            await deletePendingRegistrationCookie();

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Your verification session was not found. Please register again.",

                    code:
                        "PENDING_REGISTRATION_NOT_FOUND",

                    redirectTo:
                        "/register",
                },
                {
                    status: 401,
                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        /*
         * Service থেকে শুধু verification page-এর
         * প্রয়োজনীয় public information নেওয়া হবে।
         */
        const pendingStatus =
            await getPendingRegistrationStatus(
                registrationToken
            );

        return NextResponse.json(
            {
                success: true,
                message:
                    "Pending registration found.",

                status: {
                    maskedEmail:
                        pendingStatus.maskedEmail,

                    otpExpiresAt:
                        pendingStatus.otpExpiresAt.toISOString(),

                    resendAvailableAt:
                        pendingStatus.resendAvailableAt.toISOString(),

                    expiresAt:
                        pendingStatus.expiresAt.toISOString(),

                    resendRemainingSeconds:
                        pendingStatus.resendRemainingSeconds,

                    canResend:
                        pendingStatus.canResend,

                    attemptsRemaining:
                        pendingStatus.attemptsRemaining,
                },
            },
            {
                status: 200,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    } catch (error) {
        if (
            isEmailVerificationServiceError(
                error
            )
        ) {
            const deleteCookie =
                shouldDeletePendingCookie(
                    error.code
                );

            if (deleteCookie) {
                await deletePendingRegistrationCookie();
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
                        deleteCookie
                            ? "/register"
                            : undefined,
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
            "Pending registration status route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "Unable to load your verification information. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}