import "server-only";

import mongoose, {
    Schema,
    type HydratedDocument,
    type Model,
    type Types,
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

export interface IThumbnailReferenceImage {
    secure_url: string;
    cloudinary_public_id?: string;
    original_name?: string;
    mime_type?: string;
    size_bytes?: number;
    source_type:
    | "uploaded"
    | "current_thumbnail";
}

export interface IThumbnailVersion {
    thumbnailId: Types.ObjectId;
    userId: string;

    version_number: number;

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

    model_used?: string;
    generation_mode: ThumbnailGenerationMode;

    reference_images: IThumbnailReferenceImage[];

    createdAt?: Date;
    updatedAt?: Date;
}

export type ThumbnailVersionDocument =
    HydratedDocument<IThumbnailVersion>;

const colorSchemeIds = colorSchemes.map(
    (scheme) => scheme.id
);

const generationModes: ThumbnailGenerationMode[] = [
    "flash_generate",
    "flash_regenerate",
    "pro_enhance",
];

const ThumbnailReferenceImageSchema =
    new Schema<IThumbnailReferenceImage>(
        {
            secure_url: {
                type: String,
                required: [
                    true,
                    "Reference image URL is required",
                ],
                trim: true,
            },

            cloudinary_public_id: {
                type: String,
                trim: true,
                default: "",
            },

            original_name: {
                type: String,
                trim: true,
                default: "",
            },

            mime_type: {
                type: String,
                trim: true,
                default: "",
            },

            size_bytes: {
                type: Number,
                min: [
                    0,
                    "Reference image size cannot be negative",
                ],
                default: 0,
            },

            source_type: {
                type: String,
                enum: {
                    values: [
                        "uploaded",
                        "current_thumbnail",
                    ],
                    message:
                        "Invalid reference image source type",
                },
                required: true,
            },
        },
        {
            _id: false,
            id: false,
        }
    );

const ThumbnailVersionSchema =
    new Schema<IThumbnailVersion>(
        {
            thumbnailId: {
                type: Schema.Types.ObjectId,
                ref: "Thumbnail",
                required: [
                    true,
                    "Thumbnail ID is required",
                ],
                index: true,
            },

            userId: {
                type: String,
                required: [
                    true,
                    "User ID is required",
                ],
                trim: true,
                index: true,
            },

            version_number: {
                type: Number,
                required: [
                    true,
                    "Version number is required",
                ],
                min: [
                    1,
                    "Version number must be at least 1",
                ],
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
                    message:
                        "Invalid thumbnail style",
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
                    message:
                        "Invalid aspect ratio",
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
                    message:
                        "Invalid color scheme",
                },
                default: "vibrant",
            },

            text_overlay: {
                type: Boolean,
                default: true,
            },

            image_url: {
                type: String,
                required: [
                    true,
                    "Generated image URL is required",
                ],
                trim: true,
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
                required: [
                    true,
                    "Generation mode is required",
                ],
                enum: {
                    values: generationModes,
                    message:
                        "Invalid thumbnail generation mode",
                },
            },

            reference_images: {
                type: [
                    ThumbnailReferenceImageSchema,
                ],
                default: [],
                validate: {
                    validator: (
                        value: IThumbnailReferenceImage[]
                    ) => value.length <= 3,
                    message:
                        "A maximum of 3 reference images is allowed",
                },
            },
        },
        {
            timestamps: true,
            versionKey: false,
        }
    );

/*
 * একই thumbnail project-এর version sequence.
 */
ThumbnailVersionSchema.index(
    {
        thumbnailId: 1,
        version_number: 1,
    },
    {
        unique: true,
    }
);

/*
 * My Generation / detail page-এ
 * newest versions fetch করতে সাহায্য করবে.
 */
ThumbnailVersionSchema.index({
    thumbnailId: 1,
    createdAt: -1,
});

ThumbnailVersionSchema.index({
    userId: 1,
    createdAt: -1,
});

const ThumbnailVersion =
    (mongoose.models
        .ThumbnailVersion as
        | Model<IThumbnailVersion>
        | undefined) ??
    mongoose.model<IThumbnailVersion>(
        "ThumbnailVersion",
        ThumbnailVersionSchema
    );

export default ThumbnailVersion;