import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email("Please provide a valid email address")
    .max(254, "Email address is too long");

const passwordSchema = z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(72, "Password cannot exceed 72 characters");

export const registerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must contain at least 2 characters")
        .max(80, "Name cannot exceed 80 characters"),

    email: emailSchema,

    password: passwordSchema,
});

export const loginSchema = z.object({
    email: emailSchema,

    password: z
        .string()
        .min(1, "Password is required")
        .max(72, "Password cannot exceed 72 characters"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;