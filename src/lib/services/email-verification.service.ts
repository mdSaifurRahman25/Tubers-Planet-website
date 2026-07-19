import "server-only";

import connectDB from "@/lib/db/connect-db";
import { hashPassword } from "@/lib/auth/password";
import {
    createOtpExpiresAt,
    createPendingRegistrationExpiresAt,
    createResendAvailableAt,
    EMAIL_VERIFICATION_MAX_ATTEMPTS,
    generateEmailVerificationOtp,
    getOtpResendRemainingSeconds,
    hasOtpExpired,
    hasPendingRegistrationExpired,
    hasReachedMaximumOtpAttempts,
    hashEmailVerificationOtp,
    isValidEmailVerificationOtp,
    verifyEmailVerificationOtp,
} from "@/lib/auth/email-verification-otp";
import {
    createPendingRegistrationToken,
    hashPendingRegistrationToken,
    isValidPendingRegistrationToken,
} from "@/lib/auth/pending-registration-cookie";
import {
    sendVerificationOtp,
    VerificationOtpEmailError,
} from "@/lib/email/send-verification-otp";
import PendingRegistration from "@/models/PendingRegistration";
import User from "@/models/User";

/*
 * Terms and Conditions-এর বর্তমান version।
 * ভবিষ্যতে Terms update করলে এই value পরিবর্তন করা যাবে।
 */
export const CURRENT_TERMS_VERSION =
    "2026-07-19";

export type EmailVerificationErrorCode =
    | "INVALID_REGISTRATION_DATA"
    | "EMAIL_ALREADY_REGISTERED"
    | "PENDING_REGISTRATION_NOT_FOUND"
    | "PENDING_REGISTRATION_EXPIRED"
    | "INVALID_OTP"
    | "OTP_EXPIRED"
    | "OTP_ATTEMPTS_EXCEEDED"
    | "RESEND_TOO_SOON"
    | "EMAIL_DELIVERY_FAILED"
    | "ACCOUNT_CREATION_FAILED";

export class EmailVerificationServiceError extends Error {
    statusCode: number;
    code: EmailVerificationErrorCode;
    details?: Record<string, unknown>;

    constructor(
        message: string,
        statusCode: number,
        code: EmailVerificationErrorCode,
        details?: Record<string, unknown>,
        options?: {
            cause?: unknown;
        }
    ) {
        super(message, options);

        this.name =
            "EmailVerificationServiceError";

        this.statusCode =
            statusCode;

        this.code =
            code;

        this.details =
            details;
    }
}

export interface StartPendingRegistrationInput {
    name: string;
    email: string;

    /*
     * WhatsApp number optional।
     */
    whatsappNumber?: string;

    password: string;
    acceptedTerms: boolean;
}

export interface StartPendingRegistrationResult {
    registrationToken: string;
    maskedEmail: string;
    otpExpiresAt: Date;
    resendAvailableAt: Date;
    expiresAt: Date;
}

export interface VerifyPendingRegistrationInput {
    registrationToken: string;
    otp: string;
}

export interface VerifiedRegistrationUser {
    _id: string;
    name: string;
    email: string;
    whatsappNumber?: string;
    isEmailVerified: true;
}

export interface VerifyPendingRegistrationResult {
    user: VerifiedRegistrationUser;
}

export interface ResendVerificationOtpInput {
    registrationToken: string;
}

export interface ResendVerificationOtpResult {
    maskedEmail: string;
    otpExpiresAt: Date;
    resendAvailableAt: Date;

    /*
     * Resend করার পরে pending registration-এর
     * expiry বাড়ানো হবে। Route এই value ব্যবহার করে
     * একই cookie-এর expiry update করবে।
     */
    expiresAt: Date;
}

export interface PendingRegistrationStatus {
    maskedEmail: string;
    otpExpiresAt: Date;
    resendAvailableAt: Date;
    expiresAt: Date;
    resendRemainingSeconds: number;
    canResend: boolean;
    attemptsRemaining: number;
}

const normalizeName = (
    name: string
): string => {
    return name
        .trim()
        .replace(/\s+/g, " ");
};

const normalizeEmail = (
    email: string
): string => {
    return email
        .trim()
        .toLowerCase();
};

/*
 * WhatsApp number optional।
 *
 * শুধু whitespace, dash এবং bracket remove করে
 * database-friendly format তৈরি করবে।
 *
 * Example:
 * +880 1712-345678
 * → +8801712345678
 */
