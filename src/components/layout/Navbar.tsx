"use client";

import {
    useEffect,
    useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
    usePathname,
} from "next/navigation";
import {
    MenuIcon,
    XIcon,
} from "lucide-react";
import {
    AnimatePresence,
    motion,
} from "motion/react";

import {
    getAppUrl,
} from "@/lib/app-url";

interface NavigationItem {
    label: string;
    href: string;
    external?: boolean;
}

const navigationItems: NavigationItem[] = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Generate",
        href: getAppUrl(
            "/generate"
        ),
        external: true,
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
    item: NavigationItem
): boolean => {
    if (item.external) {
        return false;
    }

    if (item.href === "/") {
        return pathname === "/";
    }

    return (
        pathname === item.href ||
        pathname.startsWith(
            `${item.href}/`
        )
    );
};

export default function Navbar() {
    const pathname =
        usePathname();

    const [
        isMobileMenuOpen,
        setIsMobileMenuOpen,
    ] = useState(false);

    useEffect(() => {
        setIsMobileMenuOpen(
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

    const loginUrl =
        getAppUrl("/login");

    const registerUrl =
        getAppUrl("/register");

    const renderDesktopNavigationItem = (
        item: NavigationItem
    ) => {
        const isActive =
            isNavigationActive(
                pathname,
                item
            );

        const className = `transition ${isActive
            ? "text-pink-500"
            : "text-white hover:text-pink-500"
            }`;

        if (item.external) {
            return (
                <a
                    key={item.label}
                    href={item.href}
                    className={
                        className
                    }
                >
                    {item.label}
                </a>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.href}
                className={className}
            >
                {item.label}
            </Link>
        );
    };

    const renderMobileNavigationItem = (
        item: NavigationItem
    ) => {
        const isActive =
            isNavigationActive(
                pathname,
                item
            );

        const className = `transition ${isActive
            ? "text-pink-500"
            : "hover:text-pink-500"
            }`;

        if (item.external) {
            return (
                <a
                    key={item.label}
                    href={item.href}
                    onClick={() =>
                        setIsMobileMenuOpen(
                            false
                        )
                    }
                    className={
                        className
                    }
                >
                    {item.label}
                </a>
            );
        }

        return (
            <Link
                key={item.label}
                href={item.href}
                onClick={() =>
                    setIsMobileMenuOpen(
                        false
                    )
                }
                className={className}
            >
                {item.label}
            </Link>
        );
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

                <div className="hidden items-center gap-8 md:flex">
                    {navigationItems.map(
                        renderDesktopNavigationItem
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-3 md:flex">
                        <a
                            href={loginUrl}
                            className="rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white transition hover:border-pink-500/50 hover:bg-white/5 hover:text-pink-300 active:scale-95"
                        >
                            Login
                        </a>

                        <a
                            href={registerUrl}
                            className="rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95"
                        >
                            Get Started
                        </a>
                    </div>

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

            <AnimatePresence>
                {isMobileMenuOpen ? (
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
                        {navigationItems.map(
                            renderMobileNavigationItem
                        )}

                        <div className="flex flex-col items-center gap-5">
                            <a
                                href={loginUrl}
                                onClick={() =>
                                    setIsMobileMenuOpen(
                                        false
                                    )
                                }
                                className="transition hover:text-pink-500"
                            >
                                Login
                            </a>

                            <a
                                href={registerUrl}
                                onClick={() =>
                                    setIsMobileMenuOpen(
                                        false
                                    )
                                }
                                className="rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-7 py-3 text-base font-medium text-white transition hover:opacity-90"
                            >
                                Create Account
                            </a>
                        </div>

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
                ) : null}
            </AnimatePresence>
        </>
    );
}