import { randomUUID } from "crypto";

import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
    contactFormSchema,
    contactInquiryLabels,
    isContactSpamSubmission,
    type ContactFormData,
} from "@/lib/validations/contact.schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_API_URL =
    "https://api.resend.com/emails";

const RATE_LIMIT_WINDOW_MS =
    10 * 60 * 1000;

const MAX_SUBMISSIONS_PER_WINDOW = 5;

interface RateLimitRecord {
    count: number;
    expiresAt: number;
}

interface ResendSuccessResponse {
    id?: string;
}

interface ResendErrorResponse {
    message?: string;
    name?: string;
    statusCode?: number;
}

interface ContactSuccessResponse {
    success: true;
    message: string;
    submissionId: string;
}

interface ContactErrorResponse {
    success: false;
    message: string;
    errors?: unknown;
}

class ContactRequestError extends Error {
    public readonly statusCode: number;

    constructor(
        message: string,
        statusCode = 400
    ) {
        super(message);

        this.name = "ContactRequestError";
        this.statusCode = statusCode;
    }
}

class EmailDeliveryError extends Error {
    public readonly statusCode: number;

    constructor(
        message: string,
        statusCode = 502
    ) {
        super(message);

        this.name = "EmailDeliveryError";
        this.statusCode = statusCode;
    }
}

const globalContactStore =
    globalThis as typeof globalThis & {
        thumblifyContactRateLimit?: Map<
            string,
            RateLimitRecord
        >;
    };

const contactRateLimitStore =
    globalContactStore
        .thumblifyContactRateLimit ??
    new Map<string, RateLimitRecord>();

globalContactStore.thumblifyContactRateLimit =
    contactRateLimitStore;

const getErrorMessage = (
    error: unknown
): string => {
    if (error instanceof Error) {
        return error.message;
    }

    return "Unable to send your message";
};

const escapeHtml = (
    value: string
): string => {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
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
        ] of contactRateLimitStore
    ) {
        if (
            record.expiresAt <=
            currentTime
        ) {
            contactRateLimitStore.delete(
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
        contactRateLimitStore.get(
            clientIp
        );

    if (
        !existingRecord ||
        existingRecord.expiresAt <=
        currentTime
    ) {
        contactRateLimitStore.set(
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
        MAX_SUBMISSIONS_PER_WINDOW
    ) {
        throw new ContactRequestError(
            "Too many messages were submitted. Please wait a few minutes and try again.",
            429
        );
    }

    existingRecord.count += 1;

    contactRateLimitStore.set(
        clientIp,
        existingRecord
    );
};

const shouldReturnHtml = (
    request: Request
): boolean => {
    const contentType =
        request.headers
            .get("content-type")
            ?.toLowerCase() ?? "";

    const accept =
        request.headers
            .get("accept")
            ?.toLowerCase() ?? "";

    return (
        !contentType.includes(
            "application/json"
        ) &&
        accept.includes("text/html")
    );
};

const redirectToContactPage = (
    request: Request,
    status:
        | "success"
        | "error",
    message?: string
) => {
    const redirectUrl =
        new URL(
            "/contact",
            request.url
        );

    redirectUrl.searchParams.set(
        "status",
        status
    );

    if (message) {
        redirectUrl.searchParams.set(
            "message",
            message
        );
    }

    return NextResponse.redirect(
        redirectUrl,
        {
            status: 303,
        }
    );
};

const sendSuccessResponse = (
    request: Request,
    submissionId: string
) => {
    const message =
        "Your message has been sent successfully. Our team will get back to you soon.";

    if (
        shouldReturnHtml(request)
    ) {
        return redirectToContactPage(
            request,
            "success"
        );
    }

    return NextResponse.json<ContactSuccessResponse>(
        {
            success: true,
            message,
            submissionId,
        },
        {
            status: 200,
        }
    );
};

const sendErrorResponse = (
    request: Request,
    message: string,
    statusCode: number,
    errors?: unknown
) => {
    if (
        shouldReturnHtml(request)
    ) {
        return redirectToContactPage(
            request,
            "error",
            message
        );
    }

    return NextResponse.json<ContactErrorResponse>(
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
            status: statusCode,
        }
    );
};

const formDataToObject = (
    formData: FormData
): Record<string, string> => {
    const getStringValue = (
        fieldName: string
    ): string => {
        const value =
            formData.get(
                fieldName
            );

        return typeof value ===
            "string"
            ? value
            : "";
    };

    return {
        name:
            getStringValue(
                "name"
            ),

        email:
            getStringValue(
                "email"
            ),

        whatsapp:
            getStringValue(
                "whatsapp"
            ),

        inquiryType:
            getStringValue(
                "inquiryType"
            ),

        subject:
            getStringValue(
                "subject"
            ),

        message:
            getStringValue(
                "message"
            ),

        company:
            getStringValue(
                "company"
            ),
    };
};

const parseContactRequest = async (
    request: Request
): Promise<ContactFormData> => {
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
            throw new ContactRequestError(
                "Invalid JSON request body"
            );
        }
    } else {
        try {
            const formData =
                await request.formData();

            rawData =
                formDataToObject(
                    formData
                );
        } catch {
            throw new ContactRequestError(
                "Unable to read the contact form"
            );
        }
    }

    return contactFormSchema.parse(
        rawData
    );
};

