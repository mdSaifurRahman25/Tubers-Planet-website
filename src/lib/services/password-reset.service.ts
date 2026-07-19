import "server-only";

import connectDB from "@/lib/db/connect-db";
import { hashPassword } from "@/lib/auth/password";
import {
    createPasswordResetAuthorizationExpiresAt,
    createPasswordResetOtpExpiresAt,
    createPasswordResetRequestExpiresAt,
    createPasswordResetResendAvailableAt,
    generatePasswordResetOtp,
    getPasswordResetResendRemainingSeconds,
    hasPasswordResetAuthorizationExpired,
    hasPasswordResetOtpExpired,
    hasPasswordResetRequestExpired,
    hasReachedMaximumPasswordResetAttempts,
    hashPasswordResetOtp,
    isPasswordResetAuthorized,
    isValidPasswordResetOtp,
    PASSWORD_RESET_MAX_ATTEMPTS,
    verifyPasswordResetOtp,
} from "@/lib/auth/password-reset-otp";
import {
    createPasswordResetToken,
    hashPasswordResetToken,
    isValidPasswordResetToken,
} from "@/lib/auth/password-reset-cookie";
import { sendPasswordResetOtp } from "@/lib/email/send-password-reset-otp";
import PasswordResetRequest from "@/models/PasswordResetRequest";
import Session from "@/models/Session";
import User from "@/models/User";

export type PasswordResetErrorCode =
    | "INVALID_RESET_DATA"
    | "RESET_REQUEST_NOT_FOUND"
    | "RESET_REQUEST_EXPIRED"
    | "INVALID_OTP"
    | "OTP_EXPIRED"
    | "OTP_ATTEMPTS_EXCEEDED"
    | "RESEND_TOO_SOON"
    | "EMAIL_DELIVERY_FAILED"
    | "RESET_ALREADY_AUTHORIZED"
    | "RESET_NOT_AUTHORIZED"
    | "RESET_AUTHORIZATION_EXPIRED"
    | "ACCOUNT_NOT_FOUND"
    | "PASSWORD_UPDATE_FAILED";

export class PasswordResetServiceError extends Error {
    statusCode: number;
    code: PasswordResetErrorCode;
    details?: Record<string, unknown>;

    constructor(
        message: string,
        statusCode: number,
        code: PasswordResetErrorCode,
        details?: Record<string, unknown>,
        options?: {
            cause?: unknown;
        }
    ) {
        super(message, options);

        this.name = "PasswordResetServiceError";
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
    }
}

export interface StartPasswordResetInput {
    email: string;
}

export interface StartPasswordResetResult {
    /*
     * Route এই value শুধু server-side ব্যবহার করবে।
     * এটি client response-এ প্রকাশ করা হবে না।
     */
    requestCreated: boolean;

    requestToken?: string;
    maskedEmail?: string;
    otpExpiresAt?: Date;
    resendAvailableAt?: Date;
    expiresAt?: Date;
}

export interface VerifyPasswordResetOtpInput {
    requestToken: string;
    otp: string;
}

export interface VerifyPasswordResetOtpResult {
    authorized: true;
    maskedEmail: string;
    resetExpiresAt: Date;
    expiresAt: Date;
}

export interface ResendPasswordResetOtpInput {
    requestToken: string;
}

export interface ResendPasswordResetOtpResult {
    maskedEmail: string;
    otpExpiresAt: Date;
    resendAvailableAt: Date;
    expiresAt: Date;
}

export interface CompletePasswordResetInput {
    requestToken: string;
    newPassword: string;
}

export interface CompletePasswordResetResult {
    success: true;
    email: string;
}

export type PasswordResetPhase =
    | "verify-otp"
    | "set-password";

export interface PasswordResetStatus {
    phase: PasswordResetPhase;
    maskedEmail: string;
    otpExpiresAt: Date;
    resendAvailableAt: Date;
    expiresAt: Date;
    resetExpiresAt: Date | null;
    resendRemainingSeconds: number;
    canResend: boolean;
    attemptsRemaining: number;
}

const normalizeEmail = (
    email: string
): string => {
    return email
        .trim()
        .toLowerCase();
};

