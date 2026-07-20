import type {
    Metadata,
} from "next";

import type {
    ReactNode,
} from "react";

import {
    redirect,
} from "next/navigation";

import DashboardShell from "@/components/dashboard/DashboardShell";

import {
    getCurrentUser,
} from "@/lib/auth/get-current-user";

export const dynamic =
    "force-dynamic";

export const metadata:
    Metadata = {
    robots: {
        index: false,
        follow: false,
        nocache: true,

        googleBot: {
            index: false,
            follow: false,
            noimageindex: true,
        },
    },
};

interface DashboardLayoutProps {
    children: ReactNode;
}

export default async function DashboardLayout({
    children,
}: Readonly<DashboardLayoutProps>) {
    const user =
        await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return (
        <DashboardShell
            initialUser={user}
        >
            {children}
        </DashboardShell>
    );
}