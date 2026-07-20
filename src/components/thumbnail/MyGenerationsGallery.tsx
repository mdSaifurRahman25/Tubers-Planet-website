"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    useEffect,
    useState,
} from "react";

import {
    CheckCircle2Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
    DownloadIcon,
    ExternalLinkIcon,
    Layers3Icon,
    Loader2Icon,
    TrashIcon,
} from "lucide-react";

import toast from "react-hot-toast";

import SoftBackdrop from "@/components/ui/SoftBackdrop";
import { useAuth } from "@/context/AuthContext";

import type {
    AspectRatio,
    Thumbnail,
    ThumbnailGenerationMode,
} from "@/types/thumbnail.types";

interface ThumbnailVersionItem {
    _id: string;
    thumbnailId: string;

    version_number: number;

    title: string;
    description?: string;

    style: Thumbnail["style"];
    aspect_ratio: Thumbnail["aspect_ratio"];
    color_scheme: Thumbnail["color_scheme"];
    text_overlay: boolean;

    image_url: string;
    cloudinary_public_id?: string;

    prompt_used?: string;
    user_prompt?: string;

    model_used?: string;

    generation_mode:
    ThumbnailGenerationMode;

    reference_images?: unknown[];

    createdAt?: string;
    updatedAt?: string;

    is_legacy_fallback?: boolean;
}

type GroupedThumbnail =
    Thumbnail & {
        current_version_id?:
        | string
        | null;

        current_version_number?: number;

        total_versions?: number;

        versions?: ThumbnailVersionItem[];
    };

interface PaginationData {
    page: number;
    limit: number;

    totalItems: number;
    totalPages: number;

    hasPreviousPage: boolean;
    hasNextPage: boolean;

    firstItemNumber: number;
    lastItemNumber: number;
}

interface ThumbnailsApiResponse {
    success: boolean;
    message: string;

    thumbnails?: GroupedThumbnail[];

    pagination?: PaginationData;
}

interface DeleteThumbnailResponse {
    success: boolean;
    message: string;
}

interface SelectVersionResponse {
    success: boolean;
    message: string;
    thumbnail?: Thumbnail;
}

interface VersionPresentation {
    label: string;
    shortLabel: string;
    className: string;
}

const DEFAULT_PAGINATION: PaginationData = {
    page: 1,
    limit: 25,

    totalItems: 0,
    totalPages: 0,

    hasPreviousPage: false,
    hasNextPage: false,

    firstItemNumber: 0,
    lastItemNumber: 0,
};

const aspectRatioClassMap: Record<
    AspectRatio,
    string
> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
};

const readJsonResponse = async <T,>(
    response: Response
): Promise<T | null> => {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
};

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Something went wrong";
};

const formatThumbnailDate = (
    value?: string
): string => {
    if (!value) {
        return "No date";
    }

    const date = new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "No date";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
};

const createDownloadUrl = (
    imageUrl: string
): string => {
    try {
        const url =
            new URL(imageUrl);

        url.protocol = "https:";

        if (
            url.hostname ===
            "res.cloudinary.com" &&
            url.pathname.includes(
                "/upload/"
            ) &&
            !url.pathname.includes(
                "/upload/fl_attachment/"
            )
        ) {
            url.pathname =
                url.pathname.replace(
                    "/upload/",
                    "/upload/fl_attachment/"
                );
        }

        return url.toString();
    } catch {
        return imageUrl.replace(
            /^http:\/\//,
            "https://"
        );
    }
};

const createDownloadFilename = (
    title: string,
    versionNumber: number
): string => {
    const safeTitle =
        title
            .trim()
            .toLowerCase()
            .replace(
                /[^a-z0-9]+/g,
                "-"
            )
            .replace(
                /^-+|-+$/g,
                ""
            );

    return `${safeTitle || "thumbnail"
        }-version-${versionNumber}.jpg`;
};

