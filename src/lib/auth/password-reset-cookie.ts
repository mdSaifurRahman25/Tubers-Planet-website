import "server-only";

import {
    createHash,
    randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";

import {
    PASSWORD_RESET_REQUEST_TTL_MS,
} from "@/lib/auth/password-reset-otp";

/*
 * Browser-এ রাখা temporary password reset
 * cookie-এর নাম।
 */
export const PASSWORD_RESET_COOKIE_NAME =
    "thumblify_password_reset";

/*
 * 32 random bytes থেকে একটি শক্তিশালী
 * base64url token তৈরি হবে।
 */
const PASSWORD_RESET_TOKEN_BYTES = 32;

/*
 * randomBytes(32).toString("base64url")
 * সাধারণত 43 character token তৈরি করে।
 */
const PASSWORD_RESET_TOKEN_PATTERN =
    /^[A-Za-z0-9_-]{40,100}$/;

export interface PasswordResetTokenData {
    /*
     * Raw token শুধু browser-এর secure
     * httpOnly cookie-তে থাকবে।
     */
    token: string;

    /*
     * Token-এর SHA-256 hash database-এ থাকবে।
     */
    tokenHash: string;

    /*
     * Password reset request ও cookie
     * কখন expire হবে।
     */
    expiresAt: Date;
}

/*
 * Cookie বা অন্য source থেকে পাওয়া token
 * expected format-এ আছে কি না যাচাই করবে।
 */
export const isValidPasswordResetToken = (
    token: string
): boolean => {
    return PASSWORD_RESET_TOKEN_PATTERN.test(
        token.trim()
    );
};

/*
 * Raw password reset token database-এ রাখা হবে না।
 *
 * SHA-256 hash তৈরি করে PasswordResetRequest
 * document-এ রাখা হবে।
 */
export const hashPasswordResetToken = (
    token: string
): string => {
    const normalizedToken =
        token.trim();

    if (
        !isValidPasswordResetToken(
            normalizedToken
        )
    ) {
        throw new Error(
            "Invalid password reset token"
        );
    }

    return createHash("sha256")
        .update(
            `thumblify-password-reset-request:${normalizedToken}`
        )
        .digest("hex");
};

/*
 * নতুন secure password reset request token তৈরি করবে।
 *
 * Raw token:
 * Browser-এর httpOnly cookie-তে থাকবে।
 *
 * Token hash:
 * password_reset_requests collection-এ থাকবে।
 */
export const createPasswordResetToken = (
    currentTime = new Date()
): PasswordResetTokenData => {
    const token =
        randomBytes(
            PASSWORD_RESET_TOKEN_BYTES
        ).toString("base64url");

    const tokenHash =
        hashPasswordResetToken(
            token
        );

    const expiresAt =
        new Date(
            currentTime.getTime() +
            PASSWORD_RESET_REQUEST_TTL_MS
        );

    return {
        token,
        tokenHash,
        expiresAt,
    };
};

/*
 * Password reset request শুরু হওয়ার পরে
 * browser-এ secure httpOnly cookie set করবে।
 *
 * Cookie-এর মধ্যে email, user ID, OTP বা password
 * রাখা হবে না। শুধু random raw token থাকবে।
 */
export const setPasswordResetCookie = async (
    token: string,
    expiresAt: Date
): Promise<void> => {
    const normalizedToken =
        token.trim();

    if (
        !isValidPasswordResetToken(
            normalizedToken
        )
    ) {
        throw new Error(
            "Cannot set an invalid password reset token"
        );
    }

    if (
        Number.isNaN(
            expiresAt.getTime()
        ) ||
        expiresAt.getTime() <=
        Date.now()
    ) {
        throw new Error(
            "Password reset cookie expiry must be in the future"
        );
    }

    const cookieStore =
        await cookies();

    const maxAgeSeconds =
        Math.max(
            1,
            Math.floor(
                (
                    expiresAt.getTime() -
                    Date.now()
                ) /
                1000
            )
        );

    cookieStore.set({
        name:
            PASSWORD_RESET_COOKIE_NAME,

        value:
            normalizedToken,

        /*
         * Client-side JavaScript cookie পড়তে পারবে না।
         */
        httpOnly:
            true,

        /*
         * Production HTTPS connection-এ
         * cookie secure থাকবে।
         */
        secure:
            process.env.NODE_ENV ===
            "production",

        /*
         * Same-site form ও API request কাজ করবে।
         */
        sameSite:
            "lax",

        path:
            "/",

        expires:
            expiresAt,

        maxAge:
            maxAgeSeconds,
    });
};

/*
 * Browser-এর httpOnly cookie থেকে raw
 * password reset token পড়বে।
 *
 * Missing বা invalid token হলে null return করবে।
 */
export const getPasswordResetToken =
    async (): Promise<
        string | null
    > => {
        const cookieStore =
            await cookies();

        const token =
            cookieStore.get(
                PASSWORD_RESET_COOKIE_NAME
            )?.value;

        if (!token) {
            return null;
        }

        const normalizedToken =
            token.trim();

        if (
            !isValidPasswordResetToken(
                normalizedToken
            )
        ) {
            return null;
        }

        return normalizedToken;
    };

/*
 * Cookie token read করে database query-এর জন্য
 * SHA-256 token hash return করবে।
 */
export const getPasswordResetTokenHash =
    async (): Promise<
        string | null
    > => {
        const token =
            await getPasswordResetToken();

        if (!token) {
            return null;
        }

        return hashPasswordResetToken(
            token
        );
    };

/*
 * Browser-এ valid password reset cookie
 * আছে কি না পরীক্ষা করবে।
 */
export const hasPasswordResetCookie =
    async (): Promise<boolean> => {
        const token =
            await getPasswordResetToken();

        return Boolean(token);
    };

/*
 * Password reset সম্পন্ন হলে, request expire হলে
 * অথবা request invalid হলে cookie delete করবে।
 */
export const deletePasswordResetCookie =
    async (): Promise<void> => {
        const cookieStore =
            await cookies();

        cookieStore.delete(
            PASSWORD_RESET_COOKIE_NAME
        );
    };