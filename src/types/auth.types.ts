export interface AuthUser {
    _id: string;
    name: string;
    email: string;

    /*
     * WhatsApp number optional।
     */
    whatsappNumber?: string;

    isEmailVerified: boolean;
}

export interface LoginInput {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface RegisterInput {
    name: string;
    email: string;

    /*
     * User WhatsApp number না দিলেও
     * registration করতে পারবে।
     */
    whatsappNumber?: string;

    password: string;
    acceptedTerms: boolean;
}

export interface VerifyEmailInput {
    otp: string;
}

/*
 * Verification service/API থেকে অতিরিক্ত তথ্য
 * return করার জন্য।
 */
export interface AuthApiDetails {
    attemptsRemaining?: number;
    retryAfterSeconds?: number;
}

/*
 * Login, Register, Verify Email এবং Session API-এর
 * shared response structure।
 */
export interface AuthApiResponse {
    success: boolean;
    message: string;

    /*
     * Login অথবা OTP verification সফল হলে
     * authenticated user পাওয়া যাবে।
     */
    user?: AuthUser;

    /*
     * Registration-এর পরে user-কে OTP page-এ
     * পাঠাতে ব্যবহৃত হবে।
     */
    verificationRequired?: boolean;
    redirectTo?: string;

    /*
     * OTP page-এ সম্পূর্ণ email না দেখিয়ে
     * masked email দেখানো হবে।
     *
     * Example:
     * ka***n@gmail.com
     */
    maskedEmail?: string;

    otpExpiresAt?: string;
    resendAvailableAt?: string;
    expiresAt?: string;

    /*
     * Backend service error শনাক্ত করার code।
     *
     * Examples:
     * INVALID_OTP
     * OTP_EXPIRED
     * RESEND_TOO_SOON
     */
    code?: string;

    details?: AuthApiDetails;

    /*
     * Zod field validation errors।
     */
    errors?: Record<
        string,
        string[] | undefined
    >;
}

/*
 * OTP verification page load হওয়ার সময়
 * pending registration status।
 */
export interface PendingRegistrationStatus {
    maskedEmail: string;
    otpExpiresAt: string;
    resendAvailableAt: string;
    expiresAt: string;
    resendRemainingSeconds: number;
    canResend: boolean;
    attemptsRemaining: number;
}

export interface PendingRegistrationStatusResponse {
    success: boolean;
    message: string;
    status?: PendingRegistrationStatus;
    code?: string;
}