import "server-only";

import connectDB from "@/lib/db/connect-db";
import {
    hashPassword,
    verifyPassword,
} from "@/lib/auth/password";
import type {
    LoginInput,
    RegisterInput,
} from "@/lib/validations/auth.schema";
import User from "@/models/User";

export type PublicUser = {
    _id: string;
    name: string;
    email: string;
};

export class AuthServiceError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.name = "AuthServiceError";
        this.statusCode = statusCode;
    }
}

const isDuplicateKeyError = (
    error: unknown
): boolean => {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
    );
};

export const registerUser = async (
    input: RegisterInput
): Promise<PublicUser> => {
    await connectDB();

    const email = input.email.toLowerCase();

    const existingUser = await User.exists({
        email,
    });

    if (existingUser) {
        throw new AuthServiceError(
            "An account with this email already exists",
            409
        );
    }

    const hashedPassword = await hashPassword(
        input.password
    );

    try {
        const user = await User.create({
            name: input.name,
            email,
            password: hashedPassword,
        });

        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
        };
    } catch (error) {
        if (isDuplicateKeyError(error)) {
            throw new AuthServiceError(
                "An account with this email already exists",
                409
            );
        }

        throw error;
    }
};

export const loginUser = async (
    input: LoginInput
): Promise<PublicUser> => {
    await connectDB();

    const email = input.email.toLowerCase();

    const user = await User.findOne({
        email,
    }).select("+password");

    if (!user) {
        throw new AuthServiceError(
            "Invalid email or password",
            401
        );
    }

    const passwordMatches = await verifyPassword(
        input.password,
        user.password
    );

    if (!passwordMatches) {
        throw new AuthServiceError(
            "Invalid email or password",
            401
        );
    }

    return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
    };
};