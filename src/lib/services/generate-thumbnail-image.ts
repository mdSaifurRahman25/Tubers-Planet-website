import "server-only";

import {
    HarmBlockThreshold,
    HarmCategory,
    type GenerateContentConfig,
} from "@google/genai";

import gemini from "@/lib/ai/gemini";

import type {
    ColorSchemeId,
    ThumbnailStyle,
} from "@/types/thumbnail.types";

import type {
    GenerateThumbnailData,
} from "@/lib/validations/thumbnail.schema";

const stylePrompts: Record<
    ThumbnailStyle,
    string
> = {
    "Bold & Graphic":
        "an eye-catching YouTube thumbnail with bold typography, vibrant colors, expressive emotion, dramatic lighting, high contrast, and a click-worthy professional composition",

    "Tech/Futuristic":
        "a futuristic YouTube thumbnail with a sleek modern design, digital UI elements, glowing accents, holographic effects, sharp lighting, and a high-tech atmosphere",

    Minimalist:
        "a minimalist YouTube thumbnail with a clean layout, simple shapes, a limited color palette, plenty of negative space, and one clear focal point",

    Photorealistic:
        "a photorealistic YouTube thumbnail with natural lighting, realistic subjects, DSLR-style photography, natural colors, and shallow depth of field",

    Illustrated:
        "an illustrated YouTube thumbnail with custom digital artwork, stylized characters, bold outlines, vibrant colors, and a creative vector-art appearance",
};

const colorSchemeDescriptions: Record<
    ColorSchemeId,
    string
> = {
    vibrant:
        "vibrant and energetic colors with high saturation and bold contrast",

    sunset:
        "warm sunset tones with orange, pink, and purple gradients",

    ocean:
        "cool blue and teal tones with a fresh aquatic atmosphere",

    forest:
        "natural green and earthy tones with a calm organic atmosphere",

    purple:
        "a purple-dominant palette with magenta and violet tones",

    monochrome:
        "a dramatic black-and-white palette with strong contrast",

    neon:
        "electric blue, pink, and yellow neon colors with glowing effects",

    pastel:
        "soft pastel colors with gentle, friendly, and low-saturation tones",
};

const buildThumbnailPrompt = (
    data: GenerateThumbnailData
): string => {
    const promptParts: string[] = [
        `Create ${stylePrompts[data.style]}.`,
        `The YouTube video topic is: "${data.title}".`,
        `Use ${colorSchemeDescriptions[data.color_scheme]}.`,
        `The image composition must use a ${data.aspect_ratio} aspect ratio.`,
        "Design the image specifically to maximize YouTube click-through rate.",
        "The main subject must remain visually clear when viewed at a small size.",
        "Use a bold, professional, uncluttered, and attention-grabbing composition.",
    ];

    if (data.text_overlay) {
        promptParts.push(
            `Include short, large, clearly readable thumbnail text based on the title "${data.title}".`
        );

        promptParts.push(
            "Do not include unrelated words, watermarks, logos, or extra text."
        );
    } else {
        promptParts.push(
            "Do not include any written text, captions, words, or letters in the image."
        );
    }

    if (data.prompt) {
        promptParts.push(
            `Additional instructions from the creator: ${data.prompt}`
        );
    }

    return promptParts.join(" ");
};

export interface GeneratedThumbnailImage {
    buffer: Buffer;
    promptUsed: string;
    mimeType: string;
}

const generationConfig: GenerateContentConfig = {
    responseModalities: ["IMAGE"],

    safetySettings: [
        {
            category:
                HarmCategory.HARM_CATEGORY_HATE_SPEECH,

            threshold:
                HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category:
                HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,

            threshold:
                HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category:
                HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,

            threshold:
                HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
            category:
                HarmCategory.HARM_CATEGORY_HARASSMENT,

            threshold:
                HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
    ],
};

export const generateThumbnailImage = async (
    data: GenerateThumbnailData
): Promise<GeneratedThumbnailImage> => {
    const promptUsed =
        buildThumbnailPrompt(data);

    const model =
        process.env.GEMINI_IMAGE_MODEL ||
        "gemini-3.1-flash-image";

    const response =
        await gemini.models.generateContent({
            model,
            contents: promptUsed,

            config: {
                ...generationConfig,

                imageConfig: {
                    aspectRatio: data.aspect_ratio,
                    imageSize: "1K",
                },
            },
        });

    const responseParts =
        response.candidates?.[0]?.content?.parts;

    if (!responseParts?.length) {
        throw new Error(
            "Gemini did not return any generated content"
        );
    }

    const generatedImagePart =
        responseParts.find(
            (part) =>
                typeof part.inlineData?.data ===
                "string"
        );

    const base64Image =
        generatedImagePart?.inlineData?.data;

    if (!base64Image) {
        const textResponse = responseParts
            .map((part) => part.text)
            .filter(
                (text): text is string =>
                    typeof text === "string"
            )
            .join(" ");

        if (textResponse) {
            throw new Error(
                `Gemini did not generate an image: ${textResponse}`
            );
        }

        throw new Error(
            "No image data was found in the Gemini response"
        );
    }

    const mimeType =
        generatedImagePart.inlineData
            ?.mimeType || "image/png";

    const imageBuffer = Buffer.from(
        base64Image,
        "base64"
    );

    if (imageBuffer.length === 0) {
        throw new Error(
            "Gemini returned an empty image"
        );
    }

    return {
        buffer: imageBuffer,
        promptUsed,
        mimeType,
    };
};