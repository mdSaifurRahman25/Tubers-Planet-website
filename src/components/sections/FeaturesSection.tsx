"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

import SectionTitle from "@/components/ui/SectionTitle";
import { featuresData } from "@/data/features";

export default function FeaturesSection() {
    return (
        <section
            id="features"
            aria-labelledby="features-heading"
            className="relative overflow-hidden px-4 md:px-16 lg:px-24 xl:px-32"
        >
            <SectionTitle
                text1="Features"
                text2="Why use our generator?"
                text3="Create stunning thumbnails that get clicks, without the hassle."
                headingId="features-heading"
            />

            {/* Feature cards */}
            <div className="mt-16 flex flex-wrap items-center justify-center gap-6 px-6 md:gap-4">
                {featuresData.map((feature, index) => (
                    <motion.article
                        key={feature.title}
                        initial={{
                            y: 150,
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
                            delay: index * 0.15,
                            type: "spring",
                            stiffness: 320,
                            damping: 70,
                            mass: 1,
                        }}
                        className={
                            index === 1
                                ? "rounded-[13px] bg-linear-to-br from-pink-600 to-slate-800 p-px"
                                : ""
                        }
                    >
                        <div className="w-full max-w-80 space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-6">
                            <Image
                                src={feature.icon}
                                alt={`${feature.title} icon`}
                                width={44}
                                height={44}
                                className="size-11 object-contain"
                            />

                            <h3 className="text-base font-medium text-white">
                                {feature.title}
                            </h3>

                            <p className="line-clamp-2 pb-4 text-slate-400">
                                {feature.description}
                            </p>
                        </div>
                    </motion.article>
                ))}
            </div>

            {/* Feature showcase */}
            <div className="relative mx-auto mt-40 max-w-5xl">
                <div
                    aria-hidden="true"
                    className="absolute -top-10 -left-20 -z-10 size-100 rounded-full bg-pink-500/40 blur-3xl"
                />

                <motion.p
                    initial={{
                        y: 150,
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
                    className="max-w-3xl text-left text-lg text-slate-300"
                >
                    Our AI understands what makes a video go viral and
                    designs thumbnails accordingly.
                </motion.p>

                <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3">
                    <motion.div
                        initial={{
                            y: 150,
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
                        className="md:col-span-2"
                    >
                        <Image
                            src="/assets/features-showcase-1.png"
                            alt="Thumblify AI thumbnail generation showcase"
                            width={1000}
                            height={500}
                            sizes="(max-width: 768px) 100vw, 66vw"
                            className="h-auto w-full rounded-xl"
                        />
                    </motion.div>

                    <motion.div
                        initial={{
                            y: 150,
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
                            delay: 0.15,
                            type: "spring",
                            stiffness: 320,
                            damping: 70,
                            mass: 1,
                        }}
                        className="md:col-span-1"
                    >
                        <Image
                            src="/assets/features-showcase-2.png"
                            alt="AI-optimized YouTube thumbnail example"
                            width={1000}
                            height={500}
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="h-auto w-full rounded-xl transition duration-300 hover:-translate-y-0.5"
                        />

                        <h3 className="mt-6 text-2xl leading-[1.875rem] font-medium text-slate-300">
                            Boost your views with AI-optimized designs
                        </h3>

                        <p className="mt-2 text-slate-300">
                            Stop guessing and start ranking. Our AI creates
                            designs proven to capture attention.
                        </p>

                        <Link
                            href="/generate"
                            className="group mt-4 flex items-center gap-2 text-pink-600 transition hover:text-pink-700"
                        >
                            <span>Start generating free</span>

                            <ArrowUpRight
                                aria-hidden="true"
                                className="size-5 transition-transform duration-300 group-hover:translate-x-0.5"
                            />
                        </Link>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}