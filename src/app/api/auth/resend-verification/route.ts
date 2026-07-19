import { NextResponse } from "next/server";

import {
    deletePendingRegistrationCookie,
    getPendingRegistrationToken,
    setPendingRegistrationCookie,
} from "@/lib/auth/pending-registration-cookie";
import {
    isEmailVerificationServiceError,
    resendPendingRegistrationOtp,
} from "@/lib/services/email-verification.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store",
};

/*
 * Pending registration আর valid না থাকলে
 * temporary browser cookie delete করা হবে।
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

export async function POST() {
    try {
        /*
         * Pending registration-এর raw token
         * httpOnly cookie থেকে নেওয়া হবে।
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
         * এই service:
         *
         * 1. Pending registration খুঁজবে
         * 2. Resend cooldown check করবে
         * 3. নতুন 6-digit OTP তৈরি করবে
         * 4. নতুন OTP hash database-এ রাখবে
         * 5. Wrong attempt count reset করবে
         * 6. OTP email পুনরায় পাঠাবে
         * 7. Pending registration expiry বাড়াবে
         */
        const result =
            await resendPendingRegistrationOtp(
                {
                    registrationToken,
                }
            );

        /*
         * Resend করার পরে pending registration-এর
         * expiry বাড়ানো হয়েছে।
         *
         * তাই একই raw token ব্যবহার করে browser cookie-এর
         * expiry-ও update করা হবে।
         */
        await setPendingRegistrationCookie(
            registrationToken,
            result.expiresAt
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "A new verification code has been sent to your email.",

                maskedEmail:
                    result.maskedEmail,

                otpExpiresAt:
                    result.otpExpiresAt.toISOString(),

                resendAvailableAt:
                    result.resendAvailableAt.toISOString(),

                expiresAt:
                    result.expiresAt.toISOString(),

                /*
                 * নতুন OTP পাঠানোর পরে আবার resend করতে
                 * 60 seconds অপেক্ষা করতে হবে।
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

            const retryAfterSeconds =
                typeof error.details
                    ?.retryAfterSeconds ===
                    "number"
                    ? error.details
                        .retryAfterSeconds
                    : undefined;

            const headers: Record<
                string,
                string
            > = {
                ...NO_STORE_HEADERS,
            };

            /*
             * Resend cooldown error হলে browser-কে
             * Retry-After header দেওয়া হবে।
             */
            if (
                retryAfterSeconds !==
                undefined
            ) {
                headers["Retry-After"] =
                    retryAfterSeconds.toString();
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

                    headers,
                }
            );
        }

        console.error(
            "Resend verification route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to resend the verification code. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}