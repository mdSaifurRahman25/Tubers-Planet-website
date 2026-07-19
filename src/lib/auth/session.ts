import "server-only";

import {
    createHash,
    randomBytes,
} from "node:crypto";
import { cookies } from "next/headers";

import connectDB from "@/lib/db/connect-db";
import Session from "@/models/Session";

const SESSION_COOKIE_NAME =
    "thumblify_session";

/*
 * Normal login:
 * Remember Me unchecked → 1 day
 */
const SHORT_SESSION_DURATION_MS =
    1000 * 60 * 60 * 24;

/*
 * OTP verification-এর পর automatic login:
 * Default session → 7 days
 */
const DEFAULT_SESSION_DURATION_MS =
    1000 * 60 * 60 * 24 * 7;

/*
 * Normal login:
 * Remember Me checked → 30 days
 */
const REMEMBERED_SESSION_DURATION_MS =
    1000 * 60 * 60 * 24 * 30;

export interface CreateUserSessionOptions {
    /*
     * undefined হলে default 7-day session হবে।
     *
     * true হলে 30-day session।
     * false হলে 1-day session।
     */
    rememberMe?: boolean;
}

export type CurrentSession = {
    userId: string;
    expiresAt: Date;
};

const hashSessionToken = (
    token: string
): string => {
    return createHash("sha256")
        .update(token)
        .digest("hex");
};

/*
 * Session duration নির্ধারণ করবে।
 *
 * createUserSession(userId)
 * → 7 days
 *
 * createUserSession(userId, {
 *     rememberMe: false,
 * })
 * → 1 day
 *
 * createUserSession(userId, {
 *     rememberMe: true,
 * })
 * → 30 days
 */
const getSessionDuration = (
    options?: CreateUserSessionOptions
): number => {
    if (
        options?.rememberMe ===
        true
    ) {
        return REMEMBERED_SESSION_DURATION_MS;
    }

    if (
        options?.rememberMe ===
        false
    ) {
        return SHORT_SESSION_DURATION_MS;
    }

    return DEFAULT_SESSION_DURATION_MS;
};

/*
 * Authenticated user-এর জন্য নতুন database session
 * এবং secure browser cookie তৈরি করবে।
 */
export const createUserSession = async (
    userId: string,
    options?: CreateUserSessionOptions
): Promise<void> => {
    const normalizedUserId =
        userId.trim();

    if (!normalizedUserId) {
        throw new Error(
            "User ID is required to create a session"
        );
    }

    await connectDB();

    const cookieStore =
        await cookies();

    /*
     * এই browser-এ আগের session cookie থাকলে
     * database থেকে সেই session revoke করবে।
     */
    const existingToken =
        cookieStore.get(
            SESSION_COOKIE_NAME
        )?.value;

    if (existingToken) {
        await Session.deleteOne({
            tokenHash:
                hashSessionToken(
                    existingToken
                ),
        });
    }

    const sessionToken =
        randomBytes(32).toString(
            "base64url"
        );

    const tokenHash =
        hashSessionToken(
            sessionToken
        );

    const sessionDuration =
        getSessionDuration(
            options
        );

    const expiresAt =
        new Date(
            Date.now() +
            sessionDuration
        );

    try {
        await Session.create({
            userId:
                normalizedUserId,

            tokenHash,

            expiresAt,
        });
    } catch (error) {
        /*
         * Database session তৈরি না হলে browser-এ
         * কোনো unusable session cookie রাখা হবে না।
         */
        cookieStore.delete(
            SESSION_COOKIE_NAME
        );

        throw error;
    }

    cookieStore.set({
        name:
            SESSION_COOKIE_NAME,

        value:
            sessionToken,

        /*
         * Client-side JavaScript cookie পড়তে পারবে না।
         */
        httpOnly:
            true,

        /*
         * Production HTTPS connection-এ secure cookie।
         */
        secure:
            process.env.NODE_ENV ===
            "production",

        /*
         * Same-site navigation এবং API request support।
         */
        sameSite:
            "lax",

        path:
            "/",

        expires:
            expiresAt,

        /*
         * Seconds হিসেবে cookie lifetime।
         */
        maxAge:
            Math.floor(
                sessionDuration /
                1000
            ),
    });
};

/*
 * Browser cookie থেকে current valid session খুঁজবে।
 */
export const getCurrentSession =
    async (): Promise<
        CurrentSession | null
    > => {
        const cookieStore =
            await cookies();

        const sessionToken =
            cookieStore.get(
                SESSION_COOKIE_NAME
            )?.value;

        if (!sessionToken) {
            return null;
        }

        await connectDB();

        const tokenHash =
            hashSessionToken(
                sessionToken
            );

        const session =
            await Session.findOne({
                tokenHash,

                expiresAt: {
                    $gt:
                        new Date(),
                },
            }).lean();

        if (!session) {
            /*
             * Cookie আছে কিন্তু database session নেই
             * অথবা session expire হয়েছে।
             */
            cookieStore.delete(
                SESSION_COOKIE_NAME
            );

            return null;
        }

        return {
            userId:
                session.userId.toString(),

            expiresAt:
                session.expiresAt,
        };
    };

/*
 * Current browser session database ও cookie
 * দুই জায়গা থেকেই delete করবে।
 */
export const deleteCurrentSession =
    async (): Promise<void> => {
        const cookieStore =
            await cookies();

        const sessionToken =
            cookieStore.get(
                SESSION_COOKIE_NAME
            )?.value;

        if (sessionToken) {
            await connectDB();

            await Session.deleteOne({
                tokenHash:
                    hashSessionToken(
                        sessionToken
                    ),
            });
        }

        cookieStore.delete(
            SESSION_COOKIE_NAME
        );
    };