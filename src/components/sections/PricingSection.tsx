"use client";

import Link from "next/link";

import {
    Building2Icon,
    CheckIcon,
    CircleDollarSignIcon,
    CreditCardIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UserRoundIcon,
    type LucideIcon,
} from "lucide-react";

import { motion } from "motion/react";
import { useState } from "react";

import SectionTitle from "@/components/ui/SectionTitle";

type BillingCycle =
    | "monthly"
    | "yearly";

interface PricingPlan {
    id: "free" | "pro" | "business";
    name: string;
    description: string;
    icon: LucideIcon;
    monthlyPrice: number;
    yearlyMonthlyPrice: number;
    yearlyTotal: number;
    credits: string;
    features: string[];
    ctaLabel: string;
    featured?: boolean;
    badge?: string;
}

const pricingPlans: PricingPlan[] = [
    {
        id: "free",

        name: "Free",

        description:
            "For new creators who want to explore Thumblify before upgrading.",

        icon: UserRoundIcon,

        monthlyPrice: 0,

        yearlyMonthlyPrice: 0,

        yearlyTotal: 0,

        credits:
            "3 lifetime generation credits",

        ctaLabel: "Start Free",

        features: [
            "Account required",
            "3 lifetime standard generations",
            "No credit card required",
            "No watermark on downloads",
            "Generate from title and prompt",
            "Upload up to 3 reference images",
            "All available aspect ratios",
            "Thumbnail styles and color controls",
            "Standard generation access",
        ],
    },

    {
        id: "pro",

        name: "Creator Pro",

        description:
            "For active YouTubers who create and test thumbnails regularly.",

        icon: SparklesIcon,

        monthlyPrice: 12,

        yearlyMonthlyPrice: 9,

        yearlyTotal: 108,

        credits:
            "100 generation credits per month",

        ctaLabel: "Upgrade to Pro",

        featured: true,

        badge: "Most Popular",

        features: [
            "Everything included in Free",
            "100 generation credits every month",
            "Generate and Regenerate access",
            "Premium Enhance access",
            "Upload up to 3 reference images",
            "Save and compare all versions",
            "Select any preferred version",
            "Full thumbnail project history",
            "No watermark on downloads",
            "Faster generation priority",
            "Email support",
        ],
    },

    {
        id: "business",

        name: "Business",

        description:
            "For agencies, teams, and creators who need thumbnails in bulk.",

        icon: Building2Icon,

        monthlyPrice: 39,

        yearlyMonthlyPrice: 29,

        yearlyTotal: 348,

        credits:
            "500 generation credits per month",

        ctaLabel: "Contact Sales",

        badge: "Bulk Package",

        features: [
            "Everything included in Creator Pro",
            "500 shared generation credits monthly",
            "Built for high-volume thumbnail creation",
            "Bulk generation allowance",
            "Multiple channel and client workflows",
            "Premium Enhance access",
            "Additional credit top-ups",
            "Priority generation handling",
            "Priority email and WhatsApp support",
            "Business onboarding assistance",
        ],
    },
];

const getPlanHref = (
    planId: PricingPlan["id"],
    billingCycle: BillingCycle
): string => {
    if (planId === "free") {
        return "/generate";
    }

    const searchParams =
        new URLSearchParams({
            plan: planId,
            billing: billingCycle,
        });

    return `/contact?${searchParams.toString()}`;
};

const getYearlySaving = (
    plan: PricingPlan
): number => {
    if (
        plan.monthlyPrice === 0 ||
        plan.yearlyTotal === 0
    ) {
        return 0;
    }

    return (
        plan.monthlyPrice * 12 -
        plan.yearlyTotal
    );
};

interface PricingCardsProps {
    showIntroNote?: boolean;
}

