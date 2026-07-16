"use client";

import type { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

import LenisScroll from "@/components/providers/LenisScroll";
import { AuthProvider } from "@/context/AuthContext";

export default function Providers({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <AuthProvider>
            <LenisScroll />

            {children}

            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3500,
                }}
            />
        </AuthProvider>
    );
}