const downloadThumbnail = (
    imageUrl: string,
    title: string,
    versionNumber: number
) => {
    const link =
        document.createElement("a");

    link.href =
        createDownloadUrl(
            imageUrl
        );

    link.download =
        createDownloadFilename(
            title,
            versionNumber
        );

    link.rel =
        "noopener noreferrer";

    document.body.appendChild(
        link
    );

    link.click();
    link.remove();
};

const getVersionPresentation = (
    generationMode:
        ThumbnailGenerationMode
): VersionPresentation => {
    if (
        generationMode ===
        "pro_enhance"
    ) {
        return {
            label:
                "Premium Enhanced",

            shortLabel:
                "Enhanced",

            className:
                "border-amber-400/30 bg-amber-400/10 text-amber-300",
        };
    }

    if (
        generationMode ===
        "flash_regenerate"
    ) {
        return {
            label:
                "Regenerated",

            shortLabel:
                "Regenerated",

            className:
                "border-sky-400/30 bg-sky-400/10 text-sky-300",
        };
    }

    return {
        label:
            "First Generation",

        shortLabel:
            "First",

        className:
            "border-pink-400/30 bg-pink-400/10 text-pink-300",
    };
};

const getNormalizedVersions = (
    thumbnail: GroupedThumbnail
): ThumbnailVersionItem[] => {
    const storedVersions =
        thumbnail.versions ?? [];

    if (
        storedVersions.length > 0
    ) {
        return [...storedVersions].sort(
            (
                firstVersion,
                secondVersion
            ) =>
                firstVersion.version_number -
                secondVersion.version_number
        );
    }

    if (!thumbnail.image_url) {
        return [];
    }

    return [
        {
            _id:
                thumbnail.current_version_id ??
                `fallback-${thumbnail._id}`,

            thumbnailId:
                thumbnail._id,

            version_number:
                thumbnail.current_version_number ??
                1,

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
        },
    ];
};

const getDefaultVersionId = (
    thumbnail: GroupedThumbnail,
    versions: ThumbnailVersionItem[]
): string | null => {
    if (
        thumbnail.current_version_id &&
        versions.some(
            (version) =>
                version._id ===
                thumbnail.current_version_id
        )
    ) {
        return thumbnail.current_version_id;
    }

    const currentVersion =
        versions.find(
            (version) =>
                version.version_number ===
                thumbnail.current_version_number
        );

    if (currentVersion) {
        return currentVersion._id;
    }

    return (
        versions[
            versions.length - 1
        ]?._id ?? null
    );
};

const getVisiblePageNumbers = (
    currentPage: number,
    totalPages: number
): number[] => {
    if (totalPages <= 5) {
        return Array.from(
            {
                length: totalPages,
            },
            (_, index) =>
                index + 1
        );
    }

    let startPage =
        Math.max(
            currentPage - 2,
            1
        );

    let endPage =
        Math.min(
            startPage + 4,
            totalPages
        );

    if (
        endPage - startPage <
        4
    ) {
        startPage =
            Math.max(
                endPage - 4,
                1
            );
    }

    return Array.from(
        {
            length:
                endPage -
                startPage +
                1,
        },
        (_, index) =>
            startPage + index
    );
};

