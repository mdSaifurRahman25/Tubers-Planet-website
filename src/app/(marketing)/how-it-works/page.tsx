import type { Metadata } from "next";
import Link from "next/link";

import {
    ArrowRightIcon,
    CheckCircle2Icon,
    CircleHelpIcon,
    Clock3Icon,
    CoinsIcon,
    CreditCardIcon,
    CropIcon,
    DownloadIcon,
    FileImageIcon,
    FolderClockIcon,
    ImagesIcon,
    Layers3Icon,
    LightbulbIcon,
    ListChecksIcon,
    MailIcon,
    MousePointerClickIcon,
    PaletteIcon,
    RefreshCwIcon,
    ShieldCheckIcon,
    SlidersHorizontalIcon,
    SparklesIcon,
    TypeIcon,
    UserPlusIcon,
    WandSparklesIcon,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";

const siteUrl =
    process.env
        .NEXT_PUBLIC_SITE_URL
        ?.replace(/\/+$/, "") ||
    "http://localhost:3000";

const supportEmail =
    process.env
        .NEXT_PUBLIC_SUPPORT_EMAIL
        ?.trim() ||
    "hello@thumblify.com";

export const metadata: Metadata = {
    title:
        "How Thumblify Works | Create YouTube Thumbnails Step by Step",

    description:
        "Learn how to create professional YouTube thumbnails with Thumblify. Create an account, enter your video title, add reference images, generate versions, enhance your design, and download the final thumbnail.",

    keywords: [
        "how Thumblify works",
        "how to create YouTube thumbnails",
        "AI thumbnail generator tutorial",
        "YouTube thumbnail creation steps",
        "generate YouTube thumbnail",
        "thumbnail reference image",
        "professional thumbnail generator",
        "YouTube thumbnail workflow",
    ],

    alternates: {
        canonical:
            `${siteUrl}/how-it-works`,
    },

    openGraph: {
        title:
            "How Thumblify Works | From Video Idea to Final Thumbnail",

        description:
            "Follow the complete Thumblify workflow to create, regenerate, enhance, compare, and download professional thumbnail concepts.",

        url:
            `${siteUrl}/how-it-works`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "How Thumblify Works",

        description:
            "Turn your video title and reference images into professional thumbnail concepts in a few simple steps.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

interface WorkflowStep {
    number: string;
    title: string;
    description: string;
    details: string[];
    icon: LucideIcon;
    actionLabel?: string;
    actionHref?: string;
}

const workflowSteps: WorkflowStep[] = [
    {
        number:
            "01",

        title:
            "Create Your Free Account",

        description:
            "Start by creating a Thumblify account. Your account keeps your projects, generated thumbnails, saved versions, and available credits organized in one place.",

        details: [
            "An account is required to generate thumbnails",
            "No credit card is required for the Free plan",
            "Receive 3 lifetime standard generation credits",
            "Free downloads do not contain a watermark",
        ],

        icon:
            UserPlusIcon,

        actionLabel:
            "Create an Account",

        actionHref:
            "/login",
    },

    {
        number:
            "02",

        title:
            "Enter Your Video Title",

        description:
            "Add the title or main topic of your video. Thumblify uses this information to understand the subject and build the starting visual direction.",

        details: [
            "Use a clear and specific video title",
            "Mention the main subject or topic",
            "Include the important emotion or result",
            "Avoid unnecessarily long or confusing titles",
        ],

        icon:
            TypeIcon,
    },

    {
        number:
            "03",

        title:
            "Choose Your Thumbnail Settings",

        description:
            "Select the visual options that match your content platform, audience, and channel identity.",

        details: [
            "Choose a supported aspect ratio",
            "Select a visual style",
            "Choose a suitable color direction",
            "Adjust the available generation settings",
        ],

        icon:
            SlidersHorizontalIcon,
    },

    {
        number:
            "04",

        title:
            "Add Creative Instructions",

        description:
            "Use the prompt or instruction field to explain how you want the thumbnail to look. More specific instructions can provide a clearer creative direction.",

        details: [
            "Describe the main subject and background",
            "Mention facial expression or emotion",
            "Explain the preferred composition",
            "Describe lighting, colors, and visual mood",
            "Mention any important text or object placement",
        ],

        icon:
            LightbulbIcon,
    },

    {
        number:
            "05",

        title:
            "Upload Reference Images",

        description:
            "Upload your own visual references when you want the thumbnail to follow a particular face, product, character, outfit, background, or design direction.",

        details: [
            "Upload up to 3 reference images",
            "Use clear and high-quality images",
            "Upload only content you have permission to use",
            "Reference images are optional",
        ],

        icon:
            ImagesIcon,
    },

    {
        number:
            "06",

        title:
            "Generate Your Thumbnail",

        description:
            "Review your title, prompt, settings, and reference images. Then submit the request to create your first thumbnail concept.",

        details: [
            "A standard generation uses 1 credit",
            "Keep the page open while the request is processing",
            "The result is saved to your account",
            "Review all text and visual details before publishing",
        ],

        icon:
            WandSparklesIcon,

        actionLabel:
            "Generate a Thumbnail",

        actionHref:
            "/generate",
    },

    {
        number:
            "07",

        title:
            "Regenerate Another Version",

        description:
            "When the first result is not the right fit, create a fresh alternative without deleting the previous version.",

        details: [
            "Regenerate creates a new image version",
            "A regeneration currently uses 1 credit",
            "Previous versions remain saved",
            "Compare multiple ideas before choosing",
        ],

        icon:
            RefreshCwIcon,
    },

    {
        number:
            "08",

        title:
            "Use Premium Enhance",

        description:
            "Paid-plan users can refine a strong thumbnail concept with the Premium Enhance workflow and optional supporting reference images.",

        details: [
            "Improve an existing thumbnail concept",
            "Strengthen visual details and composition",
            "Use optional reference images",
            "Premium Enhance currently uses 3 credits",
        ],

        icon:
            SparklesIcon,
    },

    {
        number:
            "09",

        title:
            "Compare and Select a Version",

        description:
            "Open your thumbnail project and review the original, regenerated, and enhanced versions together.",

        details: [
            "Compare all saved project versions",
            "Select the version you prefer",
            "Return to an older version when needed",
            "Viewing and selecting existing versions uses no credits",
        ],

        icon:
            Layers3Icon,
    },

    {
        number:
            "10",

        title:
            "Download Your Final Thumbnail",

        description:
            "Download the selected result and use it in your YouTube publishing workflow. Keep your own backup of important final images.",

        details: [
            "Downloading an existing result uses no credits",
            "No Thumblify watermark is added",
            "Review the thumbnail before publishing",
            "Keep a local backup of your final file",
        ],

        icon:
            DownloadIcon,
    },
];

const setupOptions = [
    {
        title:
            "Video Title",

        description:
            "Tell Thumblify what your video is about. A clear title gives the generation process an accurate starting point.",

        icon:
            TypeIcon,
    },

    {
        title:
            "Aspect Ratio",

        description:
            "Choose the format that matches your content, such as standard landscape, square, or vertical output.",

        icon:
            CropIcon,
    },

    {
        title:
            "Visual Style",

        description:
            "Choose a style that matches the tone of your content and the type of audience you want to attract.",

        icon:
            FileImageIcon,
    },

    {
        title:
            "Color Direction",

        description:
            "Select a color scheme that supports your brand, subject, emotion, or preferred thumbnail identity.",

        icon:
            PaletteIcon,
    },

    {
        title:
            "Creative Prompt",

        description:
            "Describe the scene, subject, expression, composition, lighting, and other important creative details.",

        icon:
            LightbulbIcon,
    },

    {
        title:
            "Reference Images",

        description:
            "Add up to three visual references for faces, products, characters, clothing, backgrounds, or related visual guidance.",

        icon:
            ImagesIcon,
    },
];

const creditActions = [
    {
        action:
            "Standard Generate",

        cost:
            "1 credit",

        description:
            "Creates a new thumbnail from your title, prompt, settings, and optional reference images.",

        icon:
            WandSparklesIcon,
    },

    {
        action:
            "Regenerate",

        cost:
            "1 credit",

        description:
            "Creates a fresh version while preserving the previous versions inside the same project.",

        icon:
            RefreshCwIcon,
    },

    {
        action:
            "Premium Enhance",

        cost:
            "3 credits",

        description:
            "Uses the advanced enhancement workflow to refine an existing concept.",

        icon:
            SparklesIcon,
    },

    {
        action:
            "View, Select, or Download",

        cost:
            "0 credits",

        description:
            "Reviewing, selecting, comparing, or downloading an existing version does not create a new image.",

        icon:
            MousePointerClickIcon,
    },
];

const generationTips = [
    {
        title:
            "Be Specific",

        description:
            "Instead of writing “make it attractive,” describe the subject, emotion, background, lighting, layout, and intended audience.",

        icon:
            ListChecksIcon,
    },

    {
        title:
            "Use Clear References",

        description:
            "Choose sharp, well-lit images where the important face, object, product, or character is easy to identify.",

        icon:
            FileImageIcon,
    },

    {
        title:
            "Keep Text Short",

        description:
            "Short thumbnail text is generally easier to read on mobile screens and gives the visual elements more space.",

        icon:
            TypeIcon,
    },

    {
        title:
            "Test Multiple Versions",

        description:
            "Do not depend on only one result. Regenerate alternatives and compare the visual direction before publishing.",

        icon:
            Layers3Icon,
    },

    {
        title:
            "Protect Your Brand Identity",

        description:
            "Use a consistent color direction, visual style, composition, and level of energy across related videos.",

        icon:
            PaletteIcon,
    },

    {
        title:
            "Review Before Publishing",

        description:
            "Check generated text, faces, hands, products, brand elements, and other details before using the thumbnail publicly.",

        icon:
            ShieldCheckIcon,
    },
];

const pageFaqs = [
    {
        question:
            "Do I need an account to generate a thumbnail?",

        answer:
            "Yes. An account is required to use generation credits, save projects, compare versions, and download results from your account.",
    },

    {
        question:
            "Can I try Thumblify without a credit card?",

        answer:
            "Yes. Eligible new accounts receive three lifetime standard generation credits without adding a credit or debit card.",
    },

    {
        question:
            "Will my free thumbnails contain a watermark?",

        answer:
            "No. Downloads from the Free plan do not contain a Thumblify watermark.",
    },

    {
        question:
            "Do I have to upload reference images?",

        answer:
            "No. Reference images are optional. You can create a thumbnail using your video title, settings, and creative instructions only.",
    },

    {
        question:
            "How many reference images can I upload?",

        answer:
            "You can currently upload up to three supported reference images for a generation or enhancement request.",
    },

    {
        question:
            "What happens if I do not like the first result?",

        answer:
            "You can adjust your creative instructions, use different references, regenerate a new version, or use Premium Enhance when it is available on your plan.",
    },

    {
        question:
            "Will regenerating remove the first image?",

        answer:
            "No. Regenerated and enhanced versions remain grouped with the original project so you can compare them later.",
    },

    {
        question:
            "Does downloading use a credit?",

        answer:
            "No. Downloading, viewing, comparing, or selecting an already generated thumbnail does not use a generation credit.",
    },

    {
        question:
            "Can Thumblify guarantee more video views?",

        answer:
            "No. Thumblify helps you create and test thumbnail concepts, but video performance also depends on the topic, title, audience, content quality, publishing strategy, and distribution.",
    },
];

export default function HowItWorksPage() {
    const howToSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "HowTo",

        name:
            "How to Create a YouTube Thumbnail with Thumblify",

        description:
            "Create an account, enter a video title, choose settings, add creative instructions and reference images, generate versions, and download the final thumbnail.",

        url:
            `${siteUrl}/how-it-works`,

        totalTime:
            "PT10M",

        supply: [
            {
                "@type":
                    "HowToSupply",

                name:
                    "A video title or topic",
            },

            {
                "@type":
                    "HowToSupply",

                name:
                    "Optional reference images",
            },
        ],

        tool: [
            {
                "@type":
                    "HowToTool",

                name:
                    "Thumblify account",
            },
        ],

        step:
            workflowSteps.map(
                (step, index) => ({
                    "@type":
                        "HowToStep",

                    position:
                        index + 1,

                    name:
                        step.title,

                    text:
                        step.description,

                    url:
                        `${siteUrl}/how-it-works#step-${step.number}`,
                })
            ),
    };

    const faqSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "FAQPage",

        mainEntity:
            pageFaqs.map(
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

    const breadcrumbSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "BreadcrumbList",

        itemListElement: [
            {
                "@type":
                    "ListItem",

                position:
                    1,

                name:
                    "Home",

                item:
                    siteUrl,
            },

            {
                "@type":
                    "ListItem",

                position:
                    2,

                name:
                    "How It Works",

                item:
                    `${siteUrl}/how-it-works`,
            },
        ],
    };

    return (
        <>
            <SoftBackdrop />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            howToSchema
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

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html:
                        JSON.stringify(
                            breadcrumbSchema
                        ),
                }}
            />

            <main className="relative z-10 min-h-screen overflow-hidden px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    {/* Hero */}
                    <section
                        aria-labelledby="how-it-works-heading"
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <WandSparklesIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            How Thumblify Works
                        </div>

                        <h1
                            id="how-it-works-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-6xl"
                        >
                            Turn Your Video Idea Into a{" "}
                            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Professional Thumbnail
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                            Start with a video title,
                            add your creative direction
                            and optional reference
                            images, then generate,
                            compare, improve, and
                            download the thumbnail that
                            fits your content.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/generate"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-pink-600/20 transition hover:from-pink-600 hover:to-pink-700 sm:w-auto"
                            >
                                Create Your Thumbnail

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <Link
                                href="/pricing"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-pink-500/30 hover:bg-white/10 hover:text-white sm:w-auto"
                            >
                                View Pricing
                            </Link>
                        </div>
                    </section>

                    {/* Trust facts */}
                    <section
                        aria-label="Getting started information"
                        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
                    >
                        <article className="rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-5">
                            <CreditCardIcon
                                aria-hidden="true"
                                className="size-6 text-emerald-400"
                            />

                            <h2 className="mt-4 font-semibold text-zinc-100">
                                No Card Required
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                Start the Free plan
                                without entering payment
                                card details.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-pink-500/15 bg-pink-500/5 p-5">
                            <CoinsIcon
                                aria-hidden="true"
                                className="size-6 text-pink-400"
                            />

                            <h2 className="mt-4 font-semibold text-zinc-100">
                                3 Free Generations
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                Eligible accounts receive
                                three lifetime standard
                                generation credits.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-purple-400/15 bg-purple-400/5 p-5">
                            <ShieldCheckIcon
                                aria-hidden="true"
                                className="size-6 text-purple-400"
                            />

                            <h2 className="mt-4 font-semibold text-zinc-100">
                                No Watermark
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                Download your available
                                thumbnail without a
                                Thumblify watermark.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
                            <Clock3Icon
                                aria-hidden="true"
                                className="size-6 text-amber-400"
                            />

                            <h2 className="mt-4 font-semibold text-zinc-100">
                                Simple Workflow
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                Create, review, improve,
                                and download from one
                                organized workspace.
                            </p>
                        </article>
                    </section>

                    {/* Overview */}
                    <section
                        aria-labelledby="workflow-overview-heading"
                        className="mt-24 grid items-center gap-8 rounded-3xl border border-white/10 bg-linear-to-br from-pink-500/10 via-white/5 to-purple-500/10 p-7 shadow-2xl sm:p-10 lg:grid-cols-[0.8fr_1.2fr]"
                    >
                        <div>
                            <div className="flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                                <FolderClockIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2
                                id="workflow-overview-heading"
                                className="mt-6 text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl"
                            >
                                Everything Stays Inside
                                One Thumbnail Project
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
                                Your first result,
                                regenerated alternatives,
                                enhanced versions, and
                                selected thumbnail can
                                remain grouped together.
                                This makes it easier to
                                experiment without losing
                                your previous ideas.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            {[
                                "Create from a title and prompt",
                                "Upload up to 3 reference images",
                                "Generate multiple saved versions",
                                "Compare versions within one project",
                                "Select your preferred result",
                                "Download without using another credit",
                            ].map(
                                (item) => (
                                    <div
                                        key={item}
                                        className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                    >
                                        <CheckCircle2Icon
                                            aria-hidden="true"
                                            className="mt-0.5 size-5 shrink-0 text-emerald-400"
                                        />

                                        <span>
                                            {item}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </section>

                    {/* Complete workflow */}
                    <section
                        aria-labelledby="complete-workflow-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
                                Step-by-step guide
                            </p>

                            <h2
                                id="complete-workflow-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                How to Create a Thumbnail
                                With Thumblify
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                Follow these steps from
                                account registration to
                                the final download.
                            </p>
                        </div>

                        <div className="mx-auto mt-14 max-w-5xl space-y-6">
                            {workflowSteps.map(
                                (
                                    {
                                        number,
                                        title,
                                        description,
                                        details,
                                        icon: Icon,
                                        actionLabel,
                                        actionHref,
                                    },
                                    index
                                ) => (
                                    <article
                                        key={number}
                                        id={`step-${number}`}
                                        className="scroll-mt-28"
                                    >
                                        <div className="grid gap-5 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl sm:p-8 lg:grid-cols-[110px_minmax(0,1fr)]">
                                            <div className="flex items-start gap-4 lg:block">
                                                <div className="flex size-12 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                                                    <Icon
                                                        aria-hidden="true"
                                                        className="size-6"
                                                    />
                                                </div>

                                                <p className="mt-1 text-4xl font-black tracking-tight text-white/10 lg:mt-5">
                                                    {number}
                                                </p>
                                            </div>

                                            <div>
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-pink-400">
                                                        Step{" "}
                                                        {index +
                                                            1}
                                                    </p>

                                                    {number ===
                                                        "01" && (
                                                            <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold text-emerald-300">
                                                                Free to
                                                                start
                                                            </span>
                                                        )}
                                                </div>

                                                <h3 className="mt-3 text-2xl font-bold text-zinc-100">
                                                    {title}
                                                </h3>

                                                <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                                    {
                                                        description
                                                    }
                                                </p>

                                                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                                                    {details.map(
                                                        (
                                                            detail
                                                        ) => (
                                                            <li
                                                                key={
                                                                    detail
                                                                }
                                                                className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                                            >
                                                                <CheckCircle2Icon
                                                                    aria-hidden="true"
                                                                    className="mt-0.5 size-4.5 shrink-0 text-emerald-400"
                                                                />

                                                                <span>
                                                                    {
                                                                        detail
                                                                    }
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>

                                                {actionLabel &&
                                                    actionHref && (
                                                        <Link
                                                            href={
                                                                actionHref
                                                            }
                                                            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl border border-pink-500/25 bg-pink-500/10 px-5 py-3 text-sm font-semibold text-pink-200 transition hover:bg-pink-500/15"
                                                        >
                                                            {
                                                                actionLabel
                                                            }

                                                            <ArrowRightIcon
                                                                aria-hidden="true"
                                                                className="size-4"
                                                            />
                                                        </Link>
                                                    )}
                                            </div>
                                        </div>
                                    </article>
                                )
                            )}
                        </div>
                    </section>

                    {/* Generator inputs */}
                    <section
                        aria-labelledby="generator-inputs-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                                What you can control
                            </p>

                            <h2
                                id="generator-inputs-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                Give Thumblify a Clear
                                Creative Direction
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                These inputs help the
                                platform understand the
                                thumbnail you are trying
                                to create.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {setupOptions.map(
                                ({
                                    title,
                                    description,
                                    icon: Icon,
                                }) => (
                                    <article
                                        key={title}
                                        className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-purple-400/25 hover:bg-white/8"
                                    >
                                        <div className="flex size-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                                            <Icon
                                                aria-hidden="true"
                                                className="size-6"
                                            />
                                        </div>

                                        <h3 className="mt-5 text-lg font-semibold text-zinc-100">
                                            {title}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                                            {
                                                description
                                            }
                                        </p>
                                    </article>
                                )
                            )}
                        </div>
                    </section>

                    {/* Credits */}
                    <section
                        aria-labelledby="credit-system-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                                Simple credit system
                            </p>

                            <h2
                                id="credit-system-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                When Generation Credits
                                Are Used
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                Credits are used only
                                when Thumblify creates a
                                new image result.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                            {creditActions.map(
                                ({
                                    action,
                                    cost,
                                    description,
                                    icon: Icon,
                                }) => (
                                    <article
                                        key={action}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-6"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex size-11 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                                <Icon
                                                    aria-hidden="true"
                                                    className="size-5"
                                                />
                                            </div>

                                            <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-xs font-semibold text-zinc-200">
                                                {cost}
                                            </span>
                                        </div>

                                        <h3 className="mt-5 font-semibold text-zinc-100">
                                            {action}
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                                            {
                                                description
                                            }
                                        </p>
                                    </article>
                                )
                            )}
                        </div>

                        <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/5 p-5 text-center">
                            <p className="text-sm leading-7 text-zinc-300">
                                Selecting a saved version,
                                comparing projects, or
                                downloading an existing
                                thumbnail does not use
                                another generation credit.
                            </p>
                        </div>
                    </section>

                    {/* Tips */}
                    <section
                        aria-labelledby="generation-tips-heading"
                        className="mt-24"
                    >
                        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
                                    Better results
                                </p>

                                <h2
                                    id="generation-tips-heading"
                                    className="mt-4 text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl"
                                >
                                    Tips for Creating
                                    Stronger Thumbnail
                                    Concepts
                                </h2>

                                <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
                                    Better instructions
                                    and clearer references
                                    can help Thumblify
                                    understand the creative
                                    direction more
                                    effectively.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                {generationTips.map(
                                    ({
                                        title,
                                        description,
                                        icon: Icon,
                                    }) => (
                                        <article
                                            key={title}
                                            className="rounded-2xl border border-white/10 bg-white/5 p-6"
                                        >
                                            <Icon
                                                aria-hidden="true"
                                                className="size-6 text-amber-400"
                                            />

                                            <h3 className="mt-4 text-lg font-semibold text-zinc-100">
                                                {title}
                                            </h3>

                                            <p className="mt-3 text-sm leading-7 text-zinc-400">
                                                {
                                                    description
                                                }
                                            </p>
                                        </article>
                                    )
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Free plan */}
                    <section className="mt-24 grid items-center gap-8 rounded-3xl border border-emerald-400/15 bg-linear-to-br from-emerald-400/8 via-white/5 to-pink-500/8 p-7 shadow-2xl sm:p-10 lg:grid-cols-2">
                        <div>
                            <div className="flex size-12 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300">
                                <CreditCardIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2 className="mt-6 text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl">
                                Test the Complete Basic
                                Workflow Before Paying
                            </h2>

                            <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
                                Create your account and
                                use three lifetime
                                standard generation
                                credits. No payment card
                                is required, and your
                                available downloads will
                                not contain a Thumblify
                                watermark.
                            </p>

                            <Link
                                href="/generate"
                                className="mt-7 inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-400"
                            >
                                Start Creating Free

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <ul className="grid gap-4 sm:grid-cols-2">
                            {[
                                "Account required",
                                "3 lifetime generations",
                                "No card required",
                                "No watermark",
                                "Title and prompt input",
                                "Up to 3 references",
                                "Saved project history",
                                "Download final result",
                            ].map(
                                (feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-3 rounded-xl border border-white/8 bg-black/20 p-4 text-sm leading-6 text-zinc-300"
                                    >
                                        <CheckCircle2Icon
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

                    {/* FAQ */}
                    <section
                        aria-labelledby="how-it-works-faq-heading"
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
                                id="how-it-works-faq-heading"
                                className="mt-6 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                How It Works Questions
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                Quick answers about
                                accounts, references,
                                credits, versions, and
                                downloads.
                            </p>
                        </div>

                        <div className="mx-auto mt-12 max-w-4xl space-y-4">
                            {pageFaqs.map(
                                (faq) => (
                                    <details
                                        key={
                                            faq.question
                                        }
                                        className="group rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg open:border-pink-500/25 open:bg-white/7 sm:p-6"
                                    >
                                        <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-left text-base font-semibold leading-7 text-zinc-100">
                                            <span>
                                                {
                                                    faq.question
                                                }
                                            </span>

                                            <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xl font-light text-pink-300 transition group-open:rotate-45">
                                                +
                                            </span>
                                        </summary>

                                        <p className="mt-4 border-t border-white/8 pt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                            {
                                                faq.answer
                                            }
                                        </p>
                                    </details>
                                )
                            )}
                        </div>

                        <div className="mt-8 text-center">
                            <Link
                                href="/faqs"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-pink-300 transition hover:text-pink-200"
                            >
                                View All FAQs

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
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
                            Ready to Create Your First
                            Thumbnail?
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                            Create your account, enter
                            your video title, add your
                            creative direction, and
                            start exploring thumbnail
                            concepts without adding a
                            payment card.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/generate"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:from-pink-600 hover:to-pink-700 sm:w-auto"
                            >
                                Generate a Thumbnail

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white sm:w-auto"
                            >
                                Ask a Question

                                <MailIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>

                        <p className="mt-5 text-xs text-zinc-500">
                            Support:{" "}
                            <a
                                href={`mailto:${supportEmail}`}
                                className="text-pink-300 transition hover:text-pink-200"
                            >
                                {supportEmail}
                            </a>
                        </p>
                    </section>
                </div>
            </main>
        </>
    );
}