import type { Metadata } from "next";

import MyGenerationGallery from "@/components/thumbnail/MyGenerationGallery";

export const metadata: Metadata = {
    title: "My Generations",
    description:
        "View and manage your AI-generated YouTube thumbnails.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function MyGenerationPage() {
    return <MyGenerationGallery />;
}