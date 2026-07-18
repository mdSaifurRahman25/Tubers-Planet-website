import type {
    ReactNode,
} from "react";

import type {
    Metadata,
} from "next";

import Link from "next/link";

import {
    BanIcon,
    Building2Icon,
    CheckCircle2Icon,
    CircleDollarSignIcon,
    CloudIcon,
    CopyrightIcon,
    CreditCardIcon,
    FileImageIcon,
    FileTextIcon,
    Globe2Icon,
    KeyRoundIcon,
    MailIcon,
    MessageSquareTextIcon,
    RefreshCwIcon,
    ScaleIcon,
    ShieldCheckIcon,
    SparklesIcon,
    TriangleAlertIcon,
    UserRoundIcon,
    UsersIcon,
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

const legalEmail =
    process.env
        .NEXT_PUBLIC_LEGAL_EMAIL
        ?.trim() ||
    process.env
        .NEXT_PUBLIC_SUPPORT_EMAIL
        ?.trim() ||
    "legal@thumblify.com";

const businessLocation =
    process.env
        .NEXT_PUBLIC_BUSINESS_LOCATION
        ?.trim() ||
    "Bangladesh";

const governingLaw =
    process.env
        .NEXT_PUBLIC_GOVERNING_LAW
        ?.trim() ||
    businessLocation;

const lastUpdated =
    "July 18, 2026";

export const metadata: Metadata = {
    title:
        "Terms and Conditions | Thumblify",

    description:
        "Read the Thumblify Terms and Conditions covering accounts, free credits, paid subscriptions, uploaded images, generated thumbnails, acceptable use, cancellations, and service limitations.",

    keywords: [
        "Thumblify terms and conditions",
        "Thumblify terms of service",
        "AI thumbnail generator terms",
        "YouTube thumbnail service terms",
        "thumbnail subscription terms",
        "thumbnail generation credits",
    ],

    alternates: {
        canonical:
            `${siteUrl}/terms-and-conditions`,
    },

    openGraph: {
        title:
            "Terms and Conditions | Thumblify",

        description:
            "Review the rules and conditions that apply when you access or use Thumblify.",

        url:
            `${siteUrl}/terms-and-conditions`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "Terms and Conditions | Thumblify",

        description:
            "Important terms covering Thumblify accounts, plans, credits, uploaded content, generated thumbnails, billing, and acceptable use.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

type AccentName =
    | "pink"
    | "purple"
    | "emerald"
    | "amber";

interface TermsSectionProps {
    id: string;
    number: number;
    title: string;
    icon: LucideIcon;
    accent?: AccentName;
    children: ReactNode;
}

const accentStyles: Record<
    AccentName,
    {
        container: string;
        icon: string;
    }
> = {
    pink: {
        container:
            "border-pink-500/15 bg-linear-to-br from-pink-500/7 via-white/5 to-transparent",

        icon:
            "border-pink-500/20 bg-pink-500/10 text-pink-300",
    },

    purple: {
        container:
            "border-purple-500/15 bg-linear-to-br from-purple-500/7 via-white/5 to-transparent",

        icon:
            "border-purple-400/20 bg-purple-400/10 text-purple-300",
    },

    emerald: {
        container:
            "border-emerald-400/15 bg-linear-to-br from-emerald-400/7 via-white/5 to-transparent",

        icon:
            "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
    },

    amber: {
        container:
            "border-amber-400/15 bg-linear-to-br from-amber-400/7 via-white/5 to-transparent",

        icon:
            "border-amber-400/20 bg-amber-400/10 text-amber-300",
    },
};

function TermsSection({
    id,
    number,
    title,
    icon: Icon,
    accent = "pink",
    children,
}: TermsSectionProps) {
    const styles =
        accentStyles[accent];

    return (
        <section
            id={id}
            className={`scroll-mt-28 rounded-2xl border p-6 shadow-xl sm:p-8 ${styles.container}`}
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
            "Agreement to These Terms",
        href:
            "#agreement",
    },
    {
        label:
            "Eligibility",
        href:
            "#eligibility",
    },
    {
        label:
            "About the Service",
        href:
            "#service",
    },
    {
        label:
            "Accounts and Security",
        href:
            "#accounts",
    },
    {
        label:
            "Free Plan and Credits",
        href:
            "#free-plan",
    },
    {
        label:
            "Paid Plans and Billing",
        href:
            "#paid-plans",
    },
    {
        label:
            "Cancellation and Downgrades",
        href:
            "#cancellation",
    },
    {
        label:
            "Refunds",
        href:
            "#refunds",
    },
    {
        label:
            "Uploaded Content",
        href:
            "#uploaded-content",
    },
    {
        label:
            "Generated Thumbnails",
        href:
            "#generated-content",
    },
    {
        label:
            "Acceptable Use",
        href:
            "#acceptable-use",
    },
    {
        label:
            "Thumblify Intellectual Property",
        href:
            "#intellectual-property",
    },
    {
        label:
            "Automated Output Limitations",
        href:
            "#output-limitations",
    },
    {
        label:
            "Third-Party Services",
        href:
            "#third-party-services",
    },
    {
        label:
            "Availability and Changes",
        href:
            "#availability",
    },
    {
        label:
            "Business and Bulk Usage",
        href:
            "#business-usage",
    },
    {
        label:
            "Feedback",
        href:
            "#feedback",
    },
    {
        label:
            "Suspension and Termination",
        href:
            "#termination",
    },
    {
        label:
            "Disclaimers",
        href:
            "#disclaimers",
    },
    {
        label:
            "Limitation of Liability",
        href:
            "#liability",
    },
    {
        label:
            "Indemnification",
        href:
            "#indemnification",
    },
    {
        label:
            "Governing Law and Disputes",
        href:
            "#governing-law",
    },
    {
        label:
            "Changes to These Terms",
        href:
            "#terms-updates",
    },
    {
        label:
            "General Provisions",
        href:
            "#general",
    },
    {
        label:
            "Contact Us",
        href:
            "#contact",
    },
];

const accountResponsibilities = [
    "Provide accurate and current registration information.",
    "Keep your password, authentication credentials, and devices secure.",
    "Do not share your account unless a supported team feature expressly permits it.",
    "Remain responsible for activity performed through your account.",
    "Notify us promptly if you suspect unauthorized access or account misuse.",
    "Do not create accounts to bypass free-credit or paid-plan limits.",
];

const prohibitedUses = [
    "Use Thumblify for unlawful, fraudulent, deceptive, or abusive activity.",
    "Upload content that you do not own or have permission to process.",
    "Infringe copyrights, trademarks, privacy rights, publicity rights, or other legal rights.",
    "Create deceptive impersonations or misleading content intended to confuse viewers about a real person, brand, product, or event.",
    "Upload another person's private or sensitive images without appropriate permission.",
    "Create content that harasses, threatens, exploits, or targets another person.",
    "Attempt to bypass account restrictions, generation limits, billing controls, or security systems.",
    "Create multiple accounts primarily to obtain additional Free plan credits.",
    "Use bots, scraping tools, or unauthorized automation to access the service.",
    "Reverse engineer, interfere with, overload, damage, or disrupt Thumblify or its infrastructure.",
    "Introduce malicious code, harmful files, automated attacks, or unauthorized tracking technologies.",
    "Sell, rent, transfer, sublicense, or provide unauthorized access to your account.",
    "Use standard plans for automated bulk production when a Business arrangement is required.",
];

const businessResponsibilities = [
    {
        title:
            "Client Permissions",

        description:
            "You must have permission to upload and process all client logos, photographs, products, characters, brand assets, and other materials.",

        icon:
            FileImageIcon,
    },
    {
        title:
            "Account Access",

        description:
            "Do not share one login among multiple people unless the plan or an agreed business arrangement expressly supports shared access.",

        icon:
            UsersIcon,
    },
    {
        title:
            "Usage Limits",

        description:
            "Bulk generation and high-volume workflows must remain within the limits stated on your plan, invoice, order form, or custom agreement.",

        icon:
            CircleDollarSignIcon,
    },
    {
        title:
            "Client Review",

        description:
            "You remain responsible for reviewing generated content and obtaining client approval before publishing or distributing it.",

        icon:
            CheckCircle2Icon,
    },
];

const generalProvisions = [
    {
        title:
            "Entire Agreement",

        description:
            "These Terms, the Privacy Policy, Refund Policy, pricing information, and any applicable order form constitute the agreement concerning your use of Thumblify.",
    },
    {
        title:
            "Order of Priority",

        description:
            "If an authorized Business order form conflicts with these Terms, the order form controls only for the specific services covered by that order form.",
    },
    {
        title:
            "Severability",

        description:
            "If a provision is found unenforceable, it will be limited or removed only to the extent necessary, and the remaining provisions will continue.",
    },
    {
        title:
            "No Waiver",

        description:
            "A delay or failure to enforce a provision does not waive the right to enforce that provision later.",
    },
    {
        title:
            "Assignment",

        description:
            "You may not transfer your agreement or account without our written approval. We may transfer the agreement as part of a business reorganization or transaction.",
    },
    {
        title:
            "Force Majeure",

        description:
            "We are not responsible for delays caused by events reasonably outside our control, including infrastructure failures, natural events, government action, or major network disruption.",
    },
];

export default function TermsAndConditionsPage() {
    const termsSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "WebPage",

        name:
            "Thumblify Terms and Conditions",

        description:
            "The terms governing access to and use of the Thumblify thumbnail creation service.",

        url:
            `${siteUrl}/terms-and-conditions`,

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

    return (
        <>
            <SoftBackdrop />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            termsSchema
                        ),
                }}
            />

            <main className="relative z-10 min-h-screen overflow-hidden px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Hero */}
                    <section
                        aria-labelledby="terms-page-heading"
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <FileTextIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            Thumblify Service Agreement
                        </div>

                        <h1
                            id="terms-page-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-6xl"
                        >
                            Terms and{" "}
                            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Conditions
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                            These Terms explain the
                            rules that apply when you
                            access Thumblify, create an
                            account, upload reference
                            images, generate thumbnails,
                            or purchase a paid plan.
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

                    {/* Important summary */}
                    <section
                        aria-label="Important terms summary"
                        className="mt-14 grid gap-4 md:grid-cols-3"
                    >
                        <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-6">
                            <CreditCardIcon
                                aria-hidden="true"
                                className="size-7 text-emerald-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                Start Without a Card
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                A registered account may
                                use three lifetime Free
                                plan generation credits
                                without adding a payment
                                card.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-pink-500/15 bg-pink-500/5 p-6">
                            <FileImageIcon
                                aria-hidden="true"
                                className="size-7 text-pink-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                No Watermark
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                Thumbnails downloaded
                                from currently advertised
                                plans do not include a
                                Thumblify watermark.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-purple-400/15 bg-purple-400/5 p-6">
                            <SparklesIcon
                                aria-hidden="true"
                                className="size-7 text-purple-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                Review Before Publishing
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                Automated outputs may
                                contain unexpected
                                details. You are
                                responsible for reviewing
                                every thumbnail before
                                using it.
                            </p>
                        </article>
                    </section>

                    {/* Notice */}
                    <section className="mt-8 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 sm:p-6">
                        <div className="flex items-start gap-3">
                            <TriangleAlertIcon
                                aria-hidden="true"
                                className="mt-0.5 size-5 shrink-0 text-amber-300"
                            />

                            <div>
                                <h2 className="font-semibold text-amber-200">
                                    Please Read These
                                    Terms Carefully
                                </h2>

                                <p className="mt-2 text-sm leading-7 text-zinc-400">
                                    By creating an account
                                    or using Thumblify,
                                    you agree to these
                                    Terms and our{" "}
                                    <Link
                                        href="/privacy-policy"
                                        className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 transition hover:text-pink-200"
                                    >
                                        Privacy Policy
                                    </Link>
                                    . Do not use the
                                    service if you do not
                                    agree.
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
                                    aria-label="Terms and conditions sections"
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

                        {/* Terms content */}
                        <div className="min-w-0 space-y-8">
                            <TermsSection
                                id="agreement"
                                number={1}
                                title="Agreement to These Terms"
                                icon={
                                    FileTextIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        These Terms and
                                        Conditions form an
                                        agreement between
                                        you and{" "}
                                        {legalName}{" "}
                                        concerning your
                                        access to and use
                                        of Thumblify.
                                    </p>

                                    <p>
                                        You accept these
                                        Terms when you
                                        access the
                                        service, register
                                        an account,
                                        generate content,
                                        purchase a plan,
                                        click an acceptance
                                        button, or otherwise
                                        use Thumblify.
                                    </p>

                                    <p>
                                        Our{" "}
                                        <Link
                                            href="/privacy-policy"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 hover:text-pink-200"
                                        >
                                            Privacy Policy
                                        </Link>
                                        ,{" "}
                                        <Link
                                            href="/refund-policy"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 hover:text-pink-200"
                                        >
                                            Refund Policy
                                        </Link>
                                        , pricing
                                        information, and
                                        any applicable
                                        Business order form
                                        are incorporated
                                        into this
                                        agreement.
                                    </p>

                                    <p>
                                        If you use
                                        Thumblify on behalf
                                        of a company,
                                        agency, channel,
                                        client, or other
                                        organization, you
                                        confirm that you
                                        are authorized to
                                        accept these Terms
                                        on its behalf.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="eligibility"
                                number={2}
                                title="Eligibility and Age Requirements"
                                icon={
                                    UserRoundIcon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        You must be at
                                        least 13 years old
                                        to create or use a
                                        Thumblify account.
                                    </p>

                                    <p>
                                        If you are under
                                        the legal age of
                                        adulthood where
                                        you live, you may
                                        use Thumblify only
                                        with permission
                                        from a parent or
                                        legal guardian.
                                        A parent or
                                        guardian should
                                        review these Terms
                                        before a minor
                                        purchases a paid
                                        plan.
                                    </p>

                                    <p>
                                        You may not use
                                        the service if you
                                        are legally
                                        prohibited from
                                        receiving it or if
                                        your previous
                                        account was
                                        terminated for
                                        serious or repeated
                                        violations.
                                    </p>

                                    <p>
                                        Business users
                                        must have the
                                        authority and legal
                                        capacity necessary
                                        to enter into
                                        agreements for the
                                        organization they
                                        represent.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="service"
                                number={3}
                                title="About the Thumblify Service"
                                icon={
                                    SparklesIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        Thumblify is a
                                        creative platform
                                        that helps users
                                        generate, regenerate,
                                        enhance, organize,
                                        compare, select,
                                        and download
                                        thumbnail concepts.
                                    </p>

                                    <p>
                                        Depending on your
                                        plan and available
                                        features, you may
                                        submit video titles,
                                        prompts, creative
                                        instructions,
                                        colors, styles,
                                        aspect ratios,
                                        reference images,
                                        and existing
                                        thumbnail versions.
                                    </p>

                                    <p>
                                        Features, limits,
                                        processing methods,
                                        generation quality,
                                        supported formats,
                                        and available plans
                                        may change as the
                                        service develops.
                                    </p>

                                    <p>
                                        Thumblify is a
                                        creative tool. It
                                        does not publish
                                        videos, manage your
                                        channel, guarantee
                                        audience growth, or
                                        replace your final
                                        editorial and legal
                                        review.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="accounts"
                                number={4}
                                title="Accounts and Account Security"
                                icon={
                                    KeyRoundIcon
                                }
                                accent="emerald"
                            >
                                <p>
                                    An account is required
                                    to generate and manage
                                    thumbnails. You agree
                                    to follow these account
                                    responsibilities:
                                </p>

                                <ul className="mt-6 grid gap-3">
                                    {accountResponsibilities.map(
                                        (item) => (
                                            <li
                                                key={
                                                    item
                                                }
                                                className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                            >
                                                <CheckCircle2Icon
                                                    aria-hidden="true"
                                                    className="mt-0.5 size-5 shrink-0 text-emerald-400"
                                                />

                                                <span>
                                                    {
                                                        item
                                                    }
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                                <p className="mt-6">
                                    We may treat activity
                                    performed through your
                                    authenticated account
                                    as authorized by you
                                    until you notify us of
                                    suspected unauthorized
                                    access.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="free-plan"
                                number={5}
                                title="Free Plan and Generation Credits"
                                icon={
                                    CircleDollarSignIcon
                                }
                                accent="emerald"
                            >
                                <div className="space-y-4">
                                    <p>
                                        A newly registered
                                        eligible account
                                        currently receives
                                        three lifetime
                                        standard generation
                                        credits under the
                                        Free plan.
                                    </p>

                                    <p>
                                        The Free plan does
                                        not require a
                                        credit or debit
                                        card. It does not
                                        automatically
                                        convert into a
                                        paid subscription.
                                    </p>

                                    <p>
                                        Free plan
                                        thumbnails are
                                        currently available
                                        without a
                                        Thumblify
                                        watermark.
                                    </p>

                                    <p>
                                        The three Free
                                        plan credits are
                                        lifetime credits,
                                        not monthly
                                        credits. They do
                                        not automatically
                                        renew after being
                                        used.
                                    </p>

                                    <p>
                                        Generation credits
                                        have no cash value,
                                        cannot be sold or
                                        transferred, and
                                        may be used only
                                        within the account
                                        to which they were
                                        issued.
                                    </p>

                                    <p>
                                        Creating multiple
                                        accounts, using
                                        disposable
                                        identities, or
                                        otherwise attempting
                                        to receive
                                        additional Free
                                        plan credits is
                                        prohibited.
                                    </p>

                                    <p>
                                        Current credit
                                        costs and included
                                        actions are
                                        explained on the{" "}
                                        <Link
                                            href="/pricing"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 hover:text-pink-200"
                                        >
                                            Pricing page
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="paid-plans"
                                number={6}
                                title="Paid Plans, Billing, and Renewal"
                                icon={
                                    CreditCardIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        Paid plans may
                                        include Creator
                                        Pro, Business,
                                        additional credit
                                        packages, or other
                                        plans displayed on
                                        the Pricing page or
                                        at checkout.
                                    </p>

                                    <p>
                                        The price,
                                        currency, billing
                                        period, included
                                        credits, taxes, and
                                        important
                                        subscription terms
                                        will be presented
                                        before you complete
                                        a purchase.
                                    </p>

                                    <p>
                                        Unless checkout
                                        clearly states
                                        otherwise, paid
                                        monthly and yearly
                                        plans are recurring
                                        subscriptions.
                                        They automatically
                                        renew for the same
                                        billing period
                                        until cancelled.
                                    </p>

                                    <p>
                                        A yearly price
                                        displayed as a
                                        monthly equivalent
                                        is billed as one
                                        annual payment. For
                                        example, a plan
                                        shown as a lower
                                        monthly equivalent
                                        may require payment
                                        of the full annual
                                        total at checkout.
                                    </p>

                                    <p>
                                        By purchasing a
                                        subscription, you
                                        authorize the
                                        applicable payment
                                        provider to charge
                                        the payment method
                                        you selected for
                                        the initial
                                        purchase, renewals,
                                        applicable taxes,
                                        and approved plan
                                        changes.
                                    </p>

                                    <p>
                                        Monthly plan
                                        credits normally
                                        reset on the
                                        applicable monthly
                                        renewal or
                                        allocation date.
                                        Unless a plan
                                        expressly states
                                        otherwise, unused
                                        included monthly
                                        credits do not
                                        roll over.
                                    </p>

                                    <p>
                                        We may change
                                        future prices or
                                        plan features.
                                        Where required, we
                                        will provide notice
                                        before a material
                                        price change applies
                                        to a recurring
                                        subscription.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="cancellation"
                                number={7}
                                title="Cancellation, Downgrades, and Expiration"
                                icon={
                                    RefreshCwIcon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        You may cancel a
                                        paid subscription
                                        using available
                                        account controls.
                                        When self-service
                                        cancellation is not
                                        available, contact
                                        us using the
                                        information at the
                                        end of these Terms.
                                    </p>

                                    <p>
                                        Cancellation stops
                                        future renewal
                                        charges. Unless
                                        otherwise stated,
                                        paid access
                                        continues until
                                        the end of the
                                        billing period
                                        already paid for.
                                    </p>

                                    <p>
                                        A downgrade
                                        normally takes
                                        effect at the end
                                        of the current
                                        billing period.
                                        Your available
                                        credits and
                                        features may then
                                        change to match the
                                        lower plan.
                                    </p>

                                    <p>
                                        Cancelling a
                                        subscription does
                                        not automatically
                                        delete your
                                        account. Previously
                                        generated projects
                                        may remain available
                                        subject to storage,
                                        retention, and
                                        plan-access rules.
                                    </p>

                                    <p>
                                        You should
                                        download important
                                        thumbnails before
                                        cancelling or
                                        deleting an
                                        account. We do not
                                        promise permanent
                                        storage of all
                                        files after plan
                                        expiration or
                                        account closure.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="refunds"
                                number={8}
                                title="Refunds"
                                icon={
                                    CircleDollarSignIcon
                                }
                                accent="amber"
                            >
                                <div className="space-y-4">
                                    <p>
                                        Refund eligibility
                                        is governed by our{" "}
                                        <Link
                                            href="/refund-policy"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 hover:text-pink-200"
                                        >
                                            Refund Policy
                                        </Link>
                                        , the information
                                        displayed at
                                        checkout, and any
                                        mandatory rights
                                        available under
                                        applicable law.
                                    </p>

                                    <p>
                                        Because Thumblify
                                        provides digital
                                        generation services,
                                        the number of
                                        credits already
                                        consumed, generated
                                        files delivered,
                                        subscription period
                                        used, and reason for
                                        the request may be
                                        considered when
                                        reviewing refund
                                        eligibility.
                                    </p>

                                    <p>
                                        Nothing in these
                                        Terms removes a
                                        refund, remedy,
                                        cancellation, or
                                        other consumer
                                        right that cannot
                                        legally be
                                        excluded.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="uploaded-content"
                                number={9}
                                title="Your Uploaded Content"
                                icon={
                                    FileImageIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        “User Content”
                                        includes titles,
                                        prompts,
                                        instructions,
                                        photographs,
                                        portraits, logos,
                                        product images,
                                        characters,
                                        backgrounds,
                                        graphics, existing
                                        thumbnails, and
                                        other material you
                                        submit.
                                    </p>

                                    <p>
                                        You retain any
                                        ownership rights
                                        you already hold in
                                        your User Content.
                                        Thumblify does not
                                        obtain ownership of
                                        that content merely
                                        because you upload
                                        it.
                                    </p>

                                    <p>
                                        You confirm that
                                        you own your User
                                        Content or possess
                                        all permissions,
                                        licences, releases,
                                        and legal rights
                                        needed to upload,
                                        process, transform,
                                        and use it through
                                        Thumblify.
                                    </p>

                                    <p>
                                        You grant
                                        Thumblify a
                                        limited,
                                        non-exclusive,
                                        worldwide licence
                                        to host, store,
                                        copy, transmit,
                                        process, resize,
                                        transform, and
                                        display User
                                        Content only as
                                        reasonably necessary
                                        to provide, secure,
                                        maintain,
                                        troubleshoot, and
                                        administer the
                                        service.
                                    </p>

                                    <p>
                                        This licence does
                                        not give us
                                        permission to sell
                                        your private
                                        uploads or publicly
                                        advertise them
                                        independently of
                                        providing the
                                        service.
                                    </p>

                                    <p>
                                        User Content may
                                        be transmitted to
                                        service providers
                                        that perform
                                        hosting, storage,
                                        security, and
                                        automated image
                                        processing as
                                        described in our{" "}
                                        <Link
                                            href="/privacy-policy"
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 hover:text-pink-200"
                                        >
                                            Privacy Policy
                                        </Link>
                                        .
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="generated-content"
                                number={10}
                                title="Generated Thumbnails and Output Usage"
                                icon={
                                    SparklesIcon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        Subject to these
                                        Terms, your plan,
                                        applicable law, and
                                        third-party rights,
                                        you may use and
                                        download the
                                        thumbnail outputs
                                        generated for your
                                        account.
                                    </p>

                                    <p>
                                        You are responsible
                                        for deciding
                                        whether an output
                                        is suitable,
                                        accurate, original,
                                        lawful, and safe to
                                        publish.
                                    </p>

                                    <p>
                                        Automated systems
                                        may generate
                                        similar or
                                        identical concepts
                                        for different
                                        users. We do not
                                        guarantee that any
                                        output will be
                                        unique or exclusive
                                        to you.
                                    </p>

                                    <p>
                                        We do not
                                        guarantee that an
                                        output is eligible
                                        for copyright,
                                        trademark, design,
                                        or other
                                        intellectual-property
                                        protection in your
                                        jurisdiction.
                                    </p>

                                    <p>
                                        An output may
                                        unintentionally
                                        resemble existing
                                        artwork, brands,
                                        people, characters,
                                        designs, or other
                                        protected material.
                                        You must perform
                                        appropriate review
                                        before commercial
                                        use.
                                    </p>

                                    <p>
                                        You remain
                                        responsible for
                                        obtaining any
                                        necessary client,
                                        model, brand,
                                        talent, publicity,
                                        or other approval
                                        before publishing
                                        an output.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="acceptable-use"
                                number={11}
                                title="Acceptable Use and Prohibited Activity"
                                icon={
                                    BanIcon
                                }
                                accent="amber"
                            >
                                <p>
                                    You must use
                                    Thumblify lawfully and
                                    responsibly. You may
                                    not:
                                </p>

                                <ul className="mt-6 grid gap-3">
                                    {prohibitedUses.map(
                                        (item) => (
                                            <li
                                                key={
                                                    item
                                                }
                                                className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                            >
                                                <BanIcon
                                                    aria-hidden="true"
                                                    className="mt-0.5 size-5 shrink-0 text-red-400"
                                                />

                                                <span>
                                                    {
                                                        item
                                                    }
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>

                                <p className="mt-6">
                                    We may investigate
                                    suspected violations,
                                    restrict generation,
                                    remove content, suspend
                                    accounts, preserve
                                    evidence, or cooperate
                                    with lawful requests
                                    when reasonably
                                    necessary.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="intellectual-property"
                                number={12}
                                title="Thumblify Intellectual Property"
                                icon={
                                    CopyrightIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        Thumblify and its
                                        licensors own the
                                        website,
                                        application,
                                        software, source
                                        code, interface,
                                        layouts, databases,
                                        documentation,
                                        branding, logos,
                                        trademarks, and
                                        other service
                                        materials, excluding
                                        User Content.
                                    </p>

                                    <p>
                                        We grant you a
                                        limited,
                                        non-exclusive,
                                        non-transferable,
                                        revocable licence
                                        to access and use
                                        the service for its
                                        intended purpose
                                        while you comply
                                        with these Terms.
                                    </p>

                                    <p>
                                        You may not copy,
                                        modify, distribute,
                                        resell, sublicense,
                                        publicly reproduce,
                                        reverse engineer,
                                        or create a
                                        competing service
                                        from protected
                                        Thumblify materials
                                        except where
                                        applicable law
                                        expressly permits
                                        it.
                                    </p>

                                    <p>
                                        The Thumblify
                                        name, logo, and
                                        visual identity may
                                        not be used in a
                                        way that suggests
                                        sponsorship,
                                        endorsement, or
                                        partnership without
                                        written permission.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="output-limitations"
                                number={13}
                                title="Automated Output Limitations"
                                icon={
                                    TriangleAlertIcon
                                }
                                accent="amber"
                            >
                                <div className="space-y-4">
                                    <p>
                                        Thumbnail
                                        generation is
                                        automated and may
                                        produce unexpected,
                                        inaccurate,
                                        incomplete,
                                        distorted, or
                                        unsuitable results.
                                    </p>

                                    <p>
                                        Generated text may
                                        contain spelling
                                        errors. Images may
                                        contain incorrect
                                        details,
                                        inconsistent
                                        objects, unintended
                                        similarities, or
                                        visual defects.
                                    </p>

                                    <p>
                                        Generation may
                                        occasionally fail,
                                        take longer than
                                        expected, or return
                                        a result that does
                                        not fully follow
                                        your prompt.
                                    </p>

                                    <p>
                                        You must review,
                                        edit where
                                        necessary, and
                                        approve every
                                        output before
                                        publishing,
                                        advertising,
                                        delivering it to a
                                        client, or using it
                                        commercially.
                                    </p>

                                    <p>
                                        Thumblify does not
                                        guarantee views,
                                        clicks,
                                        click-through rate,
                                        subscriber growth,
                                        revenue, search
                                        ranking,
                                        monetization, or
                                        performance on any
                                        content platform.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="third-party-services"
                                number={14}
                                title="Third-Party Services"
                                icon={
                                    CloudIcon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        Thumblify depends
                                        on independent
                                        providers for
                                        services such as
                                        hosting, databases,
                                        authentication,
                                        image storage,
                                        automated
                                        processing,
                                        payments, email
                                        delivery,
                                        monitoring, and
                                        security.
                                    </p>

                                    <p>
                                        Your use of a
                                        third-party payment,
                                        authentication, or
                                        linked service may
                                        also be governed by
                                        that provider's
                                        terms and privacy
                                        policy.
                                    </p>

                                    <p>
                                        We do not control
                                        independent
                                        third-party
                                        services and
                                        cannot guarantee
                                        their permanent
                                        availability,
                                        processing times,
                                        security, or
                                        continued
                                        compatibility.
                                    </p>

                                    <p>
                                        Links to
                                        third-party
                                        websites are
                                        provided for
                                        convenience and do
                                        not automatically
                                        mean that
                                        Thumblify endorses
                                        their content or
                                        practices.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="availability"
                                number={15}
                                title="Service Availability and Changes"
                                icon={
                                    RefreshCwIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        We aim to provide
                                        a reliable service,
                                        but Thumblify may
                                        occasionally be
                                        unavailable because
                                        of maintenance,
                                        updates, capacity
                                        limits, provider
                                        outages, security
                                        incidents, network
                                        failures, or events
                                        outside our
                                        reasonable control.
                                    </p>

                                    <p>
                                        We may add,
                                        modify, restrict,
                                        replace, suspend,
                                        or discontinue
                                        features, plans,
                                        models, workflows,
                                        formats, storage
                                        options, or usage
                                        limits.
                                    </p>

                                    <p>
                                        Where reasonably
                                        possible, we will
                                        provide notice of
                                        material changes
                                        that significantly
                                        affect an active
                                        paid subscription.
                                    </p>

                                    <p>
                                        You are
                                        responsible for
                                        keeping independent
                                        copies of
                                        thumbnails and
                                        files that are
                                        important to you.
                                        Thumblify should not
                                        be treated as your
                                        only permanent
                                        backup system.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="business-usage"
                                number={16}
                                title="Business, Agency, and Bulk Usage"
                                icon={
                                    Building2Icon
                                }
                                accent="purple"
                            >
                                <p>
                                    Business and bulk
                                    plans are intended for
                                    agencies, teams,
                                    freelancers, brands,
                                    and high-volume
                                    creators. Business
                                    users agree to the
                                    following:
                                </p>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    {businessResponsibilities.map(
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

                                <p className="mt-6">
                                    Custom credit
                                    packages, onboarding,
                                    usage limits, payment
                                    schedules, or service
                                    commitments may be
                                    stated in a separate
                                    written order form.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="feedback"
                                number={17}
                                title="Suggestions and Feedback"
                                icon={
                                    MessageSquareTextIcon
                                }
                                accent="emerald"
                            >
                                <div className="space-y-4">
                                    <p>
                                        You may send
                                        suggestions,
                                        feature requests,
                                        ideas, comments,
                                        or other feedback
                                        about Thumblify.
                                    </p>

                                    <p>
                                        Unless we agree
                                        otherwise in
                                        writing, feedback
                                        is not confidential.
                                        You grant us
                                        permission to use,
                                        adapt, develop, and
                                        implement that
                                        feedback without
                                        payment or other
                                        obligation to you.
                                    </p>

                                    <p>
                                        Do not include
                                        confidential client
                                        information, trade
                                        secrets, or
                                        materials that you
                                        are not authorized
                                        to disclose in
                                        feedback.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="termination"
                                number={18}
                                title="Suspension and Termination"
                                icon={
                                    BanIcon
                                }
                                accent="amber"
                            >
                                <div className="space-y-4">
                                    <p>
                                        You may stop using
                                        Thumblify at any
                                        time. You may also
                                        request account
                                        deletion, subject
                                        to payment,
                                        retention,
                                        security, and legal
                                        obligations.
                                    </p>

                                    <p>
                                        We may restrict,
                                        suspend, or
                                        terminate access if
                                        we reasonably
                                        believe that:
                                    </p>

                                    <ul className="grid gap-3">
                                        {[
                                            "You materially or repeatedly violate these Terms.",
                                            "Your account is involved in fraud, abuse, unauthorized automation, or security threats.",
                                            "Payment remains overdue or is reversed without a valid basis.",
                                            "Your use creates legal exposure or risks harm to another person or the service.",
                                            "Suspension is required by law, court order, or a lawful authority.",
                                            "The relevant service or plan is discontinued.",
                                        ].map(
                                            (item) => (
                                                <li
                                                    key={
                                                        item
                                                    }
                                                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                                >
                                                    <BanIcon
                                                        aria-hidden="true"
                                                        className="mt-0.5 size-5 shrink-0 text-red-400"
                                                    />

                                                    <span>
                                                        {
                                                            item
                                                        }
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>

                                    <p>
                                        Where appropriate,
                                        we may provide
                                        notice and an
                                        opportunity to
                                        correct a
                                        violation. Serious
                                        security, fraud,
                                        unlawful, or
                                        abusive activity
                                        may result in
                                        immediate action.
                                    </p>

                                    <p>
                                        Upon termination,
                                        your right to use
                                        the service ends.
                                        Provisions that by
                                        their nature should
                                        survive termination
                                        will remain in
                                        effect, including
                                        ownership,
                                        disclaimers,
                                        liability,
                                        payment, dispute,
                                        and general
                                        provisions.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="disclaimers"
                                number={19}
                                title="Service Disclaimers"
                                icon={
                                    ShieldCheckIcon
                                }
                                accent="amber"
                            >
                                <div className="space-y-4">
                                    <p>
                                        To the maximum
                                        extent permitted by
                                        applicable law,
                                        Thumblify is
                                        provided on an “as
                                        is” and “as
                                        available” basis.
                                    </p>

                                    <p>
                                        We do not promise
                                        that the service
                                        will always be
                                        available, secure,
                                        uninterrupted,
                                        error-free, or
                                        compatible with
                                        every device,
                                        browser, platform,
                                        file, prompt, or
                                        workflow.
                                    </p>

                                    <p>
                                        We do not promise
                                        that generated
                                        outputs will be
                                        accurate, unique,
                                        legally protectable,
                                        free from
                                        third-party claims,
                                        or suitable for a
                                        particular
                                        commercial purpose.
                                    </p>

                                    <p>
                                        You use and
                                        publish generated
                                        content at your own
                                        judgment and remain
                                        responsible for
                                        final review.
                                    </p>

                                    <p>
                                        Nothing in this
                                        section excludes a
                                        warranty, guarantee,
                                        remedy, or consumer
                                        right that cannot
                                        legally be
                                        excluded.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="liability"
                                number={20}
                                title="Limitation of Liability"
                                icon={
                                    ScaleIcon
                                }
                                accent="amber"
                            >
                                <div className="space-y-4">
                                    <p>
                                        To the maximum
                                        extent permitted by
                                        applicable law,
                                        Thumblify and its
                                        owners, employees,
                                        contractors,
                                        affiliates, and
                                        service providers
                                        will not be liable
                                        for indirect,
                                        incidental,
                                        special,
                                        consequential,
                                        exemplary, or
                                        punitive damages.
                                    </p>

                                    <p>
                                        This includes, to
                                        the extent legally
                                        permitted, loss of
                                        profits, revenue,
                                        business,
                                        opportunity,
                                        goodwill, audience,
                                        content, credits,
                                        data, or anticipated
                                        savings arising
                                        from your use of or
                                        inability to use
                                        the service.
                                    </p>

                                    <p>
                                        To the maximum
                                        extent permitted by
                                        law, our total
                                        aggregate liability
                                        arising from the
                                        service or these
                                        Terms will not
                                        exceed the total
                                        amount you paid to
                                        Thumblify during
                                        the 12 months
                                        immediately before
                                        the event giving
                                        rise to the claim.
                                    </p>

                                    <p>
                                        These limitations
                                        do not apply where
                                        liability cannot
                                        legally be limited,
                                        including where
                                        applicable for
                                        fraud, intentional
                                        misconduct, or
                                        other legally
                                        protected matters.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="indemnification"
                                number={21}
                                title="Indemnification"
                                icon={
                                    ShieldCheckIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        To the extent
                                        permitted by
                                        applicable law, you
                                        agree to defend,
                                        indemnify, and hold
                                        harmless Thumblify
                                        from third-party
                                        claims, losses,
                                        liabilities, and
                                        reasonable expenses
                                        arising from:
                                    </p>

                                    <ul className="grid gap-3">
                                        {[
                                            "Your unlawful or unauthorized use of the service.",
                                            "User Content that you did not have permission to upload or process.",
                                            "Your published output infringing another person's rights.",
                                            "Your material violation of these Terms.",
                                            "Your fraud, intentional misconduct, or misuse of another person's account or information.",
                                        ].map(
                                            (item) => (
                                                <li
                                                    key={
                                                        item
                                                    }
                                                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                                >
                                                    <CheckCircle2Icon
                                                        aria-hidden="true"
                                                        className="mt-0.5 size-5 shrink-0 text-pink-400"
                                                    />

                                                    <span>
                                                        {
                                                            item
                                                        }
                                                    </span>
                                                </li>
                                            )
                                        )}
                                    </ul>

                                    <p>
                                        This section
                                        applies only to
                                        the extent allowed
                                        by applicable law
                                        and may not apply
                                        to consumer users
                                        in every
                                        jurisdiction.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="governing-law"
                                number={22}
                                title="Governing Law and Dispute Resolution"
                                icon={
                                    Globe2Icon
                                }
                                accent="purple"
                            >
                                <div className="space-y-4">
                                    <p>
                                        These Terms are
                                        governed by the
                                        laws of{" "}
                                        {governingLaw},
                                        without applying
                                        conflict-of-law
                                        principles, except
                                        where mandatory
                                        consumer law
                                        requires a
                                        different result.
                                    </p>

                                    <p>
                                        Before starting
                                        formal proceedings,
                                        you and Thumblify
                                        agree to make a
                                        reasonable attempt
                                        to resolve the
                                        dispute informally.
                                        Send a written
                                        description of the
                                        issue to{" "}
                                        <a
                                            href={`mailto:${legalEmail}?subject=Thumblify%20Legal%20Dispute`}
                                            className="text-pink-300 underline decoration-pink-400/40 underline-offset-4 hover:text-pink-200"
                                        >
                                            {legalEmail}
                                        </a>
                                        .
                                    </p>

                                    <p>
                                        The parties should
                                        allow up to 30 days
                                        for informal
                                        discussion before
                                        filing a claim,
                                        unless urgent legal
                                        relief is needed or
                                        applicable law
                                        provides otherwise.
                                    </p>

                                    <p>
                                        Subject to
                                        mandatory consumer
                                        rights, disputes
                                        that cannot be
                                        resolved informally
                                        will be submitted
                                        to the courts with
                                        lawful jurisdiction
                                        over the operator's
                                        location in{" "}
                                        {businessLocation}.
                                    </p>

                                    <p>
                                        Nothing in these
                                        Terms prevents a
                                        consumer from using
                                        a court, complaint
                                        process, regulator,
                                        or remedy that
                                        applicable law
                                        requires to remain
                                        available.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="terms-updates"
                                number={23}
                                title="Changes to These Terms"
                                icon={
                                    RefreshCwIcon
                                }
                            >
                                <div className="space-y-4">
                                    <p>
                                        We may update
                                        these Terms when
                                        the service,
                                        pricing, features,
                                        providers, laws, or
                                        business operations
                                        change.
                                    </p>

                                    <p>
                                        The updated Terms
                                        will be posted on
                                        this page with a
                                        revised “Last
                                        updated” date.
                                    </p>

                                    <p>
                                        For material
                                        changes affecting
                                        active paid
                                        subscribers, we may
                                        also provide notice
                                        through the
                                        service, account,
                                        checkout, or email
                                        where reasonably
                                        appropriate or
                                        legally required.
                                    </p>

                                    <p>
                                        Unless required
                                        for law, security,
                                        fraud prevention,
                                        or urgent service
                                        protection,
                                        material changes
                                        will apply
                                        prospectively.
                                    </p>

                                    <p>
                                        Your continued use
                                        of Thumblify after
                                        updated Terms take
                                        effect means that
                                        you accept the
                                        revised agreement.
                                    </p>
                                </div>
                            </TermsSection>

                            <TermsSection
                                id="general"
                                number={24}
                                title="General Provisions"
                                icon={
                                    FileTextIcon
                                }
                                accent="emerald"
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {generalProvisions.map(
                                        ({
                                            title,
                                            description,
                                        }) => (
                                            <article
                                                key={
                                                    title
                                                }
                                                className="rounded-xl border border-white/8 bg-black/20 p-5"
                                            >
                                                <h3 className="font-semibold text-zinc-100">
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

                                <p className="mt-6">
                                    Headings are provided
                                    for convenience and do
                                    not limit the meaning
                                    of any provision.
                                </p>
                            </TermsSection>

                            <TermsSection
                                id="contact"
                                number={25}
                                title="Contact Us"
                                icon={
                                    MailIcon
                                }
                            >
                                <p className="max-w-3xl">
                                    Contact us with
                                    questions about these
                                    Terms, subscription
                                    cancellation, billing,
                                    account access, or a
                                    legal notice.
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
                                            Email:
                                        </span>{" "}
                                        <a
                                            href={`mailto:${legalEmail}`}
                                            className="text-pink-300 transition hover:text-pink-200"
                                        >
                                            {legalEmail}
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
                                        href={`mailto:${legalEmail}?subject=Terms%20and%20Conditions%20Question`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                                    >
                                        Email Legal Team

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
                            </TermsSection>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}