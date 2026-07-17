import {
    Types,
} from "mongoose";

import { NextResponse } from "next/server";

import { requireUser } from "@/lib/auth/require-user";
import connectDatabase from "@/lib/db/connect-db";

import Thumbnail from "@/models/Thumbnail";
import ThumbnailVersion from "@/models/ThumbnailVersion";

import type {
    AspectRatio,
    ColorSchemeId,
    ThumbnailGenerationMode,
    ThumbnailStyle,
} from "@/types/thumbnail.types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

interface LeanThumbnailVersion {
    _id: Types.ObjectId;
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

    generation_mode:
    ThumbnailGenerationMode;

    reference_images?: unknown[];

    createdAt?: Date;
    updatedAt?: Date;
}

interface LeanThumbnail {
    _id: Types.ObjectId;

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

    model_used?: string;

    generation_mode?:
    ThumbnailGenerationMode;

    current_version_id?:
    | Types.ObjectId
    | null;

    current_version_number?: number;
    total_versions?: number;

    isGenerating: boolean;
    generation_error?: string;

    createdAt?: Date;
    updatedAt?: Date;
}

interface SerializedThumbnailVersion {
    _id: string;
    thumbnailId: string;

    userId: string;

    version_number: number;

    title: string;
    description: string;

    style: ThumbnailStyle;
    aspect_ratio: AspectRatio;
    color_scheme: ColorSchemeId;
    text_overlay: boolean;

    image_url: string;
    cloudinary_public_id: string;

    prompt_used: string;
    user_prompt: string;

    model_used: string;

    generation_mode:
    ThumbnailGenerationMode;

    reference_images: unknown[];

    createdAt?: Date;
    updatedAt?: Date;

    is_legacy_fallback?: boolean;
}

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to fetch thumbnails";
};

const getStatusCode = (
    message: string
): number => {
    const normalizedMessage =
        message.toLowerCase();

    if (
        normalizedMessage.includes(
            "unauthorized"
        ) ||
        normalizedMessage.includes(
            "login"
        )
    ) {
        return 401;
    }

    return 500;
};

const parsePositiveInteger = (
    value: string | null,
    fallback: number
): number => {
    if (!value) {
        return fallback;
    }

    const parsedValue =
        Number.parseInt(
            value,
            10
        );

    if (
        !Number.isFinite(
            parsedValue
        ) ||
        parsedValue < 1
    ) {
        return fallback;
    }

    return parsedValue;
};

const serializeVersion = (
    version: LeanThumbnailVersion
): SerializedThumbnailVersion => {
    return {
        _id:
            version._id.toString(),

        thumbnailId:
            version.thumbnailId.toString(),

        userId:
            version.userId,

        version_number:
            version.version_number,

        title:
            version.title,

        description:
            version.description ?? "",

        style:
            version.style,

        aspect_ratio:
            version.aspect_ratio,

        color_scheme:
            version.color_scheme,

        text_overlay:
            version.text_overlay,

        image_url:
            version.image_url,

        cloudinary_public_id:
            version.cloudinary_public_id ??
            "",

        prompt_used:
            version.prompt_used ?? "",

        user_prompt:
            version.user_prompt ?? "",

        model_used:
            version.model_used ?? "",

        generation_mode:
            version.generation_mode,

        reference_images:
            version.reference_images ?? [],

        createdAt:
            version.createdAt,

        updatedAt:
            version.updatedAt,
    };
};

const createLegacyFallbackVersion = (
    thumbnail: LeanThumbnail
): SerializedThumbnailVersion | null => {
    if (!thumbnail.image_url) {
        return null;
    }

    return {
        _id:
            `legacy-${thumbnail._id.toString()}`,

        thumbnailId:
            thumbnail._id.toString(),

        userId:
            thumbnail.userId,

        version_number: 1,

        title:
            thumbnail.title,

        description:
            thumbnail.description ?? "",

        style:
            thumbnail.style,

        aspect_ratio:
            thumbnail.aspect_ratio,

        color_scheme:
            thumbnail.color_scheme,

        text_overlay:
            thumbnail.text_overlay,

        image_url:
            thumbnail.image_url,

        cloudinary_public_id:
            thumbnail.cloudinary_public_id ??
            "",

        prompt_used:
            thumbnail.prompt_used ?? "",

        user_prompt:
            thumbnail.user_prompt ?? "",

        model_used:
            thumbnail.model_used ?? "",

        generation_mode:
            thumbnail.generation_mode ??
            "flash_generate",

        reference_images: [],

        createdAt:
            thumbnail.createdAt,

        updatedAt:
            thumbnail.updatedAt,

        is_legacy_fallback: true,
    };
};

