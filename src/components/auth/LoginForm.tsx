"use client";

import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    LockKeyhole,
    Mail,
    UserRound,
} from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";
import { useAuth } from "@/context/AuthContext";

type AuthMode = "login" | "register";

interface FormData {
    name: string;
    email: string;
    password: string;
}

const initialFormData: FormData = {
    name: "",
    email: "",
    password: "",
};

export default function LoginForm() {
    const router = useRouter();

    const {
        user,
        isAuthLoading,
        login,
        signUp,
    } = useAuth();

    const [mode, setMode] = useState<AuthMode>("login");
    const [formData, setFormData] =
        useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isAuthLoading && user) {
            router.replace("/");
        }
    }, [isAuthLoading, router, user]);

    const handleChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        setIsSubmitting(true);

        try {
            const success =
                mode === "login"
                    ? await login({
                        email: formData.email,
                        password: formData.password,
                    })
                    : await signUp({
                        name: formData.name,
                        email: formData.email,
                        password: formData.password,
                    });

            if (success) {
                router.replace("/");
                router.refresh();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleMode = () => {
        setMode((currentMode) =>
            currentMode === "login" ? "register" : "login"
        );

        setFormData(initialFormData);
    };

    const handleForgotPassword = () => {
        toast("Password reset will be added later.");
    };

    return (
        <>
            <SoftBackdrop />

            <main className="flex min-h-screen items-center justify-center px-4 py-16">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-[350px] rounded-2xl border border-white/10 bg-white/6 px-8 text-center"
                >
                    <h1 className="mt-10 text-3xl font-medium text-white">
                        {mode === "login" ? "Login" : "Sign up"}
                    </h1>

                    <p className="mt-2 text-sm text-gray-400">
                        {mode === "login"
                            ? "Please sign in to continue"
                            : "Create your account to continue"}
                    </p>

                    {mode === "register" && (
                        <div className="mt-6 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full bg-white/5 pl-6 ring-2 ring-white/10 transition-all focus-within:ring-pink-500/60">
                            <UserRound
                                size={16}
                                className="shrink-0 text-white/60"
                                aria-hidden="true"
                            />

                            <input
                                type="text"
                                name="name"
                                autoComplete="name"
                                placeholder="Name"
                                value={formData.name}
                                onChange={handleChange}
                                minLength={2}
                                maxLength={80}
                                required
                                disabled={isSubmitting}
                                className="w-full border-none bg-transparent text-white outline-none placeholder:text-white/60 disabled:cursor-not-allowed"
                            />
                        </div>
                    )}

                    <div
                        className={`flex h-12 w-full items-center gap-2 overflow-hidden rounded-full bg-white/5 pl-6 ring-2 ring-white/10 transition-all focus-within:ring-pink-500/60 ${mode === "login" ? "mt-6" : "mt-4"
                            }`}
                    >
                        <Mail
                            size={15}
                            className="shrink-0 text-white/75"
                            aria-hidden="true"
                        />

                        <input
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                            maxLength={254}
                            required
                            disabled={isSubmitting}
                            className="w-full border-none bg-transparent text-white outline-none placeholder:text-white/60 disabled:cursor-not-allowed"
                        />
                    </div>

                    <div className="mt-4 flex h-12 w-full items-center gap-2 overflow-hidden rounded-full bg-white/5 pl-6 ring-2 ring-white/10 transition-all focus-within:ring-pink-500/60">
                        <LockKeyhole
                            size={15}
                            className="shrink-0 text-white/75"
                            aria-hidden="true"
                        />

                        <input
                            type="password"
                            name="password"
                            autoComplete={
                                mode === "login"
                                    ? "current-password"
                                    : "new-password"
                            }
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            minLength={mode === "register" ? 8 : 1}
                            maxLength={72}
                            required
                            disabled={isSubmitting}
                            className="w-full border-none bg-transparent text-white outline-none placeholder:text-white/60 disabled:cursor-not-allowed"
                        />
                    </div>

                    {mode === "login" && (
                        <div className="mt-4 text-left">
                            <button
                                type="button"
                                onClick={handleForgotPassword}
                                className="text-sm text-pink-400 hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting || isAuthLoading}
                        className="mt-2 h-11 w-full rounded-full bg-pink-600 text-white transition hover:bg-pink-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSubmitting
                            ? mode === "login"
                                ? "Logging in..."
                                : "Creating account..."
                            : mode === "login"
                                ? "Login"
                                : "Sign up"}
                    </button>

                    <button
                        type="button"
                        onClick={toggleMode}
                        disabled={isSubmitting}
                        className="mt-3 mb-11 text-sm text-gray-400 disabled:cursor-not-allowed"
                    >
                        {mode === "login"
                            ? "Don't have an account?"
                            : "Already have an account?"}

                        <span className="ml-1 text-pink-400 hover:underline">
                            Click here
                        </span>
                    </button>
                </form>
            </main>
        </>
    );
}