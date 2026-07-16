import { NextResponse } from "next/server";

import { createUserSession } from "@/lib/auth/session";
import {
    AuthServiceError,
    registerUser,
} from "@/lib/services/auth.service";
import { registerSchema } from "@/lib/validations/auth.schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid registration information",
                    errors:
                        validation.error.flatten().fieldErrors,
                },
                {
                    status: 422,
                }
            );
        }

        const user = await registerUser(
            validation.data
        );

        await createUserSession(user._id);

        return NextResponse.json(
            {
                success: true,
                message: "Account created successfully",
                user,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        if (error instanceof AuthServiceError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                {
                    status: error.statusCode,
                }
            );
        }

        console.error("Register route failed:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to create account",
            },
            {
                status: 500,
            }
        );
    }
}