const maskEmailAddress = (
    email: string
): string => {
    const [
        localPart = "",
        domain = "",
    ] = email.split("@");

    if (!localPart || !domain) {
        return email;
    }

    if (localPart.length === 1) {
        return `${localPart}***@${domain}`;
    }

    if (localPart.length === 2) {
        return `${localPart[0]}***${localPart[1]}@${domain}`;
    }

    return `${localPart.slice(
        0,
        2
    )}***${localPart.slice(
        -1
    )}@${domain}`;
};

const isDuplicateKeyError = (
    error: unknown
): boolean => {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as {
            code?: number;
        }).code === 11000
    );
};

const validateEmail = (
    email: string
): string => {
    const normalizedEmail =
        normalizeEmail(email);

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            normalizedEmail
        ) ||
        normalizedEmail.length > 254
    ) {
        throw new PasswordResetServiceError(
            "Please provide a valid email address.",
            400,
            "INVALID_RESET_DATA"
        );
    }

    return normalizedEmail;
};

const validateNewPassword = (
    password: string
): void => {
    if (
        password.length < 8 ||
        password.length > 72
    ) {
        throw new PasswordResetServiceError(
            "Password must contain between 8 and 72 characters.",
            400,
            "INVALID_RESET_DATA"
        );
    }
};

const getRequestTokenHash = (
    requestToken: string
): string => {
    const normalizedToken =
        requestToken.trim();

    if (
        !isValidPasswordResetToken(
            normalizedToken
        )
    ) {
        throw new PasswordResetServiceError(
            "Your password reset session is invalid. Please start again.",
            401,
            "RESET_REQUEST_NOT_FOUND"
        );
    }

    return hashPasswordResetToken(
        normalizedToken
    );
};

/*
 * Forgot Password form submit হওয়ার পরে:
 *
 * 1. Email validation
 * 2. User account খোঁজা
 * 3. OTP ও request token তৈরি
 * 4. Temporary reset request save
 * 5. Password reset email পাঠানো
 *
 * Email না থাকলেও error throw করবে না।
 * Route সবসময় generic response দেখাবে।
 */
export const startPasswordReset =
    async (
        input: StartPasswordResetInput
    ): Promise<StartPasswordResetResult> => {
        const email =
            validateEmail(
                input.email
            );

        await connectDB();

        const user =
            await User.findOne({
                email,
            }).select(
                "_id name email isEmailVerified"
            );

        /*
         * Account না থাকলে বা explicitly unverified হলে
         * generic success flow return করা হবে।
         *
         * এতে কেউ API ব্যবহার করে email database-এ
         * আছে কি না সহজে বুঝতে পারবে না।
         */
        if (
            !user ||
            user.isEmailVerified ===
            false
        ) {
            return {
                requestCreated:
                    false,
            };
        }

        const currentTime =
            new Date();

        const otp =
            generatePasswordResetOtp();

        const otpHash =
            hashPasswordResetOtp(
                otp
            );

        const otpExpiresAt =
            createPasswordResetOtpExpiresAt(
                currentTime
            );

        const resendAvailableAt =
            createPasswordResetResendAvailableAt(
                currentTime
            );

        const {
            token:
            requestToken,

            tokenHash:
            requestTokenHash,

            expiresAt,
        } =
            createPasswordResetToken(
                currentTime
            );

        try {
            await PasswordResetRequest.findOneAndUpdate(
                {
                    userId:
                        user._id,
                },
                {
                    $set: {
                        userId:
                            user._id,

                        email:
                            user.email,

                        otpHash,

                        otpExpiresAt,

                        otpAttempts:
                            0,

                        resendAvailableAt,

                        requestTokenHash,

                        isOtpVerified:
                            false,

                        resetAuthorizedAt:
                            null,

                        resetExpiresAt:
                            null,

                        expiresAt,
                    },
                },
                {
                    upsert:
                        true,

                    new:
                        true,

                    runValidators:
                        true,

                    setDefaultsOnInsert:
                        true,
                }
            );
        } catch (error) {
            if (
                isDuplicateKeyError(
                    error
                )
            ) {
                await PasswordResetRequest.findOneAndUpdate(
                    {
                        email:
                            user.email,
                    },
                    {
                        $set: {
                            userId:
                                user._id,

                            otpHash,

                            otpExpiresAt,

                            otpAttempts:
                                0,

                            resendAvailableAt,

                            requestTokenHash,

                            isOtpVerified:
                                false,

                            resetAuthorizedAt:
                                null,

                            resetExpiresAt:
                                null,

                            expiresAt,
                        },
                    },
                    {
                        new:
                            true,

                        runValidators:
                            true,
                    }
                );
            } else {
                throw error;
            }
        }

        try {
            await sendPasswordResetOtp({
                name:
                    user.name,

                email:
                    user.email,

                otp,
            });
        } catch (error) {
            /*
             * Email পাঠানো না গেলে নতুন request
             * database-এ রেখে দেওয়া হবে না।
             */
            await PasswordResetRequest.deleteOne({
                userId:
                    user._id,

                requestTokenHash,
            });

            throw new PasswordResetServiceError(
                "Unable to send the password reset code. Please try again.",
                502,
                "EMAIL_DELIVERY_FAILED",
                undefined,
                {
                    cause:
                        error,
                }
            );
        }

        return {
            requestCreated:
                true,

            requestToken,

            maskedEmail:
                maskEmailAddress(
                    user.email
                ),

            otpExpiresAt,

            resendAvailableAt,

            expiresAt,
        };
    };

