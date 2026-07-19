"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useState,
    type FormEvent,
} from "react";

import type {
    AuthApiResponse,
    ForgotPasswordInput,
} from "@/types/auth.types";

const DEFAULT_FORM_DATA: ForgotPasswordInput = {
    email: "",
};

const getFirstFieldError = (
    errors:
        | AuthApiResponse["errors"]
        | undefined,
    fieldName: keyof ForgotPasswordInput
): string => {
    return (
        errors?.[fieldName]?.[0] ??
        ""
    );
};

const MailIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
        >
            <path
                d="M4 6.75h16v10.5H4V6.75Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />

            <path
                d="m4.75 7.5 6.1 4.7a1.85 1.85 0 0 0 2.3 0l6.1-4.7"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const ArrowLeftIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
        >
            <path
                d="M19 12H5m6-6-6 6 6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const LoadingSpinner = () => {
    return (
        <span
            aria-hidden="true"
            className="
                h-5
                w-5
                animate-spin
                rounded-full
                border-2
                border-white/30
                border-t-white
            "
        />
    );
};

const ForgotPasswordForm = () => {
    const router =
        useRouter();

    const [
        formData,
        setFormData,
    ] =
        useState<ForgotPasswordInput>(
            DEFAULT_FORM_DATA
        );

    const [
        emailError,
        setEmailError,
    ] =
        useState("");

    const [
        formError,
        setFormError,
    ] =
        useState("");

    const [
        isSubmitting,
        setIsSubmitting,
    ] =
        useState(false);

    const handleEmailChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData({
            email:
                event.target.value,
        });

        if (emailError) {
            setEmailError("");
        }

        if (formError) {
            setFormError("");
        }
    };

    const validateForm =
        (): boolean => {
            const email =
                formData.email
                    .trim()
                    .toLowerCase();

            if (!email) {
                setEmailError(
                    "Email address is required"
                );

                return false;
            }

            const isValidEmail =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                    email
                );

            if (!isValidEmail) {
                setEmailError(
                    "Please provide a valid email address"
                );

                return false;
            }

            if (
                email.length > 254
            ) {
                setEmailError(
                    "Email address is too long"
                );

                return false;
            }

            return true;
        };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setFormError("");
        setEmailError("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response =
                await fetch(
                    "/api/auth/forgot-password",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        credentials:
                            "include",

                        cache:
                            "no-store",

                        body:
                            JSON.stringify({
                                email:
                                    formData.email
                                        .trim()
                                        .toLowerCase(),
                            }),
                    }
                );

            const data =
                (await response.json().catch(
                    () => null
                )) as
                | AuthApiResponse
                | null;

            if (
                !response.ok ||
                !data?.success
            ) {
                const serverEmailError =
                    getFirstFieldError(
                        data?.errors,
                        "email"
                    );

                if (
                    serverEmailError
                ) {
                    setEmailError(
                        serverEmailError
                    );
                } else {
                    setFormError(
                        data?.message ??
                        "Unable to process your password reset request. Please try again."
                    );
                }

                return;
            }

            /*
             * OTP verification page-এ সম্পূর্ণ email
             * প্রকাশ না করে শুধু temporary browser
             * storage-এ রাখা হচ্ছে।
             *
             * এটি authentication বা authorization-এর
             * জন্য ব্যবহার হবে না।
             */
            sessionStorage.setItem(
                "thumblify_password_reset_email",
                formData.email
                    .trim()
                    .toLowerCase()
            );

            router.push(
                data.redirectTo ??
                "/forgot-password/verify"
            );
        } catch (error) {
            console.error(
                "Forgot password request failed:",
                error
            );

            setFormError(
                "Unable to connect to the server. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="
                w-full
                max-w-md
            "
        >
            <div
                className="
                    rounded-3xl
                    border
                    border-white/10
                    bg-zinc-950/80
                    p-6
                    shadow-2xl
                    shadow-fuchsia-950/20
                    backdrop-blur-xl
                    sm:p-8
                "
            >
                <div
                    className="
                        mb-8
                        text-center
                    "
                >
                    <div
                        className="
                            mx-auto
                            mb-5
                            flex
                            h-14
                            w-14
                            items-center
                            justify-center
                            rounded-2xl
                            border
                            border-fuchsia-400/20
                            bg-gradient-to-br
                            from-pink-500/15
                            to-purple-600/15
                            text-pink-400
                            shadow-lg
                            shadow-fuchsia-950/30
                        "
                    >
                        <MailIcon />
                    </div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-white
                        "
                    >
                        Forgot your password?
                    </h1>

                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-zinc-400
                        "
                    >
                        Enter the email address connected to your
                        Thumblify account. We&apos;ll send you a
                        secure 6-digit reset code.
                    </p>
                </div>

                {formError ? (
                    <div
                        role="alert"
                        className="
                            mb-5
                            rounded-xl
                            border
                            border-red-500/30
                            bg-red-500/10
                            px-4
                            py-3
                            text-sm
                            leading-6
                            text-red-300
                        "
                    >
                        {formError}
                    </div>
                ) : null}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="forgot-password-email"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-zinc-200
                            "
                        >
                            Email Address
                        </label>

                        <div className="relative">
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    left-0
                                    flex
                                    items-center
                                    pl-4
                                    text-zinc-500
                                "
                            >
                                <MailIcon />
                            </span>

                            <input
                                id="forgot-password-email"
                                name="email"
                                type="email"
                                value={
                                    formData.email
                                }
                                onChange={
                                    handleEmailChange
                                }
                                autoComplete="email"
                                autoFocus
                                disabled={
                                    isSubmitting
                                }
                                placeholder="you@example.com"
                                aria-invalid={
                                    Boolean(
                                        emailError
                                    )
                                }
                                aria-describedby={
                                    emailError
                                        ? "forgot-password-email-error"
                                        : undefined
                                }
                                className={`
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    bg-zinc-900/80
                                    pl-12
                                    pr-4
                                    text-sm
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-zinc-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    ${emailError
                                        ? "border-red-500/70 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                                        : "border-white/10 focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/10"
                                    }
                                `}
                            />
                        </div>

                        {emailError ? (
                            <p
                                id="forgot-password-email-error"
                                role="alert"
                                className="
                                    mt-2
                                    text-sm
                                    text-red-400
                                "
                            >
                                {emailError}
                            </p>
                        ) : null}
                    </div>

                    <button
                        type="submit"
                        disabled={
                            isSubmitting
                        }
                        className="
                            flex
                            h-12
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            bg-gradient-to-r
                            from-pink-500
                            via-fuchsia-500
                            to-purple-600
                            px-5
                            text-sm
                            font-semibold
                            text-white
                            shadow-lg
                            shadow-fuchsia-950/40
                            transition
                            hover:brightness-110
                            focus-visible:outline-none
                            focus-visible:ring-4
                            focus-visible:ring-pink-500/25
                            disabled:cursor-not-allowed
                            disabled:opacity-60
                        "
                    >
                        {isSubmitting ? (
                            <>
                                <LoadingSpinner />

                                Sending code...
                            </>
                        ) : (
                            "Send reset code"
                        )}
                    </button>
                </form>

                <div
                    className="
                        mt-7
                        border-t
                        border-white/10
                        pt-6
                        text-center
                    "
                >
                    <Link
                        href="/login"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-sm
                            font-medium
                            text-zinc-400
                            transition
                            hover:text-pink-400
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-pink-500/40
                        "
                    >
                        <ArrowLeftIcon />

                        Back to sign in
                    </Link>
                </div>
            </div>

            <p
                className="
                    mt-5
                    text-center
                    text-xs
                    leading-5
                    text-zinc-600
                "
            >
                For security, we&apos;ll show the same response
                whether or not an account exists for that email.
            </p>
        </div>
    );
};

export default ForgotPasswordForm;