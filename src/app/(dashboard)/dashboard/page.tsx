import type {
    Metadata,
} from "next";

import Link from "next/link";

import {
    ArrowRight,
    Coins,
    CreditCard,
    Images,
    Sparkles,
    Zap,
} from "lucide-react";

export const metadata:
    Metadata = {
    title: "Dashboard",

    description:
        "View your Thumblify account overview, credits, generations and billing activity.",
};

const dashboardStats = [
    {
        label:
            "Available Credits",

        value: "—",

        description:
            "Your current credit balance",

        icon: Coins,
    },
    {
        label:
            "Credits Used",

        value: "—",

        description:
            "All-time credit usage",

        icon: Zap,
    },
    {
        label:
            "Total Generations",

        value: "—",

        description:
            "Thumbnails you have created",

        icon: Images,
    },
    {
        label:
            "Current Plan",

        value: "—",

        description:
            "Your active package or plan",

        icon: CreditCard,
    },
];

export default function DashboardPage() {
    return (
        <div className="relative z-10 min-h-screen px-4 pb-12 pt-24 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <section className="overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-pink-600/15 via-purple-600/8 to-transparent p-6 shadow-2xl shadow-black/20 sm:p-8">
                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-pink-400/20 bg-pink-400/10 px-3 py-1 text-xs font-medium text-pink-200">
                                <Sparkles
                                    aria-hidden="true"
                                    className="size-3.5"
                                />

                                Thumblify Workspace
                            </div>

                            <h2 className="max-w-2xl text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Welcome to your
                                creative dashboard
                            </h2>

                            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                                Create thumbnails,
                                review your recent
                                work and manage your
                                account from one
                                place.
                            </p>
                        </div>

                        <Link
                            href="/generate"
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-950/30 transition hover:opacity-90"
                        >
                            <Sparkles
                                aria-hidden="true"
                                className="size-4"
                            />

                            Generate Thumbnail
                        </Link>
                    </div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {dashboardStats.map(
                        (stat) => {
                            const Icon =
                                stat.icon;

                            return (
                                <article
                                    key={
                                        stat.label
                                    }
                                    className="rounded-2xl border border-white/8 bg-white/[0.035] p-5 shadow-xl shadow-black/10"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-sm text-zinc-500">
                                                {
                                                    stat.label
                                                }
                                            </p>

                                            <p className="mt-3 text-3xl font-bold text-white">
                                                {
                                                    stat.value
                                                }
                                            </p>
                                        </div>

                                        <span className="flex size-11 items-center justify-center rounded-xl border border-pink-500/15 bg-pink-500/10 text-pink-300">
                                            <Icon
                                                aria-hidden="true"
                                                className="size-5"
                                            />
                                        </span>
                                    </div>

                                    <p className="mt-4 text-xs text-zinc-600">
                                        {
                                            stat.description
                                        }
                                    </p>
                                </article>
                            );
                        }
                    )}
                </section>

                <section className="mt-6 grid gap-6 xl:grid-cols-[1.5fr_1fr]">
                    <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-semibold text-white">
                                    Recent
                                    Generations
                                </h3>

                                <p className="mt-1 text-sm text-zinc-500">
                                    Your latest
                                    generated
                                    thumbnails will
                                    appear here.
                                </p>
                            </div>

                            <Link
                                href="/generations"
                                className="inline-flex items-center gap-1 text-sm font-medium text-pink-300 transition hover:text-pink-200"
                            >
                                View all

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <div className="mt-8 flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/15 px-6 text-center">
                            <span className="flex size-14 items-center justify-center rounded-2xl bg-white/5 text-zinc-500">
                                <Images
                                    aria-hidden="true"
                                    className="size-7"
                                />
                            </span>

                            <h4 className="mt-4 font-medium text-zinc-200">
                                Generation data
                                will appear here
                            </h4>

                            <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-500">
                                We will connect this
                                area with your real
                                thumbnail records in
                                the next data
                                integration stage.
                            </p>
                        </div>
                    </article>

                    <article className="rounded-2xl border border-white/8 bg-white/[0.035] p-6">
                        <h3 className="text-lg font-semibold text-white">
                            Quick Actions
                        </h3>

                        <p className="mt-1 text-sm text-zinc-500">
                            Access important areas
                            of your account.
                        </p>

                        <div className="mt-6 space-y-3">
                            <Link
                                href="/generate"
                                className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-pink-500/20 hover:bg-pink-500/5"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-pink-500/10 text-pink-300">
                                        <Sparkles
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>

                                    <span>
                                        <span className="block text-sm font-medium text-white">
                                            Generate
                                            Thumbnail
                                        </span>

                                        <span className="mt-0.5 block text-xs text-zinc-500">
                                            Start a
                                            new design
                                        </span>
                                    </span>
                                </span>

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 text-zinc-600"
                                />
                            </Link>

                            <Link
                                href="/credits"
                                className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-pink-500/20 hover:bg-pink-500/5"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
                                        <Coins
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>

                                    <span>
                                        <span className="block text-sm font-medium text-white">
                                            Credits
                                            &amp;
                                            Usage
                                        </span>

                                        <span className="mt-0.5 block text-xs text-zinc-500">
                                            Check
                                            credit
                                            activity
                                        </span>
                                    </span>
                                </span>

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 text-zinc-600"
                                />
                            </Link>

                            <Link
                                href="/billing"
                                className="flex items-center justify-between rounded-xl border border-white/8 bg-white/[0.03] p-4 transition hover:border-pink-500/20 hover:bg-pink-500/5"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex size-10 items-center justify-center rounded-xl bg-sky-500/10 text-sky-300">
                                        <CreditCard
                                            aria-hidden="true"
                                            className="size-5"
                                        />
                                    </span>

                                    <span>
                                        <span className="block text-sm font-medium text-white">
                                            Billing
                                            &amp;
                                            Payments
                                        </span>

                                        <span className="mt-0.5 block text-xs text-zinc-500">
                                            View
                                            payment
                                            history
                                        </span>
                                    </span>
                                </span>

                                <ArrowRight
                                    aria-hidden="true"
                                    className="size-4 text-zinc-600"
                                />
                            </Link>
                        </div>
                    </article>
                </section>
            </div>
        </div>
    );
}