"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    CircleCheckBig,
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
    UserRound,
} from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";
import { useAuth } from "@/context/AuthContext";

interface LoginFormData {
    email: string;
    password: string;
    rememberMe: boolean;
}

const INITIAL_FORM_DATA: LoginFormData = {
    email: "",
    password: "",
    rememberMe: false,
};

export default function LoginForm() {
    const router = useRouter();

    const {
        user,
        isAuthLoading,
        login,
    } = useAuth();

    const [
        formData,
        setFormData,
    ] = useState<LoginFormData>(
        INITIAL_FORM_DATA
    );

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        passwordResetSuccess,
        setPasswordResetSuccess,
    ] = useState(false);

    /*
     * Password reset সফল হওয়ার পরে user এই URL-এ আসবে:
     *
     * /login?passwordReset=success
     *
     * Query parameter পাওয়া গেলে success message দেখানো হবে।
     * এরপর URL থেকে query parameter সরিয়ে দেওয়া হবে, যাতে
     * refresh করলে message আবার না আসে।
     */
    useEffect(() => {
        const searchParams =
            new URLSearchParams(
                window.location.search
            );

        const resetStatus =
            searchParams.get(
                "passwordReset"
            );

        if (
            resetStatus ===
            "success"
        ) {
            setPasswordResetSuccess(
                true
            );

            window.history.replaceState(
                window.history.state,
                "",
                "/login"
            );
        }
    }, []);

    /*
     * Logged-in user login page-এ এলে
     * generate page-এ পাঠানো হবে।
     */
    useEffect(() => {
        if (
            !isAuthLoading &&
            user
        ) {
            router.replace(
                "/generate"
            );
        }
    }, [
        isAuthLoading,
        router,
        user,
    ]);

    const handleInputChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const {
            name,
            value,
            type,
            checked,
        } = event.target;

        setFormData(
            (currentData) => ({
                ...currentData,

                [name]:
                    type ===
                        "checkbox"
                        ? checked
                        : value,
            })
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (
            isSubmitting ||
            isAuthLoading
        ) {
            return;
        }

        const normalizedEmail =
            formData.email
                .trim()
                .toLowerCase();

        if (!normalizedEmail) {
            toast.error(
                "Please enter your email address."
            );

            return;
        }

        if (!formData.password) {
            toast.error(
                "Please enter your password."
            );

            return;
        }

        setIsSubmitting(true);

        try {
            const success =
                await login({
                    email:
                        normalizedEmail,

                    password:
                        formData.password,

                    rememberMe:
                        formData.rememberMe,
                });

            if (success) {
                router.replace(
                    "/generate"
                );

                router.refresh();
            }
        } finally {
            setIsSubmitting(
                false
            );
        }
    };

    return (
        <>
            <SoftBackdrop />

            <main className="flex min-h-screen items-center justify-center px-4 py-10 sm:py-16">
                <section className="w-full max-w-[500px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/85 shadow-2xl shadow-black/40 backdrop-blur-xl">
                    <header className="relative bg-gradient-to-br from-pink-600 via-fuchsia-600 to-purple-700 px-6 py-9 text-center sm:px-10">
                        <Link
                            href="/"
                            aria-label="Back to website"
                            className="absolute left-5 top-5 inline-flex size-10 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white transition hover:bg-black/25"
                        >
                            <ArrowLeft
                                size={20}
                                aria-hidden="true"
                            />
                        </Link>

                        <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-white/20 bg-white/15 shadow-lg backdrop-blur">
                            <UserRound
                                size={38}
                                className="text-white"
                                aria-hidden="true"
                            />
                        </div>

                        <h1 className="mt-5 text-3xl font-bold text-white">
                            Welcome Back
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-white/80 sm:text-base">
                            Sign in to your
                            Thumblify account
                        </p>
                    </header>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="px-6 py-8 sm:px-10 sm:py-10"
                    >
                        {passwordResetSuccess ? (
                            <div
                                role="status"
                                className="mb-6 flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-300"
                            >
                                <CircleCheckBig
                                    size={20}
                                    className="mt-0.5 shrink-0"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-semibold">
                                        Password reset
                                        successful
                                    </p>

                                    <p className="mt-1 text-sm leading-5 text-emerald-200/80">
                                        Your password
                                        has been
                                        updated. Sign
                                        in using your
                                        new password.
                                    </p>
                                </div>
                            </div>
                        ) : null}

                        <div>
                            <label
                                htmlFor="email"
                                className="mb-2 block text-sm font-medium text-zinc-200"
                            >
                                Email Address
                            </label>

                            <div className="flex h-13 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-pink-400/70 focus-within:ring-4 focus-within:ring-pink-500/10">
                                <Mail
                                    size={18}
                                    className="shrink-0 text-zinc-500"
                                    aria-hidden="true"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    maxLength={254}
                                    required
                                    disabled={
                                        isSubmitting
                                    }
                                    className="h-full w-full border-none bg-transparent text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="mt-5">
                            <label
                                htmlFor="password"
                                className="mb-2 block text-sm font-medium text-zinc-200"
                            >
                                Password
                            </label>

                            <div className="flex h-13 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-pink-400/70 focus-within:ring-4 focus-within:ring-pink-500/10">
                                <LockKeyhole
                                    size={18}
                                    className="shrink-0 text-zinc-500"
                                    aria-hidden="true"
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    maxLength={72}
                                    required
                                    disabled={
                                        isSubmitting
                                    }
                                    className="h-full min-w-0 flex-1 border-none bg-transparent text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"
                                />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPassword(
                                            (
                                                currentValue
                                            ) =>
                                                !currentValue
                                        );
                                    }}
                                    disabled={
                                        isSubmitting
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                    className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-zinc-500 transition hover:bg-white/5 hover:text-white disabled:cursor-not-allowed"
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <Eye
                                            size={18}
                                            aria-hidden="true"
                                        />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center justify-between gap-4">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-400">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={
                                        formData.rememberMe
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    disabled={
                                        isSubmitting
                                    }
                                    className="size-4 shrink-0 accent-pink-600"
                                />

                                Remember Me
                            </label>

                            <Link
                                href="/forgot-password"
                                aria-disabled={
                                    isSubmitting
                                }
                                tabIndex={
                                    isSubmitting
                                        ? -1
                                        : undefined
                                }
                                className={`text-sm font-medium text-pink-300 transition hover:text-pink-200 hover:underline ${isSubmitting
                                    ? "pointer-events-none cursor-not-allowed opacity-50"
                                    : ""
                                    }`}
                            >
                                Forgot Password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isAuthLoading
                            }
                            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 px-6 font-semibold text-white shadow-lg shadow-pink-950/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />

                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        <p className="mt-7 text-center text-sm text-zinc-400">
                            Don&apos;t have an
                            account?{" "}
                            <Link
                                href="/register"
                                className="font-medium text-pink-300 transition hover:text-pink-200 hover:underline"
                            >
                                Create Account
                            </Link>
                        </p>

                        <div className="mt-5 text-center">
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-pink-300"
                            >
                                <ArrowLeft
                                    size={16}
                                    aria-hidden="true"
                                />

                                Back to Website
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
}