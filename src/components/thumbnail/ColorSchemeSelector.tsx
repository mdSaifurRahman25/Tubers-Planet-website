"use client";

import { colorSchemes } from "@/data/thumbnail-options";
import type { ColorSchemeId } from "@/types/thumbnail.types";

interface ColorSchemeSelectorProps {
    value: ColorSchemeId;
    onChange: (colorSchemeId: ColorSchemeId) => void;
}

export default function ColorSchemeSelector({
    value,
    onChange,
}: ColorSchemeSelectorProps) {
    const selectedScheme = colorSchemes.find(
        (scheme) => scheme.id === value
    );

    return (
        <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-200">
                Color Scheme
            </p>

            <div
                role="group"
                aria-label="Choose thumbnail color scheme"
                className="grid grid-cols-6 gap-3"
            >
                {colorSchemes.map((scheme) => {
                    const isSelected = value === scheme.id;

                    return (
                        <button
                            key={scheme.id}
                            type="button"
                            onClick={() => onChange(scheme.id)}
                            aria-label={`Select ${scheme.name} color scheme`}
                            aria-pressed={isSelected}
                            title={scheme.name}
                            className={`relative rounded-lg transition-all ${isSelected
                                ? "ring-2 ring-pink-500"
                                : ""
                                }`}
                        >
                            <span className="flex h-10 overflow-hidden rounded-lg">
                                {scheme.colors.map((color, index) => (
                                    <span
                                        key={`${scheme.id}-${index}`}
                                        aria-hidden="true"
                                        className="flex-1"
                                        style={{
                                            backgroundColor: color,
                                        }}
                                    />
                                ))}
                            </span>
                        </button>
                    );
                })}
            </div>

            <p className="text-xs text-zinc-400">
                Selected: {selectedScheme?.name ?? "None"}
            </p>
        </div>
    );
}