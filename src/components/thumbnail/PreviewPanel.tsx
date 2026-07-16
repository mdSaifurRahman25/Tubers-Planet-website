"use client";

import Image from "next/image";
import {
    DownloadIcon,
    ImageIcon,
    Loader2Icon,
} from "lucide-react";

import type {
    AspectRatio,
    Thumbnail,
} from "@/types/thumbnail.types";

interface PreviewPanelProps {
    thumbnail: Thumbnail | null;
    isLoading: boolean;
    aspectRatio: AspectRatio;
}

const aspectClasses: Record<AspectRatio, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
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

export default function PreviewPanel({
    thumbnail,
    isLoading,
    aspectRatio,
}: PreviewPanelProps) {
    const imageUrl = thumbnail?.image_url;

    const downloadUrl = imageUrl
        ? createDownloadUrl(imageUrl)
        : null;

    return (
        <div className="relative mx-auto w-full max-w-2xl">
            <div
                className={`relative overflow-hidden ${aspectClasses[aspectRatio]}`}
            >
                {/* Loading state */}
                {isLoading && (
                    <div
                        role="status"
                        aria-live="polite"
                        className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-black/25"
                    >
                        <Loader2Icon
                            aria-hidden="true"
                            className="size-8 animate-spin text-zinc-400"
                        />

                        <div className="text-center">
                            <p className="text-sm font-medium text-zinc-200">
                                AI is creating your thumbnail...
                            </p>

                            <p className="mt-1 text-xs text-zinc-400">
                                This may take 10–20 seconds
                            </p>
                        </div>
                    </div>
                )}

                {/* Generated image */}
                {!isLoading && imageUrl && (
                    <div className="group relative h-full w-full">
                        <Image
                            src={imageUrl}
                            alt={
                                thumbnail.title ||
                                "Generated thumbnail"
                            }
                            fill
                            priority
                            sizes="(max-width: 1024px) 100vw, 672px"
                            className="object-cover"
                        />

                        <div className="absolute inset-0 flex items-end justify-center bg-black/10 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                            {downloadUrl && (
                                <a
                                    href={downloadUrl}
                                    download={createDownloadFilename(
                                        thumbnail.title
                                    )}
                                    aria-label={`Download ${thumbnail.title} thumbnail`}
                                    className="mb-6 flex items-center gap-2 rounded-md bg-white/30 px-5 py-2.5 text-xs font-medium text-white ring-2 ring-white/40 backdrop-blur transition hover:scale-105 active:scale-95"
                                >
                                    <DownloadIcon
                                        aria-hidden="true"
                                        className="size-4"
                                    />

                                    Download Thumbnail
                                </a>
                            )}
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!isLoading && !imageUrl && (
                    <div className="absolute inset-0 m-2 flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-white/20 bg-black/25">
                        <div className="hidden size-20 items-center justify-center rounded-full bg-white/10 sm:flex">
                            <ImageIcon
                                aria-hidden="true"
                                className="size-10 text-white opacity-50"
                            />
                        </div>

                        <div className="px-4 text-center">
                            <p className="font-medium text-zinc-200">
                                Generate your first thumbnail
                            </p>

                            <p className="mt-1 text-xs text-zinc-400">
                                Fill out the form and click Generate
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}