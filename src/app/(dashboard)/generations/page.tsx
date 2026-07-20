import type { Metadata } from "next";

import MyGenerationsGallery from "@/components/thumbnail/MyGenerationsGallery";

export const metadata: Metadata = {
    title: "My Generations",
    description:
        "View and manage your AI-generated YouTube thumbnails.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MyGenerationsPage() {
    return (
        <MyGenerationsGallery />
    );
}