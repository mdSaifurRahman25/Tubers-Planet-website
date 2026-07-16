import type { ReactNode } from "react";

import Navbar from "@/components/layout/Navbar";

export default function MarketingLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}