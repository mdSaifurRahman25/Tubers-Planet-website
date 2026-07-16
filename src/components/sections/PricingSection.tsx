"use client";

import Link from "next/link";
import { CheckIcon } from "lucide-react";
import { motion } from "motion/react";

import SectionTitle from "@/components/ui/SectionTitle";
import { pricingData } from "@/data/pricing";

export default function PricingSection() {
    return (
        <section
            id="pricing"
            aria-labelledby="pricing-heading"
            className="px-4 md:px-16 lg:px-24 xl:px-32"
        >
            <SectionTitle
                text1="Pricing"
                text2="Simple Pricing"
                text3="Choose the plan that fits your creation schedule. Cancel anytime."
                headingId="pricing-heading"
            />

            <div className="mt-20 flex flex-wrap items-center justify-center gap-8">
                {pricingData.map((plan, index) => (
                    <motion.article
                        key={plan.name}
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
                        className={`w-72 rounded-xl border border-pink-950 p-6 pb-16 text-center ${plan.mostPopular
                            ? "relative bg-pink-950"
                            : "bg-pink-950/30"
                            }`}
                    >
                        {plan.mostPopular && (
                            <p className="absolute -top-3.5 left-3.5 rounded-full bg-pink-400 px-3 py-1 text-sm text-white">
                                Most Popular
                            </p>
                        )}

                        <p className="font-semibold">
                            {plan.name}
                        </p>

                        <h3 className="text-3xl font-semibold">
                            ${plan.price}

                            <span className="text-sm font-normal text-gray-500">
                                /{plan.period}
                            </span>
                        </h3>

                        <ul className="mt-6 space-y-2 text-slate-300">
                            {plan.features.map((feature) => (
                                <li
                                    key={feature}
                                    className="flex items-center gap-2 text-left"
                                >
                                    <CheckIcon
                                        aria-hidden="true"
                                        className="size-4.5 shrink-0 text-pink-600"
                                    />

                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <Link
                            href="/generate"
                            className={`mt-7 flex w-full items-center justify-center rounded-md py-2.5 font-medium transition-all ${plan.mostPopular
                                ? "bg-white text-pink-600 hover:bg-slate-200"
                                : "bg-pink-500 text-white hover:bg-pink-600"
                                }`}
                        >
                            Get Started
                        </Link>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}