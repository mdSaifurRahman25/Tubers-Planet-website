"use client";

import Image from "next/image";
import Link from "next/link";

import {
    useState,
    type FormEvent,
} from "react";

import {
    CheckCircle2Icon,
    LoaderCircleIcon,
    MailIcon,
    MapPinIcon,
    PhoneIcon,
    SendIcon,
} from "lucide-react";

import type { IconType } from "react-icons";

import {
    FaFacebookF,
    FaLinkedinIn,
    FaRedditAlien,
    FaXTwitter,
    FaYoutube,
} from "react-icons/fa6";

import toast from "react-hot-toast";

interface NewsletterApiResponse {
    success: boolean;
    message: string;
}

interface SocialLink {
    label: string;
    href: string;
    icon: IconType;
}

const supportEmail =
    process.env
        .NEXT_PUBLIC_SUPPORT_EMAIL
        ?.trim() ||
    "hello@thumblify.com";

const whatsappNumber =
    process.env
        .NEXT_PUBLIC_WHATSAPP_NUMBER
        ?.trim() ||
    "";

const businessLocation =
    process.env
        .NEXT_PUBLIC_BUSINESS_LOCATION
        ?.trim() ||
    "Available Worldwide";

const normalizedWhatsappNumber =
    whatsappNumber.replace(
        /\D/g,
        ""
    );

const quickLinks = [
    {
        label: "Home",
        href: "/",
    },
    {
        label: "Generate",
        href: "/generate",
    },
    {
        label: "My Generation",
        href: "/my-generation",
    },
    {
        label: "About",
        href: "/about",
    },
    {
        label: "Contact",
        href: "/contact",
    },
];

const commonPages = [
    {
        label: "Pricing",
        href: "/pricing",
    },
    {
        label: "How it works",
        href: "/how-it-works",
    },
    {
        label: "Privacy Policy",
        href: "/privacy-policy",
    },
    {
        label: "Terms & Conditions",
        href: "/terms-and-conditions",
    },
    {
        label: "Refund Policy",
        href: "/refund-policy",
    },
    {
        label: "FAQs",
        href: "/faqs",
    },
];

const socialLinks: SocialLink[] = [
    {
        label: "Facebook",

        href:
            process.env
                .NEXT_PUBLIC_FACEBOOK_URL
                ?.trim() ||
            "https://www.facebook.com",

        icon: FaFacebookF,
    },

    {
        label: "YouTube",

        href:
            process.env
                .NEXT_PUBLIC_YOUTUBE_URL
                ?.trim() ||
            "https://www.youtube.com",

        icon: FaYoutube,
    },

    {
        label: "X",

        href:
            process.env
                .NEXT_PUBLIC_TWITTER_URL
                ?.trim() ||
            "https://x.com",

        icon: FaXTwitter,
    },

    {
        label: "LinkedIn",

        href:
            process.env
                .NEXT_PUBLIC_LINKEDIN_URL
                ?.trim() ||
            "https://www.linkedin.com",

        icon: FaLinkedinIn,
    },

    {
        label: "Reddit",

        href:
            process.env
                .NEXT_PUBLIC_REDDIT_URL
                ?.trim() ||
            "https://www.reddit.com",

        icon: FaRedditAlien,
    },
];

const readApiResponse = async (
    response: Response
): Promise<NewsletterApiResponse> => {
    try {
        return (await response.json()) as NewsletterApiResponse;
    } catch {
        return {
            success: false,

            message:
                "The server returned an invalid response.",
        };
    }
};