const normalizeWhatsappNumber = (
    whatsappNumber?: string
): string | undefined => {
    const normalized =
        whatsappNumber
            ?.trim()
            .replace(
                /[\s()-]/g,
                ""
            );

    return normalized || undefined;
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

const getRegistrationTokenHash = (
    registrationToken: string
): string => {
    const normalizedToken =
        registrationToken.trim();

    if (
        !isValidPendingRegistrationToken(
            normalizedToken
        )
    ) {
        throw new EmailVerificationServiceError(
            "Your verification session is invalid. Please register again.",
            401,
            "PENDING_REGISTRATION_NOT_FOUND"
        );
    }

    return hashPendingRegistrationToken(
        normalizedToken
    );
};

const validateStartRegistrationInput = (
    input: StartPendingRegistrationInput
): {
    name: string;
    email: string;
    whatsappNumber?: string;
} => {
    const name =
        normalizeName(
            input.name
        );

    const email =
        normalizeEmail(
            input.email
        );

    const whatsappNumber =
        normalizeWhatsappNumber(
            input.whatsappNumber
        );

    if (
        name.length < 2 ||
        name.length > 80
    ) {
        throw new EmailVerificationServiceError(
            "Name must contain between 2 and 80 characters.",
            400,
            "INVALID_REGISTRATION_DATA"
        );
    }

    if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            email
        ) ||
        email.length > 254
    ) {
        throw new EmailVerificationServiceError(
            "Please provide a valid email address.",
            400,
            "INVALID_REGISTRATION_DATA"
        );
    }

    if (
        input.password.length < 8 ||
        input.password.length > 72
    ) {
        throw new EmailVerificationServiceError(
            "Password must contain between 8 and 72 characters.",
            400,
            "INVALID_REGISTRATION_DATA"
        );
    }

    if (
        whatsappNumber &&
        !/^\+?[0-9]{7,20}$/.test(
            whatsappNumber
        )
    ) {
        throw new EmailVerificationServiceError(
            "Please provide a valid WhatsApp number.",
            400,
            "INVALID_REGISTRATION_DATA"
        );
    }

    if (!input.acceptedTerms) {
        throw new EmailVerificationServiceError(
            "You must agree to the Terms and Conditions and Privacy Policy.",
            400,
            "INVALID_REGISTRATION_DATA"
        );
    }

    return {
        name,
        email,
        whatsappNumber,
    };
};

/*
 * Sign-up form submit হওয়ার পরে:
 *
 * 1. Main User collection check করবে
 * 2. Password hash করবে
 * 3. OTP তৈরি ও hash করবে
 * 4. PendingRegistration collection-এ রাখবে
 * 5. Verification email পাঠাবে
 * 6. Raw registration token route-এ return করবে
 */
