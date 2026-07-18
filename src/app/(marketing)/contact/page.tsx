import type { Metadata } from "next";

import {
    CheckCircle2Icon,
    Clock3Icon,
    HeadphonesIcon,
    MailIcon,
    MessageCircleIcon,
    SparklesIcon,
} from "lucide-react";

import ContactForm from "@/components/contact/ContactForm";
import SoftBackdrop from "@/components/ui/SoftBackdrop";

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(
        /\/+$/,
        ""
    ) || "http://localhost:3000";

const contactEmail =
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
    "hello@thumblify.com";

const whatsappNumber =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER?.trim() ||
    "";

const normalizedWhatsappNumber =
    whatsappNumber.replace(/\D/g, "");

const whatsappHref =
    normalizedWhatsappNumber.length > 0
        ? `https://wa.me/${normalizedWhatsappNumber}`
        : "#contact-form";

const visibleWhatsappNumber =
    whatsappNumber ||
    "Available through the inquiry form";

export const metadata: Metadata = {
    title:
        "Contact Thumblify | Pricing, Sales & Partnerships",

    description:
        "Contact Thumblify to discuss pricing, plans, thumbnail requirements, team or agency usage, bulk generation, product demos, partnerships, and affiliate opportunities.",

    keywords: [
        "contact Thumblify",
        "Thumblify pricing",
        "AI thumbnail generator plans",
        "YouTube thumbnail service",
        "bulk thumbnail generation",
        "thumbnail solution for agencies",
        "Thumblify partnership",
        "Thumblify affiliate",
    ],

    alternates: {
        canonical:
            `${siteUrl}/contact`,
    },

    openGraph: {
        title:
            "Contact Thumblify | Find the Right Thumbnail Solution",

        description:
            "Tell us about your channel, thumbnail volume, team workflow, or business goals and discover the right Thumblify solution.",

        url:
            `${siteUrl}/contact`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "Contact Thumblify | Sales & Partnerships",

        description:
            "Discuss pricing, thumbnail requirements, bulk generation, agency solutions, and partnerships with Thumblify.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

const contactCards = [
    {
        title:
            "Sales Email",

        value:
            contactEmail,

        description:
            "Ask about plans, pricing, team usage, partnerships, or your specific thumbnail requirements.",

        href:
            `mailto:${contactEmail}`,

        icon:
            MailIcon,

        external:
            false,
    },

    {
        title:
            "WhatsApp Consultation",

        value:
            visibleWhatsappNumber,

        description:
            "Start a direct conversation about your channel, agency, or bulk thumbnail needs.",

        href:
            whatsappHref,

        icon:
            MessageCircleIcon,

        external:
            normalizedWhatsappNumber.length > 0,
    },

    {
        title:
            "Response Time",

        value:
            "Within 24 Hours",

        description:
            "Sales and partnership inquiries are normally answered within one business day.",

        href:
            "#contact-form",

        icon:
            Clock3Icon,

        external:
            false,
    },
];

const marketingBenefits = [
    "Create professional thumbnails in less time",
    "Explore multiple concepts before publishing",
    "Maintain a consistent visual identity",
    "Reduce recurring design time and costs",
    "Build workflows for teams, agencies, or clients",
    "Discuss bulk generation and partnership opportunities",
];

export default function ContactPage() {
    const contactPageSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "ContactPage",

        name:
            "Contact Thumblify",

        description:
            "Contact Thumblify for pricing, sales inquiries, product information, agency solutions, partnerships, and affiliate opportunities.",

        url:
            `${siteUrl}/contact`,

        mainEntity: {
            "@type":
                "Organization",

            name:
                "Thumblify",

            url:
                siteUrl,

            email:
                contactEmail,

            contactPoint: [
                {
                    "@type":
                        "ContactPoint",

                    contactType:
                        "sales",

                    email:
                        contactEmail,

                    availableLanguage: [
                        "English",
                        "Bengali",
                    ],
                },

                ...(whatsappNumber
                    ? [
                        {
                            "@type":
                                "ContactPoint",

                            contactType:
                                "sales",

                            telephone:
                                whatsappNumber,

                            availableLanguage: [
                                "English",
                                "Bengali",
                            ],
                        },
                    ]
                    : []),
            ],
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
                            contactPageSchema
                        ),
                }}
            />

            <main className="relative z-10 min-h-screen px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    <section
                        aria-labelledby="contact-page-heading"
                        className="mx-auto max-w-3xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <HeadphonesIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            Talk to Thumblify
                        </div>

                        <h1
                            id="contact-page-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-5xl"
                        >
                            Let&apos;s Find the
                            Right Thumbnail Solution
                            for Your Channel
                        </h1>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
                            Planning to create
                            faster, more engaging
                            YouTube thumbnails?
                            Tell us about your
                            channel, content volume,
                            or team workflow. We&apos;ll
                            help you explore the
                            right Thumblify option.
                        </p>
                    </section>

                    <section
                        aria-label="Thumblify sales contact information"
                        className="mt-14 grid gap-5 md:grid-cols-3"
                    >
                        {contactCards.map(
                            ({
                                title,
                                value,
                                description,
                                href,
                                icon: Icon,
                                external,
                            }) => (
                                <article
                                    key={title}
                                    className="group rounded-2xl border border-white/10 bg-white/6 p-6 shadow-xl transition hover:-translate-y-1 hover:border-pink-500/30 hover:bg-white/8"
                                >
                                    <div className="flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-400">
                                        <Icon
                                            aria-hidden="true"
                                            className="size-6"
                                        />
                                    </div>

                                    <h2 className="mt-5 text-base font-semibold text-zinc-100">
                                        {title}
                                    </h2>

                                    <a
                                        href={href}
                                        target={
                                            external
                                                ? "_blank"
                                                : undefined
                                        }
                                        rel={
                                            external
                                                ? "noopener noreferrer"
                                                : undefined
                                        }
                                        className="mt-2 block break-words text-sm font-medium text-pink-400 transition hover:text-pink-300"
                                    >
                                        {value}
                                    </a>

                                    <p className="mt-3 text-sm leading-6 text-zinc-400">
                                        {
                                            description
                                        }
                                    </p>
                                </article>
                            )
                        )}
                    </section>

                    <section
                        aria-labelledby="marketing-benefits-heading"
                        className="mt-16 grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]"
                    >
                        <div className="rounded-2xl border border-white/10 bg-white/6 p-6 shadow-xl sm:p-8">
                            <div className="flex size-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                                <SparklesIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2
                                id="marketing-benefits-heading"
                                className="mt-6 text-2xl font-bold leading-tight text-zinc-100"
                            >
                                Turn Every Video Idea
                                Into a Stronger First
                                Impression
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-zinc-400">
                                Your thumbnail is often
                                the first thing viewers
                                notice. Thumblify helps
                                creators, teams, and
                                agencies turn ideas into
                                professional visual
                                concepts without starting
                                every design from scratch.
                            </p>

                            <div className="mt-8">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-300">
                                    Why creators contact us
                                </h3>

                                <ul className="mt-4 space-y-4">
                                    {marketingBenefits.map(
                                        (benefit) => (
                                            <li
                                                key={
                                                    benefit
                                                }
                                                className="flex items-start gap-3 text-sm leading-6 text-zinc-400"
                                            >
                                                <CheckCircle2Icon
                                                    aria-hidden="true"
                                                    className="mt-0.5 size-5 shrink-0 text-emerald-400"
                                                />

                                                <span>
                                                    {
                                                        benefit
                                                    }
                                                </span>
                                            </li>
                                        )
                                    )}
                                </ul>
                            </div>

                            <div className="mt-8 rounded-xl border border-pink-400/20 bg-pink-400/8 p-4">
                                <div className="flex items-start gap-3">
                                    <MessageCircleIcon
                                        aria-hidden="true"
                                        className="mt-0.5 size-5 shrink-0 text-pink-300"
                                    />

                                    <div>
                                        <h3 className="text-sm font-semibold text-pink-200">
                                            Not sure where
                                            to start?
                                        </h3>

                                        <p className="mt-1 text-xs leading-5 text-zinc-400">
                                            Share your
                                            channel niche,
                                            publishing
                                            frequency,
                                            current workflow,
                                            and thumbnail
                                            goals. We&apos;ll
                                            help you identify
                                            the most suitable
                                            approach.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-5 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                                <Clock3Icon
                                    aria-hidden="true"
                                    className="size-5 shrink-0 text-pink-400"
                                />

                                <p className="text-sm leading-6 text-zinc-400">
                                    Sales inquiries are
                                    usually answered within{" "}
                                    <span className="font-medium text-zinc-200">
                                        one business day
                                    </span>
                                    .
                                </p>
                            </div>
                        </div>

                        <div
                            id="contact-form"
                            className="scroll-mt-28 rounded-2xl border border-white/10 bg-white/6 p-6 shadow-xl sm:p-8"
                        >
                            <div>
                                <h2 className="text-2xl font-bold text-zinc-100">
                                    Tell Us About Your Goals
                                </h2>

                                <p className="mt-2 text-sm leading-6 text-zinc-400">
                                    Share what you are
                                    looking for, and we&apos;ll
                                    review your requirements
                                    before getting back to
                                    you.
                                </p>
                            </div>

                            <ContactForm />
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}