export default function Footer() {
    const currentYear =
        new Date().getFullYear();

    const [
        newsletterEmail,
        setNewsletterEmail,
    ] = useState("");

    const [
        isSubscribing,
        setIsSubscribing,
    ] = useState(false);

    const [
        subscriptionComplete,
        setSubscriptionComplete,
    ] = useState(false);

    const handleNewsletterSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isSubscribing) {
            return;
        }

        const email =
            newsletterEmail
                .trim()
                .toLowerCase();

        if (!email) {
            toast.error(
                "Please enter your email address"
            );

            return;
        }

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (
            !emailPattern.test(email)
        ) {
            toast.error(
                "Please enter a valid email address"
            );

            return;
        }

        setIsSubscribing(true);
        setSubscriptionComplete(false);

        try {
            const response =
                await fetch(
                    "/api/newsletter",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        body: JSON.stringify({
                            email,

                            source:
                                "footer",
                        }),
                    }
                );

            const data =
                await readApiResponse(
                    response
                );

            if (
                !response.ok ||
                !data.success
            ) {
                throw new Error(
                    data.message ||
                    "Unable to join the newsletter"
                );
            }

            setNewsletterEmail("");
            setSubscriptionComplete(true);

            toast.success(
                data.message ||
                "You have joined our newsletter"
            );
        } catch (error: unknown) {
            console.error(
                "Newsletter subscription failed:",
                error
            );

            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to join the newsletter"
            );
        } finally {
            setIsSubscribing(false);
        }
    };

    return (
        <footer className="relative z-10 border-t border-white/8 bg-[#050817]">
            <div className="mx-auto max-w-7xl px-5 pt-16 pb-8 sm:px-8 lg:px-12">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.75fr_0.95fr_1.15fr] lg:gap-10">
                    {/* Brand information */}
                    <div>
                        <Link
                            href="/"
                            aria-label="Go to Thumblify homepage"
                            className="relative block h-[42px] w-[175px]"
                        >
                            <Image
                                src="/logo.svg"
                                alt="Thumblify"
                                fill
                                sizes="175px"
                                className="object-contain object-left"
                            />
                        </Link>

                        <p className="mt-6 max-w-sm text-sm leading-7 text-zinc-400">
                            Thumblify helps
                            creators, teams, and
                            agencies generate
                            professional YouTube
                            thumbnails faster,
                            explore multiple visual
                            concepts, and build a
                            stronger channel
                            identity.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h2 className="text-base font-bold text-white">
                            Quick Links
                        </h2>

                        <nav
                            aria-label="Footer quick links"
                            className="mt-6"
                        >
                            <ul className="space-y-4">
                                {quickLinks.map(
                                    (link) => (
                                        <li
                                            key={
                                                link.label
                                            }
                                        >
                                            <Link
                                                href={
                                                    link.href
                                                }
                                                className="inline-flex items-center gap-1.5 text-sm text-zinc-300 transition hover:translate-x-1 hover:text-pink-400"
                                            >
                                                {
                                                    link.label
                                                }
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </nav>
                    </div>

                    {/* Common pages and contact information */}
                    <div>
                        <h2 className="text-base font-bold text-white">
                            Common Pages
                        </h2>

                        <nav
                            aria-label="Footer common pages"
                            className="mt-6"
                        >
                            <ul className="space-y-4">
                                {commonPages.map(
                                    (link) => (
                                        <li
                                            key={
                                                link.label
                                            }
                                        >
                                            <Link
                                                href={
                                                    link.href
                                                }
                                                className="inline-flex items-center gap-1.5 text-sm text-zinc-300 transition hover:translate-x-1 hover:text-pink-400"
                                            >
                                                {
                                                    link.label
                                                }
                                            </Link>
                                        </li>
                                    )
                                )}
                            </ul>
                        </nav>

                        <div className="mt-7 space-y-4">
                            <a
                                href={`mailto:${supportEmail}`}
                                className="flex items-start gap-3 text-sm text-zinc-300 transition hover:text-pink-400"
                            >
                                <MailIcon
                                    aria-hidden="true"
                                    className="mt-0.5 size-4 shrink-0 text-pink-400"
                                />

                                <span className="break-all">
                                    {supportEmail}
                                </span>
                            </a>

                            {whatsappNumber && (
                                <a
                                    href={`https://wa.me/${normalizedWhatsappNumber}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-sm text-zinc-300 transition hover:text-pink-400"
                                >
                                    <PhoneIcon
                                        aria-hidden="true"
                                        className="size-4 shrink-0 text-pink-400"
                                    />

                                    <span>
                                        {
                                            whatsappNumber
                                        }
                                    </span>
                                </a>
                            )}

                            <div className="flex items-start gap-3 text-sm leading-6 text-zinc-300">
                                <MapPinIcon
                                    aria-hidden="true"
                                    className="mt-0.5 size-4 shrink-0 text-pink-400"
                                />

                                <span>
                                    {
                                        businessLocation
                                    }
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h2 className="text-base font-bold text-white">
                            Email Newsletter
                        </h2>

                        <p className="mt-6 text-sm leading-7 text-zinc-400">
                            Subscribe to receive
                            product updates,
                            thumbnail tips, creator
                            resources, and important
                            Thumblify announcements.
                        </p>

                        <form
                            onSubmit={
                                handleNewsletterSubmit
                            }
                            className="mt-6 space-y-3"
                        >
                            <label
                                htmlFor="footer-newsletter-email"
                                className="sr-only"
                            >
                                Email address
                            </label>

                            <div className="flex items-center rounded-full border border-white/15 bg-white/5 px-4 transition focus-within:border-pink-500/60 focus-within:ring-2 focus-within:ring-pink-500/15">
                                <MailIcon
                                    aria-hidden="true"
                                    className="size-5 shrink-0 text-zinc-500"
                                />

                                <input
                                    id="footer-newsletter-email"
                                    name="newsletterEmail"
                                    type="email"
                                    autoComplete="email"
                                    value={
                                        newsletterEmail
                                    }
                                    onChange={(
                                        event
                                    ) => {
                                        setNewsletterEmail(
                                            event
                                                .target
                                                .value
                                        );

                                        setSubscriptionComplete(
                                            false
                                        );
                                    }}
                                    placeholder="Enter your email"
                                    disabled={
                                        isSubscribing
                                    }
                                    className="w-full bg-transparent px-3 py-3.5 text-sm text-zinc-100 outline-none placeholder:text-zinc-500 disabled:cursor-not-allowed"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={
                                    isSubscribing
                                }
                                className="flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-pink-500 to-pink-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-600/15 transition hover:from-pink-600 hover:to-pink-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {isSubscribing ? (
                                    <>
                                        <LoaderCircleIcon
                                            aria-hidden="true"
                                            className="size-4 animate-spin"
                                        />

                                        Joining...
                                    </>
                                ) : subscriptionComplete ? (
                                    <>
                                        Joined

                                        <CheckCircle2Icon
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </>
                                ) : (
                                    <>
                                        Subscribe

                                        <SendIcon
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-3 text-xs leading-5 text-zinc-500">
                            No spam. Unsubscribe
                            anytime.
                        </p>
                    </div>
                </div>

                {/* Bottom copyright and social links */}
                <div className="mt-14 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-7 text-center sm:flex-row sm:text-left">
                    <p className="text-sm text-zinc-500">
                        © {currentYear} Thumblify.
                        All rights reserved.
                    </p>

                    <div
                        aria-label="Thumblify social media links"
                        className="flex flex-wrap items-center justify-center gap-2.5"
                    >
                        {socialLinks.map(
                            ({
                                label,
                                href,
                                icon: Icon,
                            }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Follow Thumblify on ${label}`}
                                    title={label}
                                    className="group flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-400 transition hover:-translate-y-1 hover:border-pink-500/40 hover:bg-pink-500/10 hover:text-pink-400"
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="size-[18px] transition-transform group-hover:scale-110"
                                    />
                                </a>
                            )
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
}