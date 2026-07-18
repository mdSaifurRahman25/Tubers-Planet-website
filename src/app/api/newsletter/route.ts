import { randomUUID } from "crypto";

import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { z, ZodError } from "zod";

import connectDatabase from "@/lib/db/connect-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const NEWSLETTER_COLLECTION_NAME =
    "newsletter_subscribers";

const RATE_LIMIT_WINDOW_MS =
    10 * 60 * 1000;

const MAX_REQUESTS_PER_WINDOW = 5;

type NewsletterStatus =
    | "active"
    | "unsubscribed";

interface NewsletterSubscriber {
    email: string;
    status: NewsletterStatus;
    source: string;
    subscriptionId: string;
    createdAt: Date;
    updatedAt: Date;
    lastSubscribedAt: Date;
    userAgent: string;
}

interface RateLimitRecord {
    count: number;
    expiresAt: number;
}

interface NewsletterSuccessResponse {
    success: true;
    message: string;
    alreadySubscribed: boolean;
}

interface NewsletterErrorResponse {
    success: false;
    message: string;
    errors?: unknown;
}

class NewsletterRequestError extends Error {
    public readonly statusCode: number;

    constructor(
        message: string,
        statusCode = 400
    ) {
        super(message);

        this.name =
            "NewsletterRequestError";

        this.statusCode =
            statusCode;
    }
}

const newsletterSchema = z.object({
    email: z
        .string({
            error:
                "Email address is required",
        })
        .trim()
        .min(
            1,
            "Email address is required"
        )
        .max(
            160,
            "Email address cannot exceed 160 characters"
        )
        .email(
            "Please enter a valid email address"
        )
        .transform((value) =>
            value.toLowerCase()
        ),

    source: z
        .string()
        .trim()
        .min(1)
        .max(50)
        .optional()
        .default("footer"),

    /*
     * Spam honeypot field।
     *
     * Footer থেকে fieldটি পাঠানো না হলেও
     * default empty string ব্যবহার হবে।
     */
    company: z
        .string()
        .trim()
        .max(
            200,
            "Invalid newsletter submission"
        )
        .optional()
        .default(""),
});

type NewsletterInput =
    z.output<
        typeof newsletterSchema
    >;

const globalNewsletterStore =
    globalThis as typeof globalThis & {
        thumblifyNewsletterRateLimit?: Map<
            string,
            RateLimitRecord
        >;
    };

const newsletterRateLimitStore =
    globalNewsletterStore
        .thumblifyNewsletterRateLimit ??
    new Map<
        string,
        RateLimitRecord
    >();

globalNewsletterStore
    .thumblifyNewsletterRateLimit =
    newsletterRateLimitStore;

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to join the newsletter";
};

const getClientIp = (
    request: Request
): string => {
    const forwardedFor =
        request.headers.get(
            "x-forwarded-for"
        );

    if (forwardedFor) {
        const firstIp =
            forwardedFor
                .split(",")[0]
                ?.trim();

        if (firstIp) {
            return firstIp;
        }
    }

    return (
        request.headers
            .get("cf-connecting-ip")
            ?.trim() ||
        request.headers
            .get("x-real-ip")
            ?.trim() ||
        "unknown"
    );
};

const clearExpiredRateLimits = (
    currentTime: number
) => {
    for (
        const [
            key,
            record,
        ] of newsletterRateLimitStore
    ) {
        if (
            record.expiresAt <=
            currentTime
        ) {
            newsletterRateLimitStore.delete(
                key
            );
        }
    }
};

const enforceRateLimit = (
    clientIp: string
) => {
    const currentTime =
        Date.now();

    clearExpiredRateLimits(
        currentTime
    );

    const existingRecord =
        newsletterRateLimitStore.get(
            clientIp
        );

    if (
        !existingRecord ||
        existingRecord.expiresAt <=
        currentTime
    ) {
        newsletterRateLimitStore.set(
            clientIp,
            {
                count: 1,

                expiresAt:
                    currentTime +
                    RATE_LIMIT_WINDOW_MS,
            }
        );

        return;
    }

    if (
        existingRecord.count >=
        MAX_REQUESTS_PER_WINDOW
    ) {
        throw new NewsletterRequestError(
            "Too many subscription attempts. Please wait a few minutes and try again.",
            429
        );
    }

    existingRecord.count += 1;

    newsletterRateLimitStore.set(
        clientIp,
        existingRecord
    );
};

const getFormStringValue = (
    formData: FormData,
    fieldName: string
): string => {
    const value =
        formData.get(fieldName);

    return typeof value ===
        "string"
        ? value
        : "";
};

