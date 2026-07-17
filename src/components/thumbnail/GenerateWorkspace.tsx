"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useState,
    type ChangeEvent,
} from "react";
import toast from "react-hot-toast";

import AspectRatioSelector from "@/components/thumbnail/AspectRatioSelector";
import ColorSchemeSelector from "@/components/thumbnail/ColorSchemeSelector";
import PreviewPanel from "@/components/thumbnail/PreviewPanel";
import StyleSelector from "@/components/thumbnail/StyleSelector";
import SoftBackdrop from "@/components/ui/SoftBackdrop";
import { useAuth } from "@/context/AuthContext";

import type {
    AspectRatio,
    ColorSchemeId,
    Thumbnail,
    ThumbnailStyle,
} from "@/types/thumbnail.types";

interface GenerateWorkspaceProps {
    thumbnailId?: string;
}

interface ThumbnailApiResponse {
    success: boolean;
    message: string;
    thumbnail?: Thumbnail;
}

const readApiResponse = async (
    response: Response
): Promise<ThumbnailApiResponse> => {
    try {
        return (await response.json()) as ThumbnailApiResponse;
    } catch {
        return {
            success: false,
            message: "Invalid response from the server",
        };
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

export default function GenerateWorkspace({
    thumbnailId,
}: GenerateWorkspaceProps) {
    const router = useRouter();

    const {
        isLoggedIn,
        isAuthLoading,
    } = useAuth();

    const isEditMode = Boolean(thumbnailId);

    const [title, setTitle] = useState("");

    const [
        additionalDetails,
        setAdditionalDetails,
    ] = useState("");

    const [thumbnail, setThumbnail] =
        useState<Thumbnail | null>(null);

    const [
        isFetchingThumbnail,
        setIsFetchingThumbnail,
    ] = useState(Boolean(thumbnailId));

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [aspectRatio, setAspectRatio] =
        useState<AspectRatio>("16:9");

    const [
        colorSchemeId,
        setColorSchemeId,
    ] = useState<ColorSchemeId>("vibrant");

    const [style, setStyle] =
        useState<ThumbnailStyle>(
            "Bold & Graphic"
        );

    const [
        isStyleDropdownOpen,
        setIsStyleDropdownOpen,
    ] = useState(false);

    const applyThumbnailToForm = (
        currentThumbnail: Thumbnail
    ) => {
        setThumbnail(currentThumbnail);

        setTitle(
            currentThumbnail.title ?? ""
        );

        setAdditionalDetails(
            currentThumbnail.user_prompt ?? ""
        );

        setAspectRatio(
            currentThumbnail.aspect_ratio
        );

        setColorSchemeId(
            currentThumbnail.color_scheme
        );

        setStyle(currentThumbnail.style);
    };

    useEffect(() => {
        if (!thumbnailId) {
            setThumbnail(null);
            setIsFetchingThumbnail(false);
            return;
        }

        if (isAuthLoading) {
            return;
        }

        if (!isLoggedIn) {
            setIsFetchingThumbnail(false);

            router.replace(
                `/login?next=/generate/${thumbnailId}`
            );

            return;
        }

        let isActive = true;

        let pollingTimer:
            | ReturnType<typeof setTimeout>
            | undefined;

        const fetchThumbnail = async () => {
            try {
                const response = await fetch(
                    `/api/thumbnails/${thumbnailId}`,
                    {
                        method: "GET",
                        credentials: "include",
                        cache: "no-store",
                    }
                );

                const data =
                    await readApiResponse(response);

                if (
                    !response.ok ||
                    !data.success ||
                    !data.thumbnail
                ) {
                    throw new Error(
                        data.message ||
                        "Unable to fetch thumbnail"
                    );
                }

                if (!isActive) {
                    return;
                }

                applyThumbnailToForm(
                    data.thumbnail
                );

                setIsFetchingThumbnail(false);

                if (data.thumbnail.isGenerating) {
                    pollingTimer = setTimeout(
                        fetchThumbnail,
                        5000
                    );
                }
            } catch (error: unknown) {
                if (!isActive) {
                    return;
                }

                console.error(
                    "Unable to fetch thumbnail:",
                    error
                );

                toast.error(
                    getErrorMessage(error)
                );

                setIsFetchingThumbnail(false);
            }
        };

        setIsFetchingThumbnail(true);

        void fetchThumbnail();

        return () => {
            isActive = false;

            if (pollingTimer) {
                clearTimeout(pollingTimer);
            }
        };
    }, [
        thumbnailId,
        isAuthLoading,
        isLoggedIn,
        router,
    ]);

    const handleSubmit = async () => {
        if (
            isSubmitting ||
            isFetchingThumbnail ||
            isAuthLoading
        ) {
            return;
        }

        if (!isLoggedIn) {
            toast.error(
                "Please log in to generate thumbnails"
            );

            router.push("/login");
            return;
        }

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }

        const endpoint =
            thumbnailId
                ? `/api/thumbnails/${thumbnailId}/regenerate`
                : "/api/thumbnails/generate";

        setIsSubmitting(true);

        try {
            const response = await fetch(
                endpoint,
                {
                    method: "POST",
                    credentials: "include",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        title: title.trim(),

                        prompt:
                            additionalDetails.trim(),

                        style,

                        aspect_ratio:
                            aspectRatio,

                        color_scheme:
                            colorSchemeId,

                        text_overlay: true,
                    }),
                }
            );

            const data =
                await readApiResponse(response);

            if (
                !response.ok ||
                !data.success ||
                !data.thumbnail
            ) {
                throw new Error(
                    data.message ||
                    "Unable to generate thumbnail"
                );
            }

            applyThumbnailToForm(
                data.thumbnail
            );

            toast.success(data.message);

            if (!thumbnailId) {
                router.push(
                    `/generate/${data.thumbnail._id}`
                );
            } else {
                router.refresh();
            }
        } catch (error: unknown) {
            console.error(
                isEditMode
                    ? "Thumbnail regeneration failed:"
                    : "Thumbnail generation failed:",
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleTitleChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(event.target.value);
    };

    const handleDetailsChange = (
        event: ChangeEvent<HTMLTextAreaElement>
    ) => {
        setAdditionalDetails(
            event.target.value
        );
    };

    const isPreviewLoading =
        isFetchingThumbnail ||
        isSubmitting ||
        Boolean(thumbnail?.isGenerating);

    return (
        <>
            <SoftBackdrop />

            <div className="relative z-10 min-h-screen pt-24">
                <main className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:pb-8">
                    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
                        {/* Left panel */}
                        <div className="space-y-4">
                            <fieldset
                                disabled={
                                    isFetchingThumbnail ||
                                    isSubmitting
                                }
                                className="space-y-6 rounded-2xl border border-white/12 bg-white/8 p-6 shadow-xl disabled:opacity-70"
                            >
                                <div>
                                    <h1 className="mb-1 text-xl font-bold text-zinc-100">
                                        {isEditMode
                                            ? "Edit Your Thumbnail"
                                            : "Create Your Thumbnail"}
                                    </h1>

                                    <p className="text-sm text-zinc-400">
                                        {isEditMode
                                            ? "Update the details and regenerate a new version"
                                            : "Describe your vision and let AI bring it to life"}
                                    </p>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="thumbnail-title"
                                        className="block text-sm font-medium text-zinc-200"
                                    >
                                        Title &amp; Topic
                                    </label>

                                    <input
                                        id="thumbnail-title"
                                        type="text"
                                        value={title}
                                        onChange={handleTitleChange}
                                        maxLength={100}
                                        placeholder="e.g., 10 Tips for Better Sleep"
                                        className="w-full rounded-lg border border-white/12 bg-black/20 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-pink-500"
                                    />

                                    <div className="flex justify-end">
                                        <span className="text-xs text-zinc-400">
                                            {title.length}/100
                                        </span>
                                    </div>
                                </div>

                                <AspectRatioSelector
                                    value={aspectRatio}
                                    onChange={setAspectRatio}
                                />

                                <StyleSelector
                                    value={style}
                                    onChange={setStyle}
                                    isOpen={
                                        isStyleDropdownOpen
                                    }
                                    setIsOpen={
                                        setIsStyleDropdownOpen
                                    }
                                />

                                <ColorSchemeSelector
                                    value={colorSchemeId}
                                    onChange={
                                        setColorSchemeId
                                    }
                                />

                                {/* Additional prompt */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="additional-details"
                                        className="block text-sm font-medium text-zinc-200"
                                    >
                                        Additional Prompts{" "}
                                        <span className="text-xs text-zinc-400">
                                            (optional)
                                        </span>
                                    </label>

                                    <textarea
                                        id="additional-details"
                                        value={additionalDetails}
                                        onChange={
                                            handleDetailsChange
                                        }
                                        rows={5}
                                        placeholder="Add any specific elements, mood, or style preferences..."
                                        className="w-full resize-none rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={
                                        isSubmitting ||
                                        isFetchingThumbnail ||
                                        isAuthLoading
                                    }
                                    className="w-full rounded-xl bg-linear-to-b from-pink-500 to-pink-600 py-3.5 text-[15px] font-medium text-white transition hover:from-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {isSubmitting
                                        ? isEditMode
                                            ? "Regenerating..."
                                            : "Generating..."
                                        : isEditMode
                                            ? "Regenerate Thumbnail"
                                            : "Generate Thumbnail"}
                                </button>
                            </fieldset>

                            {isEditMode && (
                                <Link
                                    href="/generate"
                                    className="flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                >
                                    Create a New Thumbnail
                                </Link>
                            )}
                        </div>

                        {/* Right panel */}
                        <div>
                            <div className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-xl">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                                    Preview
                                </h2>

                                <PreviewPanel
                                    thumbnail={thumbnail}
                                    isLoading={
                                        isPreviewLoading
                                    }
                                    aspectRatio={
                                        aspectRatio
                                    }
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}