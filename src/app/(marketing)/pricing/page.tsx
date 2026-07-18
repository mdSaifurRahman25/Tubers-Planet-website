import type { Metadata } from "next";
import Link from "next/link";

import {
    ArrowRightIcon,
    Building2Icon,
    CheckIcon,
    CircleHelpIcon,
    Clock3Icon,
    CoinsIcon,
    CreditCardIcon,
    Layers3Icon,
    RefreshCwIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UsersIcon,
    WandSparklesIcon,
    XIcon,
} from "lucide-react";

import {
    PricingCards,
} from "@/components/sections/PricingSection";

import SoftBackdrop from "@/components/ui/SoftBackdrop";

const siteUrl =
    process.env
        .NEXT_PUBLIC_SITE_URL
        ?.replace(
            /\/+$/,
            ""
        ) ||
    "http://localhost:3000";

export const metadata: Metadata = {
    title:
        "Thumblify Pricing | Free, Pro & Business Plans",

    description:
        "Compare Thumblify Free, Creator Pro, and Business plans. Create 3 thumbnails free without a credit card or watermark, or upgrade for more credits, Premium Enhance, and bulk generation.",

    keywords: [
        "Thumblify pricing",
        "AI thumbnail generator pricing",
        "free YouTube thumbnail generator",
        "YouTube thumbnail generator plans",
        "thumbnail generator without watermark",
        "AI thumbnail business plan",
        "bulk YouTube thumbnail generation",
        "thumbnail generator for agencies",
    ],

    alternates: {
        canonical:
            `${siteUrl}/pricing`,
    },

    openGraph: {
        title:
            "Thumblify Pricing | Start Free, Upgrade When You Grow",

        description:
            "Create 3 thumbnails free with no credit card and no watermark. Compare Creator Pro and Business plans for regular and bulk thumbnail generation.",

        url:
            `${siteUrl}/pricing`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "Thumblify Pricing | Free, Pro & Business",

        description:
            "Start with 3 free thumbnail generations, then upgrade for more credits, advanced enhancement, version history, and bulk usage.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

interface ComparisonFeature {
    feature: string;
    free: string | boolean;
    pro: string | boolean;
    business: string | boolean;
}

const comparisonFeatures: ComparisonFeature[] = [
    {
        feature:
            "Generation credits",

        free:
            "3 lifetime",

        pro:
            "100 per month",

        business:
            "500 per month",
    },

    {
        feature:
            "Credit card required to start",

        free:
            false,

        pro:
            true,

        business:
            true,
    },

    {
        feature:
            "Watermark-free downloads",

        free:
            true,

        pro:
            true,

        business:
            true,
    },

    {
        feature:
            "Generate from title and prompt",

        free:
            true,

        pro:
            true,

        business:
            true,
    },

    {
        feature:
            "Reference image uploads",

        free:
            "Up to 3",

        pro:
            "Up to 3",

        business:
            "Up to 3",
    },

    {
        feature:
            "Regenerate thumbnail versions",

        free:
            "Using available credits",

        pro:
            true,

        business:
            true,
    },

    {
        feature:
            "Premium Enhance",

        free:
            false,

        pro:
            true,

        business:
            true,
    },

    {
        feature:
            "Version comparison",

        free:
            "Basic",

        pro:
            "Full history",

        business:
            "Full history",
    },

    {
        feature:
            "Bulk generation allowance",

        free:
            false,

        pro:
            false,

        business:
            true,
    },

    {
        feature:
            "Multiple channel workflows",

        free:
            false,

        pro:
            false,

        business:
            true,
    },

    {
        feature:
            "Additional credit options",

        free:
            false,

        pro:
            "Available",

        business:
            "Custom packages",
    },

    {
        feature:
            "Support",

        free:
            "Standard",

        pro:
            "Email support",

        business:
            "Priority support",
    },
];

const creditRules = [
    {
        title:
            "Standard Generate",

        credits:
            "1 credit",

        description:
            "Create a new thumbnail from your title, settings, prompt, and optional reference images.",

        icon:
            WandSparklesIcon,
    },

    {
        title:
            "Regenerate",

        credits:
            "1 credit",

        description:
            "Create a fresh version while keeping the original thumbnail project and previous versions.",

        icon:
            RefreshCwIcon,
    },

    {
        title:
            "Premium Enhance",

        credits:
            "3 credits",

        description:
            "Use the advanced enhancement workflow to refine a current result or combine uploaded visual references.",

        icon:
            SparklesIcon,
    },
];

const pricingFaqs = [
    {
        question:
            "Do I need a credit card for the Free plan?",

        answer:
            "No. You can create an account and use the 3 free lifetime generation credits without adding a credit or debit card.",
    },

    {
        question:
            "Will Free plan thumbnails contain a watermark?",

        answer:
            "No. Thumbnails downloaded from the Free, Creator Pro, and Business plans will not contain a Thumblify watermark.",
    },

    {
        question:
            "Are the 3 Free plan credits renewed every month?",

        answer:
            "No. The Free plan includes 3 lifetime generation credits for each account. After using them, you can upgrade to a paid plan.",
    },

    {
        question:
            "What happens after I use my free credits?",

        answer:
            "Your account and previously generated thumbnails will remain available. You will need to upgrade before creating additional versions or thumbnails.",
    },

    {
        question:
            "How does yearly billing work?",

        answer:
            "The yearly selector shows the effective monthly price, but the full annual amount is charged once per year. For example, Creator Pro is shown as $9 per month and billed as $108 annually.",
    },

    {
        question:
            "Do paid credits reset every month?",

        answer:
            "Yes. Monthly plan credits reset on the monthly subscription renewal date. Yearly customers are billed annually, while their included credits are allocated monthly.",
    },

    {
        question:
            "Do unused credits roll over?",

        answer:
            "Included monthly credits do not currently roll over to the next billing month. This keeps plan limits and generation capacity predictable.",
    },

    {
        question:
            "Can I change from monthly to yearly billing?",

        answer:
            "Yes. You can request a billing-cycle change. The new billing cycle will apply according to your subscription and renewal date.",
    },

    {
        question:
            "Can I cancel a paid plan?",

        answer:
            "Yes. Paid plans can be cancelled. Your paid access will normally continue until the end of the billing period already paid for.",
    },

    {
        question:
            "Who should choose the Business plan?",

        answer:
            "The Business plan is intended for agencies, creator teams, high-volume channels, freelancers managing multiple clients, and users who regularly need thumbnails in bulk.",
    },

    {
        question:
            "Can Business users purchase more credits?",

        answer:
            "Yes. Business users can discuss additional credit packages and higher-volume requirements with the Thumblify team.",
    },

    {
        question:
            "Does purchasing a plan guarantee more video views?",

        answer:
            "No service can guarantee views or channel growth. Thumblify helps you create and test stronger thumbnail concepts, while video performance also depends on the topic, audience, title, content quality, and distribution.",
    },
];

const renderComparisonValue = (
    value: string | boolean
) => {
    if (
        typeof value ===
        "string"
    ) {
        return (
            <span className="text-sm text-zinc-300">
                {value}
            </span>
        );
    }

    if (value) {
        return (
            <span
                aria-label="Included"
                className="mx-auto flex size-6 items-center justify-center rounded-full bg-emerald-400/10"
            >
                <CheckIcon
                    aria-hidden="true"
                    className="size-4 text-emerald-400"
                />
            </span>
        );
    }

    return (
        <span
            aria-label="Not included"
            className="mx-auto flex size-6 items-center justify-center rounded-full bg-white/5"
        >
            <XIcon
                aria-hidden="true"
                className="size-4 text-zinc-600"
            />
        </span>
    );
};

export default function PricingPage() {
    const pricingPageSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "WebPage",

        name:
            "Thumblify Pricing",

        description:
            "Compare Thumblify Free, Creator Pro, and Business pricing plans.",

        url:
            `${siteUrl}/pricing`,

        mainEntity: {
            "@type":
                "OfferCatalog",

            name:
                "Thumblify Plans",

            itemListElement: [
                {
                    "@type":
                        "Offer",

                    name:
                        "Free",

                    price:
                        "0",

                    priceCurrency:
                        "USD",

                    description:
                        "3 lifetime thumbnail generation credits with no credit card and no watermark.",
                },

                {
                    "@type":
                        "Offer",

                    name:
                        "Creator Pro Monthly",

                    price:
                        "12",

                    priceCurrency:
                        "USD",

                    description:
                        "100 monthly generation credits, Premium Enhance, version history, and priority generation.",
                },

                {
                    "@type":
                        "Offer",

                    name:
                        "Creator Pro Yearly",

                    price:
                        "108",

                    priceCurrency:
                        "USD",

                    description:
                        "Creator Pro billed annually at an effective rate of 9 USD per month.",
                },

                {
                    "@type":
                        "Offer",

                    name:
                        "Business Monthly",

                    price:
                        "39",

                    priceCurrency:
                        "USD",

                    description:
                        "500 monthly generation credits for agencies, teams, and bulk thumbnail workflows.",
                },

                {
                    "@type":
                        "Offer",

                    name:
                        "Business Yearly",

                    price:
                        "348",

                    priceCurrency:
                        "USD",

                    description:
                        "Business plan billed annually at an effective rate of 29 USD per month.",
                },
            ],
        },
    };

    const faqSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "FAQPage",

        mainEntity:
            pricingFaqs.map(
                (faq) => ({
                    "@type":
                        "Question",

                    name:
                        faq.question,

                    acceptedAnswer: {
                        "@type":
                            "Answer",

                        text:
                            faq.answer,
                    },
                })
            ),
    };

    return (
        <>
            <SoftBackdrop />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            pricingPageSchema
                        ),
                }}
            />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            faqSchema
                        ),
                }}
            />

            <main className="relative z-10 min-h-screen overflow-hidden px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Hero */}
                    <section
                        aria-labelledby="pricing-page-heading"
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <CoinsIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            Thumblify Pricing
                        </div>

                        <h1
                            id="pricing-page-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-6xl"
                        >
                            Start Free and Upgrade
                            When Your{" "}
                            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Creative Workflow
                                Grows
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                            Create your first 3
                            thumbnails without adding
                            a credit card. Every plan
                            includes watermark-free
                            downloads, while paid plans
                            add more credits, advanced
                            enhancement, version
                            history, and bulk usage.
                        </p>

                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300">
                                <CreditCardIcon
                                    aria-hidden="true"
                                    className="size-4 text-pink-400"
                                />

                                No card for Free
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300">
                                <ShieldCheckIcon
                                    aria-hidden="true"
                                    className="size-4 text-emerald-400"
                                />

                                No watermark
                            </div>

                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-300">
                                <Clock3Icon
                                    aria-hidden="true"
                                    className="size-4 text-purple-400"
                                />

                                Cancel paid plans
                                anytime
                            </div>
                        </div>
                    </section>

                    {/* Shared pricing cards */}
                    <section
                        id="plans"
                        aria-label="Thumblify pricing plans"
                        className="scroll-mt-28 mt-8"
                    >
                        <PricingCards />
                    </section>

                    {/* Feature comparison */}
                    <section
                        aria-labelledby="comparison-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                                Plan comparison
                            </p>

                            <h2
                                id="comparison-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                Compare Every Plan
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                Review the main
                                differences before
                                choosing the plan that
                                fits your publishing
                                schedule, team size,
                                and thumbnail volume.
                            </p>
                        </div>

                        <div className="mt-10 overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-2xl">
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[760px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-white/10 bg-black/20">
                                            <th
                                                scope="col"
                                                className="w-[34%] px-5 py-5 text-left text-sm font-semibold text-zinc-200"
                                            >
                                                Feature
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-5 py-5 text-center text-sm font-semibold text-zinc-200"
                                            >
                                                Free
                                            </th>

                                            <th
                                                scope="col"
                                                className="bg-pink-500/8 px-5 py-5 text-center text-sm font-semibold text-pink-300"
                                            >
                                                Creator Pro
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-5 py-5 text-center text-sm font-semibold text-purple-300"
                                            >
                                                Business
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {comparisonFeatures.map(
                                            (
                                                item,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        item.feature
                                                    }
                                                    className={
                                                        index <
                                                            comparisonFeatures.length -
                                                            1
                                                            ? "border-b border-white/8"
                                                            : undefined
                                                    }
                                                >
                                                    <th
                                                        scope="row"
                                                        className="px-5 py-4 text-left text-sm font-medium text-zinc-300"
                                                    >
                                                        {
                                                            item.feature
                                                        }
                                                    </th>

                                                    <td className="px-5 py-4 text-center">
                                                        {renderComparisonValue(
                                                            item.free
                                                        )}
                                                    </td>

                                                    <td className="bg-pink-500/5 px-5 py-4 text-center">
                                                        {renderComparisonValue(
                                                            item.pro
                                                        )}
                                                    </td>

                                                    <td className="px-5 py-4 text-center">
                                                        {renderComparisonValue(
                                                            item.business
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Credit rules */}
                    <section
                        aria-labelledby="credits-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
                                Simple credit system
                            </p>

                            <h2
                                id="credits-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                How Generation Credits
                                Work
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                Credits are used when a
                                new image version is
                                created. Viewing,
                                selecting, comparing, and
                                downloading an existing
                                version does not use a
                                generation credit.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 md:grid-cols-3">
                            {creditRules.map(
                                ({
                                    title,
                                    credits,
                                    description,
                                    icon: Icon,
                                }) => (
                                    <article
                                        key={title}
                                        className="rounded-2xl border border-white/10 bg-white/6 p-6 shadow-xl"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                                                <Icon
                                                    aria-hidden="true"
                                                    className="size-6"
                                                />
                                            </div>

                                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                                                {credits}
                                            </span>
                                        </div>

                                        <h3 className="mt-6 text-lg font-semibold text-zinc-100">
                                            {title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                                            {description}
                                        </p>
                                    </article>
                                )
                            )}
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-3">
                            <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4">
                                <Layers3Icon
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-purple-400"
                                />

                                <p className="text-xs leading-6 text-zinc-400">
                                    Comparing saved
                                    versions does not use
                                    credits.
                                </p>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4">
                                <CheckIcon
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-emerald-400"
                                />

                                <p className="text-xs leading-6 text-zinc-400">
                                    Selecting a previous
                                    version does not use
                                    credits.
                                </p>
                            </div>

                            <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4">
                                <ShieldCheckIcon
                                    aria-hidden="true"
                                    className="mt-0.5 size-5 shrink-0 text-pink-400"
                                />

                                <p className="text-xs leading-6 text-zinc-400">
                                    Downloading an
                                    existing image does
                                    not use credits.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Free plan explanation */}
                    <section className="mt-24 grid gap-8 rounded-3xl border border-emerald-400/15 bg-linear-to-br from-emerald-400/8 via-white/5 to-pink-500/8 p-7 shadow-2xl sm:p-10 lg:grid-cols-[0.8fr_1.2fr]">
                        <div>
                            <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                <CreditCardIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2 className="mt-6 text-3xl font-bold leading-tight text-zinc-100">
                                Try Thumblify Before
                                Paying
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                Create an account and
                                generate your first three
                                thumbnails without adding
                                a payment method. Your
                                downloaded images will
                                remain watermark-free.
                            </p>

                            <Link
                                href="/generate"
                                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                            >
                                Create Your Free Account

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <ul className="grid gap-4 sm:grid-cols-2">
                            {[
                                "3 lifetime generation credits",
                                "No credit card required",
                                "No watermark on downloads",
                                "Upload up to 3 reference images",
                                "Use titles and custom prompts",
                                "Choose styles and color schemes",
                                "Access supported aspect ratios",
                                "Keep and download your results",
                            ].map(
                                (feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                    >
                                        <CheckIcon
                                            aria-hidden="true"
                                            className="mt-0.5 size-5 shrink-0 text-emerald-400"
                                        />

                                        <span>
                                            {feature}
                                        </span>
                                    </li>
                                )
                            )}
                        </ul>
                    </section>

                    {/* Business section */}
                    <section
                        aria-labelledby="business-plan-heading"
                        className="mt-24 grid items-center gap-8 lg:grid-cols-2"
                    >
                        <div>
                            <div className="flex size-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                                <Building2Icon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2
                                id="business-plan-heading"
                                className="mt-6 text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl"
                            >
                                Creating Thumbnails for
                                Multiple Channels or
                                Clients?
                            </h2>

                            <p className="mt-5 text-base leading-8 text-zinc-400">
                                The Business plan is
                                designed for agencies,
                                YouTube teams, freelancers,
                                high-volume creators, and
                                businesses that need a
                                larger monthly credit
                                allowance.
                            </p>

                            <Link
                                href="/contact?plan=business&billing=yearly"
                                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl border border-purple-400/30 bg-purple-400/10 px-6 py-3 text-sm font-semibold text-purple-200 transition hover:bg-purple-400/15"
                            >
                                Discuss Business Usage

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                {
                                    title:
                                        "Higher Volume",

                                    description:
                                        "A larger monthly credit allowance for frequent thumbnail production.",

                                    icon:
                                        CoinsIcon,
                                },

                                {
                                    title:
                                        "Agency Workflows",

                                    description:
                                        "Suitable for creators and agencies working across multiple channels or clients.",

                                    icon:
                                        UsersIcon,
                                },

                                {
                                    title:
                                        "Bulk Requirements",

                                    description:
                                        "Discuss additional credits and custom usage requirements as your volume grows.",

                                    icon:
                                        Layers3Icon,
                                },

                                {
                                    title:
                                        "Priority Assistance",

                                    description:
                                        "Receive priority help for business, account, and usage-related inquiries.",

                                    icon:
                                        Clock3Icon,
                                },
                            ].map(
                                ({
                                    title,
                                    description,
                                    icon: Icon,
                                }) => (
                                    <article
                                        key={title}
                                        className="rounded-2xl border border-white/10 bg-white/6 p-6"
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            className="size-6 text-purple-400"
                                        />

                                        <h3 className="mt-4 text-lg font-semibold text-zinc-100">
                                            {title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                                            {description}
                                        </p>
                                    </article>
                                )
                            )}
                        </div>
                    </section>

                    {/* FAQ */}
                    <section
                        aria-labelledby="pricing-faq-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                                <CircleHelpIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2
                                id="pricing-faq-heading"
                                className="mt-6 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                Pricing Questions
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                Important information
                                about free credits,
                                subscriptions, yearly
                                billing, cancellations,
                                and business usage.
                            </p>
                        </div>

                        <div className="mx-auto mt-12 max-w-4xl space-y-4">
                            {pricingFaqs.map(
                                (faq) => (
                                    <details
                                        key={
                                            faq.question
                                        }
                                        className="group rounded-2xl border border-white/10 bg-white/5 p-5 open:border-pink-500/25 open:bg-white/7"
                                    >
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold text-zinc-100">
                                            <span>
                                                {
                                                    faq.question
                                                }
                                            </span>

                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl font-light text-pink-300 transition group-open:rotate-45">
                                                +
                                            </span>
                                        </summary>

                                        <p className="mt-4 border-t border-white/8 pt-4 text-sm leading-7 text-zinc-400">
                                            {
                                                faq.answer
                                            }
                                        </p>
                                    </details>
                                )
                            )}
                        </div>
                    </section>

                    {/* Final CTA */}
                    <section className="mt-24 overflow-hidden rounded-3xl border border-pink-500/20 bg-linear-to-br from-pink-500/15 via-purple-500/10 to-black/20 p-8 text-center shadow-2xl sm:p-12">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-pink-400/25 bg-pink-400/10 text-pink-300">
                            <SparklesIcon
                                aria-hidden="true"
                                className="size-7"
                            />
                        </div>

                        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold text-zinc-100 sm:text-4xl">
                            Start With Three Free
                            Thumbnails—No Card and No
                            Watermark
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                            Create your account, test
                            the thumbnail workflow, and
                            upgrade only when you need
                            more generations or advanced
                            features.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/generate"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:from-pink-600 hover:to-pink-700 sm:w-auto"
                            >
                                Start Free

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white sm:w-auto"
                            >
                                Discuss Your Requirements
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}