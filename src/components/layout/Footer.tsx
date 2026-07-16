"use client";

import Image from "next/image";
import Link from "next/link";
import {
    DribbbleIcon,
    LinkedinIcon,
    TwitterIcon,
    YoutubeIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { footerData } from "@/data/footer";

const socialLinks = [
    {
        name: "Dribbble",
        href: "https://dribbble.com/",
        icon: DribbbleIcon,
    },
    {
        name: "LinkedIn",
        href: "https://linkedin.com/",
        icon: LinkedinIcon,
    },
    {
        name: "X",
        href: "https://x.com/",
        icon: TwitterIcon,
    },
    {
        name: "YouTube",
        href: "https://www.youtube.com/",
        icon: YoutubeIcon,
    },
];

const isExternalLink = (href: string) =>
    href.startsWith("http://") ||
    href.startsWith("https://");

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="mt-40 flex flex-wrap justify-center gap-10 overflow-hidden px-6 py-6 text-[13px] text-gray-500 md:justify-between md:gap-20 md:px-16 lg:px-24 xl:px-32">
            {/* Logo and footer menus */}
            <motion.div
                initial={{
                    x: -150,
                    opacity: 0,
                }}
                whileInView={{
                    x: 0,
                    opacity: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 70,
                    mass: 1,
                }}
                className="flex flex-wrap items-start gap-10 md:gap-35"
            >
                <Link
                    href="/"
                    aria-label="Go to Thumblify homepage"
                    className="shrink-0"
                >
                    <Image
                        src="/favicon.svg"
                        alt="Thumblify"
                        width={32}
                        height={32}
                        className="size-8"
                    />
                </Link>

                {footerData.map((section) => (
                    <nav
                        key={section.title}
                        aria-label={`${section.title} links`}
                    >
                        <p className="font-semibold text-slate-100">
                            {section.title}
                        </p>

                        <ul className="mt-2 space-y-2">
                            {section.links.map((link) => (
                                <li key={`${section.title}-${link.name}`}>
                                    {isExternalLink(link.href) ? (
                                        <a
                                            href={link.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transition hover:text-pink-600"
                                        >
                                            {link.name}
                                        </a>
                                    ) : (
                                        <Link
                                            href={link.href}
                                            className="transition hover:text-pink-600"
                                        >
                                            {link.name}
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </motion.div>

            {/* Social links and copyright */}
            <motion.div
                initial={{
                    x: 150,
                    opacity: 0,
                }}
                whileInView={{
                    x: 0,
                    opacity: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 70,
                    mass: 1,
                }}
                className="flex flex-col items-end gap-2 max-md:items-center max-md:text-center"
            >
                <p className="max-w-60">
                    Making every customer feel valued—no matter
                    the size of your audience.
                </p>

                <div className="mt-3 flex items-center gap-4">
                    {socialLinks.map((socialLink) => {
                        const Icon = socialLink.icon;

                        return (
                            <a
                                key={socialLink.name}
                                href={socialLink.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit Thumblify on ${socialLink.name}`}
                                className="transition hover:text-pink-500"
                            >
                                <Icon
                                    aria-hidden="true"
                                    className={
                                        socialLink.name === "YouTube"
                                            ? "size-6"
                                            : "size-5"
                                    }
                                />
                            </a>
                        );
                    })}
                </div>

                <p className="mt-3 text-center">
                    &copy; {currentYear}{" "}
                    <Link
                        href="/"
                        className="transition hover:text-pink-500"
                    >
                        Thumblify
                    </Link>
                </p>
            </motion.div>
        </footer>
    );
}