/*
 * Password reset OTP verify করবে।
 *
 * OTP সঠিক হলে নতুন password দেওয়ার জন্য
 * 15 মিনিটের authorization তৈরি হবে।
 */
export const verifyPasswordResetRequestOtp =
    async (
        input: VerifyPasswordResetOtpInput
    ): Promise<VerifyPasswordResetOtpResult> => {
        const requestTokenHash =
            getRequestTokenHash(
                input.requestToken
            );

        const otp =
            input.otp.trim();

        if (
            !isValidPasswordResetOtp(
                otp
            )
        ) {
            throw new PasswordResetServiceError(
                "Please enter a valid 6-digit verification code.",
                400,
                "INVALID_OTP"
            );
        }

        await connectDB();

        const resetRequest =
            await PasswordResetRequest.findOne({
                requestTokenHash,
            }).select(
                "+otpHash"
            );

        if (!resetRequest) {
            throw new PasswordResetServiceError(
                "Your password reset session was not found. Please start again.",
                404,
                "RESET_REQUEST_NOT_FOUND"
            );
        }

        const currentTime =
            new Date();

        if (
            hasPasswordResetRequestExpired(
                resetRequest.expiresAt,
                currentTime
            )
        ) {
            await PasswordResetRequest.deleteOne({
                _id:
                    resetRequest._id,
            });

            throw new PasswordResetServiceError(
                "Your password reset session has expired. Please start again.",
                410,
                "RESET_REQUEST_EXPIRED"
            );
        }

        /*
         * OTP আগে verify হয়ে থাকলে এবং authorization
         * এখনো valid থাকলে একই success result দেবে।
         */
        if (
            isPasswordResetAuthorized(
                resetRequest.isOtpVerified,
                resetRequest.resetExpiresAt,
                currentTime
            )
        ) {
            return {
                authorized:
                    true,

                maskedEmail:
                    maskEmailAddress(
                        resetRequest.email
                    ),

                resetExpiresAt:
                    resetRequest.resetExpiresAt as Date,

                expiresAt:
                    resetRequest.expiresAt,
            };
        }

        if (
            resetRequest.isOtpVerified &&
            hasPasswordResetAuthorizationExpired(
                resetRequest.resetExpiresAt,
                currentTime
            )
        ) {
            throw new PasswordResetServiceError(
                "Your password reset authorization has expired. Please start again.",
                410,
                "RESET_AUTHORIZATION_EXPIRED"
            );
        }

        if (
            hasReachedMaximumPasswordResetAttempts(
                resetRequest.otpAttempts
            )
        ) {
            throw new PasswordResetServiceError(
                "Too many incorrect verification attempts. Please request a new code.",
                429,
                "OTP_ATTEMPTS_EXCEEDED",
                {
                    attemptsRemaining:
                        0,
                }
            );
        }

        if (
            hasPasswordResetOtpExpired(
                resetRequest.otpExpiresAt,
                currentTime
            )
        ) {
            throw new PasswordResetServiceError(
                "Your verification code has expired. Please request a new code.",
                410,
                "OTP_EXPIRED"
            );
        }

        const otpMatches =
            verifyPasswordResetOtp(
                otp,
                resetRequest.otpHash
            );

        if (!otpMatches) {
            const updatedRequest =
                await PasswordResetRequest.findByIdAndUpdate(
                    resetRequest._id,
                    {
                        $inc: {
                            otpAttempts:
                                1,
                        },
                    },
                    {
                        new:
                            true,
                    }
                ).lean();

            const attemptsUsed =
                updatedRequest
                    ?.otpAttempts ??
                resetRequest.otpAttempts +
                1;

            const attemptsRemaining =
                Math.max(
                    0,
                    PASSWORD_RESET_MAX_ATTEMPTS -
                    attemptsUsed
                );

            if (
                attemptsRemaining === 0
            ) {
                throw new PasswordResetServiceError(
                    "Too many incorrect verification attempts. Please request a new code.",
                    429,
                    "OTP_ATTEMPTS_EXCEEDED",
                    {
                        attemptsRemaining:
                            0,
                    }
                );
            }

            throw new PasswordResetServiceError(
                "The verification code is incorrect.",
                400,
                "INVALID_OTP",
                {
                    attemptsRemaining,
                }
            );
        }

        const resetExpiresAt =
            createPasswordResetAuthorizationExpiresAt(
                currentTime
            );

        resetRequest.isOtpVerified =
            true;

        resetRequest.resetAuthorizedAt =
            currentTime;

        resetRequest.resetExpiresAt =
            resetExpiresAt;

        /*
         * Verified OTP পুনরায় ব্যবহার করা যাবে না।
         */
        resetRequest.otpExpiresAt =
            currentTime;

        await resetRequest.save();

        return {
            authorized:
                true,

            maskedEmail:
                maskEmailAddress(
                    resetRequest.email
                ),

            resetExpiresAt,

            expiresAt:
                resetRequest.expiresAt,
        };
    };

