import type {
    Metadata,
} from "next";

import Link from "next/link";

import {
    ArrowRightIcon,
    BotIcon,
    Building2Icon,
    CheckCircle2Icon,
    CircleHelpIcon,
    CoinsIcon,
    CreditCardIcon,
    FileImageIcon,
    FolderClockIcon,
    HeadphonesIcon,
    ImageDownIcon,
    KeyRoundIcon,
    Layers3Icon,
    LockKeyholeIcon,
    MailIcon,
    RefreshCwIcon,
    ShieldCheckIcon,
    SparklesIcon,
    UserRoundIcon,
    WandSparklesIcon,
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

const supportEmail =
    process.env
        .NEXT_PUBLIC_SUPPORT_EMAIL
        ?.trim() ||
    "hello@thumblify.com";

export const metadata: Metadata = {
    title:
        "Frequently Asked Questions | Thumblify",

    description:
        "Find answers about Thumblify accounts, free thumbnail generations, credits, reference images, Premium Enhance, pricing, subscriptions, downloads, privacy, and Business plans.",

    keywords: [
        "Thumblify FAQ",
        "YouTube thumbnail generator questions",
        "AI thumbnail generator help",
        "free thumbnail generator FAQ",
        "thumbnail generation credits",
        "Thumblify pricing FAQ",
        "YouTube thumbnail support",
    ],

    alternates: {
        canonical:
            `${siteUrl}/faqs`,
    },

    openGraph: {
        title:
            "Frequently Asked Questions | Thumblify",

        description:
            "Answers to common questions about creating, regenerating, enhancing, saving, and downloading YouTube thumbnails with Thumblify.",

        url:
            `${siteUrl}/faqs`,

        siteName:
            "Thumblify",

        type:
            "website",
    },

    twitter: {
        card:
            "summary_large_image",

        title:
            "Frequently Asked Questions | Thumblify",

        description:
            "Learn how Thumblify accounts, thumbnail credits, generation tools, pricing plans, downloads, and support work.",
    },

    robots: {
        index: true,
        follow: true,
    },
};

interface FaqItem {
    question: string;
    answer: string;
}

interface FaqCategory {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    accent:
    | "pink"
    | "purple"
    | "emerald"
    | "amber";
    questions: FaqItem[];
}

const faqCategories: FaqCategory[] = [
    {
        id:
            "getting-started",

        title:
            "Getting Started",

        description:
            "Basic information about Thumblify, accounts, and who the platform is designed for.",

        icon:
            UserRoundIcon,

        accent:
            "pink",

        questions: [
            {
                question:
                    "What is Thumblify?",

                answer:
                    "Thumblify is a thumbnail creation platform for YouTubers, content creators, teams, freelancers, and agencies. It helps users turn video titles, prompts, styles, and reference images into professional thumbnail concepts.",
            },

            {
                question:
                    "Who can use Thumblify?",

                answer:
                    "Thumblify is designed for individual YouTubers, new creators, regular content publishers, thumbnail designers, video teams, freelancers, marketing agencies, and businesses managing multiple channels or clients.",
            },

            {
                question:
                    "Do I need graphic-design experience?",

                answer:
                    "No. You can begin with a video title, creative prompt, preferred style, color scheme, aspect ratio, and optional reference images. Thumblify handles the initial visual-generation process.",
            },

            {
                question:
                    "Do I need to create an account?",

                answer:
                    "Yes. An account is required to generate thumbnails, use free credits, save projects, compare versions, select preferred results, and access your previous generations.",
            },

            {
                question:
                    "Can I use Thumblify without adding a credit card?",

                answer:
                    "Yes. You can create an account and use the Free plan without adding a credit or debit card.",
            },

            {
                question:
                    "Does the Free plan automatically become a paid subscription?",

                answer:
                    "No. The Free plan does not automatically convert into a paid plan. You must actively select and purchase a paid subscription before any payment is charged.",
            },
        ],
    },

    {
        id:
            "thumbnail-generation",

        title:
            "Thumbnail Generation",

        description:
            "How titles, prompts, styles, reference images, and generated results work.",

        icon:
            WandSparklesIcon,

        accent:
            "purple",

        questions: [
            {
                question:
                    "How do I generate a thumbnail?",

                answer:
                    "Open the Generate page, enter your video title, choose your preferred settings, add optional creative instructions, upload reference images when needed, and submit the generation request.",
            },

            {
                question:
                    "What information should I include in my prompt?",

                answer:
                    "You can describe the main subject, facial expression, background, text placement, lighting, emotion, color direction, camera angle, composition, and the overall feeling you want the thumbnail to communicate.",
            },

            {
                question:
                    "Can I generate a thumbnail using only a video title?",

                answer:
                    "Yes. A video title can be enough to begin. Adding more specific creative instructions and visual references usually gives the system clearer direction.",
            },

            {
                question:
                    "Can I upload my own photos?",

                answer:
                    "Yes. You can upload reference images such as your portrait, product image, character, logo, clothing reference, background idea, or another visual element you have permission to use.",
            },

            {
                question:
                    "How many reference images can I upload?",

                answer:
                    "You can currently upload up to three reference images for a supported generation or enhancement request.",
            },

            {
                question:
                    "Which thumbnail formats are supported?",

                answer:
                    "Thumblify supports available aspect-ratio options such as 16:9 for standard YouTube thumbnails, 1:1 for square content, and 9:16 for vertical content where those options are shown in the generator.",
            },

            {
                question:
                    "Can I select a thumbnail style and color scheme?",

                answer:
                    "Yes. Available generation controls may include visual style, color direction, aspect ratio, and additional creative instructions.",
            },

            {
                question:
                    "Does Thumblify guarantee that every result will be perfect?",

                answer:
                    "No. Automated image generation may occasionally produce unexpected details, spelling problems, inaccurate objects, or a result that does not fully match your idea. You should review every thumbnail before publishing it.",
            },
        ],
    },

    {
        id:
            "versions-enhancement",

        title:
            "Versions and Premium Enhance",

        description:
            "Information about regenerated versions, project history, and advanced enhancement.",

        icon:
            Layers3Icon,

        accent:
            "pink",

        questions: [
            {
                question:
                    "What is Regenerate?",

                answer:
                    "Regenerate creates a fresh thumbnail version while keeping the previous result saved inside the same thumbnail project.",
            },

            {
                question:
                    "Will regenerating delete my previous thumbnail?",

                answer:
                    "No. Previous versions remain attached to the project so you can compare them and choose the result you prefer.",
            },

            {
                question:
                    "What is Premium Enhance?",

                answer:
                    "Premium Enhance is an advanced workflow designed to refine an existing thumbnail concept, improve visual quality, strengthen details, and use optional reference images where supported.",
            },

            {
                question:
                    "Can I enhance an already generated thumbnail?",

                answer:
                    "Yes. When Premium Enhance is available on your plan, you can use an existing thumbnail version as the base for an enhanced result.",
            },

            {
                question:
                    "Can I compare generated versions?",

                answer:
                    "Yes. Saved versions can be viewed and compared within the relevant thumbnail project.",
            },

            {
                question:
                    "Can I select an older version as my preferred thumbnail?",

                answer:
                    "Yes. Selecting an older saved version does not require creating a new image and does not consume a generation credit.",
            },

            {
                question:
                    "Does viewing or comparing versions use credits?",

                answer:
                    "No. Viewing, comparing, selecting, and downloading an existing saved version do not use generation credits.",
            },
        ],
    },

    {
        id:
            "free-plan-credits",

        title:
            "Free Plan and Credits",

        description:
            "How the three free thumbnails and generation-credit system work.",

        icon:
            CoinsIcon,

        accent:
            "emerald",

        questions: [
            {
                question:
                    "How many thumbnails can I create for free?",

                answer:
                    "Each eligible registered account currently receives three lifetime standard generation credits.",
            },

            {
                question:
                    "Are the three free credits renewed every month?",

                answer:
                    "No. The Free plan includes three lifetime credits. They do not automatically reset or renew each month.",
            },

            {
                question:
                    "Do free thumbnails contain a watermark?",

                answer:
                    "No. Thumbnails downloaded from the Free plan do not contain a Thumblify watermark.",
            },

            {
                question:
                    "How much does a standard generation cost?",

                answer:
                    "A standard Generate request currently uses one generation credit.",
            },

            {
                question:
                    "How much does Regenerate cost?",

                answer:
                    "A Regenerate request currently uses one generation credit because it creates a new image version.",
            },

            {
                question:
                    "How much does Premium Enhance cost?",

                answer:
                    "Premium Enhance currently uses three credits because it performs a more advanced image-processing operation.",
            },

            {
                question:
                    "What happens after I use my free credits?",

                answer:
                    "Your account and previous projects can remain available, but you will need to upgrade or purchase an available paid option before creating more thumbnails.",
            },

            {
                question:
                    "Can I create multiple accounts to receive more free credits?",

                answer:
                    "No. Creating multiple accounts, using disposable identities, or bypassing account limits to obtain additional free credits is prohibited.",
            },

            {
                question:
                    "Do unused paid credits roll over?",

                answer:
                    "Included monthly subscription credits do not currently roll over to the next month unless a particular plan or written Business agreement states otherwise.",
            },
        ],
    },

    {
        id:
            "pricing-subscriptions",

        title:
            "Pricing and Subscriptions",

        description:
            "Information about Free, Creator Pro, Business, monthly billing, and yearly billing.",

        icon:
            CreditCardIcon,

        accent:
            "purple",

        questions: [
            {
                question:
                    "Which pricing plans are available?",

                answer:
                    "Thumblify currently presents Free, Creator Pro, and Business options. The Free plan is for testing the service, Creator Pro is for regular creators, and Business is designed for higher-volume or bulk usage.",
            },

            {
                question:
                    "What is included in Creator Pro?",

                answer:
                    "Creator Pro includes a larger monthly credit allowance, Generate and Regenerate access, Premium Enhance, full version history, watermark-free downloads, reference-image support, and additional creator-focused features shown on the Pricing page.",
            },

            {
                question:
                    "Who should choose the Business plan?",

                answer:
                    "The Business plan is designed for agencies, teams, freelancers managing multiple clients, larger channels, and users who need higher-volume or bulk thumbnail generation.",
            },

            {
                question:
                    "What is the difference between monthly and yearly billing?",

                answer:
                    "Monthly subscriptions are charged once per month. Yearly subscriptions are charged as one annual payment and normally provide a lower effective monthly price.",
            },

            {
                question:
                    "Why is the yearly plan shown as a monthly price?",

                answer:
                    "The lower figure represents the monthly equivalent of the annual price. The full yearly amount is charged once at the beginning of the annual billing period.",
            },

            {
                question:
                    "Can I change my subscription plan?",

                answer:
                    "Plan changes may be available depending on the subscription and payment system. Contact support when an account control for the requested change is not available.",
            },

            {
                question:
                    "Can I cancel my subscription?",

                answer:
                    "Yes. Cancelling prevents future renewals. Paid access will normally remain available until the end of the billing period already paid for.",
            },

            {
                question:
                    "Does cancellation immediately delete my account?",

                answer:
                    "No. Cancelling a paid subscription normally stops future renewal charges but does not automatically delete your account.",
            },
        ],
    },

    {
        id:
            "payments-refunds",

        title:
            "Payments and Refunds",

        description:
            "Important billing, cancellation, duplicate-payment, and no-refund information.",

        icon:
            ShieldCheckIcon,

        accent:
            "amber",

        questions: [
            {
                question:
                    "Can I receive a refund after purchasing a paid plan?",

                answer:
                    "Payments are generally final and non-refundable once a purchase is completed and the subscription, credits, or digital service becomes available, except where applicable law or the payment provider requires otherwise.",
            },

            {
                question:
                    "Why are payments non-refundable?",

                answer:
                    "Paid access, digital-service capacity, processing resources, account features, and generation credits become available after purchase. When a problem occurs, Thumblify focuses on correcting access, restoring eligible credits, or resolving the technical issue.",
            },

            {
                question:
                    "Can I receive a partial refund after cancelling?",

                answer:
                    "No. Cancellation stops future renewals but does not create a partial or prorated refund for the current billing period.",
            },

            {
                question:
                    "Can I receive a refund because I did not use the plan?",

                answer:
                    "No. Failing to use the subscription, credits, or features does not normally qualify a payment for a refund.",
            },

            {
                question:
                    "Can I receive a refund because I forgot to cancel?",

                answer:
                    "No. You are responsible for cancelling before the renewal date. Forgetting to cancel does not normally qualify a renewal payment for a refund.",
            },

            {
                question:
                    "What happens if I am charged twice?",

                answer:
                    "Contact billing support with your account email, transaction information, and payment receipt. A verified duplicate charge may be corrected or reversed.",
            },

            {
                question:
                    "What should I do if I do not recognize a charge?",

                answer:
                    "Contact Thumblify and the relevant payment provider promptly. Verification may be required before the transaction can be investigated.",
            },

            {
                question:
                    "Where can I read the complete payment rules?",

                answer:
                    "Review the Pricing, Terms and Conditions, and Refund Policy pages before purchasing a paid subscription or bulk package.",
            },
        ],
    },

    {
        id:
            "downloads-projects",

        title:
            "Downloads and Project History",

        description:
            "Information about saved projects, downloads, selected versions, and file availability.",

        icon:
            ImageDownIcon,

        accent:
            "pink",

        questions: [
            {
                question:
                    "Can I download my generated thumbnails?",

                answer:
                    "Yes. Available saved thumbnail versions can be downloaded from the relevant generation or project interface.",
            },

            {
                question:
                    "Does downloading an image use a credit?",

                answer:
                    "No. Downloading an existing generated image does not create a new image and therefore does not use a generation credit.",
            },

            {
                question:
                    "Where are my previous thumbnails stored?",

                answer:
                    "Your generated thumbnails and related versions are organized within your account and My Generation area, subject to available storage and retention rules.",
            },

            {
                question:
                    "Are regenerated versions stored separately?",

                answer:
                    "Regenerated and enhanced versions can remain grouped under the same parent thumbnail project so you can review the full creative history.",
            },

            {
                question:
                    "Can I delete a thumbnail project?",

                answer:
                    "Where a delete option is available, you can remove the relevant project or version. Deleted content may no longer be recoverable.",
            },

            {
                question:
                    "Should I keep my own backup?",

                answer:
                    "Yes. Download and safely store important final thumbnails. Thumblify should not be treated as the only permanent backup location for your files.",
            },
        ],
    },

    {
        id:
            "content-rights",

        title:
            "Content Rights and Acceptable Use",

        description:
            "Ownership, uploaded images, generated outputs, permissions, and publishing responsibilities.",

        icon:
            FileImageIcon,

        accent:
            "amber",

        questions: [
            {
                question:
                    "Do I keep ownership of the images I upload?",

                answer:
                    "You retain the rights you already hold in your uploaded content. You must own the content or have the necessary permission to upload and process it.",
            },

            {
                question:
                    "Can I upload another person's photograph?",

                answer:
                    "Only when you have the legal right and appropriate permission to upload, process, and use the photograph.",
            },

            {
                question:
                    "Can I use generated thumbnails commercially?",

                answer:
                    "Subject to the Terms, your plan, applicable law, and third-party rights, you may use generated outputs for your channel, clients, campaigns, and other permitted purposes.",
            },

            {
                question:
                    "Are generated thumbnails guaranteed to be unique?",

                answer:
                    "No. Automated systems may produce similar concepts for different users. Thumblify does not guarantee that every generated output is completely unique or exclusive.",
            },

            {
                question:
                    "Does Thumblify guarantee that generated content is copyright-safe?",

                answer:
                    "No. You are responsible for reviewing outputs for possible copyright, trademark, privacy, publicity, brand, or other legal concerns before publishing them.",
            },

            {
                question:
                    "Can I use celebrity, brand, or character images?",

                answer:
                    "You must ensure that your use complies with applicable copyright, trademark, publicity, privacy, platform, and advertising rules. Uploading or generating content does not automatically give you permission to use protected material.",
            },

            {
                question:
                    "Can I use Thumblify for misleading impersonation?",

                answer:
                    "No. You may not use the platform for unlawful impersonation, fraud, deceptive manipulation, harassment, or content designed to mislead viewers about a real person, brand, product, or event.",
            },
        ],
    },

    {
        id:
            "privacy-security",

        title:
            "Privacy and Account Security",

        description:
            "How uploaded content, account information, and security responsibilities are handled.",

        icon:
            LockKeyholeIcon,

        accent:
            "emerald",

        questions: [
            {
                question:
                    "What information does Thumblify collect?",

                answer:
                    "Depending on how you use the service, information may include account details, prompts, titles, uploaded reference images, generated thumbnails, project history, messages, subscription details, and limited technical information.",
            },

            {
                question:
                    "Why are uploaded images processed by service providers?",

                answer:
                    "Reference images, prompts, settings, and existing versions may need to be transmitted to infrastructure providers that perform image processing, storage, hosting, security, or related operations.",
            },

            {
                question:
                    "Does Thumblify sell my personal information?",

                answer:
                    "Thumblify does not intend to sell personal information for monetary consideration. Review the Privacy Policy for the complete data-sharing explanation.",
            },

            {
                question:
                    "How can I request account-data deletion?",

                answer:
                    "Contact the privacy or support email associated with Thumblify. Identity verification may be required before account or personal-data requests are completed.",
            },

            {
                question:
                    "How should I protect my account?",

                answer:
                    "Use a secure password, protect your devices, avoid sharing account access, and contact support immediately when you suspect unauthorized access.",
            },

            {
                question:
                    "Where can I read the full privacy information?",

                answer:
                    "The complete explanation is available on the Thumblify Privacy Policy page.",
            },
        ],
    },

    {
        id:
            "technical-support",

        title:
            "Technical Problems and Support",

        description:
            "What to do when generation, login, download, credit, or account problems occur.",

        icon:
            HeadphonesIcon,

        accent:
            "purple",

        questions: [
            {
                question:
                    "What should I do if a generation fails?",

                answer:
                    "Wait briefly, confirm your internet connection, review the uploaded files and prompt, and retry when appropriate. Contact support with the project details when the problem continues.",
            },

            {
                question:
                    "What happens if a failed request consumes a credit?",

                answer:
                    "When system records confirm that a technical failure consumed a credit without delivering the expected service, an eligible credit may be restored instead of issuing a cash refund.",
            },

            {
                question:
                    "What information should I send to support?",

                answer:
                    "Send your account email, project identifier, approximate time of the issue, browser information, screenshots, error message, and a clear explanation of what happened.",
            },

            {
                question:
                    "Why does my generated text contain spelling errors?",

                answer:
                    "Automated image generation can sometimes produce inaccurate text. Try shorter wording, clearer instructions, regeneration, or editing the final output before publishing.",
            },

            {
                question:
                    "Why does the result not exactly match my prompt?",

                answer:
                    "Automated generation interprets creative instructions rather than reproducing them with guaranteed precision. More specific prompts, better references, regeneration, and enhancement may improve the result.",
            },

            {
                question:
                    "What should I do if a download does not start?",

                answer:
                    "Check your browser's download permissions, internet connection, popup restrictions, and whether the selected image is still available. Contact support if the issue continues.",
            },

            {
                question:
                    "How quickly does support respond?",

                answer:
                    "Response time depends on request volume, plan, and issue type. Business and priority-support inquiries may receive faster handling than standard requests.",
            },
        ],
    },

    {
        id:
            "business",

        title:
            "Business and Bulk Usage",

        description:
            "Questions for agencies, creator teams, freelancers, and high-volume users.",

        icon:
            Building2Icon,

        accent:
            "pink",

        questions: [
            {
                question:
                    "What is the Business plan?",

                answer:
                    "The Business plan is a higher-volume option for agencies, teams, freelancers, brands, and creators who need more thumbnail generations or bulk workflows.",
            },

            {
                question:
                    "Can agencies use Thumblify for client work?",

                answer:
                    "Yes, provided the agency has permission to use all client photographs, logos, products, characters, and other uploaded materials.",
            },

            {
                question:
                    "Can the Business plan be used for multiple channels?",

                answer:
                    "The Business plan is intended for multi-channel and client workflows, subject to the features and limits displayed for the plan or agreed in writing.",
            },

            {
                question:
                    "Can Business users buy additional credits?",

                answer:
                    "Additional credit packages or custom usage arrangements may be available depending on your required volume.",
            },

            {
                question:
                    "Are Business and bulk payments refundable?",

                answer:
                    "Business, agency, bulk, and custom credit-package payments are generally final and non-refundable once the service or credits become available, except where mandatory law or the payment provider requires otherwise.",
            },

            {
                question:
                    "How do I discuss a custom requirement?",

                answer:
                    "Use the Contact page and select the relevant Business, agency, bulk-generation, or partnership inquiry option.",
            },
        ],
    },
];

const categoryAccentStyles = {
    pink: {
        border:
            "border-pink-500/20",

        background:
            "bg-pink-500/10",

        text:
            "text-pink-300",
    },

    purple: {
        border:
            "border-purple-400/20",

        background:
            "bg-purple-400/10",

        text:
            "text-purple-300",
    },

    emerald: {
        border:
            "border-emerald-400/20",

        background:
            "bg-emerald-400/10",

        text:
            "text-emerald-300",
    },

    amber: {
        border:
            "border-amber-400/20",

        background:
            "bg-amber-400/10",

        text:
            "text-amber-300",
    },
};

const allFaqItems =
    faqCategories.flatMap(
        (category) =>
            category.questions
    );

export default function FaqPage() {
    const faqSchema = {
        "@context":
            "https://schema.org",

        "@type":
            "FAQPage",

        mainEntity:
            allFaqItems.map(
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
                    "Frequently Asked Questions",

                item:
                    `${siteUrl}/faqs`,
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
                        aria-labelledby="faq-page-heading"
                        className="mx-auto max-w-4xl text-center"
                    >
                        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 text-sm font-medium text-pink-300">
                            <CircleHelpIcon
                                aria-hidden="true"
                                className="size-4"
                            />

                            Thumblify Help Center
                        </div>

                        <h1
                            id="faq-page-heading"
                            className="mt-6 text-3xl font-bold tracking-tight text-zinc-100 sm:text-4xl lg:text-6xl"
                        >
                            Frequently Asked{" "}
                            <span className="bg-linear-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                                Questions
                            </span>
                        </h1>

                        <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-zinc-400 sm:text-lg">
                            Find clear answers about
                            accounts, free thumbnail
                            generations, credits,
                            reference images, saved
                            versions, pricing,
                            subscriptions, payments,
                            privacy, and support.
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
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-pink-500/30 hover:bg-white/10 hover:text-white sm:w-auto"
                            >
                                Contact Thumblify

                                <MailIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>
                        </div>
                    </section>

                    {/* Quick facts */}
                    <section
                        aria-label="Important Thumblify information"
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
                                Create an account and
                                start with the Free plan
                                without adding a card.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-pink-500/15 bg-pink-500/5 p-5">
                            <SparklesIcon
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
                            <FileImageIcon
                                aria-hidden="true"
                                className="size-6 text-purple-400"
                            />

                            <h2 className="mt-4 font-semibold text-zinc-100">
                                No Watermark
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                Downloads from currently
                                advertised plans do not
                                contain a Thumblify
                                watermark.
                            </p>
                        </article>

                        <article className="rounded-2xl border border-amber-400/15 bg-amber-400/5 p-5">
                            <HeadphonesIcon
                                aria-hidden="true"
                                className="size-6 text-amber-400"
                            />

                            <h2 className="mt-4 font-semibold text-zinc-100">
                                Technical Support
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                Contact support when
                                generation, account,
                                billing, or download
                                problems occur.
                            </p>
                        </article>
                    </section>

                    {/* Category navigation */}
                    <section
                        aria-labelledby="faq-categories-heading"
                        className="mt-20"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-400">
                                Browse by topic
                            </p>

                            <h2
                                id="faq-categories-heading"
                                className="mt-4 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                Find the Right Answer
                                Faster
                            </h2>
                        </div>

                        <nav
                            aria-label="FAQ categories"
                            className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            {faqCategories.map(
                                (category) => {
                                    const Icon =
                                        category.icon;

                                    const styles =
                                        categoryAccentStyles[
                                        category.accent
                                        ];

                                    return (
                                        <a
                                            key={
                                                category.id
                                            }
                                            href={`#${category.id}`}
                                            className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:-translate-y-1 hover:border-pink-500/25 hover:bg-white/8"
                                        >
                                            <div
                                                className={`flex size-11 items-center justify-center rounded-xl border ${styles.border} ${styles.background} ${styles.text}`}
                                            >
                                                <Icon
                                                    aria-hidden="true"
                                                    className="size-5"
                                                />
                                            </div>

                                            <h3 className="mt-4 font-semibold text-zinc-100 transition group-hover:text-pink-300">
                                                {
                                                    category.title
                                                }
                                            </h3>

                                            <p className="mt-2 text-sm leading-6 text-zinc-500">
                                                {
                                                    category.questions
                                                        .length
                                                }{" "}
                                                questions
                                            </p>
                                        </a>
                                    );
                                }
                            )}
                        </nav>
                    </section>

                    {/* FAQ sections */}
                    <div className="mt-24 space-y-20">
                        {faqCategories.map(
                            (category) => {
                                const Icon =
                                    category.icon;

                                const styles =
                                    categoryAccentStyles[
                                    category.accent
                                    ];

                                return (
                                    <section
                                        key={
                                            category.id
                                        }
                                        id={
                                            category.id
                                        }
                                        aria-labelledby={`${category.id}-heading`}
                                        className="scroll-mt-28"
                                    >
                                        <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
                                            <div>
                                                <div
                                                    className={`flex size-12 items-center justify-center rounded-xl border ${styles.border} ${styles.background} ${styles.text}`}
                                                >
                                                    <Icon
                                                        aria-hidden="true"
                                                        className="size-6"
                                                    />
                                                </div>

                                                <h2
                                                    id={`${category.id}-heading`}
                                                    className="mt-5 text-2xl font-bold text-zinc-100 sm:text-3xl"
                                                >
                                                    {
                                                        category.title
                                                    }
                                                </h2>

                                                <p className="mt-3 max-w-sm text-sm leading-7 text-zinc-400">
                                                    {
                                                        category.description
                                                    }
                                                </p>
                                            </div>

                                            <div className="space-y-4">
                                                {category.questions.map(
                                                    (
                                                        faq
                                                    ) => (
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
                                        </div>
                                    </section>
                                );
                            }
                        )}
                    </div>

                    {/* Helpful links */}
                    <section
                        aria-labelledby="helpful-pages-heading"
                        className="mt-24"
                    >
                        <div className="mx-auto max-w-3xl text-center">
                            <FolderClockIcon
                                aria-hidden="true"
                                className="mx-auto size-8 text-purple-400"
                            />

                            <h2
                                id="helpful-pages-heading"
                                className="mt-5 text-3xl font-bold text-zinc-100 sm:text-4xl"
                            >
                                Helpful Thumblify Pages
                            </h2>
                        </div>

                        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {[
                                {
                                    title:
                                        "Pricing",

                                    description:
                                        "Compare Free, Creator Pro, and Business plans.",

                                    href:
                                        "/pricing",

                                    icon:
                                        CoinsIcon,
                                },

                                {
                                    title:
                                        "Privacy Policy",

                                    description:
                                        "Learn how account and creative information is handled.",

                                    href:
                                        "/privacy-policy",

                                    icon:
                                        LockKeyholeIcon,
                                },

                                {
                                    title:
                                        "Terms and Conditions",

                                    description:
                                        "Review account, content, billing, and usage rules.",

                                    href:
                                        "/terms-and-conditions",

                                    icon:
                                        KeyRoundIcon,
                                },

                                {
                                    title:
                                        "Refund Policy",

                                    description:
                                        "Review payment, cancellation, and no-refund terms.",

                                    href:
                                        "/refund-policy",

                                    icon:
                                        ShieldCheckIcon,
                                },
                            ].map(
                                ({
                                    title,
                                    description,
                                    href,
                                    icon: Icon,
                                }) => (
                                    <Link
                                        key={
                                            title
                                        }
                                        href={
                                            href
                                        }
                                        className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-pink-500/30 hover:bg-white/8"
                                    >
                                        <Icon
                                            aria-hidden="true"
                                            className="size-6 text-pink-400"
                                        />

                                        <h3 className="mt-5 text-lg font-semibold text-zinc-100 group-hover:text-pink-300">
                                            {
                                                title
                                            }
                                        </h3>

                                        <p className="mt-3 text-sm leading-7 text-zinc-400">
                                            {
                                                description
                                            }
                                        </p>

                                        <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-pink-300">
                                            Read More

                                            <ArrowRightIcon
                                                aria-hidden="true"
                                                className="size-4 transition group-hover:translate-x-1"
                                            />
                                        </span>
                                    </Link>
                                )
                            )}
                        </div>
                    </section>

                    {/* Final support CTA */}
                    <section className="mt-24 overflow-hidden rounded-3xl border border-pink-500/20 bg-linear-to-br from-pink-500/15 via-purple-500/10 to-black/20 p-8 text-center shadow-2xl sm:p-12">
                        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-pink-400/25 bg-pink-400/10 text-pink-300">
                            <HeadphonesIcon
                                aria-hidden="true"
                                className="size-7"
                            />
                        </div>

                        <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold text-zinc-100 sm:text-4xl">
                            Still Have a Question?
                        </h2>

                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-400">
                            Tell us what you are trying
                            to achieve or describe the
                            account, generation, pricing,
                            or Business question you
                            need help with.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                            <Link
                                href="/contact"
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 px-7 py-3.5 text-sm font-semibold text-white transition hover:from-pink-600 hover:to-pink-700 sm:w-auto"
                            >
                                Contact Thumblify

                                <ArrowRightIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </Link>

                            <a
                                href={`mailto:${supportEmail}?subject=Thumblify%20FAQ%20Question`}
                                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/5 px-7 py-3.5 text-sm font-semibold text-zinc-200 transition hover:bg-white/10 hover:text-white sm:w-auto"
                            >
                                Email Support

                                <MailIcon
                                    aria-hidden="true"
                                    className="size-4"
                                />
                            </a>
                        </div>
                    </section>
                </div>
            </main>
        </>
    );
}