export const startPendingRegistration =
    async (
        input: StartPendingRegistrationInput
    ): Promise<StartPendingRegistrationResult> => {
        const {
            name,
            email,
            whatsappNumber,
        } =
            validateStartRegistrationInput(
                input
            );

        await connectDB();

        const existingUser =
            await User.exists({
                email,
            });

        if (existingUser) {
            throw new EmailVerificationServiceError(
                "An account with this email already exists.",
                409,
                "EMAIL_ALREADY_REGISTERED"
            );
        }

        const currentTime =
            new Date();

        const passwordHash =
            await hashPassword(
                input.password
            );

        const otp =
            generateEmailVerificationOtp();

        const otpHash =
            hashEmailVerificationOtp(
                otp
            );

        const otpExpiresAt =
            createOtpExpiresAt(
                currentTime
            );

        const resendAvailableAt =
            createResendAvailableAt(
                currentTime
            );

        const {
            token:
            registrationToken,

            tokenHash:
            registrationTokenHash,

            expiresAt,
        } =
            createPendingRegistrationToken(
                currentTime
            );

        try {
            await PendingRegistration.findOneAndUpdate(
                {
                    email,
                },
                {
                    $set: {
                        name,
                        email,
                        whatsappNumber,
                        passwordHash,
                        otpHash,
                        otpExpiresAt,
                        otpAttempts: 0,
                        resendAvailableAt,
                        registrationTokenHash,
                        termsAcceptedAt:
                            currentTime,
                        termsVersion:
                            CURRENT_TERMS_VERSION,
                        expiresAt,
                    },
                },
                {
                    upsert: true,
                    new: true,
                    runValidators: true,
                    setDefaultsOnInsert:
                        true,
                }
            );
        } catch (error) {
            /*
             * একই email দিয়ে একসঙ্গে দুইটি request এলে
             * unique index race condition handle করবে।
             */
            if (
                isDuplicateKeyError(
                    error
                )
            ) {
                await PendingRegistration.findOneAndUpdate(
                    {
                        email,
                    },
                    {
                        $set: {
                            name,
                            whatsappNumber,
                            passwordHash,
                            otpHash,
                            otpExpiresAt,
                            otpAttempts: 0,
                            resendAvailableAt,
                            registrationTokenHash,
                            termsAcceptedAt:
                                currentTime,
                            termsVersion:
                                CURRENT_TERMS_VERSION,
                            expiresAt,
                        },
                    },
                    {
                        new: true,
                        runValidators:
                            true,
                    }
                );
            } else {
                throw error;
            }
        }

        try {
            await sendVerificationOtp({
                name,
                email,
                otp,
            });
        } catch (error) {
            /*
             * Email পাঠানো না গেলে নতুন pending request
             * রেখে দেওয়া হবে না।
             *
             * tokenHash condition থাকার কারণে অন্য কোনো
             * নতুন request ভুল করে delete হবে না।
             */
            await PendingRegistration.deleteOne({
                email,
                registrationTokenHash,
            });

            throw new EmailVerificationServiceError(
                "Unable to send the verification code. Please try again.",
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
            registrationToken,
            maskedEmail:
                maskEmailAddress(
                    email
                ),
            otpExpiresAt,
            resendAvailableAt,
            expiresAt,
        };
    };

/*
 * OTP verify করে final User account তৈরি করবে।
 *
 * Verification সফল হওয়ার আগ পর্যন্ত main users
 * collection-এ কোনো user তৈরি হবে না।
 */
export const verifyPendingRegistrationOtp =
    async (
        input: VerifyPendingRegistrationInput
    ): Promise<VerifyPendingRegistrationResult> => {
        const registrationTokenHash =
            getRegistrationTokenHash(
                input.registrationToken
            );

        const otp =
            input.otp.trim();

        if (
            !isValidEmailVerificationOtp(
                otp
            )
        ) {
            throw new EmailVerificationServiceError(
                "Please enter a valid 6-digit verification code.",
                400,
                "INVALID_OTP"
            );
        }

        await connectDB();

        const pendingRegistration =
            await PendingRegistration.findOne({
                registrationTokenHash,
            }).select(
                "+passwordHash +otpHash"
            );

        if (!pendingRegistration) {
            throw new EmailVerificationServiceError(
                "Your verification session was not found. Please register again.",
                404,
                "PENDING_REGISTRATION_NOT_FOUND"
            );
        }

        const currentTime =
            new Date();

        if (
            hasPendingRegistrationExpired(
                pendingRegistration.expiresAt,
                currentTime
            )
        ) {
            await PendingRegistration.deleteOne({
                _id:
                    pendingRegistration._id,
            });

            throw new EmailVerificationServiceError(
                "Your registration session has expired. Please register again.",
                410,
                "PENDING_REGISTRATION_EXPIRED"
            );
        }

        if (
            hasReachedMaximumOtpAttempts(
                pendingRegistration.otpAttempts
            )
        ) {
            throw new EmailVerificationServiceError(
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
            hasOtpExpired(
                pendingRegistration.otpExpiresAt,
                currentTime
            )
        ) {
            throw new EmailVerificationServiceError(
                "Your verification code has expired. Please request a new code.",
                410,
                "OTP_EXPIRED"
            );
        }

        const otpMatches =
            verifyEmailVerificationOtp(
                otp,
                pendingRegistration.otpHash
            );

        if (!otpMatches) {
            const updatedRegistration =
                await PendingRegistration.findByIdAndUpdate(
                    pendingRegistration._id,
                    {
                        $inc: {
                            otpAttempts:
                                1,
                        },
                    },
                    {
                        new: true,
                    }
                ).lean();

            const attemptsUsed =
                updatedRegistration
                    ?.otpAttempts ??
                pendingRegistration.otpAttempts +
                1;

            const attemptsRemaining =
                Math.max(
                    0,
                    EMAIL_VERIFICATION_MAX_ATTEMPTS -
                    attemptsUsed
                );

            if (
                attemptsRemaining === 0
            ) {
                throw new EmailVerificationServiceError(
                    "Too many incorrect verification attempts. Please request a new code.",
                    429,
                    "OTP_ATTEMPTS_EXCEEDED",
                    {
                        attemptsRemaining:
                            0,
                    }
                );
            }

            throw new EmailVerificationServiceError(
                "The verification code is incorrect.",
                400,
                "INVALID_OTP",
                {
                    attemptsRemaining,
                }
            );
        }

        /*
         * Verification-এর সময় আবার User collection check
         * করা হবে, যাতে race condition-এর কারণে duplicate
         * account তৈরি না হয়।
         */
        const existingUser =
            await User.exists({
                email:
                    pendingRegistration.email,
            });

        if (existingUser) {
            await PendingRegistration.deleteOne({
                _id:
                    pendingRegistration._id,
            });

            throw new EmailVerificationServiceError(
                "An account with this email already exists.",
                409,
                "EMAIL_ALREADY_REGISTERED"
            );
        }

        try {
            const user =
                new User();

            user.name =
                pendingRegistration.name;

            user.email =
                pendingRegistration.email;

            user.password =
                pendingRegistration.passwordHash;

            /*
             * User model update করার পরে এই fields
             * main User collection-এ save হবে।
             */
            user.set(
                "whatsappNumber",
                pendingRegistration.whatsappNumber
            );

            user.set(
                "isEmailVerified",
                true
            );

            user.set(
                "emailVerifiedAt",
                currentTime
            );

            user.set(
                "termsAcceptedAt",
                pendingRegistration.termsAcceptedAt
            );

            user.set(
                "termsVersion",
                pendingRegistration.termsVersion
            );

            await user.save();

            await PendingRegistration.deleteOne({
                _id:
                    pendingRegistration._id,
            });

            return {
                user: {
                    _id:
                        user._id.toString(),

                    name:
                        user.name,

                    email:
                        user.email,

                    whatsappNumber:
                        pendingRegistration.whatsappNumber,

                    isEmailVerified:
                        true,
                },
            };
        } catch (error) {
            if (
                isDuplicateKeyError(
                    error
                )
            ) {
                await PendingRegistration.deleteOne({
                    _id:
                        pendingRegistration._id,
                });

                throw new EmailVerificationServiceError(
                    "An account with this email already exists.",
                    409,
                    "EMAIL_ALREADY_REGISTERED",
                    undefined,
                    {
                        cause:
                            error,
                    }
                );
            }

            throw new EmailVerificationServiceError(
                "Unable to create your account. Please try again.",
                500,
                "ACCOUNT_CREATION_FAILED",
                undefined,
                {
                    cause:
                        error,
                }
            );
        }
    };

/*
 * Verification page থেকে নতুন OTP পাঠাবে।
 */
export const resendPendingRegistrationOtp =
    async (
        input: ResendVerificationOtpInput
    ): Promise<ResendVerificationOtpResult> => {
        const registrationTokenHash =
            getRegistrationTokenHash(
                input.registrationToken
            );

        await connectDB();

        const pendingRegistration =
            await PendingRegistration.findOne({
                registrationTokenHash,
            }).select(
                "+otpHash"
            );

        if (!pendingRegistration) {
            throw new EmailVerificationServiceError(
                "Your verification session was not found. Please register again.",
                404,
                "PENDING_REGISTRATION_NOT_FOUND"
            );
        }

        const currentTime =
            new Date();

        if (
            hasPendingRegistrationExpired(
                pendingRegistration.expiresAt,
                currentTime
            )
        ) {
            await PendingRegistration.deleteOne({
                _id:
                    pendingRegistration._id,
            });

            throw new EmailVerificationServiceError(
                "Your registration session has expired. Please register again.",
                410,
                "PENDING_REGISTRATION_EXPIRED"
            );
        }

        const resendRemainingSeconds =
            getOtpResendRemainingSeconds(
                pendingRegistration.resendAvailableAt,
                currentTime
            );

        if (
            resendRemainingSeconds > 0
        ) {
            throw new EmailVerificationServiceError(
                `Please wait ${resendRemainingSeconds} seconds before requesting another code.`,
                429,
                "RESEND_TOO_SOON",
                {
                    retryAfterSeconds:
                        resendRemainingSeconds,
                }
            );
        }

        const otp =
            generateEmailVerificationOtp();

        const otpHash =
            hashEmailVerificationOtp(
                otp
            );

        const otpExpiresAt =
            createOtpExpiresAt(
                currentTime
            );

        const resendAvailableAt =
            createResendAvailableAt(
                currentTime
            );

        const expiresAt =
            createPendingRegistrationExpiresAt(
                currentTime
            );

        /*
         * Email পাঠাতে সমস্যা হলে পুরোনো OTP state
         * restore করার জন্য আগের values রাখা হচ্ছে।
         */
        const previousOtpHash =
            pendingRegistration.otpHash;

        const previousOtpExpiresAt =
            pendingRegistration.otpExpiresAt;

        const previousOtpAttempts =
            pendingRegistration.otpAttempts;

        const previousResendAvailableAt =
            pendingRegistration.resendAvailableAt;

        const previousExpiresAt =
            pendingRegistration.expiresAt;

        pendingRegistration.otpHash =
            otpHash;

        pendingRegistration.otpExpiresAt =
            otpExpiresAt;

        pendingRegistration.otpAttempts =
            0;

        pendingRegistration.resendAvailableAt =
            resendAvailableAt;

        pendingRegistration.expiresAt =
            expiresAt;

        await pendingRegistration.save();

        try {
            await sendVerificationOtp({
                name:
                    pendingRegistration.name,

                email:
                    pendingRegistration.email,

                otp,
            });
        } catch (error) {
            /*
             * Email পাঠানো ব্যর্থ হলে পুরোনো OTP এবং
             * expiry state পুনরুদ্ধারের চেষ্টা করবে।
             */
            try {
                await PendingRegistration.updateOne(
                    {
                        _id:
                            pendingRegistration._id,

                        registrationTokenHash,
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
                    "Unable to restore pending registration after email failure:",
                    rollbackError
                );
            }

            throw new EmailVerificationServiceError(
                "Unable to resend the verification code. Please try again.",
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
                    pendingRegistration.email
                ),

            otpExpiresAt,
            resendAvailableAt,
            expiresAt,
        };
    };

/*
 * OTP verification page load হওয়ার সময় pending
 * registration-এর public status পাওয়া যাবে।
 *
 * Password, OTP hash বা raw email return করবে না।
 */
export const getPendingRegistrationStatus =
    async (
        registrationToken: string
    ): Promise<PendingRegistrationStatus> => {
        const registrationTokenHash =
            getRegistrationTokenHash(
                registrationToken
            );

        await connectDB();

        const pendingRegistration =
            await PendingRegistration.findOne({
                registrationTokenHash,
            }).lean();

        if (!pendingRegistration) {
            throw new EmailVerificationServiceError(
                "Your verification session was not found. Please register again.",
                404,
                "PENDING_REGISTRATION_NOT_FOUND"
            );
        }

        const currentTime =
            new Date();

        if (
            hasPendingRegistrationExpired(
                pendingRegistration.expiresAt,
                currentTime
            )
        ) {
            await PendingRegistration.deleteOne({
                _id:
                    pendingRegistration._id,
            });

            throw new EmailVerificationServiceError(
                "Your registration session has expired. Please register again.",
                410,
                "PENDING_REGISTRATION_EXPIRED"
            );
        }

        const resendRemainingSeconds =
            getOtpResendRemainingSeconds(
                pendingRegistration.resendAvailableAt,
                currentTime
            );

        const attemptsRemaining =
            Math.max(
                0,
                EMAIL_VERIFICATION_MAX_ATTEMPTS -
                pendingRegistration.otpAttempts
            );

        return {
            maskedEmail:
                maskEmailAddress(
                    pendingRegistration.email
                ),

            otpExpiresAt:
                pendingRegistration.otpExpiresAt,

            resendAvailableAt:
                pendingRegistration.resendAvailableAt,

            expiresAt:
                pendingRegistration.expiresAt,

            resendRemainingSeconds,

            canResend:
                resendRemainingSeconds ===
                0,

            attemptsRemaining,
        };
    };

/*
 * কোনো route-এ catch block থেকে সহজে service error
 * শনাক্ত করতে ব্যবহার করা যাবে।
 */
export const isEmailVerificationServiceError = (
    error: unknown
): error is EmailVerificationServiceError => {
    return (
        error instanceof
        EmailVerificationServiceError
    );
};

/*
 * Email sending-এর original custom error দরকার হলে
 * এই helper দিয়ে শনাক্ত করা যাবে।
 */
export const isVerificationOtpEmailError = (
    error: unknown
): error is VerificationOtpEmailError => {
    return (
        error instanceof
        VerificationOtpEmailError
    );
};