const parseNewsletterRequest = async (
    request: Request
): Promise<NewsletterInput> => {
    const contentType =
        request.headers
            .get("content-type")
            ?.toLowerCase() ?? "";

    let rawData: unknown;

    if (
        contentType.includes(
            "application/json"
        )
    ) {
        try {
            rawData =
                await request.json();
        } catch {
            throw new NewsletterRequestError(
                "Invalid JSON request body"
            );
        }
    } else {
        try {
            const formData =
                await request.formData();

            rawData = {
                email:
                    getFormStringValue(
                        formData,
                        "email"
                    ) ||
                    getFormStringValue(
                        formData,
                        "newsletterEmail"
                    ),

                source:
                    getFormStringValue(
                        formData,
                        "source"
                    ) ||
                    "footer",

                company:
                    getFormStringValue(
                        formData,
                        "company"
                    ),
            };
        } catch {
            throw new NewsletterRequestError(
                "Unable to read the newsletter form"
            );
        }
    }

    return newsletterSchema.parse(
        rawData
    );
};

const isSpamSubmission = (
    input: NewsletterInput
): boolean => {
    return input.company.length > 0;
};

const escapeHtml = (
    value: string
): string => {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll(
            "'",
            "&#039;"
        );
};

const sendWelcomeEmail = async (
    email: string
) => {
    const resendApiKey =
        process.env
            .RESEND_API_KEY
            ?.trim();

    const fromEmail =
        process.env
            .NEWSLETTER_FROM_EMAIL
            ?.trim();

    /*
     * Resend configure করা না থাকলেও
     * subscription database-এ save হবে।
     */
    if (
        !resendApiKey ||
        !fromEmail
    ) {
        return;
    }

    const siteUrl =
        process.env
            .NEXT_PUBLIC_SITE_URL
            ?.replace(
                /\/+$/,
                ""
            ) ||
        "http://localhost:3000";

    const safeEmail =
        escapeHtml(email);

    try {
        const response =
            await fetch(
                "https://api.resend.com/emails",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${resendApiKey}`,

                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        from:
                            fromEmail,

                        to: [
                            email,
                        ],

                        subject:
                            "Welcome to the Thumblify Newsletter",

                        text: [
                            "Welcome to the Thumblify newsletter!",
                            "",
                            "You are now subscribed to receive product updates, thumbnail tips, creator resources, and important announcements.",
                            "",
                            `Visit Thumblify: ${siteUrl}`,
                        ].join("\n"),

                        html: `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />

    <title>
        Welcome to Thumblify
    </title>
</head>

<body
    style="
        margin:0;
        padding:0;
        background:#09090b;
        font-family:Arial,Helvetica,sans-serif;
        color:#e4e4e7;
    "
>
    <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="
            background:#09090b;
            padding:32px 16px;
        "
    >
        <tr>
            <td align="center">
                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="
                        max-width:620px;
                        overflow:hidden;
                        border:1px solid #3f3f46;
                        border-radius:16px;
                        background:#18181b;
                    "
                >
                    <tr>
                        <td
                            style="
                                padding:30px;
                                background:linear-gradient(
                                    135deg,
                                    #db2777,
                                    #9333ea
                                );
                            "
                        >
                            <p
                                style="
                                    margin:0 0 8px;
                                    color:#fce7f3;
                                    font-size:13px;
                                    font-weight:700;
                                    letter-spacing:1px;
                                    text-transform:uppercase;
                                "
                            >
                                Thumblify Newsletter
                            </p>

                            <h1
                                style="
                                    margin:0;
                                    color:#ffffff;
                                    font-size:27px;
                                    line-height:1.3;
                                "
                            >
                                Welcome to Thumblify
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:30px;">
                            <h2
                                style="
                                    margin:0;
                                    color:#f4f4f5;
                                    font-size:21px;
                                "
                            >
                                You&apos;re subscribed!
                            </h2>

                            <p
                                style="
                                    margin:18px 0 0;
                                    color:#d4d4d8;
                                    font-size:15px;
                                    line-height:1.8;
                                "
                            >
                                Thank you for joining
                                the Thumblify newsletter.
                                You&apos;ll receive product
                                updates, practical thumbnail
                                tips, creator resources, and
                                important announcements.
                            </p>

                            <div
                                style="
                                    margin-top:22px;
                                    padding:16px;
                                    border:1px solid #3f3f46;
                                    border-radius:12px;
                                    background:#09090b;
                                "
                            >
                                <p
                                    style="
                                        margin:0;
                                        color:#a1a1aa;
                                        font-size:13px;
                                    "
                                >
                                    Subscribed email
                                </p>

                                <p
                                    style="
                                        margin:6px 0 0;
                                        color:#f472b6;
                                        font-size:14px;
                                        font-weight:600;
                                    "
                                >
                                    ${safeEmail}
                                </p>
                            </div>

                            <a
                                href="${siteUrl}"
                                style="
                                    display:inline-block;
                                    margin-top:24px;
                                    padding:12px 22px;
                                    border-radius:10px;
                                    background:#db2777;
                                    color:#ffffff;
                                    font-size:14px;
                                    font-weight:700;
                                    text-decoration:none;
                                "
                            >
                                Visit Thumblify
                            </a>

                            <p
                                style="
                                    margin:24px 0 0;
                                    color:#71717a;
                                    font-size:12px;
                                    line-height:1.6;
                                "
                            >
                                You received this email
                                because you subscribed to
                                the Thumblify newsletter.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
                        `.trim(),
                    }),

                    cache:
                        "no-store",
                }
            );

        if (!response.ok) {
            const responseText =
                await response
                    .text()
                    .catch(() => "");

            console.error(
                "Newsletter welcome email failed:",
                {
                    status:
                        response.status,

                    response:
                        responseText,
                }
            );
        }
    } catch (error) {
        /*
         * Welcome email ব্যর্থ হলেও successful
         * subscription rollback হবে না।
         */
        console.error(
            "Newsletter welcome email error:",
            error
        );
    }
};

const isDuplicateKeyError = (
    error: unknown
): boolean => {
    if (
        typeof error !==
        "object" ||
        error === null ||
        !("code" in error)
    ) {
        return false;
    }

    return (
        (
            error as {
                code?: number;
            }
        ).code === 11000
    );
};

const sendSuccessResponse = (
    message: string,
    alreadySubscribed: boolean,
    status = 200
) => {
    return NextResponse.json<NewsletterSuccessResponse>(
        {
            success: true,
            message,
            alreadySubscribed,
        },
        {
            status,

            headers: {
                "Cache-Control":
                    "no-store",
            },
        }
    );
};

const sendErrorResponse = (
    message: string,
    status: number,
    errors?: unknown
) => {
    return NextResponse.json<NewsletterErrorResponse>(
        {
            success: false,
            message,

            ...(errors
                ? {
                    errors,
                }
                : {}),
        },
        {
            status,

            headers: {
                "Cache-Control":
                    "no-store",
            },
        }
    );
};

export async function POST(
    request: Request
) {
    try {
        const clientIp =
            getClientIp(request);

        enforceRateLimit(
            clientIp
        );

        const input =
            await parseNewsletterRequest(
                request
            );

        /*
         * Bot submission হলে real database
         * operation না করে fake success।
         */
        if (
            isSpamSubmission(
                input
            )
        ) {
            console.warn(
                "Newsletter honeypot triggered"
            );

            return sendSuccessResponse(
                "You have joined our newsletter successfully.",
                false
            );
        }

        await connectDatabase();

        const database =
            mongoose.connection.db;

        if (!database) {
            throw new Error(
                "Newsletter database connection is unavailable"
            );
        }

        const collection =
            database.collection<NewsletterSubscriber>(
                NEWSLETTER_COLLECTION_NAME
            );

        /*
         * Email duplicate হওয়া বন্ধ করতে
         * unique index।
         */
        await collection.createIndex(
            {
                email: 1,
            },
            {
                unique: true,
                name:
                    "newsletter_email_unique",
            }
        );

        const existingSubscriber =
            await collection.findOne({
                email:
                    input.email,
            });

        if (
            existingSubscriber?.status ===
            "active"
        ) {
            return sendSuccessResponse(
                "You are already subscribed to the Thumblify newsletter.",
                true
            );
        }

        const currentTime =
            new Date();

        const userAgent =
            request.headers
                .get("user-agent")
                ?.slice(0, 500) ||
            "unknown";

        if (existingSubscriber) {
            await collection.updateOne(
                {
                    email:
                        input.email,
                },
                {
                    $set: {
                        status:
                            "active",

                        source:
                            input.source,

                        updatedAt:
                            currentTime,

                        lastSubscribedAt:
                            currentTime,

                        userAgent,
                    },
                }
            );
        } else {
            await collection.insertOne({
                email:
                    input.email,

                status:
                    "active",

                source:
                    input.source,

                subscriptionId:
                    randomUUID(),

                createdAt:
                    currentTime,

                updatedAt:
                    currentTime,

                lastSubscribedAt:
                    currentTime,

                userAgent,
            });
        }

        void sendWelcomeEmail(
            input.email
        );

        return sendSuccessResponse(
            "You have joined the Thumblify newsletter successfully.",
            false,
            201
        );
    } catch (error: unknown) {
        console.error(
            "Newsletter subscription failed:",
            error
        );

        /*
         * একই সময়ে duplicate request এলে
         * unique index error-কে safe success ধরা হবে।
         */
        if (
            isDuplicateKeyError(
                error
            )
        ) {
            return sendSuccessResponse(
                "You are already subscribed to the Thumblify newsletter.",
                true
            );
        }

        if (
            error instanceof
            ZodError
        ) {
            return sendErrorResponse(
                error.issues[0]
                    ?.message ||
                "Invalid newsletter information",

                400,

                error.flatten()
            );
        }

        if (
            error instanceof
            NewsletterRequestError
        ) {
            return sendErrorResponse(
                error.message,
                error.statusCode
            );
        }

        return sendErrorResponse(
            getErrorMessage(
                error
            ),
            500
        );
    }
}