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
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters"],
            maxlength: [80, "Name cannot exceed 80 characters"],
        },

        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            unique: true,
            maxlength: [254, "Email address is too long"],
            match: [
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                "Please provide a valid email address",
            ],
        },

        password: {
            type: String,
            required: [true, "Password is required"],

            // সাধারণ query-তে password ফেরত আসবে না
            select: false,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

const User =
    (models.User as Model<IUser> | undefined) ??
    model<IUser>("User", userSchema);

export default User;