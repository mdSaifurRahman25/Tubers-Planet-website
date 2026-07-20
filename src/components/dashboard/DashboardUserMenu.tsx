"use client";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import Link from "next/link";
import {
    usePathname,
    useRouter,
} from "next/navigation";

import {
    ChevronDown,
    Globe2,
    Images,
    LogOut,
    UserRound,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

import type {
    DashboardUser,
} from "@/types/dashboard.types";

interface DashboardUserMenuProps {
    user: DashboardUser;
}

export default function DashboardUserMenu({
    user,
}: DashboardUserMenuProps) {
    const router =
        useRouter();

    const pathname =
        usePathname();

    const menuRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const {
        logout,
    } = useAuth();

    const [
        isOpen,
        setIsOpen,
    ] = useState(false);

    const [
        isLoggingOut,
        setIsLoggingOut,
    ] = useState(false);

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

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        const handleOutsideClick = (
            event: MouseEvent
        ) => {
            const target =
                event.target;

            if (
                !(
                    target instanceof
                    Node
                )
            ) {
                return;
            }

            if (
                menuRef.current &&
                !menuRef.current.contains(
                    target
                )
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);

    const handleLogout =
        async () => {
            if (isLoggingOut) {
                return;
            }

            try {
                setIsLoggingOut(true);

                await logout();

                setIsOpen(false);

                router.replace(
                    "/login"
                );

                router.refresh();
            } finally {
                setIsLoggingOut(
                    false
                );
            }
        };

    return (
        <div
            ref={menuRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() =>
                    setIsOpen(
                        (
                            currentValue
                        ) =>
                            !currentValue
                    )
                }
                aria-haspopup="menu"
                aria-expanded={isOpen}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1.5 pr-2 text-left transition hover:border-white/20 hover:bg-white/8"
            >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-sm font-semibold text-white">
                    {userInitial}
                </span>

                <span className="hidden min-w-0 sm:block">
                    <span className="block max-w-32 truncate text-sm font-medium text-white">
                        {user.name}
                    </span>

                    <span className="block max-w-32 truncate text-xs text-zinc-500">
                        {user.email}
                    </span>
                </span>

                <ChevronDown
                    aria-hidden="true"
                    className={`hidden size-4 text-zinc-500 transition sm:block ${isOpen
                        ? "rotate-180"
                        : ""
                        }`}
                />
            </button>

            {isOpen ? (
                <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 p-2 shadow-2xl shadow-black/50 backdrop-blur-xl"
                >
                    <div className="border-b border-white/10 px-3 py-3">
                        <p className="truncate text-sm font-semibold text-white">
                            {user.name}
                        </p>

                        <p className="mt-1 truncate text-xs text-zinc-500">
                            {user.email}
                        </p>
                    </div>

                    <div className="py-2">
                        <Link
                            href="/profile"
                            role="menuitem"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/8 hover:text-white"
                        >
                            <UserRound
                                aria-hidden="true"
                                className="size-4"
                            />

                            View Profile
                        </Link>

                        <Link
                            href="/generations"
                            role="menuitem"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/8 hover:text-white"
                        >
                            <Images
                                aria-hidden="true"
                                className="size-4"
                            />

                            My Generations
                        </Link>

                        <Link
                            href="/"
                            role="menuitem"
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-zinc-300 transition hover:bg-white/8 hover:text-white"
                        >
                            <Globe2
                                aria-hidden="true"
                                className="size-4"
                            />

                            Back to Website
                        </Link>
                    </div>

                    <div className="border-t border-white/10 pt-2">
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() =>
                                void handleLogout()
                            }
                            disabled={
                                isLoggingOut
                            }
                            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <LogOut
                                aria-hidden="true"
                                className="size-4"
                            />

                            {isLoggingOut
                                ? "Logging out..."
                                : "Logout"}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
}