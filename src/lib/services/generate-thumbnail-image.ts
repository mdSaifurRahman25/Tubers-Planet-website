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

export interface SourceImageData {
    data: string;
    mimeType: string;
}

export type SourceImageInput =
    | string
    | SourceImageData;

export interface GeneratedThumbnailImage {
    buffer: Buffer;
    promptUsed: string;
    mimeType: string;
    modelUsed: string;
}

const MAX_REFERENCE_IMAGES = 3;

const MAX_REFERENCE_IMAGE_SIZE =
    10 * 1024 * 1024;

const allowedReferenceMimeTypes =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
    ]);

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

const normalizeMimeType = (
    mimeType: string
): string => {
    const normalized =
        mimeType
            .split(";")[0]
            ?.trim()
            .toLowerCase();

    if (normalized === "image/jpg") {
        return "image/jpeg";
    }

    return normalized || "image/png";
};

const validateMimeType = (
    mimeType: string
) => {
    if (
        !allowedReferenceMimeTypes.has(
            mimeType
        )
    ) {
        throw new Error(
            "Reference images must be JPG, PNG, or WebP files"
        );
    }
};

const getImageModel = (
    tier: ImageModelTier
): string => {
    if (tier === "pro") {
        return (
            process.env
                .GEMINI_PRO_IMAGE_MODEL ||
            "gemini-3-pro-image"
        );
    }

    return (
        process.env
            .GEMINI_FLASH_IMAGE_MODEL ||
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

const buildReferenceGenerationPrompt = (
    data: GenerateThumbnailData,
    referenceImageCount: number
): string => {
    const promptParts: string[] = [
        buildThumbnailPrompt(data),

        `You have been given ${referenceImageCount} reference image${referenceImageCount === 1
            ? ""
            : "s"
        }.`,

        "Use the first image as the primary visual reference.",

        "Use any additional images only as supporting references for the person, face, hairstyle, clothing, product, object, background, lighting, colors, or visual details.",

        "Create one unified professional thumbnail.",

        "Do not create a collage, split screen, contact sheet, or multiple separate panels unless the creator instructions explicitly request one.",

        "Do not duplicate people, faces, products, objects, or backgrounds simply because they appear in multiple references.",

        "When a reference image contains a person, preserve that person's recognizable facial features, skin tone, hairstyle, approximate age, and overall identity.",

        "Do not replace the referenced person with a different-looking person.",

        "Keep the face natural, realistic, proportional, and clearly recognizable.",

        "Correct malformed hands, extra fingers, duplicated limbs, distorted faces, partial objects, and visual artifacts.",

        "Use the references as visual guidance while following the requested thumbnail title, style, colors, composition, and creator instructions.",
    ];

    return promptParts.join(" ");
};

const buildProEnhancementPrompt = (
    data: GenerateThumbnailData,
    referenceImageCount: number
): string => {
    const promptParts: string[] = [
        "Enhance and refine the supplied visual references into one premium final YouTube thumbnail.",

        `You have been given ${referenceImageCount} reference image${referenceImageCount === 1
            ? ""
            : "s"
        }.`,

        "Treat the first image as the primary composition and main visual direction.",

        "Use any additional images only as supporting references for subjects, products, faces, objects, style, lighting, colors, or visual details.",

        "Do not create a collage, split screen, contact sheet, or multiple separate panels unless the creator instructions explicitly request one.",

        "Do not duplicate people, faces, products, objects, backgrounds, or text simply because they appear across multiple references.",

        "When a reference image contains a person, preserve that person's recognizable facial features, skin tone, hairstyle, approximate age, and overall identity.",

        "Do not replace the referenced person with a different-looking person.",

        "Preserve the successful core concept, recognizable main subject, important objects, and overall visual direction of the primary reference.",

        "Improve professional lighting, clarity, detail, subject anatomy, object quality, visual hierarchy, spacing, contrast, and mobile readability.",

        `The final thumbnail topic is: "${data.title}".`,

        `Use a ${data.aspect_ratio} composition.`,

        `Apply ${stylePrompts[data.style]}.`,

        `Use ${colorSchemeDescriptions[data.color_scheme]}.`,

        "Remove malformed hands, extra fingers, duplicated objects, partial objects near the edges, random symbols, unreadable text, unnecessary clutter, and visual artifacts.",

        "Do not add logos or watermarks.",
    ];

    if (data.text_overlay) {
        promptParts.push(
            "Use exactly one clear main headline."
        );

        promptParts.push(
            "Preserve the existing headline wording from the primary reference image whenever it is already clear and relevant."
        );

        promptParts.push(
            "Do not add, remove, rewrite, or paraphrase headline words unless the creator instructions explicitly request a text correction."
        );

        promptParts.push(
            "Keep the headline correctly spelled, bold, clean, high-contrast, and readable on mobile."
        );

        promptParts.push(
            "Do not place additional labels, captions, random numbers, or unrelated text elsewhere in the image."
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

export const createSourceImageFromBuffer = (
    buffer: Buffer,
    mimeType: string
): SourceImageData => {
    if (buffer.length === 0) {
        throw new Error(
            "The reference image is empty"
        );
    }

    if (
        buffer.length >
        MAX_REFERENCE_IMAGE_SIZE
    ) {
        throw new Error(
            "Each reference image must be smaller than 10 MB"
        );
    }

    const normalizedMimeType =
        normalizeMimeType(mimeType);

    validateMimeType(
        normalizedMimeType
    );

    return {
        data:
            buffer.toString("base64"),

        mimeType:
            normalizedMimeType,
    };
};

export const createSourceImageFromFile =
    async (
        file: File
    ): Promise<SourceImageData> => {
        if (file.size === 0) {
            throw new Error(
                "The selected reference image is empty"
            );
        }

        if (
            file.size >
            MAX_REFERENCE_IMAGE_SIZE
        ) {
            throw new Error(
                "Each reference image must be smaller than 10 MB"
            );
        }

        const mimeType =
            normalizeMimeType(
                file.type
            );

        validateMimeType(mimeType);

        const arrayBuffer =
            await file.arrayBuffer();

        const buffer =
            Buffer.from(arrayBuffer);

        return createSourceImageFromBuffer(
            buffer,
            mimeType
        );
    };

export const readSourceImageFromUrl =
    async (
        imageUrl: string
    ): Promise<SourceImageData> => {
        const secureImageUrl =
            imageUrl.replace(
                /^http:\/\//,
                "https://"
            );

        const response =
            await fetch(
                secureImageUrl,
                {
                    method: "GET",
                    cache: "no-store",
                }
            );

        if (!response.ok) {
            throw new Error(
                `Unable to load a reference image (${response.status})`
            );
        }

        const mimeType =
            normalizeMimeType(
                response.headers.get(
                    "content-type"
                ) || "image/png"
            );

        validateMimeType(mimeType);

        const contentLengthHeader =
            response.headers.get(
                "content-length"
            );

        if (
            contentLengthHeader &&
            Number(contentLengthHeader) >
            MAX_REFERENCE_IMAGE_SIZE
        ) {
            throw new Error(
                "Each reference image must be smaller than 10 MB"
            );
        }

        const arrayBuffer =
            await response.arrayBuffer();

        const buffer =
            Buffer.from(arrayBuffer);

        return createSourceImageFromBuffer(
            buffer,
            mimeType
        );
    };

const validateSourceImageData = (
    sourceImage: SourceImageData
): SourceImageData => {
    const mimeType =
        normalizeMimeType(
            sourceImage.mimeType
        );

    validateMimeType(mimeType);

    if (!sourceImage.data.trim()) {
        throw new Error(
            "Reference image data is empty"
        );
    }

    const imageBuffer =
        Buffer.from(
            sourceImage.data,
            "base64"
        );

    if (imageBuffer.length === 0) {
        throw new Error(
            "Reference image data is empty"
        );
    }

    if (
        imageBuffer.length >
        MAX_REFERENCE_IMAGE_SIZE
    ) {
        throw new Error(
            "Each reference image must be smaller than 10 MB"
        );
    }

    return {
        data:
            imageBuffer.toString(
                "base64"
            ),

        mimeType,
    };
};

const resolveSourceImages = async (
    sourceInputs:
        | SourceImageInput
        | SourceImageInput[]
): Promise<SourceImageData[]> => {
    const inputs =
        Array.isArray(sourceInputs)
            ? sourceInputs
            : [sourceInputs];

    if (inputs.length === 0) {
        throw new Error(
            "At least one reference image is required"
        );
    }

    if (
        inputs.length >
        MAX_REFERENCE_IMAGES
    ) {
        throw new Error(
            "A maximum of 3 reference images is allowed"
        );
    }

    return Promise.all(
        inputs.map(
            async (
                sourceInput
            ) => {
                if (
                    typeof sourceInput ===
                    "string"
                ) {
                    return readSourceImageFromUrl(
                        sourceInput
                    );
                }

                return validateSourceImageData(
                    sourceInput
                );
            }
        )
    );
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
        response.candidates?.[0]
            ?.content?.parts;

    if (!responseParts?.length) {
        throw new Error(
            "Gemini did not return any generated content"
        );
    }

    const generatedImagePart =
        responseParts.find(
            (part) =>
                typeof part.inlineData
                    ?.data ===
                "string"
        );

    const base64Image =
        generatedImagePart
            ?.inlineData?.data;

    if (!base64Image) {
        const textResponse =
            responseParts
                .map(
                    (part) =>
                        part.text
                )
                .filter(
                    (
                        text
                    ): text is string =>
                        typeof text ===
                        "string"
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

    if (
        imageBuffer.length === 0
    ) {
        throw new Error(
            "Gemini returned an empty image"
        );
    }

    return {
        buffer:
            imageBuffer,

        promptUsed,

        modelUsed,

        mimeType:
            generatedImagePart
                .inlineData
                ?.mimeType ||
            "image/png",
    };
};

export const generateThumbnailImage =
    async (
        data: GenerateThumbnailData,

        tier: ImageModelTier =
            "flash",

        sourceInputs?:
            | SourceImageInput
            | SourceImageInput[]
    ): Promise<GeneratedThumbnailImage> => {
        const modelUsed =
            getImageModel(tier);

        const hasReferenceImages =
            sourceInputs !== undefined &&
            (
                Array.isArray(
                    sourceInputs
                )
                    ? sourceInputs.length > 0
                    : true
            );

        if (!hasReferenceImages) {
            const promptUsed =
                buildThumbnailPrompt(
                    data
                );

            console.info(
                `[Gemini Image] Generate using: ${modelUsed}`
            );

            console.info(
                "[Gemini Image] Reference images: 0"
            );

            const response =
                await gemini.models.generateContent(
                    {
                        model:
                            modelUsed,

                        contents:
                            promptUsed,

                        config:
                            getGenerationConfig(
                                data.aspect_ratio
                            ),
                    }
                );

            return extractGeneratedImage(
                response,
                promptUsed,
                modelUsed
            );
        }

        const sourceImages =
            await resolveSourceImages(
                sourceInputs
            );

        const promptUsed =
            buildReferenceGenerationPrompt(
                data,
                sourceImages.length
            );

        console.info(
            `[Gemini Image] Generate using: ${modelUsed}`
        );

        console.info(
            `[Gemini Image] Reference images: ${sourceImages.length}`
        );

        const response =
            await gemini.models.generateContent(
                {
                    model:
                        modelUsed,

                    contents: [
                        {
                            role: "user",

                            parts: [
                                {
                                    text:
                                        promptUsed,
                                },

                                ...sourceImages.map(
                                    (
                                        sourceImage
                                    ) => ({
                                        inlineData: {
                                            data:
                                                sourceImage.data,

                                            mimeType:
                                                sourceImage.mimeType,
                                        },
                                    })
                                ),
                            ],
                        },
                    ],

                    config:
                        getGenerationConfig(
                            data.aspect_ratio
                        ),
                }
            );

        return extractGeneratedImage(
            response,
            promptUsed,
            modelUsed
        );
    };

export const enhanceThumbnailWithPro =
    async (
        data: GenerateThumbnailData,

        sourceInputs:
            | SourceImageInput
            | SourceImageInput[]
    ): Promise<GeneratedThumbnailImage> => {
        const modelUsed =
            getImageModel("pro");

        const sourceImages =
            await resolveSourceImages(
                sourceInputs
            );

        const promptUsed =
            buildProEnhancementPrompt(
                data,
                sourceImages.length
            );

        console.info(
            `[Gemini Image] Pro enhance using: ${modelUsed}`
        );

        console.info(
            `[Gemini Image] Reference images: ${sourceImages.length}`
        );

        const response =
            await gemini.models.generateContent(
                {
                    model:
                        modelUsed,

                    contents: [
                        {
                            role: "user",

                            parts: [
                                {
                                    text:
                                        promptUsed,
                                },

                                ...sourceImages.map(
                                    (
                                        sourceImage
                                    ) => ({
                                        inlineData: {
                                            data:
                                                sourceImage.data,

                                            mimeType:
                                                sourceImage.mimeType,
                                        },
                                    })
                                ),
                            ],
                        },
                    ],

                    config:
                        getGenerationConfig(
                            data.aspect_ratio
                        ),
                }
            );

        return extractGeneratedImage(
            response,
            promptUsed,
            modelUsed
        );
    };