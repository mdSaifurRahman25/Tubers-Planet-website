import type {
    AspectRatio,
    ColorScheme,
    ThumbnailStyle,
} from "@/types/thumbnail.types";

export const aspectRatios = [
    "16:9",
    "1:1",
    "9:16",
] as const satisfies readonly AspectRatio[];

export const thumbnailStyles = [
    "Bold & Graphic",
    "Minimalist",
    "Photorealistic",
    "Illustrated",
    "Tech/Futuristic",
] as const satisfies readonly ThumbnailStyle[];

export const colorSchemes = [
    {
        id: "vibrant",
        name: "Vibrant",
        colors: ["#FF6B6B", "#4ECDC4", "#45B7D1"],
    },
    {
        id: "sunset",
        name: "Sunset",
        colors: ["#FF8C42", "#FF3C38", "#A23B72"],
    },
    {
        id: "ocean",
        name: "Ocean",
        colors: ["#0077B6", "#00B4D8", "#90E0EF"],
    },
    {
        id: "forest",
        name: "Forest",
        colors: ["#2D6A4F", "#40916C", "#95D5B2"],
    },
    {
        id: "purple",
        name: "Purple Dream",
        colors: ["#7B2CBF", "#9D4EDD", "#C77DFF"],
    },
    {
        id: "monochrome",
        name: "Monochrome",
        colors: ["#212529", "#495057", "#ADB5BD"],
    },
    {
        id: "neon",
        name: "Neon",
        colors: ["#FF00FF", "#00FFFF", "#FFFF00"],
    },
    {
        id: "pastel",
        name: "Pastel",
        colors: ["#FFB5A7", "#FCD5CE", "#F8EDEB"],
    },
] as const satisfies readonly ColorScheme[];