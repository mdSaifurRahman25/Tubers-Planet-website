import { NextResponse } from "next/server";

import {
    deletePasswordResetCookie,
    setPasswordResetCookie,
} from "@/lib/auth/password-reset-cookie";
import {
    isPasswordResetServiceError,
    startPasswordReset,
} from "@/lib/services/password-reset.service";
import {
    forgotPasswordSchema,
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
 * Account পাওয়া যাক বা না যাক—client একই response পাবে।
 *
 * এতে কেউ Forgot Password API ব্যবহার করে
 * কোন email database-এ আছে তা সহজে বুঝতে পারবে না।
 */
const createGenericSuccessResponse = () => {
    return NextResponse.json(
        {
            success: true,

            message:
                "If an account exists with this email, a 6-digit password reset code has been sent.",

            passwordResetRequired:
                true,

            redirectTo:
                "/forgot-password/verify",
        },
        {
            status: 202,
            headers:
                NO_STORE_HEADERS,
        }
    );
};

export async function POST(
    request: Request
) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        const validation =
            forgotPasswordSchema.safeParse(
                body
            );

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,

                    message:
                        "Invalid password reset information",

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
         * এই service:
         *
         * 1. Email-এর account খুঁজবে
         * 2. Secure 6-digit OTP তৈরি করবে
         * 3. OTP hash database-এ রাখবে
         * 4. Temporary reset request তৈরি করবে
         * 5. Password reset email পাঠাবে
         *
         * Account না থাকলে service কোনো reset request
         * তৈরি করবে না, কিন্তু error-ও দেবে না।
         */
        const result =
            await startPasswordReset({
                email:
                    validation.data.email,
            });

        if (
            result.requestCreated &&
            result.requestToken &&
            result.expiresAt
        ) {
            /*
             * Raw reset token শুধু secure httpOnly
             * browser cookie-তে থাকবে।
             *
             * Database-এ token-এর hash রাখা হয়েছে।
             */
            await setPasswordResetCookie(
                result.requestToken,
                result.expiresAt
            );
        } else {
            /*
             * Account না থাকলে browser-এর পুরোনো reset
             * cookie রেখে দেওয়া হবে না।
             */
            await deletePasswordResetCookie();
        }

        /*
         * Account পাওয়া গেছে কি না response-এ
         * প্রকাশ করা হবে না।
         */
        return createGenericSuccessResponse();
    } catch (error) {
        if (
            isPasswordResetServiceError(
                error
            )
        ) {
            await deletePasswordResetCookie();

            /*
             * Email delivery failure-ও client-এর কাছে
             * account existence প্রকাশ করবে না।
             *
             * আসল error server terminal-এ থাকবে।
             */
            console.error(
                "Forgot password service failed:",
                {
                    code:
                        error.code,

                    message:
                        error.message,

                    cause:
                        error.cause,
                }
            );

            if (
                error.code ===
                "INVALID_RESET_DATA"
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

                        headers:
                            NO_STORE_HEADERS,
                    }
                );
            }

            /*
             * Registered ও unregistered email-এর
             * response একই রাখা হচ্ছে।
             */
            return createGenericSuccessResponse();
        }

        await deletePasswordResetCookie();

        console.error(
            "Forgot password route failed:",
            error
        );

        return NextResponse.json(
            {
                success: false,

                message:
                    "Unable to process your password reset request. Please try again.",
            },
            {
                status: 500,
                headers:
                    NO_STORE_HEADERS,
            }
        );
    }
}