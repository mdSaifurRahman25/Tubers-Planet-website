"use client";

import {
    RectangleHorizontal,
    RectangleVertical,
    Square,
    type LucideIcon,
} from "lucide-react";

import { aspectRatios } from "@/data/thumbnail-options";
import type { AspectRatio } from "@/types/thumbnail.types";

interface AspectRatioSelectorProps {
    value: AspectRatio;
    onChange: (ratio: AspectRatio) => void;
}

const iconMap: Record<AspectRatio, LucideIcon> = {
    "16:9": RectangleHorizontal,
    "1:1": Square,
    "9:16": RectangleVertical,
};

export default function AspectRatioSelector({
    value,
    onChange,
}: AspectRatioSelectorProps) {
    return (
        <div className="space-y-3">
            <p className="block text-sm font-medium text-zinc-200">
                Aspect Ratio
            </p>

            <div
                role="group"
                aria-label="Choose thumbnail aspect ratio"
                className="flex flex-wrap gap-2"
            >
                {aspectRatios.map((ratio) => {
                    const isSelected = value === ratio;
                    const Icon = iconMap[ratio];

                    return (
                        <button
                            key={ratio}
                            type="button"
                            onClick={() => onChange(ratio)}
                            aria-pressed={isSelected}
                            className={`flex items-center gap-2 rounded-md border border-white/10 px-5 py-2.5 text-sm transition ${isSelected
                                ? "bg-white/10"
                                : "hover:bg-white/6"
                                }`}
                        >
                            <Icon
                                aria-hidden="true"
                                className="size-6"
                            />

                            <span className="tracking-widest">
                                {ratio}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}