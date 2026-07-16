export type AspectRatio =
    | "16:9"
    | "1:1"
    | "9:16";

export type ThumbnailStyle =
    | "Bold & Graphic"
    | "Minimalist"
    | "Photorealistic"
    | "Illustrated"
    | "Tech/Futuristic";

export type ColorSchemeId =
    | "vibrant"
    | "sunset"
    | "ocean"
    | "forest"
    | "purple"
    | "monochrome"
    | "neon"
    | "pastel";

export interface ColorScheme {
    id: ColorSchemeId;
    name: string;
    colors: readonly string[];
}

export interface GenerateThumbnailInput {
    title: string;
    prompt: string;
    style: ThumbnailStyle;
    aspect_ratio: AspectRatio;
    color_scheme: ColorSchemeId;
    text_overlay: boolean;
}

export interface Thumbnail {
    _id: string;
    userId: string;
    title: string;
    description?: string;

    style: ThumbnailStyle;
    aspect_ratio: AspectRatio;
    color_scheme: ColorSchemeId;

    text_overlay: boolean;
    image_url?: string;
    prompt_used?: string;
    user_prompt?: string;
    isGenerating?: boolean;

    createdAt?: string;
    updatedAt?: string;
}