/*
 * নতুন password reset OTP পাঠাবে।
 */
export const resendPasswordResetRequestOtp =
    async (
        input: ResendPasswordResetOtpInput
    ): Promise<ResendPasswordResetOtpResult> => {
        const requestTokenHash =
            getRequestTokenHash(
                input.requestToken
            );

        await connectDB();

        const resetRequest =
            await PasswordResetRequest.findOne({
                requestTokenHash,
            }).select(
                "+otpHash"
            );

        if (!resetRequest) {
            throw new PasswordResetServiceError(
                "Your password reset session was not found. Please start again.",
                404,
                "RESET_REQUEST_NOT_FOUND"
            );
        }

        const currentTime =
            new Date();

        if (
            hasPasswordResetRequestExpired(
                resetRequest.expiresAt,
                currentTime
            )
        ) {
            await PasswordResetRequest.deleteOne({
                _id:
                    resetRequest._id,
            });

            throw new PasswordResetServiceError(
                "Your password reset session has expired. Please start again.",
                410,
                "RESET_REQUEST_EXPIRED"
            );
        }

        if (
            resetRequest.isOtpVerified
        ) {
            throw new PasswordResetServiceError(
                "Your verification code has already been confirmed.",
                409,
                "RESET_ALREADY_AUTHORIZED"
            );
        }

        const resendRemainingSeconds =
            getPasswordResetResendRemainingSeconds(
                resetRequest.resendAvailableAt,
                currentTime
            );

        if (
            resendRemainingSeconds > 0
        ) {
            throw new PasswordResetServiceError(
                `Please wait ${resendRemainingSeconds} seconds before requesting another code.`,
                429,
                "RESEND_TOO_SOON",
                {
                    retryAfterSeconds:
                        resendRemainingSeconds,
                }
            );
        }

        const user =
            await User.findById(
                resetRequest.userId
            ).select(
                "_id name email"
            );

        if (!user) {
            await PasswordResetRequest.deleteOne({
                _id:
                    resetRequest._id,
            });

            throw new PasswordResetServiceError(
                "The account connected to this password reset request was not found.",
                404,
                "ACCOUNT_NOT_FOUND"
            );
        }

        const otp =
            generatePasswordResetOtp();

        const otpHash =
            hashPasswordResetOtp(
                otp
            );

        const otpExpiresAt =
            createPasswordResetOtpExpiresAt(
                currentTime
            );

        const resendAvailableAt =
            createPasswordResetResendAvailableAt(
                currentTime
            );

        const expiresAt =
            createPasswordResetRequestExpiresAt(
                currentTime
            );

        const previousOtpHash =
            resetRequest.otpHash;

        const previousOtpExpiresAt =
            resetRequest.otpExpiresAt;

        const previousOtpAttempts =
            resetRequest.otpAttempts;

        const previousResendAvailableAt =
            resetRequest.resendAvailableAt;

        const previousExpiresAt =
            resetRequest.expiresAt;

        resetRequest.otpHash =
            otpHash;

        resetRequest.otpExpiresAt =
            otpExpiresAt;

        resetRequest.otpAttempts =
            0;

        resetRequest.resendAvailableAt =
            resendAvailableAt;

        resetRequest.isOtpVerified =
            false;

        resetRequest.resetAuthorizedAt =
            null;

        resetRequest.resetExpiresAt =
            null;

        resetRequest.expiresAt =
            expiresAt;

        await resetRequest.save();

        try {
            await sendPasswordResetOtp({
                name:
                    user.name,

                email:
                    user.email,

                otp,
            });
        } catch (error) {
            /*
             * Email পাঠাতে সমস্যা হলে আগের OTP state
             * পুনরুদ্ধারের চেষ্টা করবে।
             */
            try {
                await PasswordResetRequest.updateOne(
                    {
                        _id:
                            resetRequest._id,

                        requestTokenHash,
                    },
                    {
                        $set: {
                            otpHash:
                                previousOtpHash,

                            otpExpiresAt:
                                previousOtpExpiresAt,

                            otpAttempts:
                                previousOtpAttempts,

                            resendAvailableAt:
                                previousResendAvailableAt,

                            expiresAt:
                                previousExpiresAt,
                        },
                    }
                );
            } catch (
            rollbackError
            ) {
                console.error(
                    "Unable to restore password reset request after email failure:",
                    rollbackError
                );
            }

            throw new PasswordResetServiceError(
                "Unable to resend the password reset code. Please try again.",
                502,
                "EMAIL_DELIVERY_FAILED",
                undefined,
                {
                    cause:
                        error,
                }
            );
        }

        return {
            maskedEmail:
                maskEmailAddress(
                    resetRequest.email
                ),

            otpExpiresAt,

            resendAvailableAt,

            expiresAt,
        };
    };

