import "server-only";

import mongoose, {
    Schema,
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

    image_url: string;
    cloudinary_public_id?: string;

    prompt_used?: string;
    user_prompt?: string;

    isGenerating: boolean;
    generation_error?: string;

    model_used?: string;
    generation_mode?: ThumbnailGenerationMode;

    createdAt?: Date;
    updatedAt?: Date;
}

export type ThumbnailDocument =
    HydratedDocument<IThumbnail>;

const colorSchemeIds = colorSchemes.map(
    (scheme) => scheme.id
);

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
            required: [true, "Thumbnail title is required"],
            trim: true,
            minlength: [1, "Title is required"],
            maxlength: [
                100,
                "Title cannot exceed 100 characters",
            ],
        },

        description: {
            type: String,
            trim: true,
            maxlength: [
                500,
                "Description cannot exceed 500 characters",
            ],
        },

        style: {
            type: String,
            required: [true, "Thumbnail style is required"],
            enum: {
                values: [...thumbnailStyles],
                message: "Invalid thumbnail style",
            },
        },

        aspect_ratio: {
            type: String,
            required: true,
            enum: {
                values: [...aspectRatios],
                message: "Invalid aspect ratio",
            },
            default: "16:9",
        },

        color_scheme: {
            type: String,
            required: true,
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
                2000,
                "Additional prompt cannot exceed 2000 characters",
            ],
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

        model_used: {
            type: String,
            trim: true,
            default: "",
        },

        generation_mode: {
            type: String,
            enum: [
                "flash_generate",
                "flash_regenerate",
                "pro_enhance",
            ],
            default: "flash_generate",
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

ThumbnailSchema.index({
    userId: 1,
    createdAt: -1,
});

const Thumbnail =
    (mongoose.models
        .Thumbnail as Model<IThumbnail> | undefined) ??
    mongoose.model<IThumbnail>(
        "Thumbnail",
        ThumbnailSchema
    );

export default Thumbnail;