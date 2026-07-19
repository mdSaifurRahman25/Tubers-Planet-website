import "server-only";

import {
    createHmac,
    randomInt,
    timingSafeEqual,
} from "node:crypto";

/*
 * Password reset OTP হবে 6 digit।
 */
export const PASSWORD_RESET_OTP_LENGTH = 6;

/*
 * OTP 10 মিনিট valid থাকবে।
 */
export const PASSWORD_RESET_OTP_TTL_MS =
    10 * 60 * 1000;

/*
 * নতুন OTP resend করার আগে 60 seconds অপেক্ষা করতে হবে।
 */
export const PASSWORD_RESET_RESEND_COOLDOWN_MS =
    60 * 1000;

/*
 * সর্বোচ্চ 5 বার ভুল OTP দেওয়া যাবে।
 */
export const PASSWORD_RESET_MAX_ATTEMPTS = 5;

/*
 * সম্পূর্ণ password reset request সর্বোচ্চ
 * 30 মিনিট database-এ থাকবে।
 */
export const PASSWORD_RESET_REQUEST_TTL_MS =
    30 * 60 * 1000;

/*
 * OTP verify করার পরে নতুন password দেওয়ার জন্য
 * user 15 মিনিট সময় পাবে।
 */
export const PASSWORD_RESET_AUTHORIZATION_TTL_MS =
    15 * 60 * 1000;

const PASSWORD_RESET_OTP_PATTERN =
    new RegExp(
        `^\\d{${PASSWORD_RESET_OTP_LENGTH}}$`
    );

/*
 * Email verification-এর OTP secret-ই ব্যবহার করা হবে।
 *
 * তবে password reset OTP আলাদা domain prefix দিয়ে
 * hash করা হবে, তাই দুই ধরনের OTP hash এক হবে না।
 */
const getPasswordResetOtpHashSecret =
    (): string => {
        const secret =
            process.env.OTP_HASH_SECRET?.trim();

        if (!secret) {
            throw new Error(
                "OTP_HASH_SECRET is not configured"
            );
        }

        if (secret.length < 32) {
            throw new Error(
                "OTP_HASH_SECRET must contain at least 32 characters"
            );
        }

        return secret;
    };

/*
 * User paste করলে OTP-এর আগে-পরে থাকা
 * whitespace remove করবে।
 */
export const normalizePasswordResetOtp = (
    otp: string
): string => {
    return otp.trim();
};

/*
 * OTP ঠিক 6 digit কি না যাচাই করবে।
 */
export const isValidPasswordResetOtp = (
    otp: string
): boolean => {
    const normalizedOtp =
        normalizePasswordResetOtp(
            otp
        );

    return PASSWORD_RESET_OTP_PATTERN.test(
        normalizedOtp
    );
};

/*
 * Cryptographically secure 6-digit password
 * reset OTP তৈরি করবে।
 *
 * Leading zero-ও থাকতে পারে।
 *
 * Example:
 * 004281
 * 938420
 */
export const generatePasswordResetOtp =
    (): string => {
        const maximumValue =
            10 **
            PASSWORD_RESET_OTP_LENGTH;

        const otpNumber =
            randomInt(
                0,
                maximumValue
            );

        return otpNumber
            .toString()
            .padStart(
                PASSWORD_RESET_OTP_LENGTH,
                "0"
            );
    };

/*
 * Plain OTP database-এ রাখা হবে না।
 *
 * HMAC-SHA256 ব্যবহার করে hash করা হবে।
 */
export const hashPasswordResetOtp = (
    otp: string
): string => {
    const normalizedOtp =
        normalizePasswordResetOtp(
            otp
        );

    if (
        !isValidPasswordResetOtp(
            normalizedOtp
        )
    ) {
        throw new Error(
            `Password reset OTP must contain exactly ${PASSWORD_RESET_OTP_LENGTH} digits`
        );
    }

    return createHmac(
        "sha256",
        getPasswordResetOtpHashSecret()
    )
        .update(
            `thumblify-password-reset-otp:${normalizedOtp}`
        )
        .digest("hex");
};

/*
 * User-এর দেওয়া OTP stored hash-এর সঙ্গে
 * timing-safe উপায়ে compare করবে।
 */