const buildPlainTextEmail = (
    data: ContactFormData,
    submissionId: string
): string => {
    const inquiryLabel =
        contactInquiryLabels[
        data.inquiryType
        ];

    return [
        "New Thumblify Contact Message",
        "",
        `Submission ID: ${submissionId}`,
        `Inquiry Type: ${inquiryLabel}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `WhatsApp: ${data.whatsapp ||
        "Not provided"
        }`,
        `Subject: ${data.subject}`,
        "",
        "Message:",
        data.message,
    ].join("\n");
};

const buildHtmlEmail = (
    data: ContactFormData,
    submissionId: string
): string => {
    const inquiryLabel =
        contactInquiryLabels[
        data.inquiryType
        ];

    const safeName =
        escapeHtml(data.name);

    const safeEmail =
        escapeHtml(data.email);

    const safeWhatsapp =
        escapeHtml(
            data.whatsapp ||
            "Not provided"
        );

    const safeSubject =
        escapeHtml(data.subject);

    const safeInquiryLabel =
        escapeHtml(
            inquiryLabel
        );

    const safeMessage =
        escapeHtml(
            data.message
        ).replaceAll(
            "\n",
            "<br />"
        );

    const safeSubmissionId =
        escapeHtml(
            submissionId
        );

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    />
    <title>New Thumblify Contact Message</title>
</head>

<body style="margin:0;padding:0;background:#09090b;font-family:Arial,Helvetica,sans-serif;color:#e4e4e7;">
    <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        style="background:#09090b;padding:32px 16px;"
    >
        <tr>
            <td align="center">
                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    style="max-width:680px;background:#18181b;border:1px solid #3f3f46;border-radius:16px;overflow:hidden;"
                >
                    <tr>
                        <td style="padding:28px;background:linear-gradient(135deg,#db2777,#9333ea);">
                            <p style="margin:0 0 8px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:#fce7f3;">
                                Thumblify Contact Form
                            </p>

                            <h1 style="margin:0;font-size:25px;line-height:1.3;color:#ffffff;">
                                New Customer Message
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding:28px;">
                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                            >
                                <tr>
                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;color:#a1a1aa;width:150px;">
                                        Inquiry Type
                                    </td>

                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;color:#f4f4f5;font-weight:600;">
                                        ${safeInquiryLabel}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;color:#a1a1aa;">
                                        Full Name
                                    </td>

                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;color:#f4f4f5;">
                                        ${safeName}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;color:#a1a1aa;">
                                        Email
                                    </td>

                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;">
                                        <a
                                            href="mailto:${safeEmail}"
                                            style="color:#f472b6;text-decoration:none;"
                                        >
                                            ${safeEmail}
                                        </a>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;color:#a1a1aa;">
                                        WhatsApp
                                    </td>

                                    <td style="padding:10px 0;border-bottom:1px solid #3f3f46;font-size:14px;color:#f4f4f5;">
                                        ${safeWhatsapp}
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding:10px 0;font-size:14px;color:#a1a1aa;">
                                        Subject
                                    </td>

                                    <td style="padding:10px 0;font-size:14px;color:#f4f4f5;font-weight:600;">
                                        ${safeSubject}
                                    </td>
                                </tr>
                            </table>

                            <div style="margin-top:24px;padding:20px;border-radius:12px;background:#09090b;border:1px solid #3f3f46;">
                                <p style="margin:0 0 10px;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.7px;color:#f472b6;">
                                    Message
                                </p>

                                <p style="margin:0;font-size:15px;line-height:1.7;color:#d4d4d8;word-break:break-word;">
                                    ${safeMessage}
                                </p>
                            </div>

                            <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#71717a;">
                                Submission ID: ${safeSubmissionId}
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();
};

const sendContactEmail = async (
    data: ContactFormData,
    submissionId: string
): Promise<string> => {
    const resendApiKey =
        process.env
            .RESEND_API_KEY
            ?.trim();

    const recipientEmail =
        process.env
            .CONTACT_TO_EMAIL
            ?.trim() ||
        process.env
            .NEXT_PUBLIC_SUPPORT_EMAIL
            ?.trim();

    const senderEmail =
        process.env
            .CONTACT_FROM_EMAIL
            ?.trim();

    if (!resendApiKey) {
        throw new EmailDeliveryError(
            "Contact email service is not configured. RESEND_API_KEY is missing.",
            500
        );
    }

    if (!recipientEmail) {
        throw new EmailDeliveryError(
            "Contact recipient is not configured. CONTACT_TO_EMAIL is missing.",
            500
        );
    }

    if (!senderEmail) {
        throw new EmailDeliveryError(
            "Contact sender is not configured. CONTACT_FROM_EMAIL is missing.",
            500
        );
    }

    const inquiryLabel =
        contactInquiryLabels[
        data.inquiryType
        ];

    const response =
        await fetch(
            RESEND_API_URL,
            {
                method: "POST",

                headers: {
                    Authorization:
                        `Bearer ${resendApiKey}`,

                    "Content-Type":
                        "application/json",

                    "Idempotency-Key":
                        submissionId,
                },

                body: JSON.stringify({
                    from:
                        senderEmail,

                    to: [
                        recipientEmail,
                    ],

                    reply_to:
                        data.email,

                    subject:
                        `[${inquiryLabel}] ${data.subject}`,

                    html:
                        buildHtmlEmail(
                            data,
                            submissionId
                        ),

                    text:
                        buildPlainTextEmail(
                            data,
                            submissionId
                        ),

                    tags: [
                        {
                            name:
                                "source",

                            value:
                                "contact-form",
                        },

                        {
                            name:
                                "inquiry_type",

                            value:
                                data.inquiryType,
                        },
                    ],
                }),

                cache: "no-store",
            }
        );

    const responseData =
        (await response
            .json()
            .catch(() => null)) as
        | ResendSuccessResponse
        | ResendErrorResponse
        | null;

    if (!response.ok) {
        const resendMessage =
            responseData &&
                "message" in
                responseData
                ? responseData.message
                : undefined;

        console.error(
            "Resend contact email failed:",
            {
                status:
                    response.status,

                response:
                    responseData,
            }
        );

        throw new EmailDeliveryError(
            resendMessage ||
            "The email service could not deliver your message",
            502
        );
    }

    if (
        !responseData ||
        !("id" in responseData) ||
        !responseData.id
    ) {
        throw new EmailDeliveryError(
            "The email service returned an invalid response",
            502
        );
    }

    return responseData.id;
};

export async function POST(
    request: Request
) {
    const submissionId =
        randomUUID();

    try {
        const clientIp =
            getClientIp(request);

        enforceRateLimit(
            clientIp
        );

        const contactData =
            await parseContactRequest(
                request
            );

        /*
         * Honeypot পূরণ হলে bot-কে error না
         * দেখিয়ে fake success response দেওয়া হবে।
         */
        if (
            isContactSpamSubmission(
                contactData
            )
        ) {
            console.warn(
                "Contact honeypot triggered:",
                {
                    submissionId,
                }
            );

            return sendSuccessResponse(
                request,
                submissionId
            );
        }

        const emailId =
            await sendContactEmail(
                contactData,
                submissionId
            );

        console.info(
            "Contact email sent:",
            {
                submissionId,
                emailId,
                inquiryType:
                    contactData
                        .inquiryType,
            }
        );

        return sendSuccessResponse(
            request,
            submissionId
        );
    } catch (error: unknown) {
        console.error(
            "Contact form submission failed:",
            {
                submissionId,
                error,
            }
        );

        if (
            error instanceof
            ZodError
        ) {
            return sendErrorResponse(
                request,

                error.issues[0]
                    ?.message ||
                "Invalid contact information",

                400,

                error.flatten()
            );
        }

        if (
            error instanceof
            ContactRequestError
        ) {
            return sendErrorResponse(
                request,
                error.message,
                error.statusCode
            );
        }

        if (
            error instanceof
            EmailDeliveryError
        ) {
            return sendErrorResponse(
                request,
                error.message,
                error.statusCode
            );
        }

        return sendErrorResponse(
            request,
            getErrorMessage(error),
            500
        );
    }
}