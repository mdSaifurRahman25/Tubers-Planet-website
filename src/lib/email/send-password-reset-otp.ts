import "server-only";

import {
    createPasswordResetOtpEmail,
    type PasswordResetOtpEmailInput,
} from "@/lib/email/templates/password-reset-otp-email";
import {
    sendEmail,
    type SendEmailResult,
} from "@/lib/email/mailer";

export interface SendPasswordResetOtpInput
    extends PasswordResetOtpEmailInput { }

export type SendPasswordResetOtpResult =
    SendEmailResult;

/*
 * Password reset OTP email পাঠাতে সমস্যা হলে
 * service layer এই custom error শনাক্ত করতে পারবে।
 */
export class PasswordResetOtpEmailError extends Error {
    constructor(
        message = "Unable to send password reset email",
        options?: {
            cause?: unknown;
        }
    ) {
        super(message, options);

        this.name =
            "PasswordResetOtpEmailError";
    }
}

/*
 * Email address-এর শুরু ও শেষের whitespace remove করবে
 * এবং lowercase-এ convert করবে।
 */
const normalizeEmailAddress = (
    email: string
): string => {
    return email
        .trim()
        .toLowerCase();
};

/*
 * User-এর নামের অতিরিক্ত whitespace পরিষ্কার করবে।
 */
const normalizeRecipientName = (
    name: string
): string => {
    return name
        .trim()
        .replace(/\s+/g, " ");
};

/*
 * Thumblify password reset OTP email পাঠাবে।
 *
 * এই function:
 *
 * 1. User-এর name, email ও OTP গ্রহণ করবে
 * 2. Password reset email template তৈরি করবে
 * 3. Nodemailer SMTP transporter দিয়ে email পাঠাবে
 * 4. Message ID ও SMTP response return করবে
 */
export const sendPasswordResetOtp = async (
    input: SendPasswordResetOtpInput
): Promise<SendPasswordResetOtpResult> => {
    const name =
        normalizeRecipientName(
            input.name
        );

    const email =
        normalizeEmailAddress(
            input.email
        );

    const otp =
        input.otp.trim();

    if (!name) {
        throw new PasswordResetOtpEmailError(
            "Recipient name is required"
        );
    }

    if (!email) {
        throw new PasswordResetOtpEmailError(
            "Recipient email is required"
        );
    }

    if (!otp) {
        throw new PasswordResetOtpEmailError(
            "Password reset OTP is required"
        );
    }

    /*
     * Template function email এবং OTP format
     * আবার validate করবে।
     */
    const emailContent =
        createPasswordResetOtpEmail({
            name,
            email,
            otp,
        });

    try {
        return await sendEmail({
            to:
                email,

            subject:
                emailContent.subject,

            html:
                emailContent.html,

            text:
                emailContent.text,

            headers: {
                /*
                 * Email provider ও server log-এ
                 * email category শনাক্ত করতে সাহায্য করবে।
                 */
                "X-Thumblify-Email-Type":
                    "password-reset-otp",

                /*
                 * এটি automated transactional email।
                 */
                "X-Auto-Response-Suppress":
                    "All",
            },
        });
    } catch (error) {
        throw new PasswordResetOtpEmailError(
            "Unable to send the password reset code. Please try again.",
            {
                cause:
                    error,
            }
        );
    }
};

/*
 * Custom password reset email error কি না
 * সহজে পরীক্ষা করার helper।
 */
export const isPasswordResetOtpEmailError = (
    error: unknown
): error is PasswordResetOtpEmailError => {
    return (
        error instanceof
        PasswordResetOtpEmailError
    );
};