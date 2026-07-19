import { NextResponse } from "next/server";

import {
    setPendingRegistrationCookie,
} from "@/lib/auth/pending-registration-cookie";
import {
    isEmailVerificationServiceError,
    startPendingRegistration,
} from "@/lib/services/email-verification.service";
import {
    registerSchema,
} from "@/lib/validations/auth.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(
    request: Request
) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        const validation =
            registerSchema.safeParse(
                body
            );

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Invalid registration information",
                    errors:
                        validation.error.flatten()
                            .fieldErrors,
                },
                {
                    status: 422,
                    headers: {
                        "Cache-Control":
                            "no-store",
                    },
                }
            );
        }

        /*
         * Main users collection-এ এখনো user তৈরি হবে না।
         *
         * এই service:
         * 1. Pending registration তৈরি করবে
         * 2. Password hash করে রাখবে
         * 3. OTP তৈরি ও hash করবে
         * 4. Verification email পাঠাবে
         */
        const pendingRegistration =
            await startPendingRegistration(
                validation.data
            );

        /*
         * Raw pending registration token শুধু
         * secure httpOnly cookie-তে থাকবে।
         *
         * Database-এ token-এর hash রাখা হয়েছে।
         */
        await setPendingRegistrationCookie(
            pendingRegistration.registrationToken,
            pendingRegistration.expiresAt
        );

        return NextResponse.json(
            {
                success: true,
                message:
                    "We sent a 6-digit verification code to your email.",

                verificationRequired:
                    true,

                redirectTo:
                    "/verify-email",

                maskedEmail:
                    pendingRegistration.maskedEmail,

                otpExpiresAt:
                    pendingRegistration.otpExpiresAt.toISOString(),

                resendAvailableAt:
                    pendingRegistration.resendAvailableAt.toISOString(),

                expiresAt:
                    pendingRegistration.expiresAt.toISOString(),
            },
            {
                /*
                 * Registration request গ্রহণ করা হয়েছে,
                 * কিন্তু account এখনো final হয়নি।
                 */
                status: 202,

                headers: {
                    "Cache-Control":
                        "no-store",
                },
            }
        );
    } catch (error) {
        if (
            isEmailVerificationServiceError(
                error
            )
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        error.message,
                    code:
                        error.code,
                    details:
                        error.details,
                },
                {
                    status:
                        error.statusCode,
                    headers: {
                        "Cache-Control":
                            "no-store",
                    },
                }
            );
        }

        console.error(
            "Register route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Unable to start account registration. Please try again.",
            },
            {
                status: 500,
                headers: {
                    "Cache-Control":
                        "no-store",
                },
            }
        );
    }
}