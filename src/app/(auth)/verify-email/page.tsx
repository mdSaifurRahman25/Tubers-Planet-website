import type { Metadata } from "next";

import OtpVerificationForm from "@/components/auth/OtpVerificationForm";

export const metadata: Metadata = {
    title: "Verify Your Email | Thumblify",
    description:
        "Enter the verification code sent to your email to complete your Thumblify account registration.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export const dynamic = "force-dynamic";

export default function VerifyEmailPage() {
    return <OtpVerificationForm />;
}