/*
 * OTP page অথবা New Password page load হওয়ার সময়
 * current password reset request-এর public status দেবে।
 */
export const getPasswordResetStatus =
    async (
        requestToken: string
    ): Promise<PasswordResetStatus> => {
        const requestTokenHash =
            getRequestTokenHash(
                requestToken
            );

        await connectDB();

        const resetRequest =
            await PasswordResetRequest.findOne({
                requestTokenHash,
            }).lean();

        if (!resetRequest) {
            throw new PasswordResetServiceError(
                "Your password reset session was not found. Please start again.",
                404,
                "RESET_REQUEST_NOT_FOUND"
            );
        }

        const currentTime =
            new Date();

        if (
            hasPasswordResetRequestExpired(
                resetRequest.expiresAt,
                currentTime
            )
        ) {
            await PasswordResetRequest.deleteOne({
                _id:
                    resetRequest._id,
            });

            throw new PasswordResetServiceError(
                "Your password reset session has expired. Please start again.",
                410,
                "RESET_REQUEST_EXPIRED"
            );
        }

        const authorized =
            isPasswordResetAuthorized(
                resetRequest.isOtpVerified,
                resetRequest.resetExpiresAt,
                currentTime
            );

        if (
            resetRequest.isOtpVerified &&
            !authorized
        ) {
            throw new PasswordResetServiceError(
                "Your password reset authorization has expired. Please start again.",
                410,
                "RESET_AUTHORIZATION_EXPIRED"
            );
        }

        const resendRemainingSeconds =
            getPasswordResetResendRemainingSeconds(
                resetRequest.resendAvailableAt,
                currentTime
            );

        const attemptsRemaining =
            Math.max(
                0,
                PASSWORD_RESET_MAX_ATTEMPTS -
                resetRequest.otpAttempts
            );

        return {
            phase:
                authorized
                    ? "set-password"
                    : "verify-otp",

            maskedEmail:
                maskEmailAddress(
                    resetRequest.email
                ),

            otpExpiresAt:
                resetRequest.otpExpiresAt,

            resendAvailableAt:
                resetRequest.resendAvailableAt,

            expiresAt:
                resetRequest.expiresAt,

            resetExpiresAt:
                resetRequest.resetExpiresAt,

            resendRemainingSeconds,

            canResend:
                !authorized &&
                resendRemainingSeconds ===
                0,

            attemptsRemaining,
        };
    };