export const verifyPasswordResetOtp = (
    submittedOtp: string,
    storedOtpHash: string
): boolean => {
    const normalizedOtp =
        normalizePasswordResetOtp(
            submittedOtp
        );

    if (
        !isValidPasswordResetOtp(
            normalizedOtp
        )
    ) {
        return false;
    }

    /*
     * SHA-256 hex hash সবসময় 64 character হয়।
     */
    if (
        !/^[a-f0-9]{64}$/i.test(
            storedOtpHash
        )
    ) {
        return false;
    }

    const submittedHash =
        hashPasswordResetOtp(
            normalizedOtp
        );

    const submittedBuffer =
        Buffer.from(
            submittedHash,
            "hex"
        );

    const storedBuffer =
        Buffer.from(
            storedOtpHash,
            "hex"
        );

    if (
        submittedBuffer.length !==
        storedBuffer.length
    ) {
        return false;
    }

    return timingSafeEqual(
        submittedBuffer,
        storedBuffer
    );
};

/*
 * Password reset OTP কখন expire হবে।
 */
export const createPasswordResetOtpExpiresAt = (
    currentTime = new Date()
): Date => {
    return new Date(
        currentTime.getTime() +
        PASSWORD_RESET_OTP_TTL_MS
    );
};

/*
 * আবার OTP পাঠানো কখন সম্ভব হবে।
 */
export const createPasswordResetResendAvailableAt = (
    currentTime = new Date()
): Date => {
    return new Date(
        currentTime.getTime() +
        PASSWORD_RESET_RESEND_COOLDOWN_MS
    );
};

/*
 * সম্পূর্ণ temporary password reset request
 * কখন expire হবে।
 */
export const createPasswordResetRequestExpiresAt = (
    currentTime = new Date()
): Date => {
    return new Date(
        currentTime.getTime() +
        PASSWORD_RESET_REQUEST_TTL_MS
    );
};

/*
 * OTP verification সফল হওয়ার পরে নতুন password
 * দেওয়ার permission কখন expire হবে।
 */
export const createPasswordResetAuthorizationExpiresAt = (
    currentTime = new Date()
): Date => {
    return new Date(
        currentTime.getTime() +
        PASSWORD_RESET_AUTHORIZATION_TTL_MS
    );
};

/*
 * OTP expire হয়েছে কি না।
 */
export const hasPasswordResetOtpExpired = (
    otpExpiresAt: Date,
    currentTime = new Date()
): boolean => {
    return (
        otpExpiresAt.getTime() <=
        currentTime.getTime()
    );
};

/*
 * সম্পূর্ণ password reset request expire হয়েছে কি না।
 */
export const hasPasswordResetRequestExpired = (
    expiresAt: Date,
    currentTime = new Date()
): boolean => {
    return (
        expiresAt.getTime() <=
        currentTime.getTime()
    );
};

/*
 * OTP verification-এর পরে নতুন password দেওয়ার
 * authorization expire হয়েছে কি না।
 */
export const hasPasswordResetAuthorizationExpired = (
    resetExpiresAt: Date | null,
    currentTime = new Date()
): boolean => {
    if (!resetExpiresAt) {
        return true;
    }

    return (
        resetExpiresAt.getTime() <=
        currentTime.getTime()
    );
};

/*
 * নতুন password reset OTP resend করার জন্য
 * আর কত seconds অপেক্ষা করতে হবে।
 */
export const getPasswordResetResendRemainingSeconds = (
    resendAvailableAt: Date,
    currentTime = new Date()
): number => {
    const remainingMilliseconds =
        resendAvailableAt.getTime() -
        currentTime.getTime();

    if (
        remainingMilliseconds <= 0
    ) {
        return 0;
    }

    return Math.ceil(
        remainingMilliseconds /
        1000
    );
};

/*
 * সর্বোচ্চ ভুল OTP attempt শেষ হয়েছে কি না।
 */
export const hasReachedMaximumPasswordResetAttempts = (
    otpAttempts: number
): boolean => {
    return (
        otpAttempts >=
        PASSWORD_RESET_MAX_ATTEMPTS
    );
};

/*
 * OTP verification-এর পরে user নতুন password
 * দেওয়ার জন্য authorized কি না।
 */
export const isPasswordResetAuthorized = (
    isOtpVerified: boolean,
    resetExpiresAt: Date | null,
    currentTime = new Date()
): boolean => {
    if (!isOtpVerified) {
        return false;
    }

    return !hasPasswordResetAuthorizationExpired(
        resetExpiresAt,
        currentTime
    );
};