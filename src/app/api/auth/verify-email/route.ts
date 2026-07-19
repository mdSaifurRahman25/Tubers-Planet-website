import { NextResponse } from "next/server";

import {
    deletePendingRegistrationCookie,
    getPendingRegistrationToken,
} from "@/lib/auth/pending-registration-cookie";
import { createUserSession } from "@/lib/auth/session";
import {
    isEmailVerificationServiceError,
    verifyPendingRegistrationOtp,
} from "@/lib/services/email-verification.service";
import { verifyEmailSchema } from "@/lib/validations/auth.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NO_STORE_HEADERS = {
    "Cache-Control": "no-store",
};

/*
 * Pending registration আর ব্যবহারযোগ্য না হলে
 * browser-এর temporary cookie delete করবে।
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

export async function POST(
    request: Request
) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        /*
         * OTP অবশ্যই ঠিক 6 digit হতে হবে।
         */
        const validation =
            verifyEmailSchema.safeParse(
                body
            );

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Please enter a valid 6-digit verification code.",
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
         * Raw registration token browser-এর
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
         * 1. PendingRegistration খুঁজবে
         * 2. OTP expiry ও attempts check করবে
         * 3. Hashed OTP compare করবে
         * 4. Main users collection-এ verified user তৈরি করবে
         * 5. Pending registration delete করবে
         */
        const result =
            await verifyPendingRegistrationOtp(
                {
                    registrationToken,
                    otp:
                        validation.data.otp,
                }
            );

        /*
         * Email verification সফল হওয়ার পরে
         * নতুন user-এর authenticated session তৈরি হবে।
         */
        try {
            await createUserSession(
                result.user._id
            );
        } catch (sessionError) {
            /*
             * Account ইতিমধ্যে verified ও তৈরি হয়ে গেছে।
             * শুধু auto-login session তৈরি করা যায়নি।
             */
            await deletePendingRegistrationCookie();

            console.error(
                "Verified account session creation failed:",
                sessionError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Your email was verified and your account was created, but automatic login failed. Please sign in.",
                    code:
                        "SESSION_CREATION_FAILED",
                    redirectTo:
                        "/login",
                },
                {
                    status: 500,
                    headers:
                        NO_STORE_HEADERS,
                }
            );
        }

        /*
         * Verification শেষ, তাই temporary pending
         * registration cookie আর প্রয়োজন নেই।
         */
        await deletePendingRegistrationCookie();

        return NextResponse.json(
            {
                success: true,
                message:
                    "Email verified successfully. Welcome to Thumblify!",

                user:
                    result.user,

                redirectTo:
                    "/generate",
            },
            {
                status: 201,
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
            if (
                shouldDeletePendingCookie(
                    error.code
                )
            ) {
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
                        shouldDeletePendingCookie(
                            error.code
                        )
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
            "Verify email route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to verify your email. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}