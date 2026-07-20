"use client";

import type {
    ReactNode,
} from "react";

import {
    Toaster,
} from "react-hot-toast";

import LenisScroll from "@/components/providers/LenisScroll";

interface ProvidersProps {
    children: ReactNode;
}

export default function Providers({
    children,
}: Readonly<ProvidersProps>) {
    return (
        <>
            <LenisScroll />

            {children}

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 4000,

                    style: {
                        background:
                            "#18181b",

                        color:
                            "#ffffff",

                        border:
                            "1px solid rgba(255, 255, 255, 0.1)",
                    },
                }}
            />
        </>
    );
}