export default function MyGenerationsGallery() {
    const router = useRouter();

    const {
        isLoggedIn,
        isAuthLoading,
    } = useAuth();

    const [
        thumbnails,
        setThumbnails,
    ] = useState<
        GroupedThumbnail[]
    >([]);

    const [
        pagination,
        setPagination,
    ] = useState<PaginationData>(
        DEFAULT_PAGINATION
    );

    const [
        currentPage,
        setCurrentPage,
    ] = useState(1);

    const [
        refreshKey,
        setRefreshKey,
    ] = useState(0);

    const [
        activeVersionIds,
        setActiveVersionIds,
    ] = useState<
        Record<string, string>
    >({});

    const [
        isLoading,
        setIsLoading,
    ] = useState(true);

    const [
        deletingThumbnailId,
        setDeletingThumbnailId,
    ] = useState<
        string | null
    >(null);

    const [
        selectingVersionKey,
        setSelectingVersionKey,
    ] = useState<
        string | null
    >(null);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!isLoggedIn) {
            setIsLoading(false);

            router.replace(
                "/login?next=/generations"
            );

            return;
        }

        const controller =
            new AbortController();

        const fetchThumbnails =
            async () => {
                try {
                    setIsLoading(true);

                    const response =
                        await fetch(
                            `/api/thumbnails?page=${currentPage}`,
                            {
                                method: "GET",

                                credentials:
                                    "include",

                                cache:
                                    "no-store",

                                signal:
                                    controller.signal,
                            }
                        );

                    const data =
                        await readJsonResponse<ThumbnailsApiResponse>(
                            response
                        );

                    if (!data) {
                        throw new Error(
                            "Invalid response from the server"
                        );
                    }

                    if (
                        !response.ok ||
                        !data.success
                    ) {
                        throw new Error(
                            data.message ||
                            "Unable to fetch thumbnails"
                        );
                    }

                    const fetchedThumbnails =
                        data.thumbnails ??
                        [];

                    setThumbnails(
                        fetchedThumbnails
                    );

                    const nextPagination =
                        data.pagination ??
                        DEFAULT_PAGINATION;

                    setPagination(
                        nextPagination
                    );

                    if (
                        nextPagination.page !==
                        currentPage
                    ) {
                        setCurrentPage(
                            nextPagination.page
                        );
                    }

                    setActiveVersionIds(
                        (currentIds) => {
                            const nextIds: Record<
                                string,
                                string
                            > = {};

                            fetchedThumbnails.forEach(
                                (
                                    thumbnail
                                ) => {
                                    const versions =
                                        getNormalizedVersions(
                                            thumbnail
                                        );

                                    const existingId =
                                        currentIds[
                                        thumbnail._id
                                        ];

                                    const existingStillValid =
                                        Boolean(
                                            existingId &&
                                            versions.some(
                                                (
                                                    version
                                                ) =>
                                                    version._id ===
                                                    existingId
                                            )
                                        );

                                    const defaultId =
                                        getDefaultVersionId(
                                            thumbnail,
                                            versions
                                        );

                                    const nextId =
                                        existingStillValid
                                            ? existingId
                                            : defaultId;

                                    if (nextId) {
                                        nextIds[
                                            thumbnail._id
                                        ] = nextId;
                                    }
                                }
                            );

                            return nextIds;
                        }
                    );
                } catch (
                error: unknown
                ) {
                    if (
                        error instanceof
                        DOMException &&
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "Fetching thumbnails failed:",
                        error
                    );

                    toast.error(
                        getErrorMessage(
                            error
                        )
                    );
                } finally {
                    if (
                        !controller.signal
                            .aborted
                    ) {
                        setIsLoading(false);
                    }
                }
            };

        void fetchThumbnails();

        return () => {
            controller.abort();
        };
    }, [
        currentPage,
        isAuthLoading,
        isLoggedIn,
        refreshKey,
        router,
    ]);

    const handleDelete = async (
        thumbnailId: string
    ) => {
        const shouldDelete =
            window.confirm(
                "Delete this thumbnail project and all of its versions?"
            );

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingThumbnailId(
                thumbnailId
            );

            const response =
                await fetch(
                    `/api/thumbnails/${thumbnailId}`,
                    {
                        method: "DELETE",

                        credentials:
                            "include",
                    }
                );

            const data =
                await readJsonResponse<DeleteThumbnailResponse>(
                    response
                );

            if (!data) {
                throw new Error(
                    "Invalid response from the server"
                );
            }

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Unable to delete thumbnail"
                );
            }

            toast.success(
                data.message
            );

            if (
                thumbnails.length ===
                1 &&
                currentPage > 1
            ) {
                setCurrentPage(
                    (previousPage) =>
                        previousPage - 1
                );
            } else {
                setRefreshKey(
                    (currentKey) =>
                        currentKey + 1
                );
            }
        } catch (
        error: unknown
        ) {
            console.error(
                "Deleting thumbnail failed:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setDeletingThumbnailId(
                null
            );
        }
    };

    const handleUseVersion = async (
        thumbnailId: string,
        version: ThumbnailVersionItem
    ) => {
        if (
            version.is_legacy_fallback
        ) {
            toast.error(
                "This older thumbnail has not been migrated into version history yet"
            );

            return;
        }

        const selectionKey =
            `${thumbnailId}:${version._id}`;

        try {
            setSelectingVersionKey(
                selectionKey
            );

            const response =
                await fetch(
                    `/api/thumbnails/${thumbnailId}/select-version`,
                    {
                        method: "POST",

                        credentials:
                            "include",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body: JSON.stringify({
                            versionId:
                                version._id,
                        }),
                    }
                );

            const data =
                await readJsonResponse<SelectVersionResponse>(
                    response
                );

            if (!data) {
                throw new Error(
                    "Invalid response from the server"
                );
            }

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Unable to select this version"
                );
            }

            setThumbnails(
                (currentThumbnails) =>
                    currentThumbnails.map(
                        (
                            currentThumbnail
                        ) => {
                            if (
                                currentThumbnail._id !==
                                thumbnailId
                            ) {
                                return currentThumbnail;
                            }

                            return {
                                ...currentThumbnail,

                                ...(data.thumbnail ??
                                    {}),

                                versions:
                                    currentThumbnail.versions,

                                current_version_id:
                                    version._id,

                                current_version_number:
                                    version.version_number,

                                image_url:
                                    version.image_url,

                                cloudinary_public_id:
                                    version.cloudinary_public_id ??
                                    "",

                                title:
                                    version.title,

                                style:
                                    version.style,

                                aspect_ratio:
                                    version.aspect_ratio,

                                color_scheme:
                                    version.color_scheme,

                                text_overlay:
                                    version.text_overlay,

                                prompt_used:
                                    version.prompt_used ??
                                    "",

                                user_prompt:
                                    version.user_prompt ??
                                    "",

                                model_used:
                                    version.model_used ??
                                    "",

                                generation_mode:
                                    version.generation_mode,
                            };
                        }
                    )
            );

            setActiveVersionIds(
                (currentIds) => ({
                    ...currentIds,

                    [thumbnailId]:
                        version._id,
                })
            );

            toast.success(
                data.message ||
                "Selected version is now active"
            );
        } catch (
        error: unknown
        ) {
            console.error(
                "Selecting version failed:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setSelectingVersionKey(
                null
            );
        }
    };

    const handlePageChange = (
        pageNumber: number
    ) => {
        if (
            pageNumber < 1 ||
            pageNumber >
            pagination.totalPages ||
            pageNumber === currentPage ||
            isLoading
        ) {
            return;
        }

        setCurrentPage(
            pageNumber
        );

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const visiblePageNumbers =
        getVisiblePageNumbers(
            currentPage,
            pagination.totalPages
        );

    return (
        <>
            <SoftBackdrop />

            <main className="relative z-10 min-h-screen px-5 pt-24 pb-20 sm:px-8 md:px-12 lg:px-16 xl:px-24">
                <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-200">
                            My Generations
                        </h1>

                        <p className="mt-1 text-sm text-zinc-400">
                            Compare every version
                            of your generated
                            thumbnails.
                        </p>
                    </div>

                    {!isLoading &&
                        pagination.totalItems >
                        0 && (
                            <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-400">
                                {
                                    pagination.firstItemNumber
                                }
                                –
                                {
                                    pagination.lastItemNumber
                                }{" "}
                                of{" "}
                                {
                                    pagination.totalItems
                                }{" "}
                                projects
                            </div>
                        )}
                </header>

                {(isLoading ||
                    isAuthLoading) && (
                        <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                            {Array.from({
                                length: 6,
                            }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className="h-130 animate-pulse rounded-2xl border border-white/10 bg-white/6"
                                    />
                                )
                            )}
                        </div>
                    )}

                {!isLoading &&
                    !isAuthLoading &&
                    thumbnails.length ===
                    0 && (
                        <div className="py-24 text-center">
                            <h2 className="text-lg font-semibold text-zinc-200">
                                No thumbnails yet
                            </h2>

                            <p className="mt-2 text-sm text-zinc-400">
                                Generate your first
                                thumbnail to see it
                                here.
                            </p>

                            <Link
                                href="/generate"
                                className="mt-6 inline-flex rounded-full bg-pink-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-pink-700"
                            >
                                Generate Thumbnail
                            </Link>
                        </div>
                    )}

                {!isLoading &&
                    !isAuthLoading &&
                    thumbnails.length >
                    0 && (
                        <>
                            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 xl:grid-cols-3">
                                {thumbnails.map(
                                    (
                                        thumbnail,
                                        thumbnailIndex
                                    ) => {
                                        const versions =
                                            getNormalizedVersions(
                                                thumbnail
                                            );

                                        const activeVersionId =
                                            activeVersionIds[
                                            thumbnail._id
                                            ] ??
                                            getDefaultVersionId(
                                                thumbnail,
                                                versions
                                            );

                                        const activeVersion =
                                            versions.find(
                                                (
                                                    version
                                                ) =>
                                                    version._id ===
                                                    activeVersionId
                                            ) ??
                                            versions[
                                            versions.length -
                                            1
                                            ];

                                        const isDeleting =
                                            deletingThumbnailId ===
                                            thumbnail._id;

                                        if (!activeVersion) {
                                            return (
                                                <article
                                                    key={
                                                        thumbnail._id
                                                    }
                                                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/6 p-6"
                                                >
                                                    <p className="text-sm text-zinc-400">
                                                        No versions
                                                        found for this
                                                        thumbnail.
                                                    </p>
                                                </article>
                                            );
                                        }

                                        const aspectClass =
                                            aspectRatioClassMap[
                                            activeVersion
                                                .aspect_ratio
                                            ];

                                        const activePresentation =
                                            getVersionPresentation(
                                                activeVersion
                                                    .generation_mode
                                            );

                                        const isCurrentVersion =
                                            thumbnail.current_version_id ===
                                            activeVersion._id ||
                                            thumbnail.current_version_number ===
                                            activeVersion.version_number;

                                        const selectionKey =
                                            `${thumbnail._id}:${activeVersion._id}`;

                                        const isSelecting =
                                            selectingVersionKey ===
                                            selectionKey;

                                        return (
                                            <article
                                                key={
                                                    thumbnail._id
                                                }
                                                className="overflow-hidden rounded-2xl border border-white/10 bg-white/6 shadow-xl transition hover:border-white/20"
                                            >
                                                <div
                                                    className={`relative overflow-hidden bg-black ${aspectClass}`}
                                                >
                                                    {activeVersion.image_url ? (
                                                        <Image
                                                            src={
                                                                activeVersion.image_url
                                                            }
                                                            alt={
                                                                activeVersion.title
                                                            }
                                                            fill
                                                            preload={
                                                                thumbnailIndex ===
                                                                0
                                                            }
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full items-center justify-center px-5 text-center text-sm text-zinc-400">
                                                            No image
                                                            available
                                                        </div>
                                                    )}

                                                    <div className="absolute top-3 left-3">
                                                        <span
                                                            className={`rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur ${activePresentation.className}`}
                                                        >
                                                            {
                                                                activePresentation.label
                                                            }
                                                        </span>
                                                    </div>

                                                    <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 px-2.5 py-1 text-[11px] text-white backdrop-blur">
                                                        <Layers3Icon
                                                            aria-hidden="true"
                                                            className="size-3.5"
                                                        />

                                                        {
                                                            versions.length
                                                        }{" "}
                                                        version
                                                        {versions.length ===
                                                            1
                                                            ? ""
                                                            : "s"}
                                                    </div>

                                                    {thumbnail.isGenerating && (
                                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/65 text-sm font-medium text-white">
                                                            <Loader2Icon
                                                                aria-hidden="true"
                                                                className="size-4 animate-spin"
                                                            />

                                                            Processing
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="border-t border-white/8 bg-black/15 p-3">
                                                    <div className="mb-2 flex items-center justify-between gap-3">
                                                        <p className="text-xs font-medium text-zinc-300">
                                                            Compare versions
                                                        </p>

                                                        <p className="text-[11px] text-zinc-500">
                                                            Version{" "}
                                                            {
                                                                activeVersion.version_number
                                                            }
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-2 overflow-x-auto pb-1">
                                                        {versions.map(
                                                            (
                                                                version
                                                            ) => {
                                                                const presentation =
                                                                    getVersionPresentation(
                                                                        version.generation_mode
                                                                    );

                                                                const isActive =
                                                                    version._id ===
                                                                    activeVersion._id;

                                                                const isCurrent =
                                                                    thumbnail.current_version_id ===
                                                                    version._id ||
                                                                    thumbnail.current_version_number ===
                                                                    version.version_number;

                                                                return (
                                                                    <button
                                                                        key={
                                                                            version._id
                                                                        }
                                                                        type="button"
                                                                        onClick={() =>
                                                                            setActiveVersionIds(
                                                                                (
                                                                                    currentIds
                                                                                ) => ({
                                                                                    ...currentIds,

                                                                                    [thumbnail._id]:
                                                                                        version._id,
                                                                                })
                                                                            )
                                                                        }
                                                                        className={`w-27 shrink-0 overflow-hidden rounded-lg border text-left transition ${isActive
                                                                            ? "border-pink-500 ring-2 ring-pink-500/20"
                                                                            : "border-white/10 hover:border-white/25"
                                                                            }`}
                                                                    >
                                                                        <div className="relative aspect-video overflow-hidden bg-black">
                                                                            <Image
                                                                                src={
                                                                                    version.image_url
                                                                                }
                                                                                alt={`${presentation.label} version ${version.version_number}`}
                                                                                fill
                                                                                sizes="108px"
                                                                                className="object-cover"
                                                                            />

                                                                            {isCurrent && (
                                                                                <div className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                                                                                    <CheckCircle2Icon
                                                                                        aria-hidden="true"
                                                                                        className="size-3.5"
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>

                                                                        <div className="space-y-0.5 px-2 py-1.5">
                                                                            <p className="truncate text-[10px] font-medium text-zinc-200">
                                                                                {
                                                                                    presentation.shortLabel
                                                                                }
                                                                            </p>

                                                                            <p className="text-[9px] text-zinc-500">
                                                                                Version{" "}
                                                                                {
                                                                                    version.version_number
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </button>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-4 p-4">
                                                    <div>
                                                        <h2 className="line-clamp-2 text-sm font-semibold text-zinc-100">
                                                            {
                                                                activeVersion.title
                                                            }
                                                        </h2>

                                                        <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-400">
                                                            <span className="rounded bg-white/8 px-2 py-0.5">
                                                                {
                                                                    activeVersion.style
                                                                }
                                                            </span>

                                                            <span className="rounded bg-white/8 px-2 py-0.5 capitalize">
                                                                {
                                                                    activeVersion.color_scheme
                                                                }
                                                            </span>

                                                            <span className="rounded bg-white/8 px-2 py-0.5">
                                                                {
                                                                    activeVersion.aspect_ratio
                                                                }
                                                            </span>
                                                        </div>

                                                        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-zinc-500">
                                                            <span>
                                                                {formatThumbnailDate(
                                                                    activeVersion.createdAt ??
                                                                    thumbnail.createdAt
                                                                )}
                                                            </span>

                                                            {isCurrentVersion && (
                                                                <span className="inline-flex items-center gap-1 text-emerald-400">
                                                                    <CheckCircle2Icon
                                                                        aria-hidden="true"
                                                                        className="size-3.5"
                                                                    />

                                                                    Current
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <Link
                                                            href={`/generate/${thumbnail._id}`}
                                                            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/6 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10"
                                                        >
                                                            <ExternalLinkIcon
                                                                aria-hidden="true"
                                                                className="size-3.5"
                                                            />

                                                            Open Editor
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                downloadThumbnail(
                                                                    activeVersion.image_url,
                                                                    activeVersion.title,
                                                                    activeVersion.version_number
                                                                )
                                                            }
                                                            disabled={
                                                                !activeVersion.image_url
                                                            }
                                                            className="flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-white/6 px-3 py-2.5 text-xs font-medium text-zinc-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                        >
                                                            <DownloadIcon
                                                                aria-hidden="true"
                                                                className="size-3.5"
                                                            />

                                                            Download
                                                        </button>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void handleUseVersion(
                                                                thumbnail._id,
                                                                activeVersion
                                                            )
                                                        }
                                                        disabled={
                                                            isCurrentVersion ||
                                                            isSelecting ||
                                                            thumbnail.isGenerating
                                                        }
                                                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-b from-pink-500 to-pink-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:from-pink-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isSelecting ? (
                                                            <>
                                                                <Loader2Icon
                                                                    aria-hidden="true"
                                                                    className="size-4 animate-spin"
                                                                />

                                                                Selecting...
                                                            </>
                                                        ) : isCurrentVersion ? (
                                                            <>
                                                                <CheckCircle2Icon
                                                                    aria-hidden="true"
                                                                    className="size-4"
                                                                />

                                                                Current Version
                                                            </>
                                                        ) : (
                                                            "Use This Version"
                                                        )}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            void handleDelete(
                                                                thumbnail._id
                                                            )
                                                        }
                                                        disabled={
                                                            isDeleting
                                                        }
                                                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-400/20 bg-red-400/5 px-4 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2Icon
                                                                aria-hidden="true"
                                                                className="size-4 animate-spin"
                                                            />
                                                        ) : (
                                                            <TrashIcon
                                                                aria-hidden="true"
                                                                className="size-4"
                                                            />
                                                        )}

                                                        Delete Project
                                                    </button>
                                                </div>
                                            </article>
                                        );
                                    }
                                )}
                            </div>

                            {pagination.totalPages >
                                0 && (
                                    <div className="mt-12 flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-4 sm:flex-row">
                                        <p className="text-xs text-zinc-400">
                                            Showing{" "}
                                            {
                                                pagination.firstItemNumber
                                            }
                                            –
                                            {
                                                pagination.lastItemNumber
                                            }{" "}
                                            of{" "}
                                            {
                                                pagination.totalItems
                                            }{" "}
                                            thumbnail projects
                                        </p>

                                        <div className="flex flex-wrap items-center justify-center gap-2">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage - 1
                                                    )
                                                }
                                                disabled={
                                                    !pagination.hasPreviousPage ||
                                                    isLoading
                                                }
                                                className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                aria-label="Previous page"
                                            >
                                                <ChevronLeftIcon
                                                    aria-hidden="true"
                                                    className="size-4"
                                                />
                                            </button>

                                            {visiblePageNumbers.map(
                                                (
                                                    pageNumber
                                                ) => (
                                                    <button
                                                        key={
                                                            pageNumber
                                                        }
                                                        type="button"
                                                        onClick={() =>
                                                            handlePageChange(
                                                                pageNumber
                                                            )
                                                        }
                                                        disabled={
                                                            isLoading
                                                        }
                                                        aria-current={
                                                            pageNumber ===
                                                                currentPage
                                                                ? "page"
                                                                : undefined
                                                        }
                                                        className={`flex size-9 items-center justify-center rounded-lg border text-xs font-medium transition ${pageNumber ===
                                                            currentPage
                                                            ? "border-pink-500 bg-pink-500 text-white"
                                                            : "border-white/10 bg-white/5 text-zinc-300 hover:bg-white/10"
                                                            } disabled:cursor-not-allowed disabled:opacity-50`}
                                                    >
                                                        {
                                                            pageNumber
                                                        }
                                                    </button>
                                                )
                                            )}

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handlePageChange(
                                                        currentPage + 1
                                                    )
                                                }
                                                disabled={
                                                    !pagination.hasNextPage ||
                                                    isLoading
                                                }
                                                className="flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
                                                aria-label="Next page"
                                            >
                                                <ChevronRightIcon
                                                    aria-hidden="true"
                                                    className="size-4"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                )}
                        </>
                    )}
            </main>
        </>
    );
}