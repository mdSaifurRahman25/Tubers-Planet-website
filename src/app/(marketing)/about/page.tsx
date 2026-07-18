import type { Metadata } from "next";
import Link from "next/link";

import {
    ArrowRightIcon,
    CheckCircle2Icon,
    Clock3Icon,
    ImageIcon,
    Layers3Icon,
    LightbulbIcon,
    MonitorSmartphoneIcon,
    PaletteIcon,
    RefreshCwIcon,
    ShieldCheckIcon,
    SparklesIcon,
    TargetIcon,
    UsersIcon,
    WandSparklesIcon,
    WorkflowIcon,
} from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";

const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(
        /\/+$/,
        ""
    ) || "http://localhost:3000";

export const metadata: Metadata = {
    title:
        "About Thumblify | Helping YouTubers Create Better Thumbnails",

    description:
        "Learn how Thumblify helps YouTubers, creators, teams, and agencies generate professional thumbnail concepts faster, use reference images, compare versions, and build a consistent visual identity.",

    keywords: [
        "about Thumblify",
        "AI YouTube thumbnail generator",
        "YouTube thumbnail creation tool",
        "thumbnail generator for YouTubers",
        "AI thumbnail design",
        "YouTube creator tools",
        "thumbnail tool for agencies",
        "professional YouTube thumbnails",
    ],

    alternates: {
        canonical:
            `${siteUrl}/about`,
    },

    openGraph: {
        title:
            "About Thumblify | Better Thumbnail Ideas, Faster",

        description:
            "Discover how Thumblify helps creators turn video ideas, prompts, and reference images into professional YouTube thumbnail concepts.",

        url:
            `${siteUrl}/about`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "About Thumblify | Built for YouTube Creators",

        description:
            "Create, regenerate, enhance, compare, and download professional thumbnail concepts with Thumblify.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

const creatorBenefits = [
    {
        title:
            "Turn Ideas Into Visual Concepts",

        description:
            "Start with a video title, topic, or creative instruction and turn it into a complete thumbnail concept without beginning from a blank canvas.",

        icon:
            LightbulbIcon,
    },

    {
        title:
            "Use Your Own Reference Images",

        description:
            "Upload your photo, product, background, character, or other visual references so the generated thumbnail better follows your intended direction.",

        icon:
            ImageIcon,
    },

    {
        title:
            "Explore Multiple Versions",

        description:
            "Generate a first concept, create fresh regenerated versions, and compare the results before selecting the one that fits your video best.",

        icon:
            Layers3Icon,
    },

    {
        title:
            "Polish Strong Concepts",

        description:
            "Use Premium Enhance to refine an existing thumbnail, improve visual balance, strengthen details, and preserve the successful core idea.",

        icon:
            SparklesIcon,
    },

    {
        title:
            "Keep Your Channel Consistent",

        description:
            "Choose styles, color schemes, aspect ratios, and visual instructions that help your thumbnails maintain a recognizable channel identity.",

        icon:
            PaletteIcon,
    },

    {
        title:
            "Save More Creative Time",

        description:
            "Reduce the time spent testing layouts and visual directions so you can focus more attention on videos, publishing, and audience growth.",

        icon:
            Clock3Icon,
    },
];

const platformFeatures = [
    "Generate thumbnails from titles and creative prompts",
    "Upload up to three visual reference images",
    "Create fresh regenerated versions",
    "Premium enhancement for stronger final results",
    "Compare first, regenerated, and enhanced versions",
    "Select the preferred version for each project",
    "Organize related versions within one project",
    "Download generated thumbnails for publishing",
    "Support for 16:9, 1:1, and 9:16 formats",
    "Multiple visual styles and color schemes",
];

const audiences = [
    {
        title:
            "Individual YouTubers",

        description:
            "Creators who publish regularly and need faster ways to explore thumbnail ideas for upcoming videos.",

        icon:
            UsersIcon,
    },

    {
        title:
            "New Content Creators",

        description:
            "Beginners who need guidance turning a title or topic into a structured and professional visual concept.",

        icon:
            WandSparklesIcon,
    },

    {
        title:
            "YouTube Teams",

        description:
            "Channels with editors, managers, or designers who need an easier workflow for reviewing and comparing thumbnail versions.",

        icon:
            WorkflowIcon,
    },

    {
        title:
            "Agencies and Freelancers",

        description:
            "Professionals managing multiple creators or clients who need reusable creative workflows and faster concept generation.",

        icon:
            MonitorSmartphoneIcon,
    },
];

const workflowSteps = [
    {
        number:
            "01",

        title:
            "Describe Your Video",

        description:
            "Enter your video title and add optional instructions about the subject, emotion, scene, layout, headline, or visual direction.",
    },

    {
        number:
            "02",

        title:
            "Add Visual References",

        description:
            "Upload up to three images when you want to include your own face, product, character, background, clothing, or supporting visual details.",
    },

    {
        number:
            "03",

        title:
            "Generate and Compare",

        description:
            "Create the first thumbnail, regenerate fresh alternatives, and compare every saved version within the same thumbnail project.",
    },

    {
        number:
            "04",

        title:
            "Enhance and Download",

        description:
            "Polish the strongest concept, select the version you prefer, and download the finished thumbnail for your content workflow.",
    },
];

const values = [
    {
        title:
            "Creator Control",

        description:
            "Thumblify provides creative options instead of forcing every creator into the same visual formula.",

        icon:
            TargetIcon,
    },

    {
        title:
            "Useful Simplicity",

        description:
            "The workflow is designed to remain understandable even for creators without professional graphic-design experience.",

        icon:
            CheckCircle2Icon,
    },

    {
        title:
            "Responsible Creativity",

        description:
            "We aim to help creators build clear, relevant, and engaging visuals without depending on misleading promises or unnecessary complexity.",

        icon:
            ShieldCheckIcon,
    },

    {
        title:
            "Continuous Improvement",

        description:
            "Thumblify is built as an evolving creator tool, with workflows and features improving as real creator needs become clearer.",

        icon:
            RefreshCwIcon,
    },
];

export default function AboutPage() {
    const aboutPageSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "AboutPage",

        name:
            "About Thumblify",

        description:
            "Learn how Thumblify helps YouTubers, content creators, teams, and agencies create and manage professional thumbnail concepts.",

        url:
            `${siteUrl}/about`,

        mainEntity: {
            "@type":
                "Organization",

            name:
                "Thumblify",

            url:
                siteUrl,

            description:
                "Thumblify is a thumbnail creation platform designed to help YouTubers turn video ideas and reference images into professional visual concepts.",

            knowsAbout: [
                "YouTube thumbnail generation",
                "AI-assisted visual creation",
                "Thumbnail version comparison",
                "Reference-guided image generation",
                "Creator visual workflows",
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
                            aboutPageSchema
                        ),
                }}
            />

            <main className="relative z-10 min-h-screen overflow-hidden px-4 pt-32 pb-24 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-6xl">
                    {/* Hero */}
                    <section
                        aria-labelledby="about-page-heading"
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <SparklesIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            About Thumblify
                        </div>

                        <h1
                            id="about-page-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-6xl"
                        >
                            Helping YouTubers Turn
                            Great Video Ideas Into{" "}
                            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Stronger First
                                Impressions
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                            Thumblify is a thumbnail
                            creation platform built
                            to help YouTubers,
                            creators, teams, and
                            agencies explore
                            professional visual
                            concepts without starting
                            every design from
                            scratch.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/generate"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:from-pink-600 hover:to-pink-700 sm:w-auto"
                            >
                                Create a Thumbnail

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-pink-500/30 hover:bg-white/10 hover:text-white sm:w-auto"
                            >
                                Talk to Our Team
                            </Link>
                        </div>
                    </section>

                    {/* Our story */}
                    <section
                        aria-labelledby="our-story-heading"
                        className="mt-20 grid items-center gap-8 lg:grid-cols-2"
                    >
                        <div className="rounded-3xl border border-white/10 bg-white/6 p-7 shadow-2xl sm:p-9">
                            <div className="flex size-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
                                <LightbulbIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2
                                id="our-story-heading"
                                className="mt-6 text-2xl font-bold text-zinc-100 sm:text-3xl"
                            >
                                Why We Built
                                Thumblify
                            </h2>

                            <div className="mt-5 space-y-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                <p>
                                    A strong video can
                                    still struggle to
                                    attract attention
                                    when its thumbnail
                                    does not communicate
                                    the idea clearly.
                                    Yet creating multiple
                                    professional thumbnail
                                    concepts can require
                                    significant time,
                                    design experience, and
                                    repeated revisions.
                                </p>

                                <p>
                                    Thumblify was created
                                    to make that creative
                                    process easier. Instead
                                    of facing a blank
                                    canvas, creators can
                                    start with a title,
                                    prompt, style, color
                                    direction, and their
                                    own reference images.
                                </p>

                                <p>
                                    The goal is not to
                                    remove the creator from
                                    the process. The goal is
                                    to give creators more
                                    concepts, more control,
                                    and a faster way to
                                    reach a thumbnail they
                                    are confident using.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-5 sm:grid-cols-2">
                            <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
                                <TargetIcon
                                    aria-hidden="true"
                                    className="size-7 text-pink-400"
                                />

                                <h3 className="mt-5 text-lg font-semibold text-zinc-100">
                                    Our Mission
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-zinc-400">
                                    Make professional
                                    thumbnail concept
                                    creation more
                                    accessible, flexible,
                                    and efficient for
                                    creators at every
                                    stage.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-white/10 bg-black/20 p-6">
                                <MonitorSmartphoneIcon
                                    aria-hidden="true"
                                    className="size-7 text-purple-400"
                                />

                                <h3 className="mt-5 text-lg font-semibold text-zinc-100">
                                    Our Vision
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-zinc-400">
                                    Build a practical
                                    creative workspace
                                    where creators can
                                    generate, compare,
                                    improve, and manage
                                    thumbnail ideas in one
                                    place.
                                </p>
                            </article>

                            <article className="rounded-2xl border border-white/10 bg-black/20 p-6 sm:col-span-2">
                                <UsersIcon
                                    aria-hidden="true"
                                    className="size-7 text-emerald-400"
                                />

                                <h3 className="mt-5 text-lg font-semibold text-zinc-100">
                                    Built Around Real
                                    Creator Workflows
                                </h3>

                                <p className="mt-3 text-sm leading-7 text-zinc-400">
                                    Thumblify is designed
                                    around the way
                                    creators actually
                                    work: testing ideas,
                                    using their own photos,
                                    requesting revisions,
                                    comparing alternatives,
                                    and selecting a final
                                    version.
                                </p>
                            </article>
                        </div>
                    </section>

                    {/* How it helps */}
                    <section
                        aria-labelledby="creator-benefits-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
                                Built for creators
                            </p>

                            <h2
                                id="creator-benefits-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                How Thumblify Helps
                                YouTubers
                            </h2>

                            <p className="mt-4 text-base leading-7 text-zinc-400">
                                From the first video
                                idea to the final
                                downloadable result,
                                Thumblify supports the
                                most important parts of
                                the thumbnail creation
                                process.
                            </p>
                        </div>

                        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {creatorBenefits.map(
                                ({
                                    title,
                                    description,
                                    icon: Icon,
                                }) => (
                                    <article
                                        key={title}
                                        className="group rounded-2xl border border-white/10 bg-white/6 p-6 shadow-xl transition hover:-translate-y-1 hover:border-pink-500/30 hover:bg-white/8"
                                    >
                                        <div className="flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-400 transition group-hover:scale-105">
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

                    {/* Features */}
                    <section
                        aria-labelledby="platform-features-heading"
                        className="mt-24 grid gap-8 rounded-3xl border border-white/10 bg-linear-to-br from-pink-500/10 via-white/5 to-purple-500/10 p-7 shadow-2xl sm:p-10 lg:grid-cols-[0.8fr_1.2fr]"
                    >
                        <div>
                            <div className="flex size-12 items-center justify-center rounded-xl border border-pink-500/20 bg-pink-500/10 text-pink-300">
                                <WandSparklesIcon
                                    aria-hidden="true"
                                    className="size-6"
                                />
                            </div>

                            <h2
                                id="platform-features-heading"
                                className="mt-6 text-3xl font-bold leading-tight text-zinc-100"
                            >
                                More Than a
                                One-Click Image
                                Generator
                            </h2>

                            <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                                Thumblify is being
                                developed as a complete
                                thumbnail workflow. Each
                                project can contain
                                multiple versions so you
                                can experiment without
                                losing previous results.
                            </p>
                        </div>

                        <ul className="grid gap-4 sm:grid-cols-2">
                            {platformFeatures.map(
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

                    {/* Audience */}
                    <section
                        aria-labelledby="audience-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                                Who it is for
                            </p>

                            <h2
                                id="audience-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                Designed for Every
                                Stage of the Creator
                                Journey
                            </h2>
                        </div>

                        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {audiences.map(
                                ({
                                    title,
                                    description,
                                    icon: Icon,
                                }) => (
                                    <article
                                        key={title}
                                        className="rounded-2xl border border-white/10 bg-white/6 p-6 text-center shadow-xl"
                                    >
                                        <div className="mx-auto flex size-12 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-400/10 text-purple-300">
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

                    {/* Workflow */}
                    <section
                        aria-labelledby="workflow-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-pink-400">
                                Simple workflow
                            </p>

                            <h2
                                id="workflow-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                From Video Idea to
                                Final Thumbnail
                            </h2>
                        </div>

                        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
                            {workflowSteps.map(
                                ({
                                    number,
                                    title,
                                    description,
                                }) => (
                                    <article
                                        key={number}
                                        className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6"
                                    >
                                        <span className="absolute top-3 right-4 text-5xl font-black text-white/5">
                                            {number}
                                        </span>

                                        <div className="flex size-10 items-center justify-center rounded-full border border-pink-500/30 bg-pink-500/10 text-sm font-bold text-pink-300">
                                            {number}
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

                    {/* Values */}
                    <section
                        aria-labelledby="values-heading"
                        className="mt-24"
                    >
                        <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">
                            <div>
                                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                                    What guides us
                                </p>

                                <h2
                                    id="values-heading"
                                    className="mt-4 text-3xl font-bold leading-tight text-zinc-100 sm:text-4xl"
                                >
                                    Principles Behind
                                    Thumblify
                                </h2>

                                <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
                                    Every feature should
                                    make the creative
                                    process more useful,
                                    understandable, and
                                    controllable for the
                                    person creating the
                                    content.
                                </p>
                            </div>

                            <div className="grid gap-5 sm:grid-cols-2">
                                {values.map(
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
                                                className="size-6 text-emerald-400"
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

                    {/* Final CTA */}
                    <section className="mt-24 overflow-hidden rounded-3xl border border-pink-500/20 bg-linear-to-br from-pink-500/15 via-purple-500/10 to-black/20 p-8 text-center shadow-2xl sm:p-12">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-pink-400/25 bg-pink-400/10 text-pink-300">
                            <SparklesIcon
                                aria-hidden="true"
                                className="size-7"
                            />
                        </div>

                        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold text-zinc-100 sm:text-4xl">
                            Your Next Thumbnail Idea
                            Does Not Have to Start
                            From a Blank Canvas
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                            Add your title, describe
                            your vision, upload your
                            visual references, and
                            start exploring thumbnail
                            concepts for your next
                            video.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/generate"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:from-pink-600 hover:to-pink-700 sm:w-auto"
                            >
                                Start Creating

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white sm:w-auto"
                            >
                                Contact Thumblify
                            </Link>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}