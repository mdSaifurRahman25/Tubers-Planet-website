import "server-only";

import {
    createHmac,
    randomInt,
    timingSafeEqual,
} from "node:crypto";

/*
 * Verification OTP হবে 6 digit।
 */
export const EMAIL_VERIFICATION_OTP_LENGTH = 6;

/*
 * OTP 10 মিনিট পর্যন্ত valid থাকবে।
 */
export const EMAIL_VERIFICATION_OTP_TTL_MS =
    10 * 60 * 1000;

/*
 * নতুন OTP resend করার আগে 60 seconds অপেক্ষা করতে হবে।
 */
export const EMAIL_VERIFICATION_RESEND_COOLDOWN_MS =
    60 * 1000;

/*
 * সর্বোচ্চ 5 বার ভুল OTP দেওয়া যাবে।
 */
export const EMAIL_VERIFICATION_MAX_ATTEMPTS = 5;

/*
 * Pending registration সর্বোচ্চ 30 মিনিট থাকবে।
 * এর মধ্যে verification না হলে record expire হবে।
 */
export const PENDING_REGISTRATION_TTL_MS =
    30 * 60 * 1000;

const OTP_PATTERN = new RegExp(
    `^\\d{${EMAIL_VERIFICATION_OTP_LENGTH}}$`
);

/*
 * OTP hash করার secret .env.local থেকে নেওয়া হবে।
 *
 * Secret top-level-এ read করা হচ্ছে না।
 * ফলে build-এর সময় variable না থাকলেও এই file import করা যাবে।
 * Function runtime-এ ব্যবহার করার সময় secret required হবে।
 */
const getOtpHashSecret = (): string => {
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
 * User paste করলে OTP-এর আগে-পরে থাকা space remove করবে।
 *
 * OTP-এর মাঝখানের কোনো character বা space পরিবর্তন করবে না।
 */
export const normalizeEmailVerificationOtp = (
    otp: string
): string => {
    return otp.trim();
};

/*
 * OTP ঠিক 6 digit কি না যাচাই করবে।
 */
export const isValidEmailVerificationOtp = (
    otp: string
): boolean => {
    const normalizedOtp =
        normalizeEmailVerificationOtp(otp);

    return OTP_PATTERN.test(normalizedOtp);
};

/*
 * Cryptographically secure 6-digit OTP তৈরি করবে।
 *
 * Example:
 * 004821
 * 485920
 */
export const generateEmailVerificationOtp =
    (): string => {
        const maximumValue =
            10 **
            EMAIL_VERIFICATION_OTP_LENGTH;

        const otpNumber =
            randomInt(
                0,
                maximumValue
            );

        return otpNumber
            .toString()
            .padStart(
                EMAIL_VERIFICATION_OTP_LENGTH,
                "0"
            );
    };

/*
 * OTP database-এ plain text হিসেবে রাখা হবে না।
 *
 * HMAC-SHA256 ব্যবহার করে OTP hash করা হবে।
 */
export const hashEmailVerificationOtp = (
    otp: string
): string => {
    const normalizedOtp =
        normalizeEmailVerificationOtp(otp);

    if (
        !isValidEmailVerificationOtp(
            normalizedOtp
        )
    ) {
        throw new Error(
            `OTP must contain exactly ${EMAIL_VERIFICATION_OTP_LENGTH} digits`
        );
    }

    return createHmac(
        "sha256",
        getOtpHashSecret()
    )
        .update(
            `thumblify-email-verification:${normalizedOtp}`
        )
        .digest("hex");
};

/*
 * User-এর দেওয়া OTP database-এর hashed OTP-এর
 * সঙ্গে নিরাপদভাবে compare করবে।
 *
 * timingSafeEqual timing attack-এর ঝুঁকি কমায়।
 */
export const verifyEmailVerificationOtp = (
    submittedOtp: string,
    storedOtpHash: string
): boolean => {
    const normalizedOtp =
        normalizeEmailVerificationOtp(
            submittedOtp
        );

    if (
        !isValidEmailVerificationOtp(
            normalizedOtp
        )
    ) {
        return false;
    }

    if (
        !/^[a-f0-9]{64}$/i.test(
            storedOtpHash
        )
    ) {
        return false;
    }

    const submittedHash =
        hashEmailVerificationOtp(
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
 * OTP কখন expire হবে তা তৈরি করবে।
 */
export const createOtpExpiresAt = (
    currentTime = new Date()
): Date => {
    return new Date(
        currentTime.getTime() +
        EMAIL_VERIFICATION_OTP_TTL_MS
    );
};

/*
 * আবার OTP পাঠানো কখন সম্ভব হবে।
 */
export const createResendAvailableAt = (
    currentTime = new Date()
): Date => {
    return new Date(
        currentTime.getTime() +
        EMAIL_VERIFICATION_RESEND_COOLDOWN_MS
    );
};

/*
 * Pending registration record কখন expire হবে।
 */
export const createPendingRegistrationExpiresAt = (
    currentTime = new Date()
): Date => {
    return new Date(
        currentTime.getTime() +
        PENDING_REGISTRATION_TTL_MS
    );
};

/*
 * OTP expire হয়েছে কি না।
 */
export const hasOtpExpired = (
    otpExpiresAt: Date,
    currentTime = new Date()
): boolean => {
    return (
        otpExpiresAt.getTime() <=
        currentTime.getTime()
    );
};

/*
 * Pending registration expire হয়েছে কি না।
 */
export const hasPendingRegistrationExpired = (
    expiresAt: Date,
    currentTime = new Date()
): boolean => {
    return (
        expiresAt.getTime() <=
        currentTime.getTime()
    );
};

/*
 * OTP resend করার জন্য আর কত seconds অপেক্ষা করতে হবে।
 */
export const getOtpResendRemainingSeconds = (
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
 * ভুল OTP দেওয়ার maximum limit শেষ হয়েছে কি না।
 */
export const hasReachedMaximumOtpAttempts = (
    otpAttempts: number
): boolean => {
    return (
        otpAttempts >=
        EMAIL_VERIFICATION_MAX_ATTEMPTS
    );
};