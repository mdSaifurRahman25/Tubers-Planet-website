"use client";

import Image from "next/image";

import {
    useEffect,
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
    type KeyboardEvent,
} from "react";

import {
    ImagePlusIcon,
    ImagesIcon,
    UploadCloudIcon,
    XIcon,
} from "lucide-react";

import toast from "react-hot-toast";

interface ReferenceImageUploaderProps {
    files: File[];
    onChange: (files: File[]) => void;
    disabled?: boolean;
    maximumFiles?: number;
}

interface PreviewImage {
    file: File;
    url: string;
}

const DEFAULT_MAXIMUM_FILES = 3;

const MAXIMUM_FILE_SIZE =
    10 * 1024 * 1024;

const allowedImageTypes =
    new Set([
        "image/jpeg",
        "image/png",
        "image/webp",
    ]);

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

    return normalized || "";
};

const validateImageFile = (
    file: File
): string | null => {
    const mimeType =
        normalizeMimeType(file.type);

    if (
        !allowedImageTypes.has(
            mimeType
        )
    ) {
        return `${file.name || "Selected file"} must be a JPG, PNG, or WebP image`;
    }

    if (file.size === 0) {
        return `${file.name || "Selected image"} is empty`;
    }

    if (
        file.size >
        MAXIMUM_FILE_SIZE
    ) {
        return `${file.name || "Selected image"} must be smaller than 10 MB`;
    }

    return null;
};

const formatFileSize = (
    size: number
): string => {
    if (size < 1024) {
        return `${size} B`;
    }

    if (
        size <
        1024 * 1024
    ) {
        return `${Math.ceil(
            size / 1024
        )} KB`;
    }

    return `${(
        size /
        (1024 * 1024)
    ).toFixed(1)} MB`;
};

const getFileIdentity = (
    file: File
): string => {
    return [
        file.name,
        file.size,
        file.type,
        file.lastModified,
    ].join("-");
};

