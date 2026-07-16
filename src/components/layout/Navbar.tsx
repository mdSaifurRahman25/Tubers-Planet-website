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
    AnimatePresence,
    motion,
} from "motion/react";
import {
    MenuIcon,
    XIcon,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
    const pathname = usePathname();
    const router = useRouter();

    const {
        user,
        isLoggedIn,
        isAuthLoading,
        logout,
    } = useAuth();

    const [isMobileMenuOpen, setIsMobileMenuOpen] =
        useState(false);

    const [isProfileMenuOpen, setIsProfileMenuOpen] =
        useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsProfileMenuOpen(false);
    }, [pathname]);

    useEffect(() => {
        if (!isMobileMenuOpen) {
            return;
        }

        const previousOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleEscapeKey = (
            event: KeyboardEvent
        ) => {
            if (event.key === "Escape") {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener(
            "keydown",
            handleEscapeKey
        );

        return () => {
            document.body.style.overflow =
                previousOverflow;

            window.removeEventListener(
                "keydown",
                handleEscapeKey
            );
        };
    }, [isMobileMenuOpen]);

    const isActiveRoute = (href: string) => {
        if (href === "/") {
            return pathname === "/";
        }

        return pathname.startsWith(href);
    };

    const desktopLinkClass = (href: string) =>
        [
            "transition-colors hover:text-pink-500",
            isActiveRoute(href)
                ? "text-pink-500"
                : "text-white",
        ].join(" ");

    const handleLogout = async () => {
        setIsProfileMenuOpen(false);
        setIsMobileMenuOpen(false);

        await logout();

        router.replace("/");
        router.refresh();
    };

    const userInitial =
        user?.name?.trim().charAt(0).toUpperCase() ||
        "U";

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
                className="fixed top-0 right-0 left-0 z-50 flex w-full items-center justify-between border-b border-white/5 bg-black/70 px-6 py-4 text-white backdrop-blur-md md:px-16 lg:px-24 xl:px-32"
            >
                <Link
                    href="/"
                    aria-label="Go to Thumblify homepage"
                    className="shrink-0"
                >
                    <Image
                        src="/logo.svg"
                        alt="Thumblify"
                        width={140}
                        height={34}
                        priority
                        className="h-auto w-[140px]"
                    />
                </Link>

                {/* Desktop navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <Link
                        href="/"
                        className={desktopLinkClass("/")}
                    >
                        Home
                    </Link>

                    <Link
                        href="/generate"
                        className={desktopLinkClass(
                            "/generate"
                        )}
                    >
                        Generate
                    </Link>

                    {isLoggedIn ? (
                        <Link
                            href="/my-generation"
                            className={desktopLinkClass(
                                "/my-generation"
                            )}
                        >
                            My Generation
                        </Link>
                    ) : (
                        <Link
                            href="/#about"
                            className="text-white transition-colors hover:text-pink-500"
                        >
                            About
                        </Link>
                    )}

                    <Link
                        href="/#contact"
                        className="text-white transition-colors hover:text-pink-500"
                    >
                        Contact us
                    </Link>
                </div>

                <div className="flex items-center gap-3">
                    {!isAuthLoading &&
                        (isLoggedIn ? (
                            <div className="relative">
                                <button
                                    type="button"
                                    aria-label="Open user menu"
                                    aria-expanded={isProfileMenuOpen}
                                    onClick={() =>
                                        setIsProfileMenuOpen(
                                            (currentValue) =>
                                                !currentValue
                                        )
                                    }
                                    className="flex size-9 items-center justify-center rounded-full border-2 border-white/10 bg-white/20 font-medium text-white transition hover:border-pink-500/50 hover:bg-white/25"
                                >
                                    {userInitial}
                                </button>

                                <AnimatePresence>
                                    {isProfileMenuOpen && (
                                        <motion.div
                                            initial={{
                                                opacity: 0,
                                                y: -8,
                                                scale: 0.96,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                                scale: 1,
                                            }}
                                            exit={{
                                                opacity: 0,
                                                y: -8,
                                                scale: 0.96,
                                            }}
                                            transition={{
                                                duration: 0.15,
                                            }}
                                            className="absolute top-12 right-0 min-w-44 rounded-xl border border-white/10 bg-[#160711] p-2 shadow-2xl"
                                        >
                                            <div className="border-b border-white/10 px-3 py-2">
                                                <p className="truncate text-sm font-medium text-white">
                                                    {user?.name}
                                                </p>

                                                <p className="truncate text-xs text-white/50">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <Link
                                                href="/my-generation"
                                                className="mt-1 block rounded-lg px-3 py-2 text-sm text-white/80 transition hover:bg-white/10 hover:text-white"
                                            >
                                                My Generation
                                            </Link>

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="block w-full rounded-lg px-3 py-2 text-left text-sm text-pink-400 transition hover:bg-pink-500/10"
                                            >
                                                Logout
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <Link
                                href="/login"
                                className="hidden rounded-full bg-pink-600 px-6 py-2.5 text-white transition-all hover:bg-pink-700 active:scale-95 md:block"
                            >
                                Get Started
                            </Link>
                        ))}

                    {/* Mobile menu button */}
                    <button
                        type="button"
                        aria-label="Open navigation menu"
                        aria-expanded={isMobileMenuOpen}
                        onClick={() =>
                            setIsMobileMenuOpen(true)
                        }
                        className="rounded-md p-1 text-white transition active:scale-90 md:hidden"
                    >
                        <MenuIcon size={26} />
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
                        className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-8 bg-black/90 text-lg text-white backdrop-blur-md md:hidden"
                    >
                        <Link href="/">
                            Home
                        </Link>

                        <Link href="/generate">
                            Generate
                        </Link>

                        {isLoggedIn ? (
                            <Link href="/my-generation">
                                My Generation
                            </Link>
                        ) : (
                            <Link href="/#about">
                                About
                            </Link>
                        )}

                        <Link href="/#contact">
                            Contact Us
                        </Link>

                        {!isAuthLoading &&
                            (isLoggedIn ? (
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="text-pink-400"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    href="/login"
                                    className="rounded-full bg-pink-600 px-7 py-2.5"
                                >
                                    Login
                                </Link>
                            ))}

                        <button
                            type="button"
                            aria-label="Close navigation menu"
                            onClick={() =>
                                setIsMobileMenuOpen(false)
                            }
                            className="flex size-10 items-center justify-center rounded-md bg-pink-600 p-1 text-white transition hover:bg-pink-700 active:ring-3 active:ring-white"
                        >
                            <XIcon />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}