export async function GET(
    request: Request
) {
    try {
        const user =
            await requireUser();

        const userId =
            user._id.toString();

        const requestUrl =
            new URL(request.url);

        const requestedPage =
            parsePositiveInteger(
                requestUrl.searchParams.get(
                    "page"
                ),
                1
            );

        await connectDatabase();

        const totalItems =
            await Thumbnail.countDocuments({
                userId,
            });

        const totalPages =
            totalItems === 0
                ? 0
                : Math.ceil(
                    totalItems /
                    PAGE_SIZE
                );

        const currentPage =
            totalPages === 0
                ? 1
                : Math.min(
                    requestedPage,
                    totalPages
                );

        const skip =
            (currentPage - 1) *
            PAGE_SIZE;

        /*
         * Parent thumbnail project paginate হবে।
         * Versionগুলো pagination item হিসেবে
         * আলাদাভাবে count হবে না।
         */
        const thumbnailResults =
            await Thumbnail.find({
                userId,
            })
                .sort({
                    updatedAt: -1,
                    createdAt: -1,
                })
                .skip(skip)
                .limit(PAGE_SIZE)
                .lean();

        const thumbnails =
            thumbnailResults as unknown as
            LeanThumbnail[];

        /*
         * এখানে ObjectId[] type স্পষ্টভাবে
         * নির্ধারণ করা হয়েছে।
         */
        const thumbnailIds:
            Types.ObjectId[] =
            thumbnails.map(
                (thumbnail) =>
                    thumbnail._id
            );

        let thumbnailVersions:
            LeanThumbnailVersion[] = [];

        if (
            thumbnailIds.length > 0
        ) {
            const versionResults =
                await ThumbnailVersion.find({
                    userId,

                    thumbnailId: {
                        $in: thumbnailIds,
                    },
                })
                    .sort({
                        thumbnailId: 1,
                        version_number: 1,
                    })
                    .lean();

            thumbnailVersions =
                versionResults as unknown as
                LeanThumbnailVersion[];
        }

        const versionMap =
            new Map<
                string,
                SerializedThumbnailVersion[]
            >();

        for (
            const version of
            thumbnailVersions
        ) {
            const thumbnailId =
                version.thumbnailId.toString();

            const existingVersions =
                versionMap.get(
                    thumbnailId
                ) ?? [];

            existingVersions.push(
                serializeVersion(
                    version
                )
            );

            versionMap.set(
                thumbnailId,
                existingVersions
            );
        }

        const groupedThumbnails =
            thumbnails.map(
                (thumbnail) => {
                    const thumbnailId =
                        thumbnail._id.toString();

                    let versions =
                        versionMap.get(
                            thumbnailId
                        ) ?? [];

                    /*
                     * পুরোনো thumbnail-এর version history
                     * না থাকলে parent image fallback।
                     */
                    if (
                        versions.length === 0
                    ) {
                        const fallbackVersion =
                            createLegacyFallbackVersion(
                                thumbnail
                            );

                        if (fallbackVersion) {
                            versions = [
                                fallbackVersion,
                            ];
                        }
                    }

                    const latestVersion =
                        versions[
                        versions.length - 1
                        ];

                    const selectedVersionId =
                        thumbnail.current_version_id
                            ? thumbnail.current_version_id.toString()
                            : latestVersion?._id ??
                            null;

                    const selectedVersionNumber =
                        thumbnail.current_version_number &&
                            thumbnail.current_version_number >
                            0
                            ? thumbnail.current_version_number
                            : latestVersion
                                ?.version_number ??
                            0;

                    return {
                        ...thumbnail,

                        _id:
                            thumbnailId,

                        current_version_id:
                            selectedVersionId,

                        current_version_number:
                            selectedVersionNumber,

                        total_versions:
                            Math.max(
                                thumbnail.total_versions ??
                                0,
                                versions.length
                            ),

                        versions,
                    };
                }
            );

        const firstItemNumber =
            totalItems === 0
                ? 0
                : skip + 1;

        const lastItemNumber =
            totalItems === 0
                ? 0
                : Math.min(
                    skip +
                    groupedThumbnails.length,
                    totalItems
                );

        return NextResponse.json(
            {
                success: true,

                message:
                    "Thumbnail projects fetched successfully",

                thumbnails:
                    groupedThumbnails,

                pagination: {
                    page:
                        currentPage,

                    limit:
                        PAGE_SIZE,

                    totalItems,

                    totalPages,

                    hasPreviousPage:
                        currentPage > 1,

                    hasNextPage:
                        totalPages > 0 &&
                        currentPage <
                        totalPages,

                    firstItemNumber,

                    lastItemNumber,
                },
            },
            {
                status: 200,
            }
        );
    } catch (error: unknown) {
        console.error(
            "Fetching thumbnail projects failed:",
            error
        );

        const message =
            getErrorMessage(error);

        return NextResponse.json(
            {
                success: false,

                message,

                thumbnails: [],

                pagination: {
                    page: 1,

                    limit:
                        PAGE_SIZE,

                    totalItems: 0,
                    totalPages: 0,

                    hasPreviousPage: false,
                    hasNextPage: false,

                    firstItemNumber: 0,
                    lastItemNumber: 0,
                },
            },
            {
                status:
                    getStatusCode(
                        message
                    ),
            }
        );
    }
}