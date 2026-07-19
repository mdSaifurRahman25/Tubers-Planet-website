import "server-only";

import {
    Schema,
    model,
    models,
    type HydratedDocument,
    type Model,
} from "mongoose";

export interface IPendingRegistration {
    name: string;
    email: string;

    /*
     * WhatsApp number optional।
     * User না দিলেও registration চালিয়ে যেতে পারবে।
     */
    whatsappNumber?: string;

    /*
     * Plain password database-এ রাখা হবে না।
     * Password hash করে এখানে রাখা হবে।
     */
    passwordHash: string;

    /*
     * Plain OTP database-এ রাখা হবে না।
     * OTP hash করে এখানে রাখা হবে।
     */
    otpHash: string;

    otpExpiresAt: Date;
    otpAttempts: number;

    /*
     * এই সময়ের আগে নতুন OTP resend করা যাবে না।
     */
    resendAvailableAt: Date;

    /*
     * Browser-এর pending-registration cookie-র
     * secure token hash এখানে থাকবে।
     */
    registrationTokenHash: string;

    termsAcceptedAt: Date;
    termsVersion: string;

    /*
     * এই সময় পার হলে MongoDB TTL index
     * pending record delete করবে।
     */
    expiresAt: Date;

    createdAt: Date;
    updatedAt: Date;
}

export type PendingRegistrationDocument =
    HydratedDocument<IPendingRegistration>;

const pendingRegistrationSchema =
    new Schema<IPendingRegistration>(
        {
            name: {
                type: String,
                required: [
                    true,
                    "Name is required",
                ],
                trim: true,
                minlength: [
                    2,
                    "Name must be at least 2 characters",
                ],
                maxlength: [
                    80,
                    "Name cannot exceed 80 characters",
                ],
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
                index: true,
                maxlength: [
                    254,
                    "Email address is too long",
                ],
                match: [
                    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    "Please provide a valid email address",
                ],
            },

            whatsappNumber: {
                type: String,
                required: false,
                trim: true,
                default: undefined,
                minlength: [
                    7,
                    "WhatsApp number is too short",
                ],
                maxlength: [
                    20,
                    "WhatsApp number is too long",
                ],
                match: [
                    /^\+?[0-9\s()-]{7,20}$/,
                    "Please provide a valid WhatsApp number",
                ],
            },

            passwordHash: {
                type: String,
                required: [
                    true,
                    "Password hash is required",
                ],

                /*
                 * সাধারণ query result-এ password hash
                 * স্বয়ংক্রিয়ভাবে return হবে না।
                 */
                select: false,
            },

            otpHash: {
                type: String,
                required: [
                    true,
                    "OTP hash is required",
                ],

                /*
                 * সাধারণ query result-এ OTP hash
                 * return হবে না।
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

            registrationTokenHash: {
                type: String,
                required: [
                    true,
                    "Registration token hash is required",
                ],
                unique: true,
                index: true,

                /*
                 * সাধারণ query result-এ token hash
                 * return হবে না।
                 */
                select: false,
            },

            termsAcceptedAt: {
                type: Date,
                required: [
                    true,
                    "Terms acceptance time is required",
                ],
            },

            termsVersion: {
                type: String,
                required: [
                    true,
                    "Terms version is required",
                ],
                trim: true,
                maxlength: [
                    50,
                    "Terms version is too long",
                ],
            },

            expiresAt: {
                type: Date,
                required: [
                    true,
                    "Pending registration expiry is required",
                ],
            },
        },
        {
            timestamps: true,
            versionKey: false,
            collection:
                "pending_registrations",
        }
    );

/*
 * expiresAt field-এর সময় পার হলে record
 * MongoDB TTL cleanup-এর জন্য eligible হবে।
 */
pendingRegistrationSchema.index(
    {
        expiresAt: 1,
    },
    {
        expireAfterSeconds: 0,
    }
);

const PendingRegistration =
    (models.PendingRegistration as
        | Model<IPendingRegistration>
        | undefined) ??
    model<IPendingRegistration>(
        "PendingRegistration",
        pendingRegistrationSchema
    );

export default PendingRegistration;