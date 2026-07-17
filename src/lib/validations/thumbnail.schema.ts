import { z } from "zod";

import {
    aspectRatios,
    thumbnailStyles,
} from "@/data/thumbnail-options";

export const generateThumbnailSchema = z.object({
    title: z
        .string()
        .trim()
        .min(1, "Title is required")
        .max(
            100,
            "Title cannot exceed 100 characters"
        ),

    prompt: z
        .string()
        .trim()
        .max(
            2000,
            "Additional prompt cannot exceed 2000 characters"
        )
        .default(""),

    style: z.enum(thumbnailStyles),

    aspect_ratio: z.enum(aspectRatios),

    color_scheme: z.enum([
        "vibrant",
        "sunset",
        "ocean",
        "forest",
        "purple",
        "monochrome",
        "neon",
        "pastel",
    ]),

    text_overlay: z.boolean().default(true),
});

export type GenerateThumbnailData =
    z.infer<typeof generateThumbnailSchema>;