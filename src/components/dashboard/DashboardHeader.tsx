"use client";

import Link from "next/link";
import {
    usePathname,
} from "next/navigation";

import {
    Coins,
    Menu,
} from "lucide-react";

import DashboardUserMenu from "@/components/dashboard/DashboardUserMenu";

import type {
    DashboardUser,
} from "@/types/dashboard.types";

interface DashboardHeaderProps {
    user: DashboardUser;
    onOpenMobileSidebar: () => void;
}

interface DashboardPageDetails {
    title: string;
    description: string;
}

const getPageDetails = (
    pathname: string
): DashboardPageDetails => {
    if (
        pathname.startsWith(
            "/generate/"
        )
    ) {
        return {
            title: "Edit Thumbnail",
            description:
                "Regenerate or enhance your existing thumbnail.",
        };
    }

    if (
        pathname === "/generate"
    ) {
        return {
            title: "Generate Thumbnail",
            description:
                "Create a new AI-powered YouTube thumbnail.",
        };
    }

    if (
        pathname.startsWith(
            "/generations"
        )
    ) {
        return {
            title: "My Generations",
            description:
                "View and manage your generated thumbnails.",
        };
    }

    if (
        pathname.startsWith(
            "/credits"
        )
    ) {
        return {
            title: "Credits & Usage",
            description:
                "Review your available credits and usage history.",
        };
    }

    if (
        pathname.startsWith(
            "/billing"
        )
    ) {
        return {
            title: "Billing & Payments",
            description:
                "Manage payments, packages and invoices.",
        };
    }

    if (
        pathname.startsWith(
            "/profile"
        )
    ) {
        return {
            title: "Profile",
            description:
                "Manage your personal and account information.",
        };
    }

    if (
        pathname.startsWith(
            "/support"
        )
    ) {
        return {
            title: "Support",
            description:
                "Get help with your account and thumbnails.",
        };
    }

    return {
        title: "Dashboard",
        description:
            "An overview of your Thumblify account.",
    };
};

export default function DashboardHeader({
    user,
    onOpenMobileSidebar,
}: DashboardHeaderProps) {
    const pathname =
        usePathname();

    const pageDetails =
        getPageDetails(pathname);

    return (
        <header className="fixed left-0 right-0 top-0 z-30 h-16 border-b border-white/8 bg-zinc-950/80 backdrop-blur-xl lg:left-72">
            <div className="flex h-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        onClick={
                            onOpenMobileSidebar
                        }
                        aria-label="Open dashboard menu"
                        className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-zinc-300 transition hover:bg-white/10 hover:text-white lg:hidden"
                    >
                        <Menu
                            aria-hidden="true"
                            className="size-5"
                        />
                    </button>

                    <div className="min-w-0">
                        <h1 className="truncate text-base font-semibold text-white sm:text-lg">
                            {pageDetails.title}
                        </h1>

                        <p className="hidden truncate text-xs text-zinc-500 sm:block">
                            {
                                pageDetails.description
                            }
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Link
                        href="/credits"
                        className="flex h-10 items-center gap-2 rounded-xl border border-pink-500/20 bg-pink-500/10 px-3 text-sm font-medium text-pink-200 transition hover:border-pink-400/40 hover:bg-pink-500/15"
                    >
                        <Coins
                            aria-hidden="true"
                            className="size-4"
                        />

                        <span className="hidden sm:inline">
                            Credits
                        </span>
                    </Link>

                    <DashboardUserMenu
                        user={user}
                    />
                </div>
            </div>
        </header>
    );
}