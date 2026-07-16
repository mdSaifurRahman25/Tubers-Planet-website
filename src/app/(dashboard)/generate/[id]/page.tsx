import type { Metadata } from "next";

import GenerateWorkspace from "@/components/thumbnail/GenerateWorkspace";

interface GenerateByIdPageProps {
    params: Promise<{
        id: string;
    }>;
}

export const metadata: Metadata = {
    title: "Thumbnail Preview",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function GenerateByIdPage({
    params,
}: GenerateByIdPageProps) {
    const { id } = await params;

    return (
        <GenerateWorkspace thumbnailId={id} />
    );
}