import "server-only";

import mongoose, {
    Schema,
    Types,
    type HydratedDocument,
    type Model,
} from "mongoose";

import {
    aspectRatios,
    colorSchemes,
    thumbnailStyles,
} from "@/data/thumbnail-options";

import type {
    AspectRatio,
    ColorSchemeId,
    ThumbnailGenerationMode,
    ThumbnailStyle,
} from "@/types/thumbnail.types";

export interface IThumbnail {
    userId: string;

    title: string;
    description?: string;

    style: ThumbnailStyle;
    aspect_ratio: AspectRatio;
    color_scheme: ColorSchemeId;
    text_overlay: boolean;

    /*
     * বর্তমানে user যে version নির্বাচন করেছে,
     * তার snapshot নিচের fields-এ থাকবে।
     *
     * Existing frontend এবং API-এর সঙ্গে
     * backward compatibility রাখার জন্য
     * এগুলো বাদ দেওয়া হচ্ছে না।
     */
    image_url: string;
    cloudinary_public_id?: string;

    prompt_used?: string;
    user_prompt?: string;

    model_used?: string;
    generation_mode?: ThumbnailGenerationMode;

    /*
     * Version history সম্পর্কিত fields।
     */
    current_version_id?: Types.ObjectId | null;
    current_version_number: number;
    total_versions: number;

    isGenerating: boolean;
    generation_error?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

export type ThumbnailDocument =
    HydratedDocument<IThumbnail>;

const colorSchemeIds = colorSchemes.map(
    (scheme) => scheme.id
);

const generationModes: ThumbnailGenerationMode[] = [
    "flash_generate",
    "flash_regenerate",
    "pro_enhance",
];

const ThumbnailSchema = new Schema<IThumbnail>(
    {
        userId: {
            type: String,
            required: [true, "User ID is required"],
            trim: true,
            index: true,
        },

        title: {
            type: String,
            required: [
                true,
                "Thumbnail title is required",
            ],
            trim: true,
            minlength: [
                1,
                "Title is required",
            ],
            maxlength: [
                100,
                "Title cannot exceed 100 characters",
            ],
        },

        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [
                500,
                "Description cannot exceed 500 characters",
            ],
        },

        style: {
            type: String,
            required: [
                true,
                "Thumbnail style is required",
            ],
            enum: {
                values: [...thumbnailStyles],
                message: "Invalid thumbnail style",
            },
        },

        aspect_ratio: {
            type: String,
            required: [
                true,
                "Aspect ratio is required",
            ],
            enum: {
                values: [...aspectRatios],
                message: "Invalid aspect ratio",
            },
            default: "16:9",
        },

        color_scheme: {
            type: String,
            required: [
                true,
                "Color scheme is required",
            ],
            enum: {
                values: [...colorSchemeIds],
                message: "Invalid color scheme",
            },
            default: "vibrant",
        },

        text_overlay: {
            type: Boolean,
            default: true,
        },

        /*
         * Selected/current version snapshot.
         */
        image_url: {
            type: String,
            trim: true,
            default: "",
        },

        cloudinary_public_id: {
            type: String,
            trim: true,
            default: "",
        },

        prompt_used: {
            type: String,
            trim: true,
            default: "",
            maxlength: [
                6000,
                "Generated prompt is too long",
            ],
        },

        user_prompt: {
            type: String,
            trim: true,
            default: "",
            maxlength: [
                4000,
                "Additional prompt cannot exceed 4000 characters",
            ],
        },

        model_used: {
            type: String,
            trim: true,
            default: "",
        },

        generation_mode: {
            type: String,
            enum: {
                values: generationModes,
                message:
                    "Invalid thumbnail generation mode",
            },
            default: "flash_generate",
        },

        /*
         * যে version বর্তমানে selected/final।
         */
        current_version_id: {
            type: Schema.Types.ObjectId,
            ref: "ThumbnailVersion",
            default: null,
        },

        current_version_number: {
            type: Number,
            min: [
                0,
                "Current version number cannot be negative",
            ],
            default: 0,
        },

        /*
         * এই thumbnail project-এর মোট version।
         */
        total_versions: {
            type: Number,
            min: [
                0,
                "Total versions cannot be negative",
            ],
            default: 0,
        },

        isGenerating: {
            type: Boolean,
            default: true,
        },

        generation_error: {
            type: String,
            trim: true,
            default: "",
            maxlength: [
                1000,
                "Generation error cannot exceed 1000 characters",
            ],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

/*
 * My Generation pagination:
 * newest updated thumbnail project আগে আসবে।
 */
ThumbnailSchema.index({
    userId: 1,
    updatedAt: -1,
});

/*
 * একজন user-এর নির্দিষ্ট current version
 * খুঁজতে কাজে লাগবে।
 */
ThumbnailSchema.index({
    userId: 1,
    current_version_id: 1,
});

const Thumbnail =
    (mongoose.models
        .Thumbnail as
        | Model<IThumbnail>
        | undefined) ??
    mongoose.model<IThumbnail>(
        "Thumbnail",
        ThumbnailSchema
    );

export default Thumbnail;