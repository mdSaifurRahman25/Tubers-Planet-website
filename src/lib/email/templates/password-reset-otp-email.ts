import "server-only";

import {
    PASSWORD_RESET_OTP_LENGTH,
    PASSWORD_RESET_OTP_TTL_MS,
    isValidPasswordResetOtp,
} from "@/lib/auth/password-reset-otp";

export interface PasswordResetOtpEmailInput {
    name: string;
    email: string;
    otp: string;
}

export interface PasswordResetOtpEmailContent {
    subject: string;
    html: string;
    text: string;
}

const BRAND_NAME = "Thumblify";

const OTP_EXPIRY_MINUTES = Math.max(
    1,
    Math.floor(
        PASSWORD_RESET_OTP_TTL_MS /
        (60 * 1000)
    )
);

/*
 * User-provided text HTML-এর মধ্যে ব্যবহারের আগে
 * নিরাপদভাবে escape করবে।
 */
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

/*
 * User-এর নাম পরিষ্কার করবে।
 */
const normalizeRecipientName = (
    name: string
): string => {
    const normalizedName =
        name
            .trim()
            .replace(/\s+/g, " ");

    return normalizedName || "Creator";
};

/*
 * Email address পরিষ্কার করবে।
 */
const normalizeEmailAddress = (
    email: string
): string => {
    return email
        .trim()
        .toLowerCase();
};

/*
 * OTP-কে email-এর মধ্যে সহজে পড়ার মতো করে দেখাবে।
 *
 * Example:
 * 582941 → 5 8 2 9 4 1
 */
const formatOtpForDisplay = (
    otp: string
): string => {
    return otp
        .split("")
        .join(" ");
};

/*
 * Password reset OTP email-এর subject,
 * HTML version এবং plain-text version তৈরি করবে।
 */
