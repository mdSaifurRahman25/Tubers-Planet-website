"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import AspectRatioSelector from "@/components/thumbnail/AspectRatioSelector";
import ColorSchemeSelector from "@/components/thumbnail/ColorSchemeSelector";
import PreviewPanel from "@/components/thumbnail/PreviewPanel";
import StyleSelector from "@/components/thumbnail/StyleSelector";
import SoftBackdrop from "@/components/ui/SoftBackdrop";
import { useAuth } from "@/context/AuthContext";
import { colorSchemes } from "@/data/thumbnail-options";
import type {
    AspectRatio,
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

const getErrorMessage = (error: unknown): string => {
    return error instanceof Error
        ? error.message
        : "Something went wrong";
};

export default function GenerateWorkspace({
    thumbnailId,
}: GenerateWorkspaceProps) {
    const router = useRouter();

    const {
        isLoggedIn,
        isAuthLoading,
    } = useAuth();

    const [title, setTitle] = useState("");
    const [additionalDetails, setAdditionalDetails] =
        useState("");

    const [thumbnail, setThumbnail] =
        useState<Thumbnail | null>(null);

    const [isLoading, setIsLoading] =
        useState(Boolean(thumbnailId));

    const [aspectRatio, setAspectRatio] =
        useState<AspectRatio>("16:9");

    const [colorSchemeId, setColorSchemeId] =
        useState(colorSchemes[0]?.id ?? "");

    const [style, setStyle] =
        useState<ThumbnailStyle>("Bold & Graphic");

    const [
        isStyleDropdownOpen,
        setIsStyleDropdownOpen,
    ] = useState(false);

    const handleGenerate = async () => {
        if (isAuthLoading || isLoading) {
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

        setIsLoading(true);

        try {
            const response = await fetch(
                "/api/thumbnails/generate",
                {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        title: title.trim(),
                        prompt: additionalDetails.trim(),
                        style,
                        aspect_ratio: aspectRatio,
                        color_scheme: colorSchemeId,
                        text_overlay: true,
                    }),
                }
            );

            const data = await readApiResponse(response);

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

            toast.success(data.message);

            router.push(
                `/generate/${data.thumbnail._id}`
            );
        } catch (error) {
            console.error(
                "Thumbnail generation failed:",
                error
            );

            toast.error(getErrorMessage(error));
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!thumbnailId) {
            setThumbnail(null);
            setIsLoading(false);
            return;
        }

        if (isAuthLoading) {
            return;
        }

        if (!isLoggedIn) {
            setIsLoading(false);
            return;
        }

        let isActive = true;

        let pollingTimeout:
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
                        "Unable to load thumbnail"
                    );
                }

                if (!isActive) {
                    return;
                }

                const currentThumbnail =
                    data.thumbnail;

                setThumbnail(currentThumbnail);
                setTitle(currentThumbnail.title);
                setAdditionalDetails(
                    currentThumbnail.user_prompt ?? ""
                );
                setColorSchemeId(
                    currentThumbnail.color_scheme
                );
                setAspectRatio(
                    currentThumbnail.aspect_ratio
                );
                setStyle(currentThumbnail.style);

                const isStillGenerating =
                    !currentThumbnail.image_url;

                setIsLoading(isStillGenerating);

                if (isStillGenerating) {
                    pollingTimeout = setTimeout(
                        fetchThumbnail,
                        5000
                    );
                }
            } catch (error) {
                if (!isActive) {
                    return;
                }

                console.error(
                    "Unable to fetch thumbnail:",
                    error
                );

                toast.error(getErrorMessage(error));
                setIsLoading(false);
            }
        };

        setIsLoading(true);
        void fetchThumbnail();

        return () => {
            isActive = false;

            if (pollingTimeout) {
                clearTimeout(pollingTimeout);
            }
        };
    }, [
        thumbnailId,
        isAuthLoading,
        isLoggedIn,
    ]);

    const handleTitleChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        setTitle(event.target.value);
    };

    const handleDetailsChange = (
        event: ChangeEvent<HTMLTextAreaElement>
    ) => {
        setAdditionalDetails(event.target.value);
    };

    return (
        <>
            <SoftBackdrop />

            <div className="relative z-10 min-h-screen pt-24">
                <main className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:pb-8">
                    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
                        {/* Left panel */}
                        <fieldset
                            disabled={Boolean(thumbnailId)}
                            className={
                                thumbnailId
                                    ? "space-y-6 opacity-80"
                                    : "space-y-6"
                            }
                        >
                            <div className="space-y-6 rounded-2xl border border-white/12 bg-white/8 p-6 shadow-xl">
                                <div>
                                    <h1 className="mb-1 text-xl font-bold text-zinc-100">
                                        Create Your Thumbnail
                                    </h1>

                                    <p className="text-sm text-zinc-400">
                                        Describe your vision and let AI
                                        bring it to life
                                    </p>
                                </div>

                                {/* Title */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="thumbnail-title"
                                        className="block text-sm font-medium"
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
                                    isOpen={isStyleDropdownOpen}
                                    setIsOpen={
                                        setIsStyleDropdownOpen
                                    }
                                />

                                <ColorSchemeSelector
                                    value={colorSchemeId}
                                    onChange={setColorSchemeId}
                                />

                                {/* Additional prompt */}
                                <div className="space-y-2">
                                    <label
                                        htmlFor="additional-details"
                                        className="block text-sm font-medium"
                                    >
                                        Additional Prompts{" "}
                                        <span className="text-xs text-zinc-400">
                                            (optional)
                                        </span>
                                    </label>

                                    <textarea
                                        id="additional-details"
                                        value={additionalDetails}
                                        onChange={handleDetailsChange}
                                        rows={3}
                                        placeholder="Add any specific elements, mood, or style preferences..."
                                        className="w-full resize-none rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                {!thumbnailId && (
                                    <button
                                        type="button"
                                        onClick={handleGenerate}
                                        disabled={
                                            isLoading || isAuthLoading
                                        }
                                        className="w-full rounded-xl bg-linear-to-b from-pink-500 to-pink-600 py-3.5 text-[15px] font-medium text-white transition-colors hover:from-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {isLoading
                                            ? "Generating..."
                                            : "Generate Thumbnail"}
                                    </button>
                                )}
                            </div>
                        </fieldset>

                        {/* Right panel */}
                        <div>
                            <div className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-xl">
                                <h2 className="mb-4 text-lg font-semibold text-zinc-100">
                                    Preview
                                </h2>

                                <PreviewPanel
                                    thumbnail={thumbnail}
                                    isLoading={isLoading}
                                    aspectRatio={aspectRatio}
                                />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}