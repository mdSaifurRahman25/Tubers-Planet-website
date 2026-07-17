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

export type ImageModelTier =
    | "flash"
    | "pro";

interface SourceImageData {
    data: string;
    mimeType: string;
}

export interface GeneratedThumbnailImage {
    buffer: Buffer;
    promptUsed: string;
    mimeType: string;
    modelUsed: string;
}

const stylePrompts: Record<
    ThumbnailStyle,
    string
> = {
    "Bold & Graphic":
        "an eye-catching YouTube thumbnail with bold typography, vibrant colors, expressive emotion, dramatic lighting, high contrast, and a professional click-worthy composition",

    "Tech/Futuristic":
        "a futuristic YouTube thumbnail with a sleek modern design, digital interface elements, glowing accents, holographic effects, sharp lighting, and a high-tech atmosphere",

    Minimalist:
        "a minimalist YouTube thumbnail with a clean layout, simple shapes, a limited color palette, negative space, and one clear focal point",

    Photorealistic:
        "a photorealistic YouTube thumbnail with natural lighting, realistic subjects, DSLR-style photography, accurate textures, and shallow depth of field",

    Illustrated:
        "an illustrated YouTube thumbnail with custom digital artwork, stylized characters, bold outlines, vibrant colors, and a polished vector-art appearance",
};

const colorSchemeDescriptions: Record<
    ColorSchemeId,
    string
> = {
    vibrant:
        "vibrant and energetic colors with high saturation and bold contrast",

    sunset:
        "warm sunset tones with orange, pink, red, and purple gradients",

    ocean:
        "cool blue and teal tones with a fresh aquatic atmosphere",

    forest:
        "natural emerald green and earthy tones with a premium organic atmosphere",

    purple:
        "a purple-dominant palette with magenta and violet tones",

    monochrome:
        "a dramatic black-and-white palette with strong contrast",

    neon:
        "electric blue, pink, and yellow neon colors with glowing effects",

    pastel:
        "soft pastel colors with gentle, friendly, low-saturation tones",
};

const getImageModel = (
    tier: ImageModelTier
): string => {
    if (tier === "pro") {
        return (
            process.env.GEMINI_PRO_IMAGE_MODEL ||
            "gemini-3-pro-image"
        );
    }

    return (
        process.env.GEMINI_FLASH_IMAGE_MODEL ||
        "gemini-3.1-flash-image"
    );
};

const buildThumbnailPrompt = (
    data: GenerateThumbnailData
): string => {
    const promptParts: string[] = [
        `Create ${stylePrompts[data.style]}.`,
        `The YouTube video title and topic is: "${data.title}".`,
        `Use ${colorSchemeDescriptions[data.color_scheme]}.`,
        `The composition must use a ${data.aspect_ratio} aspect ratio.`,
        "Design it specifically to maximize YouTube click-through rate.",
        "Keep the main subject and headline clearly visible at small mobile thumbnail sizes.",
        "Keep the composition professional, balanced, uncluttered, and visually striking.",
    ];

    if (data.text_overlay) {
        promptParts.push(
            `Include one clear headline based on the title "${data.title}".`
        );

        promptParts.push(
            "Make the headline large, correctly spelled, high-contrast, and easy to read."
        );

        promptParts.push(
            "Do not introduce unrelated words, random labels, duplicated text, logos, or watermarks."
        );
    } else {
        promptParts.push(
            "Do not include any written text, captions, words, numbers, or letters."
        );
    }

    if (data.prompt) {
        promptParts.push(
            `Additional creator instructions: ${data.prompt}`
        );
    }

    return promptParts.join(" ");
};

