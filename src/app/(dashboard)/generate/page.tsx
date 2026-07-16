import type { Metadata } from "next";

import GenerateWorkspace from "@/components/thumbnail/GenerateWorkspace";

export const metadata: Metadata = {
    title: "Generate Thumbnail",
    description:
        "Create an AI-powered YouTube thumbnail with Thumblify.",
    robots: {
        index: false,
        follow: false,
    },
};

export default function GeneratePage() {
    return <GenerateWorkspace />;
}