/*
 * OTP verification সফল হওয়ার পরে নতুন password save করবে।
 *
 * Password update হওয়ার আগে user-এর সব existing
 * login session revoke করা হবে।
 */
export const completePasswordReset =
    async (
        input: CompletePasswordResetInput
    ): Promise<CompletePasswordResetResult> => {
        validateNewPassword(
            input.newPassword
        );

        const requestTokenHash =
            getRequestTokenHash(
                input.requestToken
            );

        await connectDB();

        const resetRequest =
            await PasswordResetRequest.findOne({
                requestTokenHash,
            });

        if (!resetRequest) {
            throw new PasswordResetServiceError(
                "Your password reset session was not found. Please start again.",
                404,
                "RESET_REQUEST_NOT_FOUND"
            );
        }

        const currentTime =
            new Date();

        if (
            hasPasswordResetRequestExpired(
                resetRequest.expiresAt,
                currentTime
            )
        ) {
            await PasswordResetRequest.deleteOne({
                _id:
                    resetRequest._id,
            });

            throw new PasswordResetServiceError(
                "Your password reset session has expired. Please start again.",
                410,
                "RESET_REQUEST_EXPIRED"
            );
        }

        if (
            !resetRequest.isOtpVerified
        ) {
            throw new PasswordResetServiceError(
                "Verify your email code before setting a new password.",
                403,
                "RESET_NOT_AUTHORIZED"
            );
        }

        if (
            hasPasswordResetAuthorizationExpired(
                resetRequest.resetExpiresAt,
                currentTime
            )
        ) {
            throw new PasswordResetServiceError(
                "Your password reset authorization has expired. Please start again.",
                410,
                "RESET_AUTHORIZATION_EXPIRED"
            );
        }

        const user =
            await User.findById(
                resetRequest.userId
            ).select(
                "_id email"
            );

        if (!user) {
            await PasswordResetRequest.deleteOne({
                _id:
                    resetRequest._id,
            });

            throw new PasswordResetServiceError(
                "The account connected to this password reset request was not found.",
                404,
                "ACCOUNT_NOT_FOUND"
            );
        }

        const passwordHash =
            await hashPassword(
                input.newPassword
            );

        try {
            /*
             * পুরোনো browser/device sessionগুলো আগে
             * revoke করা হচ্ছে।
             */
            await Session.deleteMany({
                userId:
                    user._id,
            });

            user.password =
                passwordHash;

            await user.save();

            await PasswordResetRequest.deleteOne({
                _id:
                    resetRequest._id,
            });

            return {
                success:
                    true,

                email:
                    user.email,
            };
        } catch (error) {
            throw new PasswordResetServiceError(
                "Unable to update your password. Please try again.",
                500,
                "PASSWORD_UPDATE_FAILED",
                undefined,
                {
                    cause:
                        error,
                }
            );
        }
    };

/*
 * Route-এর catch block থেকে password reset
 * service error শনাক্ত করতে ব্যবহার হবে।
 */
export const isPasswordResetServiceError = (
    error: unknown
): error is PasswordResetServiceError => {
    return (
        error instanceof
        PasswordResetServiceError
    );
};