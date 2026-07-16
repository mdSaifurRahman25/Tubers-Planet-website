"use client";

import {
    ChevronDownIcon,
    CpuIcon,
    ImageIcon,
    PenToolIcon,
    SparkleIcon,
    SquareIcon,
    type LucideIcon,
} from "lucide-react";

import { thumbnailStyles } from "@/data/thumbnail-options";
import type { ThumbnailStyle } from "@/types/thumbnail.types";

interface StyleSelectorProps {
    value: ThumbnailStyle;
    onChange: (style: ThumbnailStyle) => void;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const styleDescriptions: Record<ThumbnailStyle, string> = {
    "Bold & Graphic":
        "High contrast, bold typography, striking visuals",
    Minimalist:
        "Clean, simple, lots of white space",
    Photorealistic:
        "Photo-based, natural looking",
    Illustrated:
        "Hand-drawn, artistic, creative",
    "Tech/Futuristic":
        "Modern, sleek, tech-inspired",
};

const styleIcons: Record<
    ThumbnailStyle,
    LucideIcon
> = {
    "Bold & Graphic": SparkleIcon,
    Minimalist: SquareIcon,
    Photorealistic: ImageIcon,
    Illustrated: PenToolIcon,
    "Tech/Futuristic": CpuIcon,
};

export default function StyleSelector({
    value,
    onChange,
    isOpen,
    setIsOpen,
}: StyleSelectorProps) {
    const SelectedIcon = styleIcons[value];

    const handleSelect = (
        selectedStyle: ThumbnailStyle
    ) => {
        onChange(selectedStyle);
        setIsOpen(false);
    };

    return (
        <div
            className="relative space-y-3"
            onKeyDown={(event) => {
                if (event.key === "Escape") {
                    setIsOpen(false);
                }
            }}
        >
            <p className="text-sm font-medium text-zinc-200">
                Thumbnail Style
            </p>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-3 rounded-md border border-white/10 bg-white/8 px-4 py-3 text-left text-zinc-200 transition hover:bg-white/12"
            >
                <div className="min-w-0">
                    <div className="flex items-center gap-2 font-medium">
                        <SelectedIcon
                            aria-hidden="true"
                            className="size-4 shrink-0"
                        />

                        <span>{value}</span>
                    </div>

                    <p className="mt-1 text-xs text-zinc-400">
                        {styleDescriptions[value]}
                    </p>
                </div>

                <ChevronDownIcon
                    aria-hidden="true"
                    className={`size-5 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <div
                    role="menu"
                    aria-label="Thumbnail styles"
                    className="absolute top-full left-0 z-50 mt-2 w-full overflow-hidden rounded-md border border-white/12 bg-black/80 shadow-lg backdrop-blur-3xl"
                >
                    {thumbnailStyles.map(
                        (thumbnailStyle) => {
                            const Icon =
                                styleIcons[thumbnailStyle];

                            const isSelected =
                                value === thumbnailStyle;

                            return (
                                <button
                                    key={thumbnailStyle}
                                    type="button"
                                    role="menuitemradio"
                                    aria-checked={isSelected}
                                    onClick={() =>
                                        handleSelect(thumbnailStyle)
                                    }
                                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-white/10 ${isSelected
                                        ? "bg-white/8"
                                        : ""
                                        }`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="mt-0.5 size-4 shrink-0"
                                    />

                                    <div>
                                        <p className="font-medium text-zinc-200">
                                            {thumbnailStyle}
                                        </p>

                                        <p className="text-xs text-zinc-400">
                                            {
                                                styleDescriptions[
                                                thumbnailStyle
                                                ]
                                            }
                                        </p>
                                    </div>
                                </button>
                            );
                        }
                    )}
                </div>
            )}
        </div>
    );
}