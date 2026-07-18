import type { Metadata } from "next";
import Link from "next/link";

import {
    ArrowRightIcon,
    BotIcon,
    CheckCircle2Icon,
    CookieIcon,
    CreditCardIcon,
    DatabaseIcon,
    FileImageIcon,
    Globe2Icon,
    KeyRoundIcon,
    LockKeyholeIcon,
    MailIcon,
    MessageSquareTextIcon,
    ScaleIcon,
    ShieldCheckIcon,
    Trash2Icon,
    UserRoundIcon,
    UsersIcon,
} from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";

const siteUrl =
    process.env
        .NEXT_PUBLIC_SITE_URL
        ?.replace(/\/+$/, "") ||
    "http://localhost:3000";

const privacyEmail =
    process.env
        .NEXT_PUBLIC_PRIVACY_EMAIL
        ?.trim() ||
    process.env
        .NEXT_PUBLIC_SUPPORT_EMAIL
        ?.trim() ||
    "privacy@thumblify.com";

const businessLocation =
    process.env
        .NEXT_PUBLIC_BUSINESS_LOCATION
        ?.trim() ||
    "Bangladesh";

const lastUpdated =
    "July 18, 2026";

export const metadata: Metadata = {
    title:
        "Privacy Policy | Thumblify",

    description:
        "Read the Thumblify Privacy Policy to understand what information we collect, how uploaded images and generated thumbnails are processed, and how you can manage your privacy rights.",

    keywords: [
        "Thumblify privacy policy",
        "thumbnail generator privacy",
        "AI image generator privacy",
        "uploaded image privacy",
        "YouTube thumbnail data policy",
        "creator tool privacy policy",
    ],

    alternates: {
        canonical:
            `${siteUrl}/privacy-policy`,
    },

    openGraph: {
        title:
            "Privacy Policy | Thumblify",

        description:
            "Learn how Thumblify collects, uses, protects, stores, and shares information when you use our thumbnail creation platform.",

        url:
            `${siteUrl}/privacy-policy`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "Privacy Policy | Thumblify",

        description:
            "Learn how Thumblify handles account information, uploaded reference images, generated thumbnails, communications, and privacy requests.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

const tableOfContents = [
    {
        label:
            "Scope of This Policy",
        href:
            "#scope",
    },
    {
        label:
            "Information We Collect",
        href:
            "#information-we-collect",
    },
    {
        label:
            "How We Use Information",
        href:
            "#how-we-use-information",
    },
    {
        label:
            "Image and AI Processing",
        href:
            "#image-processing",
    },
    {
        label:
            "Cookies and Similar Technologies",
        href:
            "#cookies",
    },
    {
        label:
            "How We Share Information",
        href:
            "#information-sharing",
    },
    {
        label:
            "Payments",
        href:
            "#payments",
    },
    {
        label:
            "Data Retention",
        href:
            "#data-retention",
    },
    {
        label:
            "Data Security",
        href:
            "#data-security",
    },
    {
        label:
            "International Processing",
        href:
            "#international-processing",
    },
    {
        label:
            "Your Privacy Rights",
        href:
            "#privacy-rights",
    },
    {
        label:
            "Children's Privacy",
        href:
            "#childrens-privacy",
    },
    {
        label:
            "Emails and Newsletter",
        href:
            "#communications",
    },
    {
        label:
            "Policy Updates",
        href:
            "#policy-updates",
    },
    {
        label:
            "Contact Us",
        href:
            "#contact-us",
    },
];

const collectedInformation = [
    {
        title:
            "Account Information",

        description:
            "Your name, email address, authentication details, account identifier, plan information, account status, and profile information.",

        icon:
            UserRoundIcon,
    },
    {
        title:
            "Uploaded Content",

        description:
            "Reference images, photos, product images, characters, backgrounds, prompts, titles, instructions, and other files you submit for thumbnail generation.",

        icon:
            FileImageIcon,
    },
    {
        title:
            "Generated Content",

        description:
            "Generated thumbnails, regenerated versions, enhanced versions, selected versions, project history, generation settings, styles, colors, and aspect ratios.",

        icon:
            BotIcon,
    },
    {
        title:
            "Communications",

        description:
            "Information included in contact forms, sales inquiries, support requests, partnership inquiries, feedback, and other messages you send to us.",

        icon:
            MessageSquareTextIcon,
    },
    {
        title:
            "Newsletter Information",

        description:
            "Your email address, subscription status, subscription source, signup date, and limited technical information used to manage newsletter requests.",

        icon:
            MailIcon,
    },
    {
        title:
            "Transaction Information",

        description:
            "Your selected plan, billing cycle, subscription status, payment confirmation, transaction identifier, invoice details, and limited billing information.",

        icon:
            CreditCardIcon,
    },
    {
        title:
            "Technical Information",

        description:
            "IP address, browser type, device information, operating system, pages viewed, request timestamps, error logs, security events, and general usage activity.",

        icon:
            DatabaseIcon,
    },
    {
        title:
            "Cookies and Session Data",

        description:
            "Authentication cookies, session identifiers, security tokens, preferences, and similar technologies needed to keep you signed in and operate the service.",

        icon:
            CookieIcon,
    },
];

const informationUses = [
    "Create, authenticate, secure, and manage your account.",
    "Process prompts, titles, settings, and reference images to generate thumbnail results.",
    "Store generated projects, versions, selections, and download history.",
    "Provide Free, Creator Pro, Business, and other available plans.",
    "Measure generation credits and enforce plan limits.",
    "Process subscriptions, payments, renewals, refunds, and billing inquiries.",
    "Respond to contact forms, sales inquiries, support requests, and feedback.",
    "Send account notices, security alerts, service updates, and requested communications.",
    "Manage newsletter subscriptions and marketing preferences.",
    "Detect spam, fraud, abuse, unauthorized access, and violations of our policies.",
    "Diagnose technical problems and improve reliability, performance, and usability.",
    "Comply with legal obligations and protect our users, service, and rights.",
];

const informationSharing = [
    {
        title:
            "AI Processing Providers",

        description:
            "Uploaded reference images, prompts, settings, and related instructions may be transmitted to infrastructure providers that process requests and return generated or enhanced images.",

        icon:
            BotIcon,
    },
    {
        title:
            "Cloud and Storage Providers",

        description:
            "We may use hosting, database, content delivery, image storage, backup, and security providers to operate Thumblify and deliver saved files.",

        icon:
            DatabaseIcon,
    },
    {
        title:
            "Authentication Providers",

        description:
            "Authentication and security providers may process account credentials, session information, verification data, and login activity.",

        icon:
            KeyRoundIcon,
    },
    {
        title:
            "Email Providers",

        description:
            "Email delivery providers may process your email address and message content to send contact responses, service messages, or newsletters.",

        icon:
            MailIcon,
    },
    {
        title:
            "Payment Providers",

        description:
            "Payment processors may handle card details, payment authorization, invoices, subscription renewals, refunds, and fraud-prevention checks.",

        icon:
            CreditCardIcon,
    },
    {
        title:
            "Professional and Legal Services",

        description:
            "Information may be shared with auditors, accountants, legal advisers, insurers, or authorities when reasonably necessary or legally required.",

        icon:
            ScaleIcon,
    },
];

const privacyRights = [
    {
        title:
            "Access",

        description:
            "Request information about the personal data associated with your account and obtain a copy where applicable.",

        icon:
            UserRoundIcon,
    },
    {
        title:
            "Correction",

        description:
            "Ask us to correct personal information that is inaccurate, outdated, or incomplete.",

        icon:
            CheckCircle2Icon,
    },
    {
        title:
            "Deletion",

        description:
            "Request deletion of your account and personal information, subject to legal, security, fraud-prevention, and record-keeping exceptions.",

        icon:
            Trash2Icon,
    },
    {
        title:
            "Data Portability",

        description:
            "Request certain personal information in a structured and portable format where this right applies.",

        icon:
            DatabaseIcon,
    },
    {
        title:
            "Restriction or Objection",

        description:
            "Ask us to restrict certain processing or object to processing based on legitimate interests where applicable.",

        icon:
            ShieldCheckIcon,
    },
    {
        title:
            "Withdraw Consent",

        description:
            "Withdraw consent for consent-based processing without affecting processing that occurred before withdrawal.",

        icon:
            LockKeyholeIcon,
    },
];

export default function PrivacyPolicyPage() {
    const privacyPolicySchema = {
        "@context":
            "https://schema.org",

        "@type":
            "WebPage",

        name:
            "Thumblify Privacy Policy",

        description:
            "Information about how Thumblify collects, uses, stores, protects, and shares personal information.",

        url:
            `${siteUrl}/privacy-policy`,

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
                "Thumblify",

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
                            privacyPolicySchema
                        ),
                }}
            />

            <main className="relative z-10 min-h-screen overflow-hidden px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Hero */}
                    <section
                        aria-labelledby="privacy-policy-heading"
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <ShieldCheckIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            Your Privacy Matters
                        </div>

                        <h1
                            id="privacy-policy-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-6xl"
                        >
                            Privacy{" "}
                            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Policy
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                            This Privacy Policy
                            explains what information
                            Thumblify collects, why we
                            collect it, how it may be
                            processed and shared, and
                            the choices available to
                            you.
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
                        aria-label="Privacy policy summary"
                        className="mt-14 grid gap-4 md:grid-cols-3"
                    >
                        <article className="rounded-2xl border border-white/10 bg-white/6 p-6">
                            <FileImageIcon
                                aria-hidden="true"
                                className="size-7 text-pink-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                Your Creative Content
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                Reference images,
                                prompts, and settings
                                are processed to create,
                                store, and deliver your
                                requested thumbnails.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-white/10 bg-white/6 p-6">
                            <LockKeyholeIcon
                                aria-hidden="true"
                                className="size-7 text-emerald-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                Security Measures
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                We use reasonable
                                technical and
                                organizational measures
                                to protect account,
                                project, and
                                communication data.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-white/10 bg-white/6 p-6">
                            <UserRoundIcon
                                aria-hidden="true"
                                className="size-7 text-purple-400"
                            />

                            <h2 className="mt-4 text-lg font-semibold text-zinc-100">
                                Your Choices
                            </h2>

                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                Depending on your
                                location, you may
                                request access,
                                correction, deletion,
                                portability, or other
                                privacy controls.
                            </p>
                        </article>
                    </section>

                    <div className="mt-16 grid items-start gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
                        {/* Table of contents */}
                        <aside className="lg:sticky lg:top-28">
                            <div className="rounded-2xl border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
                                <h2 className="text-base font-semibold text-zinc-100">
                                    On This Page
                                </h2>

                                <nav
                                    aria-label="Privacy policy sections"
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
                            <section
                                id="scope"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    1. Scope of This
                                    Policy
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        This Privacy
                                        Policy applies
                                        when you visit
                                        Thumblify, create
                                        an account,
                                        generate or manage
                                        thumbnails,
                                        subscribe to our
                                        newsletter,
                                        purchase a plan,
                                        contact us, or
                                        otherwise use our
                                        websites,
                                        applications, and
                                        related services.
                                    </p>

                                    <p>
                                        In this policy,
                                        “Thumblify,”
                                        “we,” “us,” and
                                        “our” refer to
                                        the operator of
                                        the Thumblify
                                        service. “You”
                                        refers to a
                                        visitor, account
                                        holder, creator,
                                        customer, team
                                        member, or other
                                        user of the
                                        service.
                                    </p>

                                    <p>
                                        This policy does
                                        not apply to
                                        third-party
                                        websites,
                                        applications, or
                                        services that we
                                        do not control,
                                        even when they
                                        are linked from
                                        Thumblify.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="information-we-collect"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    2. Information We
                                    Collect
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    The information we
                                    collect depends on
                                    how you use
                                    Thumblify and which
                                    features are
                                    available to your
                                    account.
                                </p>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    {collectedInformation.map(
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
                                                    className="size-5 text-pink-400"
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

                                <div className="mt-6 rounded-xl border border-amber-400/15 bg-amber-400/5 p-5">
                                    <h3 className="font-semibold text-amber-200">
                                        Information You
                                        Upload
                                    </h3>

                                    <p className="mt-2 text-sm leading-7 text-zinc-400">
                                        Please do not
                                        upload sensitive
                                        personal
                                        information or
                                        images of another
                                        person unless you
                                        have the right
                                        and necessary
                                        permission to use
                                        that content.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="how-we-use-information"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    3. How We Use
                                    Information
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    We may use collected
                                    information for the
                                    following purposes:
                                </p>

                                <ul className="mt-6 grid gap-3">
                                    {informationUses.map(
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

                                <div className="mt-6">
                                    <h3 className="text-lg font-semibold text-zinc-100">
                                        Legal Bases
                                    </h3>

                                    <p className="mt-3 text-sm leading-7 text-zinc-400">
                                        Where applicable,
                                        we process
                                        personal
                                        information to
                                        perform our
                                        contract with
                                        you, comply with
                                        legal obligations,
                                        pursue legitimate
                                        interests such as
                                        security and
                                        service
                                        improvement, and
                                        obtain consent
                                        when consent is
                                        required.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="image-processing"
                                className="scroll-mt-28 rounded-2xl border border-pink-500/20 bg-linear-to-br from-pink-500/8 via-white/5 to-purple-500/8 p-6 sm:p-8"
                            >
                                <div className="flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                                    <BotIcon
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold text-zinc-100">
                                    4. Image and
                                    Automated Processing
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        Thumblify uses
                                        automated image
                                        processing to
                                        generate,
                                        regenerate, and
                                        enhance thumbnail
                                        concepts based on
                                        the information
                                        you provide.
                                    </p>

                                    <p>
                                        Your title,
                                        prompt, selected
                                        style, color
                                        direction,
                                        aspect ratio,
                                        uploaded reference
                                        images, and
                                        existing thumbnail
                                        versions may be
                                        transmitted to
                                        infrastructure
                                        providers that
                                        perform image
                                        generation or
                                        enhancement.
                                    </p>

                                    <p>
                                        Generated results
                                        may be saved to
                                        your account so
                                        you can review,
                                        compare, select,
                                        download, or
                                        delete different
                                        versions.
                                    </p>

                                    <p>
                                        Automated
                                        thumbnail
                                        generation does
                                        not make legal,
                                        employment,
                                        financial,
                                        educational, or
                                        similarly
                                        significant
                                        decisions about
                                        you.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="cookies"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    5. Cookies and
                                    Similar Technologies
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        Thumblify may
                                        use cookies,
                                        local storage,
                                        session storage,
                                        security tokens,
                                        and similar
                                        technologies.
                                    </p>

                                    <p>
                                        Essential
                                        technologies help
                                        us authenticate
                                        accounts, maintain
                                        sessions, prevent
                                        fraud, remember
                                        preferences, and
                                        operate core
                                        service
                                        functionality.
                                    </p>

                                    <p>
                                        Where optional
                                        analytics or
                                        marketing
                                        technologies are
                                        used, we will
                                        provide any
                                        notice, consent
                                        controls, or
                                        opt-out choices
                                        required by
                                        applicable law.
                                    </p>

                                    <p>
                                        Blocking
                                        essential cookies
                                        may prevent login,
                                        account security,
                                        generation history,
                                        or other important
                                        features from
                                        working correctly.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="information-sharing"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    6. How We Share
                                    Information
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    We may share
                                    information only as
                                    reasonably necessary
                                    to operate, secure,
                                    support, and improve
                                    Thumblify.
                                </p>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    {informationSharing.map(
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

                                <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-400">
                                    <p>
                                        We may also
                                        disclose
                                        information when
                                        we reasonably
                                        believe disclosure
                                        is required to
                                        comply with law,
                                        respond to lawful
                                        requests, protect
                                        users, investigate
                                        abuse, or enforce
                                        our agreements.
                                    </p>

                                    <p>
                                        If Thumblify is
                                        involved in a
                                        merger,
                                        acquisition,
                                        financing,
                                        reorganization, or
                                        sale of assets,
                                        information may
                                        be transferred as
                                        part of that
                                        transaction,
                                        subject to
                                        applicable
                                        protections.
                                    </p>
                                </div>

                                <div className="mt-6 rounded-xl border border-emerald-400/15 bg-emerald-400/5 p-5">
                                    <h3 className="font-semibold text-emerald-200">
                                        Sale of Personal
                                        Information
                                    </h3>

                                    <p className="mt-2 text-sm leading-7 text-zinc-400">
                                        Thumblify does
                                        not sell personal
                                        information for
                                        monetary
                                        consideration. If
                                        our practices
                                        materially change,
                                        we will update
                                        this policy and
                                        provide legally
                                        required choices.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="payments"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    7. Payments and
                                    Subscriptions
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        When you
                                        purchase a paid
                                        plan, payment
                                        information may
                                        be collected
                                        directly by an
                                        independent
                                        payment processor.
                                    </p>

                                    <p>
                                        Thumblify may
                                        receive limited
                                        transaction
                                        details such as
                                        the selected plan,
                                        billing cycle,
                                        transaction
                                        identifier,
                                        payment status,
                                        renewal date,
                                        invoice details,
                                        and limited
                                        billing contact
                                        information.
                                    </p>

                                    <p>
                                        We do not intend
                                        to directly store
                                        your complete
                                        credit or debit
                                        card number.
                                        Payment processors
                                        handle payment
                                        credentials
                                        according to their
                                        own privacy and
                                        security
                                        practices.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="data-retention"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    8. Data Retention
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        We retain
                                        personal
                                        information for
                                        as long as
                                        reasonably
                                        necessary to
                                        provide the
                                        service, maintain
                                        your account,
                                        complete
                                        transactions,
                                        comply with legal
                                        obligations,
                                        resolve disputes,
                                        prevent fraud, and
                                        enforce our
                                        agreements.
                                    </p>

                                    <p>
                                        Account
                                        information and
                                        saved thumbnail
                                        projects may
                                        remain available
                                        until you delete
                                        them, close your
                                        account, or ask us
                                        to remove them,
                                        subject to
                                        applicable
                                        exceptions.
                                    </p>

                                    <p>
                                        Newsletter data
                                        may be retained
                                        until you
                                        unsubscribe and
                                        for a limited
                                        period afterward
                                        to record your
                                        preference.
                                    </p>

                                    <p>
                                        Some information
                                        may remain in
                                        secure backups,
                                        transaction
                                        records, fraud
                                        prevention
                                        records, or legal
                                        archives for a
                                        reasonable period
                                        before deletion or
                                        anonymization.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="data-security"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    9. Data Security
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        We use reasonable
                                        technical,
                                        administrative,
                                        and organizational
                                        safeguards
                                        designed to
                                        protect
                                        information from
                                        unauthorized
                                        access,
                                        alteration,
                                        disclosure, loss,
                                        or misuse.
                                    </p>

                                    <p>
                                        These measures
                                        may include
                                        encrypted network
                                        connections,
                                        authentication
                                        controls, access
                                        restrictions,
                                        security logging,
                                        rate limiting,
                                        backups, and
                                        service-provider
                                        security reviews.
                                    </p>

                                    <p>
                                        No online service,
                                        storage system,
                                        or transmission
                                        method can be
                                        guaranteed to be
                                        completely secure.
                                        You are
                                        responsible for
                                        keeping your login
                                        credentials
                                        confidential and
                                        informing us of
                                        suspected
                                        unauthorized
                                        access.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="international-processing"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <div className="flex size-11 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                                    <Globe2Icon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </div>

                                <h2 className="mt-5 text-2xl font-bold text-zinc-100">
                                    10. International
                                    Data Processing
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        Thumblify is
                                        operated from{" "}
                                        {
                                            businessLocation
                                        }
                                        , while our
                                        hosting, storage,
                                        email, payment,
                                        security, and
                                        processing
                                        providers may
                                        operate in other
                                        countries.
                                    </p>

                                    <p>
                                        As a result,
                                        information may
                                        be transferred to
                                        and processed in
                                        countries with
                                        data-protection
                                        rules that differ
                                        from those in your
                                        location.
                                    </p>

                                    <p>
                                        Where required,
                                        we use appropriate
                                        contractual,
                                        organizational, or
                                        legal safeguards
                                        for international
                                        transfers.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="privacy-rights"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    11. Your Privacy
                                    Rights
                                </h2>

                                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    Depending on your
                                    location and
                                    applicable law, you
                                    may have some or all
                                    of the following
                                    rights:
                                </p>

                                <div className="mt-7 grid gap-4 sm:grid-cols-2">
                                    {privacyRights.map(
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
                                                    className="size-5 text-emerald-400"
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

                                <div className="mt-6 space-y-4 text-sm leading-7 text-zinc-400">
                                    <p>
                                        You may also
                                        have the right to
                                        opt out of certain
                                        sales, sharing,
                                        targeted
                                        advertising, or
                                        profiling where
                                        these rights
                                        apply.
                                    </p>

                                    <p>
                                        We will not
                                        discriminate
                                        against you for
                                        exercising an
                                        applicable privacy
                                        right.
                                    </p>

                                    <p>
                                        Before completing
                                        a request, we may
                                        need to verify
                                        your identity and
                                        confirm that the
                                        request relates to
                                        your account. An
                                        authorized agent
                                        may submit a
                                        request where
                                        permitted by law,
                                        subject to
                                        verification.
                                    </p>

                                    <p>
                                        You may also
                                        submit a complaint
                                        to your local
                                        privacy or
                                        data-protection
                                        authority where
                                        that right is
                                        available.
                                    </p>
                                </div>

                                <a
                                    href={`mailto:${privacyEmail}?subject=Thumblify%20Privacy%20Request`}
                                    className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                                >
                                    Submit a Privacy
                                    Request

                                    <ArrowRightIcon
                                        aria-hidden="true"
                                        className="size-4"
                                    />
                                </a>
                            </section>

                            <section
                                id="childrens-privacy"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <div className="flex size-11 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10 text-amber-300">
                                    <UsersIcon
                                        aria-hidden="true"
                                        className="size-5"
                                    />
                                </div>

                                <h2 className="mt-5 text-2xl font-bold text-zinc-100">
                                    12. Children's and
                                    Teen Users' Privacy
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        Thumblify is not
                                        directed to
                                        children under 13,
                                        and we do not
                                        knowingly collect
                                        personal
                                        information from
                                        children under 13.
                                    </p>

                                    <p>
                                        Users who are
                                        under the age of
                                        legal adulthood in
                                        their location
                                        should ask a
                                        parent or legal
                                        guardian to review
                                        applicable terms
                                        before purchasing
                                        a paid plan or
                                        submitting payment
                                        information.
                                    </p>

                                    <p>
                                        If you believe a
                                        child under 13
                                        provided personal
                                        information to
                                        Thumblify, contact
                                        us so we can
                                        investigate and
                                        take appropriate
                                        action.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="communications"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    13. Emails,
                                    Newsletter, and
                                    Marketing
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        We may send
                                        transactional
                                        messages needed
                                        to operate your
                                        account, such as
                                        security notices,
                                        verification
                                        messages, billing
                                        information, and
                                        important service
                                        updates.
                                    </p>

                                    <p>
                                        When you
                                        subscribe to the
                                        newsletter or
                                        otherwise request
                                        marketing
                                        communications, we
                                        may send product
                                        updates, thumbnail
                                        tips, creator
                                        resources,
                                        announcements, and
                                        relevant offers.
                                    </p>

                                    <p>
                                        You may
                                        unsubscribe from
                                        promotional
                                        communications
                                        using an
                                        unsubscribe option
                                        where provided or
                                        by contacting us.
                                        You may continue
                                        to receive
                                        essential
                                        transactional
                                        messages while
                                        your account
                                        remains active.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="policy-updates"
                                className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8"
                            >
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    14. Changes to This
                                    Privacy Policy
                                </h2>

                                <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                    <p>
                                        We may update
                                        this Privacy
                                        Policy when our
                                        service, data
                                        practices,
                                        providers,
                                        features, legal
                                        obligations, or
                                        business operations
                                        change.
                                    </p>

                                    <p>
                                        The updated
                                        version will be
                                        posted on this
                                        page with a new
                                        “Last updated”
                                        date. When
                                        required, we may
                                        also provide
                                        notice through the
                                        service or by
                                        email.
                                    </p>

                                    <p>
                                        You should review
                                        this page
                                        periodically to
                                        understand our
                                        current privacy
                                        practices.
                                    </p>
                                </div>
                            </section>

                            <section
                                id="contact-us"
                                className="scroll-mt-28 overflow-hidden rounded-2xl border border-pink-500/20 bg-linear-to-br from-pink-500/12 via-purple-500/8 to-black/20 p-6 sm:p-8"
                            >
                                <div className="flex size-12 items-center justify-center rounded-xl border border-pink-400/20 bg-pink-400/10 text-pink-300">
                                    <MailIcon
                                        aria-hidden="true"
                                        className="size-6"
                                    />
                                </div>

                                <h2 className="mt-6 text-2xl font-bold text-zinc-100">
                                    15. Contact Us
                                </h2>

                                <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                                    Contact us with
                                    questions about this
                                    Privacy Policy, our
                                    data practices, or a
                                    request concerning
                                    your personal
                                    information.
                                </p>

                                <div className="mt-6 space-y-3 text-sm text-zinc-300">
                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Organization:
                                        </span>{" "}
                                        Thumblify
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Email:
                                        </span>{" "}
                                        <a
                                            href={`mailto:${privacyEmail}`}
                                            className="text-pink-300 transition hover:text-pink-200"
                                        >
                                            {
                                                privacyEmail
                                            }
                                        </a>
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Location:
                                        </span>{" "}
                                        {
                                            businessLocation
                                        }
                                    </p>

                                    <p>
                                        <span className="font-semibold text-zinc-100">
                                            Website:
                                        </span>{" "}
                                        {
                                            siteUrl
                                        }
                                    </p>
                                </div>

                                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                    <a
                                        href={`mailto:${privacyEmail}?subject=Privacy%20Policy%20Question`}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-pink-700"
                                    >
                                        Email Privacy
                                        Team

                                        <ArrowRightIcon
                                            aria-hidden="true"
                                            className="size-4"
                                        />
                                    </a>

                                    <Link
                                        href="/contact"
                                        className="inline-flex items-center justify-center rounded-xl border border-white/12 bg-white/5 px-6 py-3 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white"
                                    >
                                        Visit Contact
                                        Page
                                    </Link>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}