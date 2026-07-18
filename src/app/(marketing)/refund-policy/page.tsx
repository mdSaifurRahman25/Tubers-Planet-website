import type {
    ReactNode,
} from "react";

import type {
    Metadata,
} from "next";

import Link from "next/link";

import {
    BanIcon,
    CheckCircle2Icon,
    CircleDollarSignIcon,
    Clock3Icon,
    CoinsIcon,
    CreditCardIcon,
    FileTextIcon,
    HeadphonesIcon,
    MailIcon,
    RefreshCwIcon,
    ScaleIcon,
    ShieldCheckIcon,
    SparklesIcon,
    TriangleAlertIcon,
    WrenchIcon,
} from "lucide-react";

import type {
    LucideIcon,
} from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";

const siteUrl =
    process.env
        .NEXT_PUBLIC_SITE_URL
        ?.replace(/\/+$/, "") ||
    "http://localhost:3000";

const legalName =
    process.env
        .NEXT_PUBLIC_LEGAL_NAME
        ?.trim() ||
    "Thumblify";

const billingEmail =
    process.env
        .NEXT_PUBLIC_BILLING_EMAIL
        ?.trim() ||
    process.env
        .NEXT_PUBLIC_SUPPORT_EMAIL
        ?.trim() ||
    "billing@thumblify.com";

const supportEmail =
    process.env
        .NEXT_PUBLIC_SUPPORT_EMAIL
        ?.trim() ||
    "hello@thumblify.com";

const businessLocation =
    process.env
        .NEXT_PUBLIC_BUSINESS_LOCATION
        ?.trim() ||
    "Bangladesh";

const lastUpdated =
    "July 18, 2026";

