import type { Metadata } from "next";

import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = {
    title: "Create Account | Thumblify",
    description:
        "Create your Thumblify account and verify your email to start generating professional YouTube thumbnails.",
    robots: {
        index: false,
        follow: false,
        nocache: true,
    },
};

export default function RegisterPage() {
    return <RegisterForm />;
}