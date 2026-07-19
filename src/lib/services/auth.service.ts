import "server-only";

import connectDB from "@/lib/db/connect-db";
import { verifyPassword } from "@/lib/auth/password";
import type { LoginInput } from "@/lib/validations/auth.schema";
import User from "@/models/User";

export type PublicUser = {
    _id: string;
    name: string;
    email: string;
    whatsappNumber?: string;
    isEmailVerified: boolean;
};

export class AuthServiceError extends Error {
    statusCode: number;

    constructor(
        message: string,
        statusCode: number
    ) {
        super(message);

        this.name =
            "AuthServiceError";

        this.statusCode =
            statusCode;
    }
}

const normalizeEmail = (
    email: string
): string => {
    return email
        .trim()
        .toLowerCase();
};

/*
 * User-এর safe public information তৈরি করবে।
 *
 * Password, password hash অথবা অন্য private
 * database information return করবে না।
 */
const createPublicUser = (
    user: {
        _id: {
            toString: () => string;
        };
        name: string;
        email: string;
        whatsappNumber?: string;
        isEmailVerified?: boolean;
    }
): PublicUser => {
    return {
        _id:
            user._id.toString(),

        name:
            user.name,

        email:
            user.email,

        whatsappNumber:
            user.whatsappNumber,

        /*
         * User model-এ default true আছে।
         * তারপরও explicit boolean response দেওয়া হচ্ছে।
         */
        isEmailVerified:
            user.isEmailVerified !==
            false,
    };
};

/*
 * Verified account login করবে।
 *
 * Pending registration এখানে পাওয়া যাবে না,
 * কারণ OTP verification-এর আগে pending data
 * মূল users collection-এ রাখা হয় না।
 */
export const loginUser = async (
    input: LoginInput
): Promise<PublicUser> => {
    await connectDB();

    const email =
        normalizeEmail(
            input.email
        );

    const user =
        await User.findOne({
            email,
        }).select(
            "+password"
        );

    if (!user) {
        throw new AuthServiceError(
            "Invalid email or password",
            401
        );
    }

    const passwordMatches =
        await verifyPassword(
            input.password,
            user.password
        );

    if (!passwordMatches) {
        throw new AuthServiceError(
            "Invalid email or password",
            401
        );
    }

    /*
     * সাধারণত unverified account users collection-এ
     * থাকার কথা নয়। তারপরও অতিরিক্ত নিরাপত্তার জন্য
     * এই verification check রাখা হয়েছে।
     */
    if (
        user.isEmailVerified ===
        false
    ) {
        throw new AuthServiceError(
            "Please verify your email before signing in",
            403
        );
    }

    return createPublicUser(
        user
    );
};