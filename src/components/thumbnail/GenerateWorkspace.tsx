"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
    useEffect,
    useState,
    type ChangeEvent,
} from "react";

import {
    SparklesIcon,
    ZapIcon,
} from "lucide-react";

import toast from "react-hot-toast";

import AspectRatioSelector from "@/components/thumbnail/AspectRatioSelector";
import ColorSchemeSelector from "@/components/thumbnail/ColorSchemeSelector";
import PreviewPanel from "@/components/thumbnail/PreviewPanel";
import ReferenceImageUploader from "@/components/thumbnail/ReferenceImageUploader";
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
    referenceImageCount?: number;
}

type ThumbnailAction =
    | "generate"
    | "regenerate"
    | "enhance";

interface GenerationStatus {
    label: string;
    className: string;
}

interface ThumbnailRequestBody {
    title: string;
    prompt: string;
    style: ThumbnailStyle;
    aspect_ratio: AspectRatio;
    color_scheme: ColorSchemeId;
    text_overlay: boolean;
}

const MAXIMUM_REFERENCE_IMAGES = 3;

const readApiResponse = async (
    response: Response
): Promise<ThumbnailApiResponse> => {
    try {
        return (await response.json()) as ThumbnailApiResponse;
    } catch {
        return {
            success: false,
            message:
                "Invalid response from the server",
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

const getGenerationStatus = (
    thumbnail: Thumbnail | null
): GenerationStatus | null => {
    if (!thumbnail?.image_url) {
        return null;
    }

    if (
        thumbnail.generation_mode ===
        "pro_enhance"
    ) {
        return {
            label: "Premium Enhanced",
            className:
                "border-amber-400/30 bg-amber-400/10 text-amber-300",
        };
    }

    if (
        thumbnail.generation_mode ===
        "flash_regenerate"
    ) {
        return {
            label: "Regenerated",
            className:
                "border-sky-400/30 bg-sky-400/10 text-sky-300",
        };
    }

    if (
        thumbnail.generation_mode ===
        "flash_generate"
    ) {
        return {
            label: "First Generation",
            className:
                "border-pink-400/30 bg-pink-400/10 text-pink-300",
        };
    }

    return {
        label: "Generated",
        className:
            "border-white/15 bg-white/8 text-zinc-300",
    };
};

const getSuccessMessage = (
    action: ThumbnailAction
): string => {
    if (action === "regenerate") {
        return "Thumbnail regenerated successfully";
    }

    if (action === "enhance") {
        return "Premium enhancement completed successfully";
    }

    return "Thumbnail generated successfully";
};

export default function GenerateWorkspace({
    thumbnailId,
}: GenerateWorkspaceProps) {
    const router = useRouter();

    const {
        isLoggedIn,
        isAuthLoading,
    } = useAuth();

    const isEditMode =
        Boolean(thumbnailId);

    const [title, setTitle] =
        useState("");

    const [
        additionalDetails,
        setAdditionalDetails,
    ] = useState("");

    const [thumbnail, setThumbnail] =
        useState<Thumbnail | null>(null);

    const [
        referenceImages,
        setReferenceImages,
    ] = useState<File[]>([]);

    const [
        isFetchingThumbnail,
        setIsFetchingThumbnail,
    ] = useState(Boolean(thumbnailId));

    const [
        activeAction,
        setActiveAction,
    ] = useState<ThumbnailAction | null>(
        null
    );

    const [aspectRatio, setAspectRatio] =
        useState<AspectRatio>("16:9");

    const [
        colorSchemeId,
        setColorSchemeId,
    ] = useState<ColorSchemeId>(
        "vibrant"
    );

    const [style, setStyle] =
        useState<ThumbnailStyle>(
            "Bold & Graphic"
        );

    const [
        isStyleDropdownOpen,
        setIsStyleDropdownOpen,
    ] = useState(false);

    const isSubmitting =
        activeAction !== null;

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

        setStyle(
            currentThumbnail.style
        );
    };

    useEffect(() => {
        if (!thumbnailId) {
            setThumbnail(null);
            setReferenceImages([]);
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

                if (
                    data.thumbnail.isGenerating
                ) {
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

    const createRequestBody =
        (): ThumbnailRequestBody => {
            return {
                title: title.trim(),

                prompt:
                    additionalDetails.trim(),

                style,

                aspect_ratio:
                    aspectRatio,

                color_scheme:
                    colorSchemeId,

                text_overlay: true,
            };
        };

    const createJsonRequestOptions = (
        requestBody: ThumbnailRequestBody
    ): RequestInit => {
        return {
            method: "POST",
            credentials: "include",

            headers: {
                "Content-Type":
                    "application/json",
            },

            body: JSON.stringify(
                requestBody
            ),
        };
    };

    /*
     * Generate with references এবং
     * Premium Enhance—দুটির জন্যই
     * multipart/form-data request।
     *
     * Browser নিজে boundary-সহ Content-Type
     * তৈরি করবে, তাই manual header নেই।
     */
    const createReferenceRequestOptions = (
        requestBody: ThumbnailRequestBody
    ): RequestInit => {
        const formData =
            new FormData();

        formData.append(
            "input",
            JSON.stringify(
                requestBody
            )
        );

        referenceImages.forEach(
            (referenceImage) => {
                formData.append(
                    "referenceImages",
                    referenceImage
                );
            }
        );

        return {
            method: "POST",
            credentials: "include",
            body: formData,
        };
    };

    const getRequestOptions = (
        action: ThumbnailAction,
        requestBody: ThumbnailRequestBody
    ): RequestInit => {
        /*
         * Premium Enhance সবসময় FormData ব্যবহার
         * করবে, কারণ backend request.formData()
         * দিয়ে input গ্রহণ করে।
         */
        if (action === "enhance") {
            return createReferenceRequestOptions(
                requestBody
            );
        }

        /*
         * প্রথম Generate-এর সময় reference image
         * থাকলে FormData পাঠানো হবে।
         */
        if (
            action === "generate" &&
            referenceImages.length > 0
        ) {
            return createReferenceRequestOptions(
                requestBody
            );
        }

        /*
         * Image ছাড়া Generate এবং Regenerate
         * JSON request ব্যবহার করবে।
         */
        return createJsonRequestOptions(
            requestBody
        );
    };

    const handleAction = async (
        action: ThumbnailAction
    ) => {
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

        if (
            referenceImages.length >
            MAXIMUM_REFERENCE_IMAGES
        ) {
            toast.error(
                "A maximum of 3 reference images is allowed"
            );

            return;
        }

        if (
            action === "enhance" &&
            referenceImages.length === 0 &&
            !thumbnail?.image_url
        ) {
            toast.error(
                "Upload a reference image or generate a thumbnail first"
            );

            return;
        }

        let endpoint =
            "/api/thumbnails/generate";

        if (
            action === "regenerate" &&
            thumbnailId
        ) {
            endpoint =
                `/api/thumbnails/${thumbnailId}/regenerate`;
        }

        if (
            action === "enhance" &&
            thumbnailId
        ) {
            endpoint =
                `/api/thumbnails/${thumbnailId}/enhance`;
        }

        const requestBody =
            createRequestBody();

        const requestOptions =
            getRequestOptions(
                action,
                requestBody
            );

        setActiveAction(action);

        try {
            const response = await fetch(
                endpoint,
                requestOptions
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
                    "Unable to process thumbnail"
                );
            }

            applyThumbnailToForm(
                data.thumbnail
            );

            /*
             * Uploaded reference imageগুলো request
             * complete হওয়ার পরে clear হবে।
             */
            if (
                action === "generate" ||
                action === "enhance"
            ) {
                setReferenceImages([]);
            }

            toast.success(
                getSuccessMessage(action)
            );

            if (action === "generate") {
                router.push(
                    `/generate/${data.thumbnail._id}`
                );
            } else {
                router.refresh();
            }
        } catch (error: unknown) {
            console.error(
                `${action} thumbnail failed:`,
                error
            );

            toast.error(
                getErrorMessage(error)
            );
        } finally {
            setActiveAction(null);
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

    const generationStatus =
        getGenerationStatus(thumbnail);

    const canEnhance =
        referenceImages.length > 0 ||
        Boolean(thumbnail?.image_url);

    return (
        <>
            <SoftBackdrop />

            <div className="relative z-10 min-h-screen pt-24">
                <main className="mx-auto max-w-6xl px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:pb-8">
                    <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
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
                                            ? "Update the details, create a fresh version, or polish the current result."
                                            : "Describe your idea, optionally add visual references, and generate a professional thumbnail."}
                                    </p>
                                </div>

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
                                        onChange={
                                            handleTitleChange
                                        }
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
                                        value={
                                            additionalDetails
                                        }
                                        onChange={
                                            handleDetailsChange
                                        }
                                        rows={6}
                                        placeholder="Add specific subjects, mood, layout, text placement, corrections or reference-image instructions..."
                                        className="w-full resize-none rounded-lg border border-white/10 bg-white/6 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-400 focus:ring-2 focus:ring-pink-500"
                                    />
                                </div>

                                {/*
                 * Uploader এখন Create এবং Edit—
                 * দুই mode-এই দেখা যাবে।
                 */}
                                <div className="space-y-2">
                                    {!isEditMode && (
                                        <div className="rounded-lg border border-sky-400/20 bg-sky-400/8 px-3 py-2.5 text-xs leading-5 text-sky-200">
                                            Optional: upload your own
                                            photo, product, background,
                                            or other visual references
                                            before generating. The first
                                            image will be the primary
                                            reference.
                                        </div>
                                    )}

                                    {isEditMode && (
                                        <div className="rounded-lg border border-amber-400/20 bg-amber-400/8 px-3 py-2.5 text-xs leading-5 text-amber-200">
                                            These reference images are
                                            used by Premium Enhance.
                                            Leave this empty to enhance
                                            the current thumbnail.
                                        </div>
                                    )}

                                    <ReferenceImageUploader
                                        files={referenceImages}
                                        onChange={
                                            setReferenceImages
                                        }
                                        maximumFiles={
                                            MAXIMUM_REFERENCE_IMAGES
                                        }
                                        disabled={
                                            isSubmitting ||
                                            isFetchingThumbnail
                                        }
                                    />
                                </div>

                                {!isEditMode && (
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleAction(
                                                    "generate"
                                                )
                                            }
                                            disabled={
                                                isSubmitting ||
                                                isFetchingThumbnail ||
                                                isAuthLoading
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 py-3.5 text-[15px] font-medium text-white transition hover:from-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <ZapIcon
                                                aria-hidden="true"
                                                className="size-4"
                                            />

                                            {activeAction ===
                                                "generate"
                                                ? "Generating..."
                                                : "Generate Thumbnail"}
                                        </button>

                                        <div className="rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-zinc-400">
                                            {referenceImages.length > 0 ? (
                                                <p>
                                                    Generating with{" "}
                                                    <span className="font-medium text-zinc-200">
                                                        {referenceImages.length}{" "}
                                                        reference image
                                                        {referenceImages.length ===
                                                            1
                                                            ? ""
                                                            : "s"}
                                                    </span>
                                                    . The first image will guide
                                                    the main subject and visual
                                                    direction.
                                                </p>
                                            ) : (
                                                <p>
                                                    No reference image selected.
                                                    The thumbnail will be created
                                                    entirely from your title,
                                                    settings, and prompt.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {isEditMode && (
                                    <div className="space-y-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleAction(
                                                    "regenerate"
                                                )
                                            }
                                            disabled={
                                                isSubmitting ||
                                                isFetchingThumbnail ||
                                                isAuthLoading
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 py-3.5 text-[15px] font-medium text-white transition hover:from-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <ZapIcon
                                                aria-hidden="true"
                                                className="size-4"
                                            />

                                            {activeAction ===
                                                "regenerate"
                                                ? "Regenerating..."
                                                : "Regenerate Thumbnail"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                void handleAction(
                                                    "enhance"
                                                )
                                            }
                                            disabled={
                                                isSubmitting ||
                                                isFetchingThumbnail ||
                                                isAuthLoading ||
                                                !canEnhance
                                            }
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-amber-300 to-yellow-500 py-3.5 text-[15px] font-semibold text-zinc-950 transition hover:from-amber-200 hover:to-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <SparklesIcon
                                                aria-hidden="true"
                                                className="size-4"
                                            />

                                            {activeAction ===
                                                "enhance"
                                                ? "Enhancing..."
                                                : "Premium Enhance"}
                                        </button>

                                        <div className="space-y-2 rounded-lg border border-white/10 bg-black/20 p-3 text-xs leading-5 text-zinc-400">
                                            <p>
                                                <span className="font-medium text-zinc-200">
                                                    Regenerate:
                                                </span>{" "}
                                                Create a completely fresh
                                                version using your updated
                                                title, style, colors and
                                                instructions.
                                            </p>

                                            <p>
                                                <span className="font-medium text-amber-300">
                                                    Premium Enhance:
                                                </span>{" "}
                                                Upload up to three reference
                                                images. The first image guides
                                                the main composition, while
                                                the others provide supporting
                                                visual details.
                                            </p>

                                            <p>
                                                When no reference image is
                                                uploaded, the current
                                                thumbnail will be used
                                                automatically.
                                            </p>
                                        </div>
                                    </div>
                                )}
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

                        <div>
                            <div className="rounded-2xl border border-white/10 bg-white/8 p-6 shadow-xl">
                                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                                    <h2 className="text-lg font-semibold text-zinc-100">
                                        Preview
                                    </h2>

                                    {generationStatus && (
                                        <span
                                            className={`rounded-full border px-3 py-1 text-xs ${generationStatus.className}`}
                                        >
                                            {generationStatus.label}
                                        </span>
                                    )}
                                </div>

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