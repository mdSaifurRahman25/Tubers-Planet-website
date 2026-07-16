import "server-only";

import {
    Schema,
    model,
    models,
    type Model,
    type Types,
} from "mongoose";

export interface ISession {
    userId: Types.ObjectId;
    tokenHash: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        tokenHash: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            required: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// মেয়াদ শেষ হওয়া session MongoDB স্বয়ংক্রিয়ভাবে remove করবে
sessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
);

const Session =
    (models.Session as Model<ISession> | undefined) ??
    model<ISession>("Session", sessionSchema);

export default Session;