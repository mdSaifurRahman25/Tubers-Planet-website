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
    Eye,
    EyeOff,
    LoaderCircle,
    LockKeyhole,
    Mail,
    MessageCircle,
    UserRound,
} from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";
import { useAuth } from "@/context/AuthContext";

interface RegisterFormData {
    name: string;
    email: string;
    whatsappNumber: string;
    password: string;
    acceptedTerms: boolean;
}

const INITIAL_FORM_DATA: RegisterFormData = {
    name: "",
    email: "",
    whatsappNumber: "",
    password: "",
    acceptedTerms: false,
};

export default function RegisterForm() {
    const router = useRouter();

    const {
        user,
        isAuthLoading,
        signUp,
    } = useAuth();

    const [
        formData,
        setFormData,
    ] = useState<RegisterFormData>(
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

    /*
     * Already logged-in user register page-এ এলে
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
                    type === "checkbox"
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

        const normalizedName =
            formData.name
                .trim()
                .replace(/\s+/g, " ");

        const normalizedEmail =
            formData.email
                .trim()
                .toLowerCase();

        const normalizedWhatsappNumber =
            formData.whatsappNumber
                .trim();

        if (
            normalizedName.length <
            2
        ) {
            toast.error(
                "Full name must contain at least 2 characters."
            );

            return;
        }

        if (
            formData.password.length <
            8
        ) {
            toast.error(
                "Password must contain at least 8 characters."
            );

            return;
        }

        if (
            !formData.acceptedTerms
        ) {
            toast.error(
                "You must agree to the Terms and Conditions and Privacy Policy."
            );

            return;
        }

        setIsSubmitting(true);

        try {
            const success =
                await signUp({
                    name:
                        normalizedName,

                    email:
                        normalizedEmail,

                    whatsappNumber:
                        normalizedWhatsappNumber ||
                        undefined,

                    password:
                        formData.password,

                    acceptedTerms:
                        formData.acceptedTerms,
                });

            /*
             * OTP flow-এ AuthContext নিজেই
             * /verify-email page-এ পাঠাবে।
             *
             * এই success block পুরোনো/fallback
             * registration response-এর জন্য।
             */
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
                <section className="w-full max-w-[520px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/85 shadow-2xl shadow-black/40 backdrop-blur-xl">
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
                            Create Account
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-white/80 sm:text-base">
                            Join Thumblify and start creating better thumbnails
                        </p>
                    </header>

                    <form
                        onSubmit={
                            handleSubmit
                        }
                        className="px-6 py-8 sm:px-10 sm:py-10"
                    >
                        <div>
                            <label
                                htmlFor="name"
                                className="mb-2 block text-sm font-medium text-zinc-200"
                            >
                                Full Name
                            </label>

                            <div className="flex h-13 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-pink-400/70 focus-within:ring-4 focus-within:ring-pink-500/10">
                                <UserRound
                                    size={18}
                                    className="shrink-0 text-zinc-500"
                                    aria-hidden="true"
                                />

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="Your full name"
                                    autoComplete="name"
                                    minLength={2}
                                    maxLength={80}
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
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <label
                                    htmlFor="whatsappNumber"
                                    className="block text-sm font-medium text-zinc-200"
                                >
                                    WhatsApp Number
                                </label>

                                <span className="text-xs text-zinc-500">
                                    Optional
                                </span>
                            </div>

                            <div className="flex h-13 items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-pink-400/70 focus-within:ring-4 focus-within:ring-pink-500/10">
                                <MessageCircle
                                    size={18}
                                    className="shrink-0 text-zinc-500"
                                    aria-hidden="true"
                                />

                                <input
                                    id="whatsappNumber"
                                    type="tel"
                                    name="whatsappNumber"
                                    value={
                                        formData.whatsappNumber
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    placeholder="+880 1XXXXXXXXX"
                                    autoComplete="tel"
                                    inputMode="tel"
                                    maxLength={20}
                                    disabled={
                                        isSubmitting
                                    }
                                    className="h-full w-full border-none bg-transparent text-white outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"
                                />
                            </div>

                            <p className="mt-2 text-xs leading-5 text-zinc-500">
                                Include your country code for international numbers.
                            </p>
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
                                    placeholder="Minimum 8 characters"
                                    autoComplete="new-password"
                                    minLength={8}
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
                                            (currentValue) =>
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

                        <label className="mt-6 flex cursor-pointer items-start gap-3 text-sm leading-6 text-zinc-400">
                            <input
                                type="checkbox"
                                name="acceptedTerms"
                                checked={
                                    formData.acceptedTerms
                                }
                                onChange={
                                    handleInputChange
                                }
                                required
                                disabled={
                                    isSubmitting
                                }
                                className="mt-1 size-4 shrink-0 accent-pink-600"
                            />

                            <span>
                                I agree to the{" "}
                                <Link
                                    href="/terms-and-conditions"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-pink-300 transition hover:text-pink-200 hover:underline"
                                >
                                    Terms and Conditions
                                </Link>{" "}
                                and{" "}
                                <Link
                                    href="/privacy-policy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-medium text-pink-300 transition hover:text-pink-200 hover:underline"
                                >
                                    Privacy Policy
                                </Link>
                                .
                            </span>
                        </label>

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

                                    Sending Verification Code...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <p className="mt-7 text-center text-sm text-zinc-400">
                            Already have an account?{" "}
                            <Link
                                href="/login"
                                className="font-medium text-pink-300 transition hover:text-pink-200 hover:underline"
                            >
                                Sign in
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