"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function CTASection() {
    return (
        <motion.section
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
            className="mx-4 mt-40 flex max-w-5xl flex-col items-center justify-between gap-6 rounded-2xl bg-linear-to-b from-pink-900 to-pink-950 p-6 py-16 text-left text-white md:mx-auto md:w-full md:flex-row md:gap-0 md:pl-20"
        >
            <div>
                <motion.h2
                    initial={{
                        y: 80,
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
                        stiffness: 280,
                        damping: 70,
                        mass: 1,
                    }}
                    className="bg-linear-to-r from-white to-pink-400 bg-clip-text text-4xl font-semibold text-transparent md:text-[46px] md:leading-15"
                >
                    Ready to go viral?
                </motion.h2>

                <motion.p
                    initial={{
                        y: 80,
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
                        stiffness: 200,
                        damping: 70,
                        mass: 1,
                    }}
                    className="bg-linear-to-r from-white to-pink-400 bg-clip-text text-lg text-transparent"
                >
                    Join thousands of creators using AI to boost their CTR.
                </motion.p>
            </div>

            <motion.div
                initial={{
                    y: 80,
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
                    stiffness: 280,
                    damping: 70,
                    mass: 1,
                }}
                className="mt-4 md:mt-0"
            >
                <Link
                    href="/generate"
                    className="inline-flex rounded-full bg-white px-12 py-3 text-sm text-slate-800 transition hover:bg-slate-200"
                >
                    Generate Free Thumbnail
                </Link>
            </motion.div>
        </motion.section>
    );
}