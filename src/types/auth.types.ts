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

/*
 * Login form data।
 */
export interface LoginInput {
    email: string;
    password: string;
    rememberMe: boolean;
}

/*
 * Registration form data।
 */
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

/*
 * New account email verification OTP।
 */
export interface VerifyEmailInput {
    otp: string;
}

/*
 * Forgot Password form data।
 */
export interface ForgotPasswordInput {
    email: string;
}

/*
 * Password reset OTP verification data।
 */
export interface VerifyPasswordResetOtpInput {
    otp: string;
}

/*
 * OTP verify হওয়ার পরে নতুন password form data।
 */
export interface ResetPasswordInput {
    newPassword: string;
    confirmPassword: string;
}

/*
 * Password reset flow-এর বর্তমান ধাপ।
 */
export type PasswordResetPhase =
    | "verify-otp"
    | "set-password";

/*
 * Authentication এবং password reset API থেকে
 * অতিরিক্ত error information।
 */
export interface AuthApiDetails {
    attemptsRemaining?: number;
    retryAfterSeconds?: number;
}

/*
 * Login, Register, Email Verification,
 * Forgot Password এবং Reset Password API-এর
 * shared response structure।
 */
export interface AuthApiResponse {
    success: boolean;
    message: string;

    /*
     * Login অথবা email verification সফল হলে
     * authenticated user পাওয়া যাবে।
     */
    user?: AuthUser;

    /*
     * Registration-এর পরে OTP verification page-এ
     * পাঠাতে ব্যবহৃত হবে।
     */
    verificationRequired?: boolean;

    /*
     * Forgot Password request-এর পরে reset OTP page-এ
     * পাঠাতে ব্যবহার করা যাবে।
     */
    passwordResetRequired?: boolean;

    /*
     * Password reset OTP সফলভাবে verify হয়েছে।
     */
    authorized?: boolean;

    /*
     * API success/error অনুযায়ী frontend redirect।
     */
    redirectTo?: string;

    /*
     * সম্পূর্ণ email প্রকাশ না করে masked email।
     *
     * Example:
     * ka***n@gmail.com
     */
    maskedEmail?: string;

    /*
     * OTP এবং temporary request expiry information।
     */
    otpExpiresAt?: string;
    resendAvailableAt?: string;
    expiresAt?: string;

    /*
     * OTP verify হওয়ার পরে নতুন password দেওয়ার
     * authorization expiry।
     */
    resetExpiresAt?: string;

    /*
     * Password reset-এর current phase।
     */
    phase?: PasswordResetPhase;

    /*
     * Resend countdown।
     */
    resendRemainingSeconds?: number;

    /*
     * Backend service error code।
     *
     * Examples:
     * INVALID_OTP
     * OTP_EXPIRED
     * RESEND_TOO_SOON
     * RESET_REQUEST_EXPIRED
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
 * Account verification page load হওয়ার সময়
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
    redirectTo?: string;
    details?: AuthApiDetails;
}

/*
 * Password Reset OTP page অথবা New Password page
 * load হওয়ার সময় current reset request status।
 */
export interface PasswordResetStatus {
    phase: PasswordResetPhase;
    maskedEmail: string;

    otpExpiresAt: string;
    resendAvailableAt: string;
    expiresAt: string;

    /*
     * OTP verify হওয়ার আগে এটি null থাকবে।
     */
    resetExpiresAt: string | null;

    resendRemainingSeconds: number;
    canResend: boolean;
    attemptsRemaining: number;
}

export interface PasswordResetStatusResponse {
    success: boolean;
    message: string;
    status?: PasswordResetStatus;
    code?: string;
    redirectTo?: string;
    details?: AuthApiDetails;
}