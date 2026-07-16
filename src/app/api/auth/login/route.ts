import { NextResponse } from "next/server";

import { createUserSession } from "@/lib/auth/session";
import {
    AuthServiceError,
    loginUser,
} from "@/lib/services/auth.service";
import { loginSchema } from "@/lib/validations/auth.schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
    try {
        const body = await request
            .json()
            .catch(() => null);

        const validation = loginSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Invalid login information",
                    errors:
                        validation.error.flatten().fieldErrors,
                },
                {
                    status: 422,
                }
            );
        }

        const user = await loginUser(validation.data);

        await createUserSession(user._id);

        return NextResponse.json({
            success: true,
            message: "Logged in successfully",
            user,
        });
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

        console.error("Login route failed:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Unable to log in",
            },
            {
                status: 500,
            }
        );
    }
}