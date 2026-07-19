import "server-only";

import {
    createVerificationOtpEmail,
    type VerificationOtpEmailInput,
} from "@/lib/email/templates/verification-otp-email";
import {
    sendEmail,
    type SendEmailResult,
} from "@/lib/email/mailer";

export interface SendVerificationOtpInput
    extends VerificationOtpEmailInput { }

export type SendVerificationOtpResult =
    SendEmailResult;

export class VerificationOtpEmailError extends Error {
    constructor(
        message = "Unable to send verification email",
        options?: {
            cause?: unknown;
        }
    ) {
        super(message, options);

        this.name =
            "VerificationOtpEmailError";
    }
}

/*
 * Email address-এর শুরু ও শেষের whitespace সরাবে
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
 * Thumblify account verification-এর OTP email পাঠাবে।
 *
 * এই function:
 *
 * 1. Name, email ও OTP গ্রহণ করবে
 * 2. Email template তৈরি করবে
 * 3. Nodemailer SMTP transporter দিয়ে email পাঠাবে
 * 4. Message ID ও SMTP response return করবে
 */
export const sendVerificationOtp = async (
    input: SendVerificationOtpInput
): Promise<SendVerificationOtpResult> => {
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
        throw new VerificationOtpEmailError(
            "Recipient name is required"
        );
    }

    if (!email) {
        throw new VerificationOtpEmailError(
            "Recipient email is required"
        );
    }

    if (!otp) {
        throw new VerificationOtpEmailError(
            "Verification OTP is required"
        );
    }

    /*
     * Template function OTP format-ও validate করবে।
     */
    const emailContent =
        createVerificationOtpEmail({
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
                 * Email provider বা mail logs-এ
                 * transactional email-এর category
                 * শনাক্ত করতে সাহায্য করবে।
                 */
                "X-Thumblify-Email-Type":
                    "email-verification-otp",
            },
        });
    } catch (error) {
        throw new VerificationOtpEmailError(
            "Unable to send the verification code. Please try again.",
            {
                cause:
                    error,
            }
        );
    }
};