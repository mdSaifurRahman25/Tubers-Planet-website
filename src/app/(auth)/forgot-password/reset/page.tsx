import type { Metadata } from "next";

import ResetPasswordForm from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
    title: "Create New Password | Thumblify",

    description:
        "Create a new secure password for your Thumblify account.",

    robots: {
        index: false,
        follow: false,
    },
};

const ResetPasswordPage = () => {
    return (
        <main
            className="
                relative
                flex
                min-h-screen
                items-center
                justify-center
                overflow-hidden
                bg-[#07070a]
                px-4
                py-16
                sm:px-6
            "
        >
            {/* Background gradient */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    bg-[radial-gradient(circle_at_top_left,rgba(236,72,153,0.13),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.14),transparent_34%)]
                "
            />

            {/* Top center glow */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -top-40
                    left-1/2
                    h-80
                    w-80
                    -translate-x-1/2
                    rounded-full
                    bg-fuchsia-600/10
                    blur-3xl
                "
            />

            {/* Left pink glow */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-[-120px]
                    top-1/3
                    h-72
                    w-72
                    rounded-full
                    bg-pink-600/10
                    blur-3xl
                "
            />

            {/* Right purple glow */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    bottom-[-140px]
                    right-[-100px]
                    h-80
                    w-80
                    rounded-full
                    bg-purple-600/10
                    blur-3xl
                "
            />

            {/* Subtle background grid */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.035]
                    [background-image:linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)]
                    [background-size:42px_42px]
                "
            />

            <section
                aria-labelledby="reset-password-page-title"
                className="
                    relative
                    z-10
                    flex
                    w-full
                    justify-center
                "
            >
                <h1
                    id="reset-password-page-title"
                    className="sr-only"
                >
                    Create a new password
                </h1>

                <ResetPasswordForm />
            </section>
        </main>
    );
};

export default ResetPasswordPage;