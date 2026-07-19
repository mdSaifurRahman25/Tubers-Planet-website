import "server-only";

import {
    Schema,
    model,
    models,
    type HydratedDocument,
    type Model,
} from "mongoose";

export interface IUser {
    name: string;
    email: string;

    /*
     * WhatsApp number optional।
     * User signup-এর সময় এটি না দিলেও account তৈরি হবে।
     */
    whatsappNumber?: string;

    password: string;

    /*
     * Main users collection-এ শুধু verified account যাবে।
     */
    isEmailVerified: boolean;
    emailVerifiedAt: Date | null;

    /*
     * User কখন এবং Terms-এর কোন version গ্রহণ করেছে।
     *
     * পুরোনো existing user-এর জন্য এগুলো null থাকতে পারে।
     */
    termsAcceptedAt: Date | null;
    termsVersion: string | null;

    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument =
    HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
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
                /^\+?[0-9]{7,20}$/,
                "Please provide a valid WhatsApp number",
            ],
        },

        password: {
            type: String,
            required: [
                true,
                "Password is required",
            ],

            /*
             * সাধারণ query-তে password hash
             * return হবে না।
             */
            select: false,
        },

        isEmailVerified: {
            type: Boolean,
            required: true,

            /*
             * আগে থেকে database-এ থাকা user যেন
             * verification feature যোগ করার পরে
             * হঠাৎ account access হারিয়ে না ফেলে।
             *
             * নতুন signup flow-তে verified user তৈরি করার
             * সময়ও এই value explicitly true দেওয়া হবে।
             */
            default: true,
        },

        emailVerifiedAt: {
            type: Date,
            default: null,
        },

        termsAcceptedAt: {
            type: Date,
            default: null,
        },

        termsVersion: {
            type: String,
            trim: true,
            default: null,
            maxlength: [
                50,
                "Terms version is too long",
            ],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User =
    (models.User as
        | Model<IUser>
        | undefined) ??
    model<IUser>(
        "User",
        userSchema
    );

export default User;