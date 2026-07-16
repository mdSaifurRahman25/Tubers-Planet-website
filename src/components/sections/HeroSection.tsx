"use client";

import Link from "next/link";
import {
    CheckIcon,
    ChevronRightIcon,
    VideoIcon,
} from "lucide-react";
import { motion } from "motion/react";

import TiltedImage from "@/components/thumbnail/TiltedImage";

const specialFeatures = [
    "No design skill needed",
    "Fast generation",
    "High CTR templates",
];

export default function HeroSection() {
    return (
        <section
            id="home"
            aria-labelledby="hero-heading"
            className="relative flex flex-col items-center justify-center overflow-hidden px-4 md:px-16 lg:px-24 xl:px-32"
        >
            {/* Background glow */}
            <div
                aria-hidden="true"
                className="absolute top-30 left-1/4 -z-10 size-72 rounded-full bg-pink-600 blur-[300px]"
            />

            {/* Announcement */}
            <motion.div
                initial={{
                    y: -20,
                    opacity: 0,
                }}
                whileInView={{
                    y: 0,
                    opacity: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 320,
                    damping: 70,
                    mass: 1,
                }}
                className="mt-44"
            >
                <Link
                    href="/generate"
                    className="group flex items-center gap-2 rounded-full bg-pink-200/15 p-1 pr-3 text-pink-100"
                >
                    <span className="rounded-full bg-pink-800 px-3.5 py-1 text-xs text-white">
                        NEW
                    </span>

                    <span className="flex items-center gap-1 text-sm sm:text-base">
                        <span>
                            Generate your first thumbnail for free
                        </span>

                        <ChevronRightIcon
                            size={16}
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:translate-x-0.5"
                        />
                    </span>
                </Link>
            </motion.div>

            {/* Main heading */}
            <motion.h1
                id="hero-heading"
                initial={{
                    y: 50,
                    opacity: 0,
                }}
                whileInView={{
                    y: 0,
                    opacity: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    type: "spring",
                    stiffness: 240,
                    damping: 70,
                    mass: 1,
                }}
                className="max-w-3xl text-center text-5xl/17 font-medium md:text-6xl/21"
            >
                AI Thumbnail Generator for your{" "}
                <span className="move-gradient inline-block rounded-xl px-3 whitespace-nowrap">
                    Videos.
                </span>
            </motion.h1>

            {/* Description */}
            <motion.p
                initial={{
                    y: 50,
                    opacity: 0,
                }}
                whileInView={{
                    y: 0,
                    opacity: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    delay: 0.2,
                    type: "spring",
                    stiffness: 320,
                    damping: 70,
                    mass: 1,
                }}
                className="mt-6 max-w-lg text-center text-base text-slate-200"
            >
                Stop wasting hours on design. Get
                high-converting thumbnails in seconds with
                our advanced AI.
            </motion.p>

            {/* Action buttons */}
            <motion.div
                initial={{
                    y: 50,
                    opacity: 0,
                }}
                whileInView={{
                    y: 0,
                    opacity: 1,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    type: "spring",
                    stiffness: 320,
                    damping: 70,
                    mass: 1,
                }}
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
                <Link
                    href="/generate"
                    className="flex h-11 items-center justify-center rounded-full bg-pink-600 px-7 text-white transition hover:bg-pink-700 active:scale-95"
                >
                    Generate Now
                </Link>

                <Link
                    href="/#how-it-works"
                    className="flex h-11 items-center gap-2 rounded-full border border-pink-900 px-6 transition hover:bg-pink-950/50"
                >
                    <VideoIcon
                        strokeWidth={1}
                        aria-hidden="true"
                    />

                    <span>See how it works</span>
                </Link>
            </motion.div>

            {/* Special features */}
            <ul className="mt-12 flex flex-wrap items-center justify-center gap-4 md:gap-14">
                {specialFeatures.map((feature, index) => (
                    <motion.li
                        key={feature}
                        initial={{
                            y: 30,
                            opacity: 0,
                        }}
                        whileInView={{
                            y: 0,
                            opacity: 1,
                        }}
                        viewport={{
                            once: true,
                        }}
                        transition={{
                            delay: index * 0.2,
                            duration: 0.3,
                        }}
                        className="flex items-center gap-2"
                    >
                        <CheckIcon
                            aria-hidden="true"
                            className="size-5 text-pink-600"
                        />

                        <span className="text-slate-400">
                            {feature}
                        </span>
                    </motion.li>
                ))}
            </ul>

            <TiltedImage />
        </section>
    );
}