export const metadata: Metadata = {
    title:
        "Refund Policy | Thumblify",

    description:
        "Read the Thumblify Refund Policy covering non-refundable digital services, subscription payments, generation credits, cancellations, technical issues, duplicate charges, and mandatory legal exceptions.",

    keywords: [
        "Thumblify refund policy",
        "Thumblify no refund policy",
        "thumbnail subscription refund policy",
        "AI thumbnail generator refund",
        "digital service refund policy",
        "generation credit refund",
    ],

    alternates: {
        canonical:
            `${siteUrl}/refund-policy`,
    },

    openGraph: {
        title:
            "Refund Policy | Thumblify",

        description:
            "Payments for Thumblify digital services are generally final and non-refundable. Review the policy before purchasing a paid plan.",

        url:
            `${siteUrl}/refund-policy`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "Refund Policy | Thumblify",

        description:
            "Important information about non-refundable subscription payments, credits, cancellations, and technical support.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

interface PolicySectionProps {
    id: string;
    number: number;
    title: string;
    icon: LucideIcon;
    children: ReactNode;
    accent?:
    | "pink"
    | "purple"
    | "emerald"
    | "amber";
}

const accentStyles = {
    pink: {
        section:
            "border-pink-500/15 bg-linear-to-br from-pink-500/7 via-white/5 to-transparent",

        icon:
            "border-pink-500/20 bg-pink-500/10 text-pink-300",
    },

    purple: {
        section:
            "border-purple-500/15 bg-linear-to-br from-purple-500/7 via-white/5 to-transparent",

        icon:
            "border-purple-400/20 bg-purple-400/10 text-purple-300",
    },

    emerald: {
        section:
            "border-emerald-400/15 bg-linear-to-br from-emerald-400/7 via-white/5 to-transparent",

        icon:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },

    amber: {
        section:
            "border-amber-400/15 bg-linear-to-br from-amber-400/7 via-white/5 to-transparent",

        icon:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
    },
};

function PolicySection({
    id,
    number,
    title,
    icon: Icon,
    children,
    accent = "pink",
}: PolicySectionProps) {
    const styles =
        accentStyles[accent];

    return (
        <section
            id={id}
            className={`scroll-mt-28 rounded-2xl border p-6 shadow-xl sm:p-8 ${styles.section}`}
        >
            <div className="flex items-start gap-4">
                <div
                    className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${styles.icon}`}
                >
                    <Icon
                        aria-hidden="true"
                        className="size-5"
                    />
                </div>

                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                        Section {number}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-zinc-100">
                        {title}
                    </h2>
                </div>
            </div>

            <div className="mt-6 text-sm leading-7 text-zinc-400 sm:text-base">
                {children}
            </div>
        </section>
    );
}

const tableOfContents = [
    {
        label:
            "Policy Overview",
        href:
            "#overview",
    },
    {
        label:
            "Try Before Purchasing",
        href:
            "#free-plan",
    },
    {
        label:
            "All Sales Are Final",
        href:
            "#all-sales-final",
    },
    {
        label:
            "Non-Refundable Payments",
        href:
            "#non-refundable",
    },
    {
        label:
            "Technical Issues",
        href:
            "#technical-issues",
    },
    {
        label:
            "Failed Generations",
        href:
            "#failed-generations",
    },
    {
        label:
            "Subscription Cancellation",
        href:
            "#cancellation",
    },
    {
        label:
            "Yearly Subscriptions",
        href:
            "#yearly-plans",
    },
    {
        label:
            "Duplicate or Unauthorized Charges",
        href:
            "#payment-errors",
    },
    {
        label:
            "Business and Bulk Plans",
        href:
            "#business-plans",
    },
    {
        label:
            "Payment Provider Rules",
        href:
            "#payment-provider",
    },
    {
        label:
            "Chargebacks",
        href:
            "#chargebacks",
    },
    {
        label:
            "Mandatory Legal Rights",
        href:
            "#legal-rights",
    },
    {
        label:
            "Policy Changes",
        href:
            "#policy-changes",
    },
    {
        label:
            "Contact Us",
        href:
            "#contact",
    },
];

const nonRefundableReasons = [
    "You changed your mind after completing the purchase.",
    "You purchased the wrong plan or selected the wrong billing cycle.",
    "You did not use the subscription, credits, or available features.",
    "You used only part of the included credits or subscription period.",
    "You forgot to cancel before a monthly or yearly renewal.",
    "You no longer need the service or stopped creating content.",
    "You are dissatisfied with a generated result for subjective or creative reasons.",
    "A generated image did not exactly match your imagined result or prompt.",
    "You experienced a temporary processing delay that was later resolved.",
    "You experienced a device, browser, network, or internet connection problem.",
    "Your subscription was downgraded or cancelled before the end of its billing period.",
    "Your account was restricted or terminated because of a policy violation.",
    "You purchased a Business or bulk package but did not use all included credits.",
    "Unused credits remained when your subscription expired or was cancelled.",
    "A promotional price, discount, or lower price became available after your purchase.",
];

const supportResolutions = [
    {
        title:
            "Credit Restoration",

        description:
            "When a verified technical failure consumes credits without producing a usable result, eligible credits may be restored to your account.",

        icon:
            CoinsIcon,
    },

    {
        title:
            "Generation Retry",

        description:
            "We may help you retry a failed request or provide guidance for improving the prompt, references, settings, or generation process.",

        icon:
            RefreshCwIcon,
    },

    {
        title:
            "Account Correction",

        description:
            "We may correct verified plan-access, billing-status, credit-balance, login, or account configuration problems.",

        icon:
            WrenchIcon,
    },

    {
        title:
            "Technical Assistance",

        description:
            "Our team may investigate service errors, review logs, provide troubleshooting steps, and help restore access to available features.",

        icon:
            HeadphonesIcon,
    },
];

const refundFaqs = [
    {
        question:
            "Can I receive a refund after purchasing a plan?",

        answer:
            "No. Payments are generally final and non-refundable once the purchase is completed and the subscription, credits, or digital service becomes available, except where a refund is required by applicable law or the payment provider.",
    },

    {
        question:
            "What happens if I do not use my subscription?",

        answer:
            "Not using a subscription, feature, or credit allocation does not qualify the payment for a refund. You remain responsible for cancelling before the next renewal.",
    },

    {
        question:
            "Can I receive a partial refund after cancelling?",

        answer:
            "No. Cancellation prevents future renewals but does not create a prorated or partial refund for the current monthly or yearly billing period.",
    },

    {
        question:
            "What happens if a generation fails?",

        answer:
            "Contact support with the project details. When a technical failure is verified, Thumblify may restore the affected credits or assist with another generation instead of issuing a cash refund.",
    },

    {
        question:
            "Can I receive a refund because I do not like a thumbnail?",

        answer:
            "No. Creative output is subjective and may require different prompts, references, regeneration, or enhancement. Dissatisfaction with a particular result does not normally qualify for a refund.",
    },

    {
        question:
            "Can I receive a refund for an annual plan after using part of the year?",

        answer:
            "No. Annual plans are purchased as a full yearly commitment. Cancelling stops the next annual renewal but does not create a refund for the unused portion of the current year.",
    },

    {
        question:
            "What if I was charged twice?",

        answer:
            "Contact billing support immediately. A verified duplicate transaction may be corrected or reversed. This is treated as a payment correction rather than an ordinary refund request.",
    },

    {
        question:
            "What if I do not recognize a payment?",

        answer:
            "Contact Thumblify and your payment provider promptly. We may request verification and investigate the transaction before taking appropriate action.",
    },

    {
        question:
            "Does cancelling delete my account?",

        answer:
            "No. Cancelling a subscription normally stops future renewals but does not automatically delete your Thumblify account or previously generated projects.",
    },

    {
        question:
            "Can a payment provider issue a refund despite this policy?",

        answer:
            "A Merchant of Record, payment processor, card network, bank, or applicable law may require or process a refund, reversal, or chargeback in circumstances outside Thumblify's direct control.",
    },
];

export default function RefundPolicyPage() {
    const refundPolicySchema = {
        "@context":
            "https://schema.org",

        "@type":
            "WebPage",

        name:
            "Thumblify Refund Policy",

        description:
            "The refund and cancellation policy governing Thumblify digital services, subscriptions, and generation credits.",

        url:
            `${siteUrl}/refund-policy`,

        dateModified:
            "2026-07-18",

        isPartOf: {
            "@type":
                "WebSite",

            name:
                "Thumblify",

            url:
                siteUrl,
        },

        publisher: {
            "@type":
                "Organization",

            name:
                legalName,

            url:
                siteUrl,
        },
    };

    const faqSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "FAQPage",

        mainEntity:
            refundFaqs.map(
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
                            refundPolicySchema
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
                        aria-labelledby="refund-policy-heading"
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <CircleDollarSignIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            Payment and Cancellation Terms
                        </div>

                        <h1
                            id="refund-policy-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-6xl"
                        >
                            Refund{" "}
                            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Policy
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                            Thumblify provides
                            immediately available digital
                            services and generation
                            credits. Once a payment is
                            completed and paid access is
                            provided, the payment is
                            generally final and
                            non-refundable.
                        </p>

                        <div className="mt-7 flex flex-wrap items-center justify-center gap-3 text-xs text-zinc-400">
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                                Effective:{" "}
                                {lastUpdated}
                            </span>

                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2">
                                Last updated:{" "}
                                {lastUpdated}
                            </span>
                        </div>
                    </section>

                    {/* Policy summary */}
                    <section
                        aria-label="Refund policy summary"
                        className="mt-14 grid gap-4 md:grid-cols-3"
                    >
                        <article className="rounded-2xl border border-red-400/15 bg-red-400/5 p-6">
                            <BanIcon
                                aria-hidden="true"
                                className="size-7 text-red-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                All Sales Are Final
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                Completed subscription,
                                credit, and bulk-package
                                payments are generally
                                non-refundable.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-6">
                            <SparklesIcon
                                aria-hidden="true"
                                className="size-7 text-emerald-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                Try Before Paying
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                Eligible accounts receive
                                three free thumbnail
                                generations without adding
                                a payment card.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-purple-400/15 bg-purple-400/5 p-6">
                            <HeadphonesIcon
                                aria-hidden="true"
                                className="size-7 text-purple-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                Support Before Refund
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                When a technical problem
                                occurs, we focus on fixing
                                access, restoring eligible
                                credits, or helping you
                                complete the service.
                            </p>
                        </article>
                    </section>

                    {/* Important notice */}
                    <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                            <TriangleAlertIcon
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-amber-300"
                            />

                            <div>
                                <h2 className="font-semibold text-amber-200">
                                    Important Purchase Notice
                                </h2>

                                <p className="mt-2 text-sm leading-7 text-zinc-400">
                                    By completing a paid
                                    purchase, you request
                                    immediate access to the
                                    selected digital
                                    service, subscription,
                                    and generation credits.
                                    You acknowledge that
                                    the payment is generally
                                    final and
                                    non-refundable, except
                                    where applicable law or
                                    the payment provider
                                    requires otherwise.
                                </p>
                            </div>
                        </div>
                    </section>

                    <div className="mt-16 grid items-start gap-10 lg:grid-cols-[290px_minmax(0,1fr)]">
                        {/* Table of contents */}
                        <aside className="lg:sticky lg:top-28">
                            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
                                <h2 className="text-base font-semibold text-zinc-100">
                                    On This Page
                                </h2>

                                <nav
                                    aria-label="Refund policy sections"
                                    className="mt-5"
                                >
                                    <ul className="space-y-1">
                                        {tableOfContents.map(
                                            (item) => (
                                                <li
                                                    key={
                                                        item.href
                                                    }
                                                >
                                                    <a
                                                        href={
                                                            item.href
                                                        }
                                                        className="block rounded-lg px-3 py-2 text-sm leading-5 text-zinc-400 transition hover:bg-white/5 hover:text-pink-300"
                                                    >
                                                        {
                                                            item.label
                                                        }
                                                    </a>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </nav>
                            </div>
                        </aside>

                        {/* Policy content */}
                        <div className="min-w-0 space-y-8">
                            <PolicySection
                                id="overview"
                                number={1}
                                title="Policy Overview"
                                icon={
                                    FileTextIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        This Refund Policy
                                        applies to
                                        Thumblify
                                        subscriptions,
                                        generation credits,
                                        credit top-ups,
                                        Business plans,
                                        bulk packages, and
                                        other paid digital
                                        services.
                                    </p>

                                    <p>
                                        Thumblify provides
                                        digital access and
                                        uses computing,
                                        storage, processing,
                                        infrastructure, and
                                        third-party
                                        resources when
                                        making services and
                                        image-generation
                                        features available.
                                    </p>

                                    <p>
                                        For this reason,
                                        payments are
                                        generally final
                                        once a transaction
                                        is completed and
                                        the purchased plan,
                                        credits, or service
                                        becomes available.
                                    </p>

                                    <p>
                                        This policy should
                                        be read together
                                        with our{" "}
                                        <Link
                                            href="/terms-and-conditions"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 transition hover:text-pink-200"
                                        >
                                            Terms and Conditions
                                        </Link>
                                        ,{" "}
                                        <Link
                                            href="/privacy-policy"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 transition hover:text-pink-200"
                                        >
                                            Privacy Policy
                                        </Link>
                                        , and the
                                        information shown
                                        on the Pricing page
                                        and checkout.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="free-plan"
                                number={2}
                                title="Try Thumblify Before Purchasing"
                                icon={
                                    SparklesIcon
                                }
                                accent="emerald"
                            >
                                <div className="space-y-4">
                                    <p>
                                        Thumblify provides
                                        eligible registered
                                        users with three
                                        lifetime Free plan
                                        thumbnail-generation
                                        credits.
                                    </p>

                                    <p>
                                        No credit or debit
                                        card is required to
                                        use these Free plan
                                        credits, and
                                        downloaded Free
                                        plan thumbnails do
                                        not contain a
                                        Thumblify
                                        watermark.
                                    </p>

                                    <p>
                                        The Free plan
                                        allows users to
                                        review the basic
                                        generation
                                        experience,
                                        supported settings,
                                        output style, and
                                        general suitability
                                        of the service
                                        before purchasing a
                                        paid plan.
                                    </p>

                                    <p>
                                        You should use the
                                        Free plan and
                                        review the{" "}
                                        <Link
                                            href="/pricing"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 transition hover:text-pink-200"
                                        >
                                            Pricing page
                                        </Link>{" "}
                                        before completing
                                        a paid purchase.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="all-sales-final"
                                number={3}
                                title="All Sales Are Final"
                                icon={
                                    BanIcon
                                }
                                accent="amber"
                            >
                                <div className="space-y-4">
                                    <p className="font-semibold text-zinc-200">
                                        Once a payment is
                                        successfully
                                        completed, it is
                                        generally final,
                                        non-cancellable,
                                        and non-refundable.
                                    </p>

                                    <p>
                                        This applies
                                        whether or not you
                                        immediately use the
                                        purchased
                                        subscription,
                                        credits, features,
                                        storage, generation
                                        allowance, or
                                        support.
                                    </p>

                                    <p>
                                        Paid access is made
                                        available for the
                                        entire purchased
                                        billing period or
                                        package. Choosing
                                        not to use that
                                        access does not
                                        reverse the
                                        transaction.
                                    </p>

                                    <p>
                                        Cancellation
                                        affects future
                                        renewals only. It
                                        does not create a
                                        refund, credit,
                                        partial refund, or
                                        prorated refund for
                                        a payment already
                                        completed.
                                    </p>

                                    <div className="rounded-xl border border-red-400/15 bg-red-400/5 p-5">
                                        <p className="font-semibold text-red-200">
                                            No Money-Back
                                            Guarantee
                                        </p>

                                        <p className="mt-2 text-sm leading-7 text-zinc-400">
                                            Thumblify does
                                            not offer a
                                            trial refund
                                            period,
                                            satisfaction
                                            guarantee, or
                                            general
                                            money-back
                                            guarantee for
                                            paid services.
                                        </p>
                                    </div>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="non-refundable"
                                number={4}
                                title="Payments That Do Not Qualify for a Refund"
                                icon={
                                    CircleDollarSignIcon
                                }
                                accent="amber"
                            >
                                <p>
                                    Without limiting the
                                    rest of this policy,
                                    refunds will generally
                                    not be provided for any
                                    of the following
                                    reasons:
                                </p>

                                <ul className="mt-6 grid gap-3">
                                    {nonRefundableReasons.map(
                                        (reason) => (
                                            <li
                                                key={
                                                    reason
                                                }
                                                className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                            >
                                                <BanIcon
                                                    aria-hidden="true"
                                                    className="mt-0.5 size-5 shrink-0 text-red-400"
                                                />

                                                <span>
                                                    {
                                                        reason
                                                    }
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </PolicySection>

                            <PolicySection
                                id="technical-issues"
                                number={5}
                                title="Technical Problems and Service Resolution"
                                icon={
                                    WrenchIcon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        A technical
                                        problem does not
                                        automatically
                                        qualify a payment
                                        for a cash refund.
                                        Contact our support
                                        team so we can
                                        investigate and
                                        attempt to resolve
                                        the issue.
                                    </p>

                                    <p>
                                        Depending on the
                                        verified problem,
                                        available
                                        resolutions may
                                        include:
                                    </p>
                                </div>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    {supportResolutions.map(
                                        ({
                                            title,
                                            description,
                                            icon: Icon,
                                        }) => (
                                            <article
                                                key={
                                                    title
                                                }
                                                className="rounded-xl border border-white/8 bg-black/20 p-5"
                                            >
                                                <Icon
                                                    aria-hidden="true"
                                                    className="size-5 text-purple-400"
                                                />

                                                <h3 className="mt-4 font-semibold text-zinc-100">
                                                    {
                                                        title
                                                    }
                                                </h3>

                                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                                    {
                                                        description
                                                    }
                                                </p>
                                            </article>
                                        )
                                    )}
                                </div>

                                <div className="mt-6 space-y-4">
                                    <p>
                                        We may request
                                        screenshots,
                                        project
                                        identifiers,
                                        transaction
                                        information,
                                        browser details,
                                        timestamps, or
                                        other information
                                        needed to
                                        investigate.
                                    </p>

                                    <p>
                                        You must provide a
                                        reasonable
                                        opportunity for
                                        Thumblify to fix
                                        the problem before
                                        escalating the
                                        matter through a
                                        payment dispute.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="failed-generations"
                                number={6}
                                title="Failed or Interrupted Generations"
                                icon={
                                    RefreshCwIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        A generation may
                                        occasionally fail,
                                        time out, be
                                        interrupted, or
                                        return an unusable
                                        file because of a
                                        verified technical
                                        error.
                                    </p>

                                    <p>
                                        When our records
                                        confirm that a
                                        credit was consumed
                                        without successful
                                        service delivery,
                                        we may restore the
                                        affected generation
                                        credit or allow
                                        another generation.
                                    </p>

                                    <p>
                                        Restoring a credit
                                        or providing another
                                        generation is the
                                        normal resolution
                                        for a verified
                                        generation failure.
                                        It does not create
                                        eligibility for a
                                        cash refund.
                                    </p>

                                    <p>
                                        Creative
                                        dissatisfaction is
                                        different from a
                                        technical failure.
                                        A result that works
                                        technically but
                                        does not match your
                                        preference,
                                        expectation, or
                                        imagined design
                                        does not normally
                                        qualify as a failed
                                        generation.
                                    </p>

                                    <p>
                                        Users can improve
                                        results by adjusting
                                        titles, prompts,
                                        reference images,
                                        styles, colors,
                                        regeneration
                                        instructions, or
                                        enhancement
                                        settings.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="cancellation"
                                number={7}
                                title="Subscription Cancellation"
                                icon={
                                    Clock3Icon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        You may cancel a
                                        paid subscription
                                        through available
                                        account controls or
                                        by contacting
                                        support when
                                        self-service
                                        cancellation is not
                                        available.
                                    </p>

                                    <p>
                                        Cancellation stops
                                        the subscription
                                        from renewing at
                                        the end of the
                                        current billing
                                        period.
                                    </p>

                                    <p>
                                        Your paid access
                                        will normally
                                        continue until the
                                        end of the monthly
                                        or yearly period
                                        already paid for.
                                    </p>

                                    <p>
                                        Cancelling during a
                                        billing period does
                                        not produce a
                                        refund for the
                                        remaining days,
                                        unused credits, or
                                        unused features.
                                    </p>

                                    <p>
                                        You are responsible
                                        for cancelling
                                        before your next
                                        renewal date.
                                        Forgetting to
                                        cancel does not
                                        normally qualify a
                                        renewal payment for
                                        a refund.
                                    </p>

                                    <p>
                                        Cancelling a
                                        subscription does
                                        not automatically
                                        delete your account
                                        or previously
                                        generated projects.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="yearly-plans"
                                number={8}
                                title="Yearly Subscription Payments"
                                icon={
                                    CreditCardIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        A yearly plan may
                                        display a lower
                                        monthly-equivalent
                                        price, but the full
                                        yearly amount is
                                        charged at the
                                        beginning of the
                                        annual billing
                                        period.
                                    </p>

                                    <p>
                                        Yearly plans are
                                        full annual
                                        commitments. After
                                        the annual payment
                                        is completed, it is
                                        generally
                                        non-refundable.
                                    </p>

                                    <p>
                                        Cancelling a yearly
                                        plan stops the next
                                        annual renewal. It
                                        does not result in a
                                        partial or prorated
                                        refund for the
                                        unused portion of
                                        the current year.
                                    </p>

                                    <p>
                                        Monthly credit
                                        allocations under a
                                        yearly plan may
                                        continue according
                                        to the plan rules
                                        until the current
                                        annual term ends.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="payment-errors"
                                number={9}
                                title="Duplicate, Incorrect, or Unauthorized Charges"
                                icon={
                                    ShieldCheckIcon
                                }
                                accent="emerald"
                            >
                                <div className="space-y-4">
                                    <p>
                                        Contact us promptly
                                        if you believe that
                                        you were charged
                                        more than once for
                                        the same
                                        transaction, were
                                        charged an
                                        incorrect amount,
                                        or do not recognize
                                        a payment.
                                    </p>

                                    <p>
                                        We may request your
                                        transaction
                                        identifier, invoice,
                                        payment receipt,
                                        account email,
                                        charge date, and
                                        other verification
                                        information.
                                    </p>

                                    <p>
                                        A verified duplicate
                                        or incorrect charge
                                        may be corrected or
                                        reversed. This is a
                                        payment correction,
                                        not an ordinary
                                        refund for a valid
                                        purchase.
                                    </p>

                                    <p>
                                        Suspected
                                        unauthorized
                                        payments may also
                                        require review by
                                        the payment
                                        processor,
                                        Merchant of Record,
                                        card issuer, or
                                        financial
                                        institution.
                                    </p>

                                    <p>
                                        We may restrict the
                                        associated account
                                        while investigating
                                        suspected fraud,
                                        unauthorized access,
                                        or payment abuse.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="business-plans"
                                number={10}
                                title="Business, Agency, and Bulk Packages"
                                icon={
                                    CoinsIcon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        Business plans,
                                        agency packages,
                                        custom credit
                                        packages, onboarding
                                        services, and bulk
                                        generation packages
                                        are generally final
                                        and non-refundable
                                        once payment is
                                        completed.
                                    </p>

                                    <p>
                                        Refunds are not
                                        provided because a
                                        business, agency,
                                        team, or client
                                        failed to use all
                                        purchased credits,
                                        changed its
                                        campaign, lost a
                                        client, reduced its
                                        publishing volume,
                                        or no longer needed
                                        the service.
                                    </p>

                                    <p>
                                        Additional
                                        conditions may be
                                        stated in an
                                        accepted quotation,
                                        invoice, order
                                        form, contract, or
                                        custom Business
                                        agreement.
                                    </p>

                                    <p>
                                        When an authorized
                                        custom agreement
                                        contains different
                                        payment or
                                        cancellation terms,
                                        that agreement
                                        controls for the
                                        specific purchase
                                        covered by it.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="payment-provider"
                                number={11}
                                title="Payment Processor and Merchant of Record Rules"
                                icon={
                                    ScaleIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        Payments may be
                                        processed by an
                                        independent payment
                                        processor or
                                        Merchant of Record.
                                    </p>

                                    <p>
                                        The entity shown on
                                        your receipt,
                                        invoice, checkout,
                                        or bank statement
                                        may be responsible
                                        for processing the
                                        payment, taxes,
                                        refunds, reversals,
                                        and chargebacks.
                                    </p>

                                    <p>
                                        Your transaction
                                        may also be subject
                                        to the payment
                                        provider's buyer
                                        terms, refund
                                        procedures,
                                        mandatory
                                        compliance rules,
                                        and legal
                                        obligations.
                                    </p>

                                    <p>
                                        Where a payment
                                        provider or
                                        Merchant of Record
                                        is legally or
                                        contractually
                                        required to issue a
                                        refund or reversal,
                                        its decision may
                                        apply despite the
                                        general no-refund
                                        terms stated on
                                        this page.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="chargebacks"
                                number={12}
                                title="Chargebacks and Payment Disputes"
                                icon={
                                    TriangleAlertIcon
                                }
                                accent="amber"
                            >
                                <div className="space-y-4">
                                    <p>
                                        A chargeback should
                                        not be used as a
                                        substitute for
                                        contacting support
                                        about a technical,
                                        billing, or account
                                        problem.
                                    </p>

                                    <p>
                                        Before opening a
                                        payment dispute,
                                        contact us and
                                        provide a reasonable
                                        opportunity to
                                        investigate and
                                        resolve the issue.
                                    </p>

                                    <p>
                                        Fraudulent,
                                        misleading, or
                                        abusive chargebacks
                                        may result in
                                        account suspension,
                                        termination,
                                        cancellation of
                                        remaining credits,
                                        and submission of
                                        relevant records to
                                        the payment
                                        provider.
                                    </p>

                                    <p>
                                        We may provide
                                        transaction
                                        records, account
                                        activity, login
                                        information,
                                        generation history,
                                        service-delivery
                                        evidence, support
                                        communications, and
                                        acceptance records
                                        when responding to a
                                        payment dispute.
                                    </p>

                                    <p>
                                        Nothing in this
                                        section prevents
                                        you from exercising
                                        a lawful payment or
                                        consumer right.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="legal-rights"
                                number={13}
                                title="Mandatory Consumer and Legal Rights"
                                icon={
                                    ScaleIcon
                                }
                                accent="emerald"
                            >
                                <div className="space-y-4">
                                    <p>
                                        This policy does
                                        not exclude,
                                        restrict, or remove
                                        any refund,
                                        cancellation,
                                        withdrawal,
                                        correction, or
                                        consumer right that
                                        cannot legally be
                                        excluded.
                                    </p>

                                    <p>
                                        If applicable law
                                        requires a refund
                                        because the paid
                                        service was not
                                        delivered, was
                                        materially
                                        misrepresented, or
                                        for another
                                        legally protected
                                        reason, that
                                        mandatory law will
                                        apply.
                                    </p>

                                    <p>
                                        Where legally
                                        permitted, we may
                                        first attempt to
                                        provide the
                                        purchased service,
                                        correct the
                                        technical problem,
                                        restore credits, or
                                        offer an equivalent
                                        remedy.
                                    </p>

                                    <p>
                                        The availability
                                        and scope of
                                        mandatory rights
                                        may depend on your
                                        location, the
                                        payment provider,
                                        the type of
                                        customer, and
                                        whether the service
                                        or digital content
                                        has already been
                                        used.
                                    </p>

                                    <p>
                                        Nothing on this
                                        page should be
                                        interpreted as
                                        preventing a
                                        customer from
                                        contacting an
                                        appropriate
                                        consumer-protection
                                        authority.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="policy-changes"
                                number={14}
                                title="Changes to This Refund Policy"
                                icon={
                                    RefreshCwIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        We may update this
                                        Refund Policy when
                                        our plans, billing
                                        model, payment
                                        providers,
                                        generation-credit
                                        system, service
                                        features, legal
                                        obligations, or
                                        business operations
                                        change.
                                    </p>

                                    <p>
                                        The updated policy
                                        will be posted on
                                        this page with a
                                        revised “Last
                                        updated” date.
                                    </p>

                                    <p>
                                        The policy in
                                        effect when a
                                        payment was
                                        completed will
                                        generally apply to
                                        that transaction,
                                        unless applicable
                                        law or a payment
                                        provider requires a
                                        different result.
                                    </p>

                                    <p>
                                        Material changes
                                        affecting active
                                        subscriptions may
                                        also be communicated
                                        through the service,
                                        checkout, account,
                                        or email where
                                        appropriate.
                                    </p>
                                </div>
                            </PolicySection>

                            <PolicySection
                                id="contact"
                                number={15}
                                title="Contact Billing Support"
                                icon={
                                    MailIcon
                                }
                                accent="purple"
                            >
                                <p>
                                    Contact us about
                                    subscription
                                    cancellation, duplicate
                                    transactions,
                                    unrecognized payments,
                                    missing credits,
                                    technical failures, or
                                    account-access
                                    problems.
                                </p>

                                <div className="mt-6 grid gap-3 rounded-xl border border-white/10 bg-black/20 p-5 text-sm text-zinc-300">
                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Service:
                                        </span>{" "}
                                        Thumblify
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Operator:
                                        </span>{" "}
                                        {legalName}
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Billing email:
                                        </span>{" "}
                                        <a
                                            href={`mailto:${billingEmail}`}
                                            className="text-pink-300 transition hover:text-pink-200"
                                        >
                                            {billingEmail}
                                        </a>
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Support email:
                                        </span>{" "}
                                        <a
                                            href={`mailto:${supportEmail}`}
                                            className="text-pink-300 transition hover:text-pink-200"
                                        >
                                            {supportEmail}
                                        </a>
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Location:
                                        </span>{" "}
                                        {businessLocation}
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Website:
                                        </span>{" "}
                                        {siteUrl}
                                    </p>
                                </div>

                                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href={`mailto:${billingEmail}?subject=Thumblify%20Billing%20Issue`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                                    >
                                        Contact Billing Support

                                        <MailIcon
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </a>

                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                                    >
                                        Visit Contact Page
                                    </Link>
                                </div>
                            </PolicySection>
                        </div>
                    </div>

                    {/* FAQ */}
                    <section
                        aria-labelledby="refund-faq-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                                <CircleDollarSignIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
                                Common Questions
                            </p>

                            <h2
                                id="refund-faq-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                Refund and Cancellation FAQ
                            </h2>
                        </div>

                        <div className="mx-auto mt-12 max-w-4xl space-y-4">
                            {refundFaqs.map(
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
                </div>
            </main>
        </>
    );
}