const buildProEnhancementPrompt = (
    data: GenerateThumbnailData
): string => {
    const promptParts: string[] = [
        "Enhance and refine the provided existing YouTube thumbnail into a premium final version.",
        "Use the provided image as the primary visual reference.",
        "Preserve its successful core concept, recognizable subject, important objects, and overall visual direction.",
        "Improve professional lighting, clarity, detail, subject anatomy, object quality, typography, visual hierarchy, spacing, and mobile readability.",
        `The final thumbnail topic is: "${data.title}".`,
        `Use a ${data.aspect_ratio} composition.`,
        `Apply ${stylePrompts[data.style]}.`,
        `Use ${colorSchemeDescriptions[data.color_scheme]}.`,
        "Remove malformed hands, extra fingers, duplicated objects, partial objects near the edges, random symbols, unreadable text, unnecessary clutter, and visual artifacts.",
        "Do not add logos or watermarks.",
    ];

    if (data.text_overlay) {
        promptParts.push(
            `Use one clear headline based on "${data.title}".`
        );

        promptParts.push(
            "Keep the headline correctly spelled, bold, clean, and readable on mobile."
        );

        promptParts.push(
            "Do not place additional labels, random numbers, or unrelated text elsewhere in the image."
        );
    } else {
        promptParts.push(
            "Remove all written text from the final image."
        );
    }

    if (data.prompt) {
        promptParts.push(
            `Apply these current correction instructions carefully: ${data.prompt}`
        );
    }

    return promptParts.join(" ");
};

const getGenerationConfig = (
    aspectRatio: GenerateThumbnailData["aspect_ratio"]
): GenerateContentConfig => {
    return {
        responseModalities: ["IMAGE"],

        imageConfig: {
            aspectRatio,
            imageSize: "1K",
        },

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
};

const readSourceImage = async (
    imageUrl: string
): Promise<SourceImageData> => {
    const secureImageUrl =
        imageUrl.replace(
            /^http:\/\//,
            "https://"
        );

    const response = await fetch(
        secureImageUrl,
        {
            method: "GET",
            cache: "no-store",
        }
    );

    if (!response.ok) {
        throw new Error(
            `Unable to load the existing thumbnail for Pro enhancement (${response.status})`
        );
    }

    const mimeType =
        response.headers
            .get("content-type")
            ?.split(";")[0]
            ?.trim() || "image/png";

    if (!mimeType.startsWith("image/")) {
        throw new Error(
            "The current thumbnail URL did not return a valid image"
        );
    }

    const arrayBuffer =
        await response.arrayBuffer();

    const buffer =
        Buffer.from(arrayBuffer);

    if (buffer.length === 0) {
        throw new Error(
            "The current thumbnail image is empty"
        );
    }

    return {
        data: buffer.toString("base64"),
        mimeType,
    };
};

const extractGeneratedImage = (
    response: Awaited<
        ReturnType<
            typeof gemini.models.generateContent
        >
    >,
    promptUsed: string,
    modelUsed: string
): GeneratedThumbnailImage => {
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

        throw new Error(
            textResponse
                ? `Gemini did not generate an image: ${textResponse}`
                : "No image data was found in the Gemini response"
        );
    }

    const imageBuffer =
        Buffer.from(
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
        modelUsed,
        mimeType:
            generatedImagePart.inlineData
                ?.mimeType || "image/png",
    };
};

export const generateThumbnailImage = async (
    data: GenerateThumbnailData,
    tier: ImageModelTier = "flash"
): Promise<GeneratedThumbnailImage> => {
    const modelUsed =
        getImageModel(tier);

    const promptUsed =
        buildThumbnailPrompt(data);

    console.info(
        `[Gemini Image] Generate using: ${modelUsed}`
    );

    const response =
        await gemini.models.generateContent({
            model: modelUsed,
            contents: promptUsed,
            config: getGenerationConfig(
                data.aspect_ratio
            ),
        });

    return extractGeneratedImage(
        response,
        promptUsed,
        modelUsed
    );
};

export const enhanceThumbnailWithPro =
    async (
        data: GenerateThumbnailData,
        currentImageUrl: string
    ): Promise<GeneratedThumbnailImage> => {
        const modelUsed =
            getImageModel("pro");

        const promptUsed =
            buildProEnhancementPrompt(data);

        const sourceImage =
            await readSourceImage(
                currentImageUrl
            );

        console.info(
            `[Gemini Image] Pro enhance using: ${modelUsed}`
        );

        const response =
            await gemini.models.generateContent({
                model: modelUsed,

                contents: [
                    {
                        role: "user",

                        parts: [
                            {
                                text: promptUsed,
                            },
                            {
                                inlineData: {
                                    data: sourceImage.data,
                                    mimeType:
                                        sourceImage.mimeType,
                                },
                            },
                        ],
                    },
                ],

                config: getGenerationConfig(
                    data.aspect_ratio
                ),
            });

        return extractGeneratedImage(
            response,
            promptUsed,
            modelUsed
        );
    };