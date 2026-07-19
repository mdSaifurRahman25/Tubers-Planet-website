import "server-only";

import { createHash } from "node:crypto";

import nodemailer, {
    type SendMailOptions,
    type Transporter,
} from "nodemailer";

interface SmtpConfig {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    pass: string;
    from: string;
    replyTo?: string;
}

export interface SendEmailInput {
    to: string | string[];
    subject: string;
    html: string;
    text: string;
    replyTo?: string;
    headers?: SendMailOptions["headers"];
}

export interface SendEmailResult {
    messageId: string;
    response: string;
}

/*
 * Development-এর Hot Reload-এর সময় বারবার নতুন
 * Nodemailer transporter তৈরি হওয়া বন্ধ করবে।
 */
declare global {
    var __thumblifyMailer:
        | Transporter
        | undefined;

    var __thumblifyMailerConfigHash:
        | string
        | undefined;
}

const getRequiredEnvironmentVariable = (
    name: string
): string => {
    const value =
        process.env[name]?.trim();

    if (!value) {
        throw new Error(
            `${name} is not configured`
        );
    }

    return value;
};

const parseSmtpPort = (
    value: string
): number => {
    const port = Number(value);

    if (
        !Number.isInteger(port) ||
        port < 1 ||
        port > 65535
    ) {
        throw new Error(
            "SMTP_PORT must be a valid port number"
        );
    }

    return port;
};

const parseBoolean = (
    value: string | undefined,
    fallback: boolean
): boolean => {
    if (!value) {
        return fallback;
    }

    const normalizedValue =
        value.trim().toLowerCase();

    if (
        normalizedValue === "true" ||
        normalizedValue === "1" ||
        normalizedValue === "yes"
    ) {
        return true;
    }

    if (
        normalizedValue === "false" ||
        normalizedValue === "0" ||
        normalizedValue === "no"
    ) {
        return false;
    }

    throw new Error(
        "SMTP_SECURE must be true or false"
    );
};

/*
 * Environment variables function call-এর সময় পড়া হবে।
 * ফলে Next.js build-এর সময় SMTP configure না থাকলেও
 * শুধু file import হওয়ার কারণে build fail করবে না।
 */
export const getSmtpConfig =
    (): SmtpConfig => {
        const host =
            getRequiredEnvironmentVariable(
                "SMTP_HOST"
            );

        const port =
            parseSmtpPort(
                process.env.SMTP_PORT?.trim() ||
                "587"
            );

        /*
         * Port 465 হলে default secure true।
         * Port 587 হলে default secure false।
         */
        const secure =
            parseBoolean(
                process.env.SMTP_SECURE,
                port === 465
            );

        const user =
            getRequiredEnvironmentVariable(
                "SMTP_USER"
            );

        const pass =
            getRequiredEnvironmentVariable(
                "SMTP_PASS"
            );

        const from =
            process.env.SMTP_FROM?.trim() ||
            `Thumblify <${user}>`;

        const replyTo =
            process.env.SMTP_REPLY_TO?.trim() ||
            undefined;

        return {
            host,
            port,
            secure,
            user,
            pass,
            from,
            replyTo,
        };
    };

/*
 * SMTP configuration পরিবর্তন হলে development cache-এর
 * পুরোনো transporter reuse করা হবে না।
 */
const createSmtpConfigHash = (
    config: SmtpConfig
): string => {
    return createHash("sha256")
        .update(
            [
                config.host,
                config.port.toString(),
                config.secure.toString(),
                config.user,
                config.pass,
                config.from,
                config.replyTo || "",
            ].join("\n")
        )
        .digest("hex");
};

const createMailer = (
    config: SmtpConfig
): Transporter => {
    return nodemailer.createTransport({
        host:
            config.host,

        port:
            config.port,

        secure:
            config.secure,

        auth: {
            user:
                config.user,

            pass:
                config.pass,
        },

        /*
         * একই server instance থেকে একাধিক email পাঠানোর
         * সময় connection reuse করতে সাহায্য করবে।
         */
        pool:
            true,

        maxConnections:
            3,

        maxMessages:
            50,

        /*
         * SMTP server response না দিলে request যেন
         * অনির্দিষ্ট সময় আটকে না থাকে।
         */
        connectionTimeout:
            15_000,

        greetingTimeout:
            10_000,

        socketTimeout:
            30_000,
    });
};

/*
 * Application-এর shared Nodemailer transporter।
 */
export const getMailer =
    (): Transporter => {
        const config =
            getSmtpConfig();

        const configHash =
            createSmtpConfigHash(
                config
            );

        if (
            globalThis.__thumblifyMailer &&
            globalThis.__thumblifyMailerConfigHash ===
            configHash
        ) {
            return globalThis.__thumblifyMailer;
        }

        const transporter =
            createMailer(config);

        globalThis.__thumblifyMailer =
            transporter;

        globalThis.__thumblifyMailerConfigHash =
            configHash;

        return transporter;
    };

/*
 * SMTP credentials এবং connection ঠিক আছে কি না
 * পরীক্ষা করার জন্য ব্যবহার করা যাবে।
 *
 * এটি application startup-এ বাধ্যতামূলকভাবে call করব না।
 * কারণ SMTP সাময়িকভাবে unavailable হলেও Next.js app
 * যেন সম্পূর্ণভাবে crash না করে।
 */
export const verifyMailerConnection =
    async (): Promise<void> => {
        const transporter =
            getMailer();

        await transporter.verify();
    };

/*
 * Thumblify-এর সব transactional email এই function
 * ব্যবহার করে পাঠানো হবে।
 */
export const sendEmail = async (
    input: SendEmailInput
): Promise<SendEmailResult> => {
    const config =
        getSmtpConfig();

    const transporter =
        getMailer();

    const recipients =
        Array.isArray(input.to)
            ? input.to
                .map((email) =>
                    email.trim()
                )
                .filter(Boolean)
            : input.to.trim();

    if (
        Array.isArray(recipients)
            ? recipients.length === 0
            : !recipients
    ) {
        throw new Error(
            "At least one email recipient is required"
        );
    }

    if (!input.subject.trim()) {
        throw new Error(
            "Email subject is required"
        );
    }

    if (!input.html.trim()) {
        throw new Error(
            "Email HTML content is required"
        );
    }

    if (!input.text.trim()) {
        throw new Error(
            "Email text content is required"
        );
    }

    const info =
        await transporter.sendMail({
            from:
                config.from,

            to:
                recipients,

            subject:
                input.subject.trim(),

            html:
                input.html,

            text:
                input.text,

            replyTo:
                input.replyTo?.trim() ||
                config.replyTo,

            headers:
                input.headers,
        });

    return {
        messageId:
            info.messageId || "",

        response:
            info.response || "",
    };
};