export default function ReferenceImageUploader({
    files,
    onChange,
    disabled = false,
    maximumFiles =
    DEFAULT_MAXIMUM_FILES,
}: ReferenceImageUploaderProps) {
    const inputId = useId();

    const inputRef =
        useRef<HTMLInputElement>(null);

    const replaceIndexRef =
        useRef<number | null>(null);

    const [
        previews,
        setPreviews,
    ] = useState<PreviewImage[]>([]);

    const [
        isDragging,
        setIsDragging,
    ] = useState(false);

    const safeMaximumFiles =
        Math.max(
            1,
            Math.min(
                maximumFiles,
                DEFAULT_MAXIMUM_FILES
            )
        );

    const remainingSlots =
        Math.max(
            safeMaximumFiles -
            files.length,
            0
        );

    const hasAvailableSlot =
        remainingSlots > 0;

    useEffect(() => {
        const nextPreviews =
            files.map((file) => ({
                file,
                url:
                    URL.createObjectURL(
                        file
                    ),
            }));

        setPreviews(
            nextPreviews
        );

        return () => {
            nextPreviews.forEach(
                (preview) => {
                    URL.revokeObjectURL(
                        preview.url
                    );
                }
            );
        };
    }, [files]);

    const resetInput = () => {
        if (inputRef.current) {
            inputRef.current.value =
                "";
        }
    };

    const getValidFiles = (
        selectedFiles: File[]
    ): File[] => {
        const validFiles: File[] =
            [];

        selectedFiles.forEach(
            (selectedFile) => {
                const validationError =
                    validateImageFile(
                        selectedFile
                    );

                if (validationError) {
                    toast.error(
                        validationError
                    );

                    return;
                }

                validFiles.push(
                    selectedFile
                );
            }
        );

        return validFiles;
    };

    const addFiles = (
        selectedFiles: File[]
    ) => {
        if (disabled) {
            return;
        }

        if (
            selectedFiles.length === 0
        ) {
            return;
        }

        const validFiles =
            getValidFiles(
                selectedFiles
            );

        if (
            validFiles.length === 0
        ) {
            resetInput();
            return;
        }

        const existingFileIds =
            new Set(
                files.map(
                    getFileIdentity
                )
            );

        const uniqueFiles =
            validFiles.filter(
                (file) => {
                    const identity =
                        getFileIdentity(
                            file
                        );

                    if (
                        existingFileIds.has(
                            identity
                        )
                    ) {
                        return false;
                    }

                    existingFileIds.add(
                        identity
                    );

                    return true;
                }
            );

        if (
            uniqueFiles.length === 0
        ) {
            toast.error(
                "The selected image is already added"
            );

            resetInput();
            return;
        }

        if (
            !hasAvailableSlot
        ) {
            toast.error(
                `A maximum of ${safeMaximumFiles} reference images is allowed`
            );

            resetInput();
            return;
        }

        const filesToAdd =
            uniqueFiles.slice(
                0,
                remainingSlots
            );

        if (
            uniqueFiles.length >
            remainingSlots
        ) {
            toast.error(
                `Only ${remainingSlots} more reference image${remainingSlots === 1
                    ? ""
                    : "s"
                } can be added`
            );
        }

        onChange([
            ...files,
            ...filesToAdd,
        ]);

        resetInput();
    };

    const replaceFile = (
        selectedFiles: File[]
    ) => {
        const replaceIndex =
            replaceIndexRef.current;

        replaceIndexRef.current =
            null;

        if (
            disabled ||
            replaceIndex === null
        ) {
            resetInput();
            return;
        }

        const selectedFile =
            selectedFiles[0];

        if (!selectedFile) {
            resetInput();
            return;
        }

        const validationError =
            validateImageFile(
                selectedFile
            );

        if (validationError) {
            toast.error(
                validationError
            );

            resetInput();
            return;
        }

        const selectedIdentity =
            getFileIdentity(
                selectedFile
            );

        const isDuplicate =
            files.some(
                (
                    existingFile,
                    index
                ) =>
                    index !==
                    replaceIndex &&
                    getFileIdentity(
                        existingFile
                    ) === selectedIdentity
            );

        if (isDuplicate) {
            toast.error(
                "The selected image is already added"
            );

            resetInput();
            return;
        }

        const nextFiles =
            [...files];

        nextFiles[replaceIndex] =
            selectedFile;

        onChange(nextFiles);

        resetInput();
    };

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const selectedFiles =
            Array.from(
                event.target.files ??
                []
            );

        if (
            replaceIndexRef.current !==
            null
        ) {
            replaceFile(
                selectedFiles
            );

            return;
        }

        addFiles(
            selectedFiles
        );
    };

    const handleDragOver = (
        event: DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();

        if (
            disabled ||
            !hasAvailableSlot
        ) {
            return;
        }

        setIsDragging(true);
    };

    const handleDragLeave = (
        event: DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();

        setIsDragging(false);
    };

    const handleDrop = (
        event: DragEvent<HTMLDivElement>
    ) => {
        event.preventDefault();

        setIsDragging(false);

        if (
            disabled ||
            !hasAvailableSlot
        ) {
            return;
        }

        const selectedFiles =
            Array.from(
                event.dataTransfer
                    .files ?? []
            );

        addFiles(
            selectedFiles
        );
    };

    const openAddFilePicker = () => {
        if (
            disabled ||
            !hasAvailableSlot
        ) {
            return;
        }

        replaceIndexRef.current =
            null;

        resetInput();

        inputRef.current?.click();
    };

    const openReplaceFilePicker = (
        index: number
    ) => {
        if (disabled) {
            return;
        }

        replaceIndexRef.current =
            index;

        resetInput();

        inputRef.current?.click();
    };

    const handleRemoveFile = (
        index: number
    ) => {
        if (disabled) {
            return;
        }

        onChange(
            files.filter(
                (_, fileIndex) =>
                    fileIndex !== index
            )
        );

        resetInput();
    };

    const handleDropZoneKeyDown = (
        event: KeyboardEvent<HTMLDivElement>
    ) => {
        if (
            event.key !== "Enter" &&
            event.key !== " "
        ) {
            return;
        }

        event.preventDefault();

        openAddFilePicker();
    };

    return (
        <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-medium text-zinc-200">
                        Reference Images
                    </p>

                    <p className="mt-1 text-xs leading-5 text-zinc-400">
                        Upload up to three
                        images, or leave this
                        empty to use the
                        current thumbnail.
                    </p>
                </div>

                <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-zinc-400">
                    {files.length}/
                    {safeMaximumFiles}
                </span>
            </div>

            <input
                ref={inputRef}
                id={inputId}
                type="file"
                multiple={
                    replaceIndexRef.current ===
                    null
                }
                accept="image/jpeg,image/png,image/webp"
                onChange={
                    handleInputChange
                }
                disabled={disabled}
                className="sr-only"
            />

            {previews.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {previews.map(
                        (
                            preview,
                            index
                        ) => (
                            <div
                                key={getFileIdentity(
                                    preview.file
                                )}
                                className="overflow-hidden rounded-xl border border-white/12 bg-black/20"
                            >
                                <div className="relative aspect-video overflow-hidden bg-black">
                                    <Image
                                        src={
                                            preview.url
                                        }
                                        alt={`Reference image ${index + 1
                                            }`}
                                        fill
                                        unoptimized
                                        sizes="(max-width: 640px) 100vw, 200px"
                                        className="object-cover"
                                    />

                                    <div className="absolute top-2 left-2 rounded-full border border-white/15 bg-black/70 px-2 py-1 text-[11px] font-medium text-white backdrop-blur">
                                        Reference{" "}
                                        {index + 1}
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemoveFile(
                                                index
                                            )
                                        }
                                        disabled={
                                            disabled
                                        }
                                        aria-label={`Remove reference image ${index + 1
                                            }`}
                                        title="Remove image"
                                        className="absolute top-2 right-2 flex size-8 items-center justify-center rounded-full border border-white/15 bg-black/70 text-white backdrop-blur transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <XIcon
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </button>
                                </div>

                                <div className="space-y-3 px-3 py-3">
                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-medium text-zinc-200">
                                            {
                                                preview
                                                    .file.name
                                            }
                                        </p>

                                        <p className="mt-1 text-xs text-zinc-500">
                                            {formatFileSize(
                                                preview.file
                                                    .size
                                            )}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            openReplaceFilePicker(
                                                index
                                            )
                                        }
                                        disabled={
                                            disabled
                                        }
                                        className="w-full rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        Replace
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
            )}

            {hasAvailableSlot && (
                <div
                    role="button"
                    tabIndex={
                        disabled ? -1 : 0
                    }
                    onClick={
                        openAddFilePicker
                    }
                    onKeyDown={
                        handleDropZoneKeyDown
                    }
                    onDragOver={
                        handleDragOver
                    }
                    onDragLeave={
                        handleDragLeave
                    }
                    onDrop={handleDrop}
                    aria-disabled={
                        disabled
                    }
                    className={`flex min-h-36 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-5 py-6 text-center transition ${isDragging
                        ? "border-pink-500 bg-pink-500/10"
                        : "border-white/15 bg-black/20 hover:border-pink-500/60 hover:bg-white/5"
                        } ${disabled
                            ? "cursor-not-allowed opacity-50"
                            : "cursor-pointer"
                        }`}
                >
                    <div className="flex size-12 items-center justify-center rounded-full bg-white/8 text-zinc-300">
                        {isDragging ? (
                            <UploadCloudIcon
                                aria-hidden="true"
                                className="size-6"
                            />
                        ) : files.length >
                            0 ? (
                            <ImagesIcon
                                aria-hidden="true"
                                className="size-6"
                            />
                        ) : (
                            <ImagePlusIcon
                                aria-hidden="true"
                                className="size-6"
                            />
                        )}
                    </div>

                    <div>
                        <p className="text-sm font-medium text-zinc-200">
                            {isDragging
                                ? "Drop your images here"
                                : files.length >
                                    0
                                    ? `Add ${remainingSlots} more image${remainingSlots ===
                                        1
                                        ? ""
                                        : "s"
                                    }`
                                    : "Choose or drop reference images"}
                        </p>

                        <p className="mt-1 text-xs leading-5 text-zinc-500">
                            Select up to{" "}
                            {safeMaximumFiles} JPG,
                            PNG or WebP images
                            <br />
                            Maximum 10 MB per
                            image
                        </p>
                    </div>
                </div>
            )}

            {!hasAvailableSlot && (
                <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5 text-xs text-emerald-300">
                    Maximum of{" "}
                    {safeMaximumFiles}{" "}
                    reference images selected.
                </div>
            )}
        </div>
    );
}