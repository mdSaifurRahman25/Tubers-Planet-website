import "server-only";

import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";

import connectDB from "@/lib/db/connect-db";
import Session from "@/models/Session";

const SESSION_COOKIE_NAME = "thumblify_session";

const SESSION_DURATION_MS =
    1000 * 60 * 60 * 24 * 7; // 7 days

const hashSessionToken = (token: string): string => {
    return createHash("sha256").update(token).digest("hex");
};

export type CurrentSession = {
    userId: string;
    expiresAt: Date;
};

export const createUserSession = async (
    userId: string
): Promise<void> => {
    await connectDB();

    const cookieStore = await cookies();

    // এই browser-এ পুরোনো session থাকলে সেটি revoke করবে
    const existingToken = cookieStore.get(
        SESSION_COOKIE_NAME
    )?.value;

    if (existingToken) {
        await Session.deleteOne({
            tokenHash: hashSessionToken(existingToken),
        });
    }

    const sessionToken = randomBytes(32).toString("base64url");
    const tokenHash = hashSessionToken(sessionToken);

    const expiresAt = new Date(
        Date.now() + SESSION_DURATION_MS
    );

    await Session.create({
        userId,
        tokenHash,
        expiresAt,
    });

    cookieStore.set({
        name: SESSION_COOKIE_NAME,
        value: sessionToken,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: expiresAt,
    });
};

export const getCurrentSession =
    async (): Promise<CurrentSession | null> => {
        const cookieStore = await cookies();

        const sessionToken = cookieStore.get(
            SESSION_COOKIE_NAME
        )?.value;

        if (!sessionToken) {
            return null;
        }

        await connectDB();

        const session = await Session.findOne({
            tokenHash: hashSessionToken(sessionToken),
            expiresAt: {
                $gt: new Date(),
            },
        }).lean();

        if (!session) {
            return null;
        }

        return {
            userId: session.userId.toString(),
            expiresAt: session.expiresAt,
        };
    };

export const deleteCurrentSession =
    async (): Promise<void> => {
        const cookieStore = await cookies();

        const sessionToken = cookieStore.get(
            SESSION_COOKIE_NAME
        )?.value;

        if (sessionToken) {
            await connectDB();

            await Session.deleteOne({
                tokenHash: hashSessionToken(sessionToken),
            });
        }

        cookieStore.delete(SESSION_COOKIE_NAME);
    };