import "server-only";

import {
    Schema,
    Types,
    model,
    models,
    type HydratedDocument,
    type Model,
} from "mongoose";

export interface IPasswordResetRequest {
    /*
     * যে verified User password reset করছে।
     */
    userId: Types.ObjectId;

    /*
     * OTP পাঠানোর email address।
     */
    email: string;

    /*
     * Plain OTP database-এ রাখা হবে না।
     */
    otpHash: string;

    otpExpiresAt: Date;
    otpAttempts: number;

    /*
     * এই সময়ের আগে নতুন OTP resend করা যাবে না।
     */
    resendAvailableAt: Date;

    /*
     * Browser-এর secure password-reset cookie-তে
     * raw token থাকবে।
     *
     * Database-এ শুধু তার hash রাখা হবে।
     */
    requestTokenHash: string;

    /*
     * OTP সঠিকভাবে verify হয়েছে কি না।
     */
    isOtpVerified: boolean;

    /*
     * OTP verify হওয়ার সময়।
     */
    resetAuthorizedAt: Date | null;

    /*
     * OTP verify হওয়ার পরে কতক্ষণ পর্যন্ত
     * নতুন password দেওয়া যাবে।
     */
    resetExpiresAt: Date | null;

    /*
     * পুরো temporary password reset request
     * কখন MongoDB থেকে delete হবে।
     */
    expiresAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

export type PasswordResetRequestDocument =
    HydratedDocument<IPasswordResetRequest>;

const passwordResetRequestSchema =
    new Schema<IPasswordResetRequest>(
        {
            /*
             * প্রতি user-এর জন্য এক সময়ে
             * একটি active password reset request থাকবে।
             */
            userId: {
                type: Schema.Types.ObjectId,
                ref: "User",
                required: [
                    true,
                    "User ID is required",
                ],
                unique: true,
            },

            email: {
                type: String,
                required: [
                    true,
                    "Email is required",
                ],
                trim: true,
                lowercase: true,
                unique: true,
                maxlength: [
                    254,
                    "Email address is too long",
                ],
                match: [
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    "Please provide a valid email address",
                ],
            },

            otpHash: {
                type: String,
                required: [
                    true,
                    "OTP hash is required",
                ],

                /*
                 * সাধারণ query-তে OTP hash
                 * ফেরত আসবে না।
                 */
                select: false,
            },

            otpExpiresAt: {
                type: Date,
                required: [
                    true,
                    "OTP expiry time is required",
                ],
            },

            otpAttempts: {
                type: Number,
                required: true,
                default: 0,
                min: [
                    0,
                    "OTP attempts cannot be negative",
                ],
            },

            resendAvailableAt: {
                type: Date,
                required: [
                    true,
                    "OTP resend time is required",
                ],
            },

            requestTokenHash: {
                type: String,
                required: [
                    true,
                    "Password reset token hash is required",
                ],
                unique: true,

                /*
                 * সাধারণ query-তে token hash
                 * ফেরত আসবে না।
                 */
                select: false,
            },

            isOtpVerified: {
                type: Boolean,
                required: true,
                default: false,
            },

            resetAuthorizedAt: {
                type: Date,
                default: null,
            },

            resetExpiresAt: {
                type: Date,
                default: null,
            },

            expiresAt: {
                type: Date,
                required: [
                    true,
                    "Password reset request expiry is required",
                ],
            },
        },
        {
            timestamps: true,
            versionKey: false,
            collection:
                "password_reset_requests",
        }
    );

/*
 * expiresAt সময় পার হলে MongoDB এই temporary
 * password reset request স্বয়ংক্রিয়ভাবে delete করবে।
 */
passwordResetRequestSchema.index(
    {
        expiresAt: 1,
    },
    {
        expireAfterSeconds: 0,
    }
);

const PasswordResetRequest =
    (models.PasswordResetRequest as
        | Model<IPasswordResetRequest>
        | undefined) ??
    model<IPasswordResetRequest>(
        "PasswordResetRequest",
        passwordResetRequestSchema
    );

export default PasswordResetRequest;