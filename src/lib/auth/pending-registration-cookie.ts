import "server-only";

import {
    createHash,
    randomBytes,
} from "node:crypto";

import { cookies } from "next/headers";

import {
    PENDING_REGISTRATION_TTL_MS,
} from "@/lib/auth/email-verification-otp";

/*
 * Browser-এ রাখা temporary registration cookie-এর নাম।
 */
export const PENDING_REGISTRATION_COOKIE_NAME =
    "thumblify_pending_registration";

/*
 * 32 random bytes base64url format-এ সাধারণত
 * 43 character token তৈরি করে।
 */
const REGISTRATION_TOKEN_BYTES = 32;

const TOKEN_PATTERN =
    /^[A-Za-z0-9_-]{40,100}$/;

export interface PendingRegistrationTokenData {
    /*
     * Raw token শুধু browser cookie-তে থাকবে।
     */
    token: string;

    /*
     * Token-এর hash database-এ রাখা হবে।
     */
    tokenHash: string;

    /*
     * Pending registration এবং cookie কখন expire হবে।
     */
    expiresAt: Date;
}

/*
 * Registration token database-এ plain text হিসেবে
 * রাখা হবে না। SHA-256 hash রাখা হবে।
 */
export const hashPendingRegistrationToken = (
    token: string
): string => {
    const normalizedToken =
        token.trim();

    if (
        !isValidPendingRegistrationToken(
            normalizedToken
        )
    ) {
        throw new Error(
            "Invalid pending registration token"
        );
    }

    return createHash("sha256")
        .update(
            `thumblify-pending-registration:${normalizedToken}`
        )
        .digest("hex");
};

/*
 * Cookie থেকে পাওয়া token expected format-এ আছে কি না
 * তা যাচাই করবে।
 */
export const isValidPendingRegistrationToken = (
    token: string
): boolean => {
    return TOKEN_PATTERN.test(
        token.trim()
    );
};

/*
 * নতুন secure pending registration token তৈরি করবে।
 *
 * Raw token:
 * Browser cookie-তে থাকবে।
 *
 * Token hash:
 * PendingRegistration document-এ থাকবে।
 */
export const createPendingRegistrationToken = (
    currentTime = new Date()
): PendingRegistrationTokenData => {
    const token =
        randomBytes(
            REGISTRATION_TOKEN_BYTES
        ).toString("base64url");

    const tokenHash =
        hashPendingRegistrationToken(
            token
        );

    const expiresAt =
        new Date(
            currentTime.getTime() +
            PENDING_REGISTRATION_TTL_MS
        );

    return {
        token,
        tokenHash,
        expiresAt,
    };
};

/*
 * Registration শুরু হওয়ার পরে browser-এ
 * secure httpOnly cookie set করবে।
 *
 * Cookie-এর মধ্যে email, password, OTP বা user data
 * রাখা হবে না। শুধু random token থাকবে।
 */
export const setPendingRegistrationCookie = async (
    token: string,
    expiresAt: Date
): Promise<void> => {
    if (
        !isValidPendingRegistrationToken(
            token
        )
    ) {
        throw new Error(
            "Cannot set an invalid pending registration token"
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
            "Pending registration cookie expiry must be in the future"
        );
    }

    const cookieStore =
        await cookies();

    cookieStore.set({
        name:
            PENDING_REGISTRATION_COOKIE_NAME,

        value:
            token,

        /*
         * Client-side JavaScript cookie পড়তে পারবে না।
         */
        httpOnly:
            true,

        /*
         * Production HTTPS connection-এ cookie পাঠাবে।
         */
        secure:
            process.env.NODE_ENV ===
            "production",

        /*
         * সাধারণ navigation এবং same-site API request
         * ঠিকভাবে কাজ করবে।
         */
        sameSite:
            "lax",

        path:
            "/",

        expires:
            expiresAt,
    });
};

/*
 * Browser cookie থেকে raw pending token পড়বে।
 *
 * Invalid বা missing token হলে null return করবে।
 */
export const getPendingRegistrationToken =
    async (): Promise<
        string | null
    > => {
        const cookieStore =
            await cookies();

        const token =
            cookieStore.get(
                PENDING_REGISTRATION_COOKIE_NAME
            )?.value;

        if (!token) {
            return null;
        }

        const normalizedToken =
            token.trim();

        if (
            !isValidPendingRegistrationToken(
                normalizedToken
            )
        ) {
            return null;
        }

        return normalizedToken;
    };

/*
 * Cookie token read করে তার database-safe hash return করবে।
 *
 * Verify Email এবং Resend OTP API এই function ব্যবহার করে
 * PendingRegistration record খুঁজতে পারবে।
 */
export const getPendingRegistrationTokenHash =
    async (): Promise<
        string | null
    > => {
        const token =
            await getPendingRegistrationToken();

        if (!token) {
            return null;
        }

        return hashPendingRegistrationToken(
            token
        );
    };

/*
 * Pending registration cookie আছে কি না।
 */
export const hasPendingRegistrationCookie =
    async (): Promise<boolean> => {
        const token =
            await getPendingRegistrationToken();

        return Boolean(token);
    };

/*
 * Verification সফল হলে, registration বাতিল হলে,
 * অথবা pending record invalid হলে cookie delete করবে।
 */
export const deletePendingRegistrationCookie =
    async (): Promise<void> => {
        const cookieStore =
            await cookies();

        cookieStore.delete(
            PENDING_REGISTRATION_COOKIE_NAME
        );
    };