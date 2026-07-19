import "server-only";

import {
    EMAIL_VERIFICATION_OTP_LENGTH,
    EMAIL_VERIFICATION_OTP_TTL_MS,
    isValidEmailVerificationOtp,
} from "@/lib/auth/email-verification-otp";

export interface VerificationOtpEmailInput {
    name: string;
    email: string;
    otp: string;
}

export interface VerificationOtpEmailContent {
    subject: string;
    html: string;
    text: string;
}

const BRAND_NAME = "Thumblify";

const OTP_EXPIRY_MINUTES = Math.max(
    1,
    Math.floor(
        EMAIL_VERIFICATION_OTP_TTL_MS /
            (60 * 1000)
    )
);

/*
 * User-provided value সরাসরি HTML email-এর মধ্যে
 * ব্যবহার করার আগে escape করা হবে।
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
 * Email-এর মধ্যে দেখানোর জন্য নাম পরিষ্কার করবে।
 */
const normalizeRecipientName = (
    name: string
): string => {
    const normalizedName = name
        .trim()
        .replace(/\s+/g, " ");

    return normalizedName || "Creator";
};

/*
 * OTP-কে visually readable format-এ দেখাবে।
 *
 * Example:
 * 582941 → 5 8 2 9 4 1
 */
const formatOtpForDisplay = (
    otp: string
): string => {
    return otp.split("").join(" ");
};

export const createVerificationOtpEmail = (
    input: VerificationOtpEmailInput
): VerificationOtpEmailContent => {
    const name =
        normalizeRecipientName(
            input.name
        );

    const email =
        input.email
            .trim()
            .toLowerCase();

    const otp =
        input.otp.trim();

    if (!email) {
        throw new Error(
            "Recipient email is required"
        );
    }

    if (
        !isValidEmailVerificationOtp(
            otp
        )
    ) {
        throw new Error(
            `Verification OTP must contain exactly ${EMAIL_VERIFICATION_OTP_LENGTH} digits`
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
        `${otp} is your ${BRAND_NAME} verification code`;

    const text = [
        `Welcome to ${BRAND_NAME}, ${name}!`,
        "",
        "Use the following verification code to complete your account registration:",
        "",
        otp,
        "",
        `This code will expire in ${OTP_EXPIRY_MINUTES} minutes.`,
        "",
        `The verification request was made for ${email}.`,
        "",
        "For your security, do not share this code with anyone.",
        "",
        `If you did not try to create a ${BRAND_NAME} account, you can safely ignore this email.`,
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
    <div
        style="
            display: none;
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            color: transparent;
            line-height: 1px;
            font-size: 1px;
        "
    >
        Use ${otp} to verify your ${BRAND_NAME} account.
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
                        background-color: #18181b;
                        border:
                            1px
                            solid
                            #3f3f46;
                        border-radius: 24px;
                        overflow: hidden;
                    "
                >
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
                                Verify your email
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
                                Complete your account registration
                            </p>
                        </td>
                    </tr>

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
                                Enter the verification code below to finish creating your ${BRAND_NAME} account.
                            </p>

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
                                            Verification code
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
                                    Never share this verification code with anyone. The ${BRAND_NAME} team will never ask you for this code.
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
                                This verification request was made for
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
                                If you did not try to create a ${BRAND_NAME} account, you can safely ignore this email.
                            </p>
                        </td>
                    </tr>

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
                    This is an automated account verification email.
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