"use client";

import Image from "next/image";
import Link from "next/link";
import {
    useEffect,
    useState,
} from "react";
import { useRouter } from "next/navigation";
import {
    DownloadIcon,
    Loader2Icon,
    TrashIcon,
} from "lucide-react";
import toast from "react-hot-toast";

import SoftBackdrop from "@/components/ui/SoftBackdrop";
import { useAuth } from "@/context/AuthContext";

import type {
    AspectRatio,
    Thumbnail,
} from "@/types/thumbnail.types";

interface ThumbnailsApiResponse {
    success: boolean;
    message: string;
    thumbnails?: Thumbnail[];
}

interface DeleteThumbnailResponse {
    success: boolean;
    message: string;
}

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

    if (Number.isNaN(date.getTime())) {
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
        const url = new URL(imageUrl);

        url.protocol = "https:";

        if (
            url.hostname === "res.cloudinary.com" &&
            url.pathname.includes("/upload/") &&
            !url.pathname.includes(
                "/upload/fl_attachment/"
            )
        ) {
            url.pathname = url.pathname.replace(
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
    title: string
): string => {
    const safeTitle = title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `${safeTitle || "thumbnail"}.jpg`;
};

const downloadThumbnail = (
    imageUrl: string,
    title: string
) => {
    const link =
        document.createElement("a");

    link.href =
        createDownloadUrl(imageUrl);

    link.download =
        createDownloadFilename(title);

    link.rel = "noopener noreferrer";

    document.body.appendChild(link);
    link.click();
    link.remove();
};

export default function MyGenerationGallery() {
    const router = useRouter();

    const {
        isLoggedIn,
        isAuthLoading,
    } = useAuth();

    const [thumbnails, setThumbnails] =
        useState<Thumbnail[]>([]);

    const [isLoading, setIsLoading] =
        useState(true);

    const [
        deletingThumbnailId,
        setDeletingThumbnailId,
    ] = useState<string | null>(null);

    useEffect(() => {
        if (isAuthLoading) {
            return;
        }

        if (!isLoggedIn) {
            setIsLoading(false);

            router.replace(
                "/login?next=/my-generation"
            );

            return;
        }

        const controller =
            new AbortController();

        const fetchThumbnails = async () => {
            try {
                setIsLoading(true);

                const response = await fetch(
                    "/api/thumbnails",
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                        signal: controller.signal,
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

                if (!response.ok || !data.success) {
                    throw new Error(
                        data.message ||
                        "Unable to fetch thumbnails"
                    );
                }

                setThumbnails(
                    data.thumbnails ?? []
                );
            } catch (error: unknown) {
                if (
                    error instanceof DOMException &&
                    error.name === "AbortError"
                ) {
                    return;
                }

                console.error(
                    "Fetching thumbnails failed:",
                    error
                );

                toast.error(
                    getErrorMessage(error)
                );
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void fetchThumbnails();

        return () => {
            controller.abort();
        };
    }, [
        isAuthLoading,
        isLoggedIn,
        router,
    ]);

    const handleDelete = async (
        thumbnailId: string
    ) => {
        const shouldDelete =
            window.confirm(
                "Are you sure you want to delete this thumbnail?"
            );

        if (!shouldDelete) {
            return;
        }

        try {
            setDeletingThumbnailId(
                thumbnailId
            );

            const response = await fetch(
                `/api/thumbnails/${thumbnailId}`,
                {
                    method: "DELETE",
                    credentials: "include",
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

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message ||
                    "Unable to delete thumbnail"
                );
            }

            setThumbnails(
                (currentThumbnails) =>
                    currentThumbnails.filter(
                        (thumbnail) =>
                            thumbnail._id !==
                            thumbnailId
                    )
            );

            toast.success(data.message);
        } catch (error: unknown) {
            console.error(
                "Deleting thumbnail failed:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setDeletingThumbnailId(null);
        }
    };

    return (
        <>
            <SoftBackdrop />

            <main className="relative z-10 min-h-screen px-6 pt-32 pb-20 md:px-16 lg:px-24 xl:px-32">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-zinc-200">
                        My Generations
                    </h1>

                    <p className="mt-1 text-sm text-zinc-400">
                        View and manage all your
                        AI-generated thumbnails
                    </p>
                </header>

                {(isLoading ||
                    isAuthLoading) && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {Array.from({
                                length: 6,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-65 animate-pulse rounded-2xl border border-white/10 bg-white/6"
                                />
                            ))}
                        </div>
                    )}

                {!isLoading &&
                    !isAuthLoading &&
                    thumbnails.length === 0 && (
                        <div className="py-24 text-center">
                            <h2 className="text-lg font-semibold text-zinc-200">
                                No thumbnails yet
                            </h2>

                            <p className="mt-2 text-sm text-zinc-400">
                                Generate your first thumbnail
                                to see it here.
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
                    thumbnails.length > 0 && (
                        <div className="columns-1 gap-8 sm:columns-2 lg:columns-3 2xl:columns-4">
                            {thumbnails.map(
                                (thumbnail, index) => {
                                    const aspectClass =
                                        aspectRatioClassMap[
                                        thumbnail.aspect_ratio
                                        ];

                                    const isDeleting =
                                        deletingThumbnailId ===
                                        thumbnail._id;

                                    return (
                                        <article
                                            key={thumbnail._id}
                                            className="group relative mb-8 break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-white/6 shadow-xl transition hover:border-white/20"
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.push(
                                                        `/generate/${thumbnail._id}`
                                                    )
                                                }
                                                className="block w-full cursor-pointer text-left"
                                                aria-label={`Open ${thumbnail.title}`}
                                            >
                                                <div
                                                    className={`relative overflow-hidden bg-black ${aspectClass}`}
                                                >
                                                    {thumbnail.image_url ? (
                                                        <Image
                                                            src={
                                                                thumbnail.image_url
                                                            }
                                                            alt={
                                                                thumbnail.title
                                                            }
                                                            fill
                                                            preload={index === 0}
                                                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                                                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-zinc-400">
                                                            {thumbnail.isGenerating
                                                                ? "Generating..."
                                                                : thumbnail.generation_error ||
                                                                "No image"}
                                                        </div>
                                                    )}

                                                    {thumbnail.isGenerating && (
                                                        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 text-sm font-medium text-white">
                                                            <Loader2Icon
                                                                aria-hidden="true"
                                                                className="size-4 animate-spin"
                                                            />

                                                            Generating
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-2 p-4">
                                                    <h2 className="line-clamp-2 text-sm font-semibold text-zinc-100">
                                                        {thumbnail.title}
                                                    </h2>

                                                    <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                                                        <span className="rounded bg-white/8 px-2 py-0.5">
                                                            {thumbnail.style}
                                                        </span>

                                                        <span className="rounded bg-white/8 px-2 py-0.5 capitalize">
                                                            {
                                                                thumbnail.color_scheme
                                                            }
                                                        </span>

                                                        <span className="rounded bg-white/8 px-2 py-0.5">
                                                            {
                                                                thumbnail.aspect_ratio
                                                            }
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-zinc-500">
                                                        {formatThumbnailDate(
                                                            thumbnail.createdAt
                                                        )}
                                                    </p>
                                                </div>
                                            </button>

                                            <div className="absolute right-2 bottom-2 flex gap-1.5 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        void handleDelete(
                                                            thumbnail._id
                                                        )
                                                    }
                                                    disabled={isDeleting}
                                                    title="Delete thumbnail"
                                                    aria-label={`Delete ${thumbnail.title}`}
                                                    className="flex size-7 items-center justify-center rounded bg-black/60 text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
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
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (
                                                            thumbnail.image_url
                                                        ) {
                                                            downloadThumbnail(
                                                                thumbnail.image_url,
                                                                thumbnail.title
                                                            );
                                                        }
                                                    }}
                                                    disabled={
                                                        !thumbnail.image_url
                                                    }
                                                    title="Download thumbnail"
                                                    aria-label={`Download ${thumbnail.title}`}
                                                    className="flex size-7 items-center justify-center rounded bg-black/60 text-white transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    <DownloadIcon
                                                        aria-hidden="true"
                                                        className="size-4"
                                                    />
                                                </button>
                                            </div>
                                        </article>
                                    );
                                }
                            )}
                        </div>
                    )}
            </main>
        </>
    );
}