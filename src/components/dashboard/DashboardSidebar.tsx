"use client";

import Image from "next/image";
import Link from "next/link";
import {
    usePathname,
} from "next/navigation";

import {
    ArrowUpRight,
    X,
} from "lucide-react";

import {
    dashboardNavigation,
    dashboardSupportNavigation,
    type DashboardNavigationItem,
} from "@/config/dashboard-navigation";

import type {
    DashboardUser,
} from "@/types/dashboard.types";

interface DashboardSidebarProps {
    user: DashboardUser;
    isMobile?: boolean;
    onClose?: () => void;
}

const isNavigationActive = (
    pathname: string,
    item: DashboardNavigationItem
): boolean => {
    if (item.exact) {
        return (
            pathname === item.href
        );
    }

    return (
        pathname === item.href ||
        pathname.startsWith(
            `${item.href}/`
        )
    );
};

export default function DashboardSidebar({
    user,
    isMobile = false,
    onClose,
}: DashboardSidebarProps) {
    const pathname =
        usePathname();

    const userInitial =
        user.name
            ?.trim()
            .charAt(0)
            .toUpperCase() ||
        user.email
            ?.trim()
            .charAt(0)
            .toUpperCase() ||
        "U";

    const renderNavigationItem = (
        item: DashboardNavigationItem
    ) => {
        const Icon =
            item.icon;

        const isActive =
            isNavigationActive(
                pathname,
                item
            );

        return (
            <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive
                    ? "bg-gradient-to-r from-pink-600/20 to-purple-600/10 text-pink-200 ring-1 ring-pink-500/20"
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                    }`}
            >
                <Icon
                    aria-hidden="true"
                    className={`size-5 shrink-0 transition ${isActive
                        ? "text-pink-400"
                        : "text-zinc-500 group-hover:text-zinc-300"
                        }`}
                />

                <span className="min-w-0 flex-1 truncate">
                    {item.label}
                </span>

                {isActive ? (
                    <span className="size-1.5 rounded-full bg-pink-400 shadow-[0_0_12px_rgba(244,114,182,0.8)]" />
                ) : null}
            </Link>
        );
    };

    return (
        <aside className="flex h-full w-72 flex-col border-r border-white/8 bg-zinc-950/95 backdrop-blur-xl">
            <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
                <Link
                    href="/dashboard"
                    onClick={onClose}
                    aria-label="Go to dashboard"
                    className="relative block h-8 w-36"
                >
                    <Image
                        src="/logo.svg"
                        alt="Thumblify"
                        fill
                        priority
                        sizes="144px"
                        className="object-contain object-left"
                    />
                </Link>

                {isMobile ? (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dashboard menu"
                        className="flex size-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/8 hover:text-white"
                    >
                        <X
                            aria-hidden="true"
                            className="size-5"
                        />
                    </button>
                ) : null}
            </div>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-4 py-5">
                <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                    Workspace
                </p>

                <nav
                    aria-label="Dashboard navigation"
                    className="space-y-1"
                >
                    {dashboardNavigation.map(
                        renderNavigationItem
                    )}
                </nav>

                <div className="mt-auto pt-8">
                    <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                        Help
                    </p>

                    <div className="space-y-1">
                        {renderNavigationItem(
                            dashboardSupportNavigation
                        )}

                        <Link
                            href="/"
                            onClick={onClose}
                            className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-zinc-400 transition hover:bg-white/5 hover:text-white"
                        >
                            <ArrowUpRight
                                aria-hidden="true"
                                className="size-5 text-zinc-500 transition group-hover:text-zinc-300"
                            />

                            <span className="flex-1">
                                Back to Website
                            </span>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-white/8 p-4">
                <Link
                    href="/profile"
                    onClick={onClose}
                    className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3 transition hover:border-white/15 hover:bg-white/[0.06]"
                >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-sm font-semibold text-white">
                        {userInitial}
                    </span>

                    <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                            {user.name}
                        </span>

                        <span className="mt-0.5 block truncate text-xs text-zinc-500">
                            {user.email}
                        </span>
                    </span>
                </Link>
            </div>
        </aside>
    );
}