export const createPasswordResetOtpEmail = (
    input: PasswordResetOtpEmailInput
): PasswordResetOtpEmailContent => {
    const name =
        normalizeRecipientName(
            input.name
        );

    const email =
        normalizeEmailAddress(
            input.email
        );

    const otp =
        input.otp.trim();

    if (!email) {
        throw new Error(
            "Recipient email is required"
        );
    }

    if (
        !isValidPasswordResetOtp(
            otp
        )
    ) {
        throw new Error(
            `Password reset OTP must contain exactly ${PASSWORD_RESET_OTP_LENGTH} digits`
        );
    }

    const safeName =
        escapeHtml(name);

    const safeEmail =
        escapeHtml(email);

    const safeOtp =
        escapeHtml(
            formatOtpForDisplay(
                otp
            )
        );

    const subject =
        `${otp} is your ${BRAND_NAME} password reset code`;

    const text = [
        `Hello ${name},`,
        "",
        `We received a request to reset the password for your ${BRAND_NAME} account.`,
        "",
        "Use the following verification code:",
        "",
        otp,
        "",
        `This code will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
        "",
        `The password reset request was made for ${email}.`,
        "",
        "For your security, do not share this code with anyone.",
        "",
        `If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.`,
        "",
        `— The ${BRAND_NAME} Team`,
    ].join("\n");

    const html = `
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1"
    />

    <meta
        name="color-scheme"
        content="dark light"
    />

    <meta
        name="supported-color-schemes"
        content="dark light"
    />

    <title>${escapeHtml(subject)}</title>
</head>

<body
    style="
        margin: 0;
        padding: 0;
        background-color: #09090b;
        font-family:
            Arial,
            Helvetica,
            sans-serif;
        color: #ffffff;
    "
>
    <!-- Email preview text -->
    <div
        style="
            display: none;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            color: transparent;
            font-size: 1px;
            line-height: 1px;
        "
    >
        Use ${otp} to reset your ${BRAND_NAME} password.
    </div>

    <table
        role="presentation"
        width="100%"
        cellspacing="0"
        cellpadding="0"
        border="0"
        style="
            width: 100%;
            background-color: #09090b;
        "
    >
        <tr>
            <td
                align="center"
                style="
                    padding:
                        40px
                        16px;
                "
            >
                <table
                    role="presentation"
                    width="100%"
                    cellspacing="0"
                    cellpadding="0"
                    border="0"
                    style="
                        width: 100%;
                        max-width: 600px;
                        overflow: hidden;
                        border:
                            1px
                            solid
                            #3f3f46;
                        border-radius: 24px;
                        background-color: #18181b;
                    "
                >
                    <!-- Header -->
                    <tr>
                        <td
                            align="center"
                            style="
                                padding:
                                    36px
                                    28px
                                    32px;
                                background:
                                    linear-gradient(
                                        135deg,
                                        #db2777,
                                        #9333ea
                                    );
                            "
                        >
                            <div
                                style="
                                    display: inline-block;
                                    margin-bottom: 16px;
                                    padding:
                                        10px
                                        18px;
                                    border:
                                        1px
                                        solid
                                        rgba(
                                            255,
                                            255,
                                            255,
                                            0.35
                                        );
                                    border-radius: 999px;
                                    background-color:
                                        rgba(
                                            9,
                                            9,
                                            11,
                                            0.22
                                        );
                                    color: #ffffff;
                                    font-size: 14px;
                                    font-weight: 700;
                                    letter-spacing: 1.5px;
                                    text-transform: uppercase;
                                "
                            >
                                ${BRAND_NAME}
                            </div>

                            <h1
                                style="
                                    margin: 0;
                                    color: #ffffff;
                                    font-size: 30px;
                                    line-height: 1.25;
                                    font-weight: 800;
                                "
                            >
                                Reset your password
                            </h1>

                            <p
                                style="
                                    margin:
                                        12px
                                        0
                                        0;
                                    color:
                                        rgba(
                                            255,
                                            255,
                                            255,
                                            0.88
                                        );
                                    font-size: 16px;
                                    line-height: 1.6;
                                "
                            >
                                Use the secure code below to continue
                            </p>
                        </td>
                    </tr>

                    <!-- Main content -->
                    <tr>
                        <td
                            style="
                                padding:
                                    36px
                                    32px;
                            "
                        >
                            <p
                                style="
                                    margin:
                                        0
                                        0
                                        18px;
                                    color: #f4f4f5;
                                    font-size: 17px;
                                    line-height: 1.7;
                                "
                            >
                                Hello
                                <strong
                                    style="
                                        color: #ffffff;
                                    "
                                >
                                    ${safeName}
                                </strong>,
                            </p>

                            <p
                                style="
                                    margin:
                                        0
                                        0
                                        26px;
                                    color: #d4d4d8;
                                    font-size: 16px;
                                    line-height: 1.75;
                                "
                            >
                                We received a request to reset the password for your ${BRAND_NAME} account. Enter the verification code below to continue.
                            </p>

                            <!-- OTP box -->
                            <table
                                role="presentation"
                                width="100%"
                                cellspacing="0"
                                cellpadding="0"
                                border="0"
                                style="
                                    width: 100%;
                                "
                            >
                                <tr>
                                    <td
                                        align="center"
                                        style="
                                            padding:
                                                28px
                                                16px;
                                            border:
                                                1px
                                                solid
                                                #52525b;
                                            border-radius: 18px;
                                            background-color: #09090b;
                                        "
                                    >
                                        <p
                                            style="
                                                margin:
                                                    0
                                                    0
                                                    12px;
                                                color: #a1a1aa;
                                                font-size: 13px;
                                                font-weight: 700;
                                                letter-spacing: 1.5px;
                                                text-transform: uppercase;
                                            "
                                        >
                                            Password reset code
                                        </p>

                                        <div
                                            style="
                                                color: #f472b6;
                                                font-size: 38px;
                                                line-height: 1.2;
                                                font-weight: 800;
                                                letter-spacing: 5px;
                                            "
                                        >
                                            ${safeOtp}
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <p
                                style="
                                    margin:
                                        24px
                                        0
                                        0;
                                    color: #d4d4d8;
                                    font-size: 15px;
                                    line-height: 1.7;
                                    text-align: center;
                                "
                            >
                                This code will expire in
                                <strong
                                    style="
                                        color: #ffffff;
                                    "
                                >
                                    ${OTP_EXPIRY_MINUTES} minutes
                                </strong>.
                            </p>

                            <!-- Security notice -->
                            <div
                                style="
                                    margin-top: 30px;
                                    padding:
                                        18px
                                        20px;
                                    border:
                                        1px
                                        solid
                                        #3f3f46;
                                    border-radius: 14px;
                                    background-color: #27272a;
                                "
                            >
                                <p
                                    style="
                                        margin:
                                            0
                                            0
                                            8px;
                                        color: #f4f4f5;
                                        font-size: 14px;
                                        font-weight: 700;
                                        line-height: 1.5;
                                    "
                                >
                                    Security notice
                                </p>

                                <p
                                    style="
                                        margin: 0;
                                        color: #a1a1aa;
                                        font-size: 14px;
                                        line-height: 1.65;
                                    "
                                >
                                    Never share this code with anyone. The ${BRAND_NAME} team will never ask you to provide your password reset code.
                                </p>
                            </div>

                            <p
                                style="
                                    margin:
                                        28px
                                        0
                                        0;
                                    color: #a1a1aa;
                                    font-size: 14px;
                                    line-height: 1.7;
                                "
                            >
                                This password reset request was made for
                                <strong
                                    style="
                                        color: #d4d4d8;
                                        word-break: break-all;
                                    "
                                >
                                    ${safeEmail}
                                </strong>.
                            </p>

                            <p
                                style="
                                    margin:
                                        16px
                                        0
                                        0;
                                    color: #71717a;
                                    font-size: 13px;
                                    line-height: 1.7;
                                "
                            >
                                If you did not request a password reset, you can safely ignore this email. Your current password will remain unchanged.
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td
                            align="center"
                            style="
                                padding:
                                    24px
                                    28px;
                                border-top:
                                    1px
                                    solid
                                    #3f3f46;
                                background-color: #111113;
                            "
                        >
                            <p
                                style="
                                    margin: 0;
                                    color: #a1a1aa;
                                    font-size: 13px;
                                    line-height: 1.6;
                                "
                            >
                                Sent securely by
                                <strong
                                    style="
                                        color: #f4f4f5;
                                    "
                                >
                                    ${BRAND_NAME}
                                </strong>
                            </p>

                            <p
                                style="
                                    margin:
                                        8px
                                        0
                                        0;
                                    color: #52525b;
                                    font-size: 12px;
                                    line-height: 1.6;
                                "
                            >
                                Create better YouTube thumbnails with confidence.
                            </p>
                        </td>
                    </tr>
                </table>

                <p
                    style="
                        margin:
                            20px
                            0
                            0;
                        color: #52525b;
                        font-size: 12px;
                        line-height: 1.6;
                        text-align: center;
                    "
                >
                    This is an automated password reset email.
                </p>
            </td>
        </tr>
    </table>
</body>
</html>
`.trim();

    return {
        subject,
        html,
        text,
    };
};