export function PricingCards({
    showIntroNote = true,
}: PricingCardsProps) {
    const [
        billingCycle,
        setBillingCycle,
    ] =
        useState<BillingCycle>(
            "yearly"
        );

    const isYearly =
        billingCycle === "yearly";

    return (
        <div>
            {/* Billing selector */}
            <div className="mt-10 flex flex-col items-center">
                <div
                    role="group"
                    aria-label="Choose billing cycle"
                    className="relative flex items-center rounded-full border border-white/10 bg-white/5 p-1"
                >
                    <button
                        type="button"
                        onClick={() =>
                            setBillingCycle(
                                "monthly"
                            )
                        }
                        aria-pressed={
                            billingCycle ===
                            "monthly"
                        }
                        className={`relative z-10 rounded-full px-5 py-2.5 text-sm font-medium transition ${billingCycle ===
                            "monthly"
                            ? "bg-white text-zinc-950 shadow-lg"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        Monthly
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setBillingCycle(
                                "yearly"
                            )
                        }
                        aria-pressed={
                            billingCycle ===
                            "yearly"
                        }
                        className={`relative z-10 flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition ${billingCycle ===
                            "yearly"
                            ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                            : "text-zinc-400 hover:text-white"
                            }`}
                    >
                        Yearly

                        <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${billingCycle ===
                                "yearly"
                                ? "bg-white/15 text-white"
                                : "bg-emerald-400/10 text-emerald-300"
                                }`}
                        >
                            Save up to 26%
                        </span>
                    </button>
                </div>

                {showIntroNote && (
                    <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
                        Yearly plans are paid
                        once per year and shown
                        as their monthly
                        equivalent.
                    </p>
                )}
            </div>

            {/* Pricing cards */}
            <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-3">
                {pricingPlans.map(
                    (plan, index) => {
                        const Icon =
                            plan.icon;

                        const displayPrice =
                            isYearly
                                ? plan.yearlyMonthlyPrice
                                : plan.monthlyPrice;

                        const yearlySaving =
                            getYearlySaving(
                                plan
                            );

                        return (
                            <motion.article
                                key={plan.id}
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
                                    amount: 0.15,
                                }}
                                transition={{
                                    delay:
                                        index *
                                        0.1,

                                    type:
                                        "spring",

                                    stiffness:
                                        220,

                                    damping:
                                        32,
                                }}
                                className={`relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 shadow-2xl sm:p-7 ${plan.featured
                                    ? "border-pink-500/50 bg-linear-to-b from-pink-500/15 via-purple-500/8 to-white/5 shadow-pink-950/30 lg:-translate-y-3"
                                    : "border-white/10 bg-white/6"
                                    }`}
                            >
                                {plan.featured && (
                                    <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-pink-500 via-purple-400 to-pink-500" />
                                )}

                                {plan.badge && (
                                    <span
                                        className={`absolute top-5 right-5 rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${plan.featured
                                            ? "border-pink-400/30 bg-pink-400/15 text-pink-200"
                                            : "border-purple-400/25 bg-purple-400/10 text-purple-300"
                                            }`}
                                    >
                                        {
                                            plan.badge
                                        }
                                    </span>
                                )}

                                <div
                                    className={`flex size-12 items-center justify-center rounded-2xl border ${plan.featured
                                        ? "border-pink-400/30 bg-pink-400/15 text-pink-300"
                                        : "border-white/10 bg-white/5 text-zinc-300"
                                        }`}
                                >
                                    <Icon
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </div>

                                <div className="mt-6">
                                    <h3 className="text-xl font-bold text-white">
                                        {
                                            plan.name
                                        }
                                    </h3>

                                    <p className="mt-2 min-h-14 text-sm leading-6 text-zinc-400">
                                        {
                                            plan.description
                                        }
                                    </p>
                                </div>

                                <div className="mt-6 border-b border-white/10 pb-6">
                                    <div className="flex items-end gap-1">
                                        <span className="text-sm font-medium text-zinc-400">
                                            $
                                        </span>

                                        <span className="text-5xl font-bold tracking-tight text-white">
                                            {
                                                displayPrice
                                            }
                                        </span>

                                        {displayPrice >
                                            0 && (
                                                <span className="mb-1 text-sm text-zinc-500">
                                                    /month
                                                </span>
                                            )}
                                    </div>

                                    {plan.id ===
                                        "free" ? (
                                        <p className="mt-3 text-sm font-medium text-emerald-300">
                                            Free forever
                                        </p>
                                    ) : isYearly ? (
                                        <div className="mt-3 space-y-1">
                                            <p className="text-sm text-zinc-300">
                                                $
                                                {
                                                    plan.yearlyTotal
                                                }{" "}
                                                billed once
                                                per year
                                            </p>

                                            <p className="text-xs text-emerald-300">
                                                Save $
                                                {
                                                    yearlySaving
                                                }{" "}
                                                every year
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="mt-3 text-sm text-zinc-400">
                                            Billed
                                            monthly.
                                            Cancel
                                            anytime.
                                        </p>
                                    )}

                                    <div className="mt-5 flex items-center gap-2 rounded-xl border border-white/10 bg-black/20 px-3 py-2.5">
                                        <CircleDollarSignIcon
                                            aria-hidden="true"
                                            className="size-4 shrink-0 text-pink-400"
                                        />

                                        <span className="text-xs font-medium text-zinc-300">
                                            {
                                                plan.credits
                                            }
                                        </span>
                                    </div>
                                </div>

                                <ul className="mt-6 flex-1 space-y-3.5">
                                    {plan.features.map(
                                        (
                                            feature
                                        ) => (
                                            <li
                                                key={
                                                    feature
                                                }
                                                className="flex items-start gap-3 text-sm leading-6 text-zinc-300"
                                            >
                                                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-400/10">
                                                    <CheckIcon
                                                        aria-hidden="true"
                                                        className="size-3.5 text-emerald-400"
                                                    />
                                                </span>

                                                <span>
                                                    {
                                                        feature
                                                    }
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                                <Link
                                    href={getPlanHref(
                                        plan.id,
                                        billingCycle
                                    )}
                                    className={`mt-8 flex w-full items-center justify-center rounded-xl px-5 py-3.5 text-sm font-semibold transition ${plan.featured
                                        ? "bg-linear-to-b from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-600/20 hover:from-pink-600 hover:to-pink-700"
                                        : plan.id ===
                                            "business"
                                            ? "border border-purple-400/30 bg-purple-400/10 text-purple-200 hover:bg-purple-400/15"
                                            : "border border-white/12 bg-white/8 text-white hover:border-pink-500/30 hover:bg-white/12"
                                        }`}
                                >
                                    {
                                        plan.ctaLabel
                                    }
                                </Link>

                                {plan.id ===
                                    "free" && (
                                        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-zinc-500">
                                            <CreditCardIcon
                                                aria-hidden="true"
                                                className="size-3.5"
                                            />

                                            No credit
                                            card required
                                        </div>
                                    )}
                            </motion.article>
                        );
                    }
                )}
            </div>

            {/* Trust information */}
            <div className="mt-10 grid gap-3 text-sm text-zinc-400 sm:grid-cols-3">
                <div className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                    <CreditCardIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-pink-400"
                    />

                    Free plan needs no card
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                    <ShieldCheckIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-emerald-400"
                    />

                    No watermark on any plan
                </div>

                <div className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                    <CircleDollarSignIcon
                        aria-hidden="true"
                        className="size-4 shrink-0 text-purple-400"
                    />

                    Cancel paid plans anytime
                </div>
            </div>

            <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-5 text-zinc-500">
                Standard Generate and
                Regenerate actions use one
                credit. Premium Enhance may
                use additional credits because
                it performs a more advanced
                image-processing operation.
            </p>
        </div>
    );
}

export default function PricingSection() {
    return (
        <section
            id="pricing"
            aria-labelledby="pricing-heading"
            className="px-4 py-24 md:px-16 lg:px-24 xl:px-32"
        >
            <div className="mx-auto max-w-7xl">
                <SectionTitle
                    text1="Pricing"
                    text2="Simple Pricing for Every Creator"
                    text3="Start free, upgrade when you need more generations, or choose a bulk package for your team or agency."
                    headingId="pricing-heading"
                />

                <PricingCards />
            </div>
        </section>
    );
}