"use client";

import {
    useEffect,
    useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    usePathname,
    useRouter,
} from "next/navigation";
import {
    MenuIcon,
    XIcon,
} from "lucide-react";
import {
    AnimatePresence,
    motion,
} from "motion/react";

import { useAuth } from "@/context/AuthContext";

interface NavigationItem {
    label: string;
    href: string;
    protected?: boolean;
    guestOnly?: boolean;
}

const navigationItems: NavigationItem[] = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Generate",
        href: "/generate",
    },
    {
        label: "My Generations",
        href: "/generations",
        protected: true,
    },
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Pricing",
        href: "/pricing",
    },
    {
        label: "Contact us",
        href: "/contact",
    },
];

const isNavigationActive = (
    pathname: string,
    href: string
): boolean => {
    if (href === "/") {
        return pathname === "/";
    }

    if (href.startsWith("/#")) {
        return false;
    }

    return (
        pathname === href ||
        pathname.startsWith(
            `${href}/`
        )
    );
};

export default function Navbar() {
    const pathname =
        usePathname();

    const router =
        useRouter();

    const {
        user,
        isLoggedIn,
        isAuthLoading,
        logout,
    } = useAuth();

    const [
        isMobileMenuOpen,
        setIsMobileMenuOpen,
    ] = useState(false);

    const [
        isProfileMenuOpen,
        setIsProfileMenuOpen,
    ] = useState(false);

    const [
        isLoggingOut,
        setIsLoggingOut,
    ] = useState(false);

    const visibleNavigationItems =
        navigationItems.filter(
            (item) => {
                if (
                    item.protected &&
                    !isLoggedIn
                ) {
                    return false;
                }

                if (
                    item.guestOnly &&
                    isLoggedIn
                ) {
                    return false;
                }

                return true;
            }
        );

    const userInitial =
        user?.name
            ?.trim()
            .charAt(0)
            .toUpperCase() ||
        user?.email
            ?.trim()
            .charAt(0)
            .toUpperCase() ||
        "U";

    useEffect(() => {
        setIsMobileMenuOpen(
            false
        );

        setIsProfileMenuOpen(
            false
        );
    }, [pathname]);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            return;
        }

        const previousOverflow =
            document.body.style
                .overflow;

        document.body.style.overflow =
            "hidden";

        return () => {
            document.body.style.overflow =
                previousOverflow;
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        const closeProfileMenu = (
            event: MouseEvent
        ) => {
            const target =
                event.target;

            if (
                !(
                    target instanceof
                    Element
                )
            ) {
                return;
            }

            if (
                !target.closest(
                    "[data-profile-menu]"
                )
            ) {
                setIsProfileMenuOpen(
                    false
                );
            }
        };

        document.addEventListener(
            "mousedown",
            closeProfileMenu
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                closeProfileMenu
            );
        };
    }, []);

    const handleLogout =
        async () => {
            if (isLoggingOut) {
                return;
            }

            try {
                setIsLoggingOut(
                    true
                );

                await logout();

                setIsProfileMenuOpen(
                    false
                );

                setIsMobileMenuOpen(
                    false
                );

                router.push("/");
                router.refresh();
            } finally {
                setIsLoggingOut(
                    false
                );
            }
        };

    return (
        <>
            <motion.nav
                initial={{
                    y: -100,
                    opacity: 0,
                }}
                animate={{
                    y: 0,
                    opacity: 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 250,
                    damping: 70,
                    mass: 1,
                }}
                className="fixed top-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-black/40 px-6 py-4 backdrop-blur-md md:px-16 lg:px-24 xl:px-32"
            >
                {/* Logo */}
                <Link
                    href="/"
                    aria-label="Go to Thumblify homepage"
                    className="relative block h-[34px] w-[140px] shrink-0"
                >
                    <Image
                        src="/logo.svg"
                        alt="Thumblify"
                        fill
                        priority
                        sizes="140px"
                        className="object-contain object-left"
                    />
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    {visibleNavigationItems.map(
                        (item) => {
                            const isActive =
                                isNavigationActive(
                                    pathname,
                                    item.href
                                );

                            return (
                                <Link
                                    key={
                                        item.label
                                    }
                                    href={
                                        item.href
                                    }
                                    className={`transition ${isActive
                                        ? "text-pink-500"
                                        : "text-white hover:text-pink-500"
                                        }`}
                                >
                                    {
                                        item.label
                                    }
                                </Link>
                            );
                        }
                    )}
                </div>

                {/* Account controls */}
                <div className="flex items-center gap-3">
                    {!isAuthLoading &&
                        isLoggedIn &&
                        user && (
                            <div
                                data-profile-menu
                                className="relative"
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsProfileMenuOpen(
                                            (
                                                currentValue
                                            ) =>
                                                !currentValue
                                        )
                                    }
                                    aria-label="Open profile menu"
                                    aria-haspopup="menu"
                                    aria-expanded={
                                        isProfileMenuOpen
                                    }
                                    className="flex size-9 items-center justify-center rounded-full border-2 border-white/10 bg-white/20 text-sm font-medium text-white transition hover:border-pink-500/60"
                                >
                                    {
                                        userInitial
                                    }
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            role="menu"
                                            initial={{
                                                y: -8,
                                                opacity: 0,
                                                scale: 0.96,
                                            }}
                                            animate={{
                                                y: 0,
                                                opacity: 1,
                                                scale: 1,
                                            }}
                                            exit={{
                                                y: -8,
                                                opacity: 0,
                                                scale: 0.96,
                                            }}
                                            transition={{
                                                duration: 0.15,
                                            }}
                                            className="absolute top-full right-0 mt-3 w-52 overflow-hidden rounded-xl border border-white/10 bg-zinc-950 p-2 shadow-2xl"
                                        >
                                            <div className="border-b border-white/10 px-3 py-2">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {
                                                        user.name
                                                    }
                                                </p>

                                                <p className="truncate text-xs text-zinc-400">
                                                    {
                                                        user.email
                                                    }
                                                </p>
                                            </div>

                                            <Link
                                                href="/generations"
                                                role="menuitem"
                                                className="mt-1 block rounded-lg px-3 py-2 text-sm text-zinc-300 transition hover:bg-white/10 hover:text-white"
                                            >
                                                My
                                                Generations
                                            </Link>

                                            <button
                                                type="button"
                                                role="menuitem"
                                                onClick={() =>
                                                    void handleLogout()
                                                }
                                                disabled={
                                                    isLoggingOut
                                                }
                                                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-300 transition hover:bg-pink-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isLoggingOut
                                                    ? "Logging out..."
                                                    : "Logout"}
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                    {!isAuthLoading &&
                        !isLoggedIn && (
                            <div className="hidden items-center gap-3 md:flex">
                                <Link
                                    href="/login"
                                    className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:border-pink-500/50 hover:bg-white/5 hover:text-pink-300 active:scale-95"
                                >
                                    Login
                                </Link>

                                <Link
                                    href="/register"
                                    className="rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}

                    {isAuthLoading && (
                        <div
                            aria-label="Loading account"
                            className="size-9 animate-pulse rounded-full bg-white/10"
                        />
                    )}

                    <button
                        type="button"
                        onClick={() =>
                            setIsMobileMenuOpen(
                                true
                            )
                        }
                        aria-label="Open navigation menu"
                        aria-expanded={
                            isMobileMenuOpen
                        }
                        className="text-white transition active:scale-90 md:hidden"
                    >
                        <MenuIcon
                            aria-hidden="true"
                            className="size-7"
                        />
                    </button>
                </div>
            </motion.nav>

            {/* Mobile navigation */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{
                            x: "-100%",
                        }}
                        animate={{
                            x: 0,
                        }}
                        exit={{
                            x: "-100%",
                        }}
                        transition={{
                            duration: 0.3,
                            ease: "easeInOut",
                        }}
                        className="fixed inset-0 z-100 flex flex-col items-center justify-center gap-8 bg-black/80 text-lg text-white backdrop-blur-md md:hidden"
                    >
                        {visibleNavigationItems.map(
                            (item) => {
                                const isActive =
                                    isNavigationActive(
                                        pathname,
                                        item.href
                                    );

                                return (
                                    <Link
                                        key={
                                            item.label
                                        }
                                        href={
                                            item.href
                                        }
                                        onClick={() =>
                                            setIsMobileMenuOpen(
                                                false
                                            )
                                        }
                                        className={`transition ${isActive
                                            ? "text-pink-500"
                                            : "hover:text-pink-500"
                                            }`}
                                    >
                                        {
                                            item.label
                                        }
                                    </Link>
                                );
                            }
                        )}

                        {!isAuthLoading &&
                            isLoggedIn && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        void handleLogout()
                                    }
                                    disabled={
                                        isLoggingOut
                                    }
                                    className="transition hover:text-pink-500 disabled:opacity-60"
                                >
                                    {isLoggingOut
                                        ? "Logging out..."
                                        : "Logout"}
                                </button>
                            )}

                        {!isAuthLoading &&
                            !isLoggedIn && (
                                <div className="flex flex-col items-center gap-5">
                                    <Link
                                        href="/login"
                                        onClick={() =>
                                            setIsMobileMenuOpen(
                                                false
                                            )
                                        }
                                        className={`transition ${pathname ===
                                            "/login"
                                            ? "text-pink-500"
                                            : "hover:text-pink-500"
                                            }`}
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        href="/register"
                                        onClick={() =>
                                            setIsMobileMenuOpen(
                                                false
                                            )
                                        }
                                        className="rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-7 py-3 text-base font-medium text-white transition hover:opacity-90"
                                    >
                                        Create
                                        Account
                                    </Link>
                                </div>
                            )}

                        <button
                            type="button"
                            onClick={() =>
                                setIsMobileMenuOpen(
                                    false
                                )
                            }
                            aria-label="Close navigation menu"
                            className="flex size-10 items-center justify-center rounded-md bg-pink-600 p-1 text-white transition hover:bg-pink-700 active:ring-3 active:ring-white"
                        >
                            <XIcon
                                aria-hidden="true"
                            />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}