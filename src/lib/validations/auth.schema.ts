import { z } from "zod";

const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .email(
        "Please provide a valid email address"
    )
    .max(
        254,
        "Email address is too long"
    );

const passwordSchema = z
    .string()
    .min(
        8,
        "Password must contain at least 8 characters"
    )
    .max(
        72,
        "Password cannot exceed 72 characters"
    );

const otpSchema = z
    .string()
    .trim()
    .regex(
        /^\d{6}$/,
        "Please enter a valid 6-digit verification code"
    );

/*
 * WhatsApp number optional।
 *
 * Empty string দিলে undefined হয়ে যাবে।
 *
 * Accepted examples:
 * +8801712345678
 * 01712345678
 * +1 202-555-0123
 */
const whatsappNumberSchema =
    z.preprocess(
        (value) => {
            if (
                typeof value !==
                "string"
            ) {
                return value;
            }

            const trimmedValue =
                value.trim();

            if (!trimmedValue) {
                return undefined;
            }

            return trimmedValue;
        },

        z
            .string()
            .transform((value) =>
                value.replace(
                    /[\s()-]/g,
                    ""
                )
            )
            .refine(
                (value) =>
                    /^\+?[0-9]{7,20}$/.test(
                        value
                    ),
                {
                    message:
                        "Please provide a valid WhatsApp number",
                }
            )
            .optional()
    );

/*
 * Account registration validation।
 */
export const registerSchema =
    z.object({
        name: z
            .string()
            .trim()
            .min(
                2,
                "Name must contain at least 2 characters"
            )
            .max(
                80,
                "Name cannot exceed 80 characters"
            ),

        email:
            emailSchema,

        whatsappNumber:
            whatsappNumberSchema,

        password:
            passwordSchema,

        acceptedTerms: z
            .boolean({
                message:
                    "You must agree to the Terms and Conditions and Privacy Policy",
            })
            .refine(
                (value) =>
                    value === true,
                {
                    message:
                        "You must agree to the Terms and Conditions and Privacy Policy",
                }
            ),
    });

/*
 * Account login validation।
 */
export const loginSchema =
    z.object({
        email:
            emailSchema,

        password: z
            .string()
            .min(
                1,
                "Password is required"
            )
            .max(
                72,
                "Password cannot exceed 72 characters"
            ),

        /*
         * Frontend rememberMe না পাঠালেও
         * default false হবে।
         */
        rememberMe: z
            .boolean()
            .optional()
            .default(false),
    });

/*
 * New account email verification OTP।
 */
export const verifyEmailSchema =
    z.object({
        otp:
            otpSchema,
    });

/*
 * Forgot Password form।
 *
 * User শুধু account email submit করবে।
 */
export const forgotPasswordSchema =
    z.object({
        email:
            emailSchema,
    });

/*
 * Password Reset OTP verification।
 */
export const verifyPasswordResetOtpSchema =
    z.object({
        otp:
            otpSchema,
    });

/*
 * OTP verification-এর পরে নতুন password সেট করবে।
 *
 * newPassword এবং confirmPassword একই না হলে
 * confirmPassword field-এ validation error দেখাবে।
 */
export const resetPasswordSchema =
    z
        .object({
            newPassword:
                passwordSchema,

            confirmPassword: z
                .string()
                .min(
                    1,
                    "Please confirm your new password"
                )
                .max(
                    72,
                    "Password cannot exceed 72 characters"
                ),
        })
        .refine(
            (data) =>
                data.newPassword ===
                data.confirmPassword,
            {
                message:
                    "Passwords do not match",
                path: [
                    "confirmPassword",
                ],
            }
        );

export type RegisterInput =
    z.infer<
        typeof registerSchema
    >;

export type LoginInput =
    z.infer<
        typeof loginSchema
    >;

export type VerifyEmailInput =
    z.infer<
        typeof verifyEmailSchema
    >;

export type ForgotPasswordInput =
    z.infer<
        typeof forgotPasswordSchema
    >;

export type VerifyPasswordResetOtpInput =
    z.infer<
        typeof verifyPasswordResetOtpSchema
    >;

export type ResetPasswordInput =
    z.infer<
        typeof resetPasswordSchema
    >;