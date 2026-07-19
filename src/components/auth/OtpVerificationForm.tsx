"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type ClipboardEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
    ArrowLeft,
    LoaderCircle,
    MailCheck,
    RefreshCw,
    ShieldCheck,
} from "lucide-react";

import SoftBackdrop from "@/components/ui/SoftBackdrop";
import type {
    AuthApiResponse,
    PendingRegistrationStatus,
} from "@/types/auth.types";

const OTP_LENGTH = 6;
const MAX_OTP_ATTEMPTS = 5;

interface PendingRegistrationApiResponse {
    success: boolean;
    message: string;
    status?: PendingRegistrationStatus;
    code?: string;
    redirectTo?: string;
}

interface ResendVerificationApiResponse
    extends AuthApiResponse {
    resendRemainingSeconds?: number;
}

const createEmptyOtp = (): string[] =>
    Array.from(
        {
            length: OTP_LENGTH,
        },
        () => ""
    );

const readJsonResponse = async <T,>(
    response: Response
): Promise<T | null> => {
    try {
        return (await response.json()) as T;
    } catch {
        return null;
    }
};

const parseDateTime = (
    value?: string
): number | null => {
    if (!value) {
        return null;
    }

    const timestamp = Date.parse(value);

    if (Number.isNaN(timestamp)) {
        return null;
    }

    return timestamp;
};

const getRemainingSeconds = (
    targetTime: number | null,
    currentTime: number
): number => {
    if (!targetTime) {
        return 0;
    }

    return Math.max(
        0,
        Math.ceil(
            (targetTime - currentTime) /
            1000
        )
    );
};

const formatCountdown = (
    totalSeconds: number
): string => {
    const minutes = Math.floor(
        totalSeconds / 60
    );

    const seconds =
        totalSeconds % 60;

    return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

const getFirstErrorMessage = (
    data: AuthApiResponse | null
): string => {
    if (!data) {
        return "Invalid response from the server";
    }

    if (data.errors) {
        const firstError =
            Object.values(data.errors)
                .flat()
                .find(Boolean);

        if (firstError) {
            return firstError;
        }
    }

    return (
        data.message ||
        "Something went wrong"
    );
};

export default function OtpVerificationForm() {
    const router = useRouter();

    const inputRefs =
        useRef<
            Array<HTMLInputElement | null>
        >([]);

    const [
        otpDigits,
        setOtpDigits,
    ] = useState<string[]>(
        createEmptyOtp
    );

    const [
        maskedEmail,
        setMaskedEmail,
    ] = useState("");

    const [
        otpExpiresAt,
        setOtpExpiresAt,
    ] = useState<number | null>(
        null
    );

    const [
        resendAvailableAt,
        setResendAvailableAt,
    ] = useState<number | null>(
        null
    );

    const [
        registrationExpiresAt,
        setRegistrationExpiresAt,
    ] = useState<number | null>(
        null
    );

    const [
        attemptsRemaining,
        setAttemptsRemaining,
    ] = useState(
        MAX_OTP_ATTEMPTS
    );

    const [
        isLoadingStatus,
        setIsLoadingStatus,
    ] = useState(true);

    const [
        isVerifying,
        setIsVerifying,
    ] = useState(false);

    const [
        isResending,
        setIsResending,
    ] = useState(false);

    const [
        loadError,
        setLoadError,
    ] = useState("");

    const [
        currentTime,
        setCurrentTime,
    ] = useState(() =>
        Date.now()
    );

    /*
     * Countdown update করার জন্য
     * প্রতি এক সেকেন্ডে current time update হবে।
     */
    useEffect(() => {
        const intervalId =
            window.setInterval(
                () => {
                    setCurrentTime(
                        Date.now()
                    );
                },
                1000
            );

        return () => {
            window.clearInterval(
                intervalId
            );
        };
    }, []);

    /*
     * Registration-এর সময় রাখা masked email
     * status API load হওয়ার আগে fallback হিসেবে দেখাবে।
     */
    useEffect(() => {
        const savedMaskedEmail =
            sessionStorage.getItem(
                "thumblify_pending_masked_email"
            );

        if (savedMaskedEmail) {
            setMaskedEmail(
                savedMaskedEmail
            );
        }
    }, []);

    const loadPendingRegistration =
        useCallback(
            async (): Promise<void> => {
                setIsLoadingStatus(
                    true
                );

                setLoadError("");

                try {
                    const response =
                        await fetch(
                            "/api/auth/pending-registration",
                            {
                                method:
                                    "GET",

                                credentials:
                                    "include",

                                cache:
                                    "no-store",
                            }
                        );

                    const data =
                        await readJsonResponse<PendingRegistrationApiResponse>(
                            response
                        );

                    if (
                        !response.ok ||
                        !data?.success ||
                        !data.status
                    ) {
                        const message =
                            data?.message ||
                            "Unable to load your verification information.";

                        setLoadError(
                            message
                        );

                        if (
                            data?.redirectTo
                        ) {
                            toast.error(
                                message
                            );

                            router.replace(
                                data.redirectTo
                            );
                        }

                        return;
                    }

                    setMaskedEmail(
                        data.status
                            .maskedEmail
                    );

                    sessionStorage.setItem(
                        "thumblify_pending_masked_email",
                        data.status
                            .maskedEmail
                    );

                    setOtpExpiresAt(
                        parseDateTime(
                            data.status
                                .otpExpiresAt
                        )
                    );

                    setResendAvailableAt(
                        parseDateTime(
                            data.status
                                .resendAvailableAt
                        )
                    );

                    setRegistrationExpiresAt(
                        parseDateTime(
                            data.status
                                .expiresAt
                        )
                    );

                    setAttemptsRemaining(
                        data.status
                            .attemptsRemaining
                    );
                } catch (error) {
                    console.error(
                        "Unable to load pending registration:",
                        error
                    );

                    setLoadError(
                        "Unable to connect to the server. Please try again."
                    );
                } finally {
                    setIsLoadingStatus(
                        false
                    );
                }
            },
            [router]
        );

    useEffect(() => {
        void loadPendingRegistration();
    }, [loadPendingRegistration]);

    const otp =
        useMemo(
            () =>
                otpDigits.join(""),
            [otpDigits]
        );

    const otpRemainingSeconds =
        getRemainingSeconds(
            otpExpiresAt,
            currentTime
        );

    const resendRemainingSeconds =
        getRemainingSeconds(
            resendAvailableAt,
            currentTime
        );

    const registrationRemainingSeconds =
        getRemainingSeconds(
            registrationExpiresAt,
            currentTime
        );

    const isOtpComplete =
        otp.length === OTP_LENGTH;

    const isOtpExpired =
        otpExpiresAt !== null &&
        otpRemainingSeconds === 0;

    const isRegistrationExpired =
        registrationExpiresAt !==
        null &&
        registrationRemainingSeconds ===
        0;

    const canVerify =
        isOtpComplete &&
        !isOtpExpired &&
        !isRegistrationExpired &&
        attemptsRemaining > 0 &&
        !isVerifying &&
        !isResending &&
        !isLoadingStatus;

    const canResend =
        resendRemainingSeconds ===
        0 &&
        !isRegistrationExpired &&
        !isResending &&
        !isVerifying &&
        !isLoadingStatus;

    const focusOtpInput = (
        index: number
    ) => {
        const safeIndex =
            Math.min(
                Math.max(index, 0),
                OTP_LENGTH - 1
            );

        inputRefs.current[
            safeIndex
        ]?.focus();

        inputRefs.current[
            safeIndex
        ]?.select();
    };

    const updateOtpFromValue = (
        startIndex: number,
        rawValue: string
    ) => {
        const numericValue =
            rawValue.replace(
                /\D/g,
                ""
            );

        if (!numericValue) {
            setOtpDigits(
                (currentDigits) => {
                    const nextDigits =
                        [
                            ...currentDigits,
                        ];

                    nextDigits[
                        startIndex
                    ] = "";

                    return nextDigits;
                }
            );

            return;
        }

        const incomingDigits =
            numericValue
                .slice(
                    0,
                    OTP_LENGTH -
                    startIndex
                )
                .split("");

        setOtpDigits(
            (currentDigits) => {
                const nextDigits =
                    [
                        ...currentDigits,
                    ];

                incomingDigits.forEach(
                    (
                        digit,
                        offset
                    ) => {
                        nextDigits[
                            startIndex +
                            offset
                        ] = digit;
                    }
                );

                return nextDigits;
            }
        );

        const nextFocusIndex =
            Math.min(
                startIndex +
                incomingDigits.length,
                OTP_LENGTH - 1
            );

        window.setTimeout(
            () => {
                focusOtpInput(
                    nextFocusIndex
                );
            },
            0
        );
    };

    const handleOtpChange = (
        index: number,
        value: string
    ) => {
        updateOtpFromValue(
            index,
            value
        );
    };

    const handleOtpPaste = (
        event: ClipboardEvent<HTMLInputElement>,
        index: number
    ) => {
        event.preventDefault();

        const pastedValue =
            event.clipboardData.getData(
                "text"
            );

        updateOtpFromValue(
            index,
            pastedValue
        );
    };

    const handleOtpKeyDown = (
        event: KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (
            event.key ===
            "Backspace"
        ) {
            if (
                otpDigits[index]
            ) {
                setOtpDigits(
                    (currentDigits) => {
                        const nextDigits =
                            [
                                ...currentDigits,
                            ];

                        nextDigits[
                            index
                        ] = "";

                        return nextDigits;
                    }
                );

                return;
            }

            if (index > 0) {
                setOtpDigits(
                    (currentDigits) => {
                        const nextDigits =
                            [
                                ...currentDigits,
                            ];

                        nextDigits[
                            index - 1
                        ] = "";

                        return nextDigits;
                    }
                );

                focusOtpInput(
                    index - 1
                );
            }

            return;
        }

        if (
            event.key ===
            "ArrowLeft"
        ) {
            event.preventDefault();

            focusOtpInput(
                index - 1
            );

            return;
        }

        if (
            event.key ===
            "ArrowRight"
        ) {
            event.preventDefault();

            focusOtpInput(
                index + 1
            );
        }
    };

    const clearOtpInputs = () => {
        setOtpDigits(
            createEmptyOtp()
        );

        window.setTimeout(
            () => {
                focusOtpInput(0);
            },
            0
        );
    };

    const handleVerify = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!isOtpComplete) {
            toast.error(
                "Please enter the complete 6-digit verification code."
            );

            focusOtpInput(
                otpDigits.findIndex(
                    (digit) =>
                        !digit
                ) === -1
                    ? 0
                    : otpDigits.findIndex(
                        (digit) =>
                            !digit
                    )
            );

            return;
        }

        if (isOtpExpired) {
            toast.error(
                "This verification code has expired. Please request a new code."
            );

            return;
        }

        if (
            attemptsRemaining <= 0
        ) {
            toast.error(
                "You have used all verification attempts. Please request a new code."
            );

            return;
        }

        setIsVerifying(true);

        try {
            const response =
                await fetch(
                    "/api/auth/verify-email",
                    {
                        method:
                            "POST",

                        credentials:
                            "include",

                        headers: {
                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                {
                                    otp,
                                }
                            ),
                    }
                );

            const data =
                await readJsonResponse<AuthApiResponse>(
                    response
                );

            if (
                !response.ok ||
                !data?.success
            ) {
                const message =
                    getFirstErrorMessage(
                        data
                    );

                const remainingAttempts =
                    data?.details
                        ?.attemptsRemaining;

                if (
                    typeof remainingAttempts ===
                    "number"
                ) {
                    setAttemptsRemaining(
                        remainingAttempts
                    );
                }

                if (
                    data?.code ===
                    "OTP_ATTEMPTS_EXCEEDED"
                ) {
                    setAttemptsRemaining(
                        0
                    );
                }

                toast.error(
                    message
                );

                if (
                    data?.redirectTo
                ) {
                    router.replace(
                        data.redirectTo
                    );

                    return;
                }

                if (
                    data?.code ===
                    "INVALID_OTP" ||
                    data?.code ===
                    "OTP_ATTEMPTS_EXCEEDED"
                ) {
                    clearOtpInputs();
                }

                return;
            }

            sessionStorage.removeItem(
                "thumblify_pending_masked_email"
            );

            toast.success(
                data.message
            );

            /*
             * Verify API session cookie তৈরি করেছে।
             * Full navigation দিলে AuthContext নতুন session
             * নিয়ে authenticated user load করবে।
             */
            window.location.assign(
                data.redirectTo ||
                "/generate"
            );
        } catch (error) {
            console.error(
                "Email verification failed:",
                error
            );

            toast.error(
                "Unable to verify your email. Please try again."
            );
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) {
            return;
        }

        setIsResending(true);

        try {
            const response =
                await fetch(
                    "/api/auth/resend-verification",
                    {
                        method:
                            "POST",

                        credentials:
                            "include",

                        cache:
                            "no-store",
                    }
                );

            const data =
                await readJsonResponse<ResendVerificationApiResponse>(
                    response
                );

            if (
                !response.ok ||
                !data?.success
            ) {
                const retryAfterSeconds =
                    data?.details
                        ?.retryAfterSeconds;

                if (
                    typeof retryAfterSeconds ===
                    "number"
                ) {
                    setResendAvailableAt(
                        Date.now() +
                        retryAfterSeconds *
                        1000
                    );
                }

                toast.error(
                    getFirstErrorMessage(
                        data
                    )
                );

                if (
                    data?.redirectTo
                ) {
                    router.replace(
                        data.redirectTo
                    );
                }

                return;
            }

            if (
                data.maskedEmail
            ) {
                setMaskedEmail(
                    data.maskedEmail
                );

                sessionStorage.setItem(
                    "thumblify_pending_masked_email",
                    data.maskedEmail
                );
            }

            setOtpExpiresAt(
                parseDateTime(
                    data.otpExpiresAt
                )
            );

            setResendAvailableAt(
                parseDateTime(
                    data.resendAvailableAt
                )
            );

            setRegistrationExpiresAt(
                parseDateTime(
                    data.expiresAt
                )
            );

            setAttemptsRemaining(
                MAX_OTP_ATTEMPTS
            );

            clearOtpInputs();

            toast.success(
                data.message
            );
        } catch (error) {
            console.error(
                "Unable to resend verification code:",
                error
            );

            toast.error(
                "Unable to resend the verification code. Please try again."
            );
        } finally {
            setIsResending(false);
        }
    };

    if (isLoadingStatus) {
        return (
            <>
                <SoftBackdrop />

                <main className="flex min-h-screen items-center justify-center px-4 py-16">
                    <div className="flex w-full max-w-md flex-col items-center rounded-3xl border border-white/10 bg-zinc-950/80 px-8 py-14 text-center shadow-2xl backdrop-blur-xl">
                        <LoaderCircle
                            size={36}
                            className="animate-spin text-pink-400"
                            aria-hidden="true"
                        />

                        <p className="mt-5 text-sm text-zinc-300">
                            Loading your
                            verification
                            information...
                        </p>
                    </div>
                </main>
            </>
        );
    }

    if (loadError) {
        return (
            <>
                <SoftBackdrop />

                <main className="flex min-h-screen items-center justify-center px-4 py-16">
                    <div className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950/80 px-8 py-12 text-center shadow-2xl backdrop-blur-xl">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-red-500/10 ring-1 ring-red-400/20">
                            <MailCheck
                                size={30}
                                className="text-red-300"
                                aria-hidden="true"
                            />
                        </div>

                        <h1 className="mt-6 text-2xl font-semibold text-white">
                            Verification
                            unavailable
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-zinc-400">
                            {loadError}
                        </p>

                        <button
                            type="button"
                            onClick={() => {
                                void loadPendingRegistration();
                            }}
                            className="mt-7 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-5 font-medium text-white transition hover:opacity-90"
                        >
                            <RefreshCw
                                size={17}
                                aria-hidden="true"
                            />

                            Try Again
                        </button>

                        <Link
                            href="/register"
                            className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-pink-300"
                        >
                            <ArrowLeft
                                size={16}
                                aria-hidden="true"
                            />

                            Back to Sign Up
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <SoftBackdrop />

            <main className="flex min-h-screen items-center justify-center px-4 py-16">
                <section className="w-full max-w-[500px] overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/80 shadow-2xl backdrop-blur-xl">
                    <div className="bg-gradient-to-r from-pink-600 via-fuchsia-600 to-purple-600 px-7 py-8 text-center sm:px-10">
                        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-white/25 bg-black/20 shadow-lg">
                            <ShieldCheck
                                size={32}
                                className="text-white"
                                aria-hidden="true"
                            />
                        </div>

                        <h1 className="mt-5 text-2xl font-bold text-white sm:text-3xl">
                            Verify Your Email
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-white/80">
                            Enter the
                            six-digit code we
                            sent to your email
                        </p>
                    </div>

                    <form
                        onSubmit={
                            handleVerify
                        }
                        className="px-6 py-8 sm:px-10"
                    >
                        <div className="text-center">
                            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-pink-500/10 ring-1 ring-pink-400/20">
                                <MailCheck
                                    size={23}
                                    className="text-pink-300"
                                    aria-hidden="true"
                                />
                            </div>

                            <p className="mt-4 text-sm text-zinc-400">
                                Verification
                                code sent to
                            </p>

                            <p className="mt-1 break-all font-medium text-white">
                                {maskedEmail ||
                                    "your email address"}
                            </p>
                        </div>

                        <div className="mt-8 flex justify-center gap-2 sm:gap-3">
                            {otpDigits.map(
                                (
                                    digit,
                                    index
                                ) => (
                                    <input
                                        key={
                                            index
                                        }
                                        ref={(
                                            element
                                        ) => {
                                            inputRefs.current[
                                                index
                                            ] =
                                                element;
                                        }}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        autoComplete={
                                            index ===
                                                0
                                                ? "one-time-code"
                                                : "off"
                                        }
                                        maxLength={
                                            1
                                        }
                                        value={
                                            digit
                                        }
                                        onChange={(
                                            event
                                        ) => {
                                            handleOtpChange(
                                                index,
                                                event
                                                    .target
                                                    .value
                                            );
                                        }}
                                        onPaste={(
                                            event
                                        ) => {
                                            handleOtpPaste(
                                                event,
                                                index
                                            );
                                        }}
                                        onKeyDown={(
                                            event
                                        ) => {
                                            handleOtpKeyDown(
                                                event,
                                                index
                                            );
                                        }}
                                        disabled={
                                            isVerifying ||
                                            isResending ||
                                            isRegistrationExpired
                                        }
                                        aria-label={`Verification code digit ${index +
                                            1
                                            }`}
                                        className="h-13 w-11 rounded-xl border border-white/10 bg-white/5 text-center text-xl font-bold text-white outline-none transition focus:border-pink-400 focus:bg-pink-500/10 focus:ring-4 focus:ring-pink-500/10 disabled:cursor-not-allowed disabled:opacity-50 sm:h-14 sm:w-13 sm:text-2xl"
                                    />
                                )
                            )}
                        </div>

                        <div
                            aria-live="polite"
                            className="mt-5 text-center text-sm"
                        >
                            {isRegistrationExpired ? (
                                <p className="text-red-300">
                                    Your
                                    registration
                                    session has
                                    expired.
                                </p>
                            ) : isOtpExpired ? (
                                <p className="text-amber-300">
                                    This code has
                                    expired.
                                    Request a new
                                    code below.
                                </p>
                            ) : (
                                <p className="text-zinc-400">
                                    Code expires
                                    in{" "}
                                    <span className="font-semibold text-pink-300">
                                        {formatCountdown(
                                            otpRemainingSeconds
                                        )}
                                    </span>
                                </p>
                            )}

                            <p className="mt-2 text-xs text-zinc-500">
                                Verification
                                attempts
                                remaining:{" "}
                                <span className="font-semibold text-zinc-300">
                                    {
                                        attemptsRemaining
                                    }
                                </span>
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={
                                !canVerify
                            }
                            className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 px-6 font-semibold text-white shadow-lg shadow-pink-950/20 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isVerifying ? (
                                <>
                                    <LoaderCircle
                                        size={
                                            18
                                        }
                                        className="animate-spin"
                                        aria-hidden="true"
                                    />

                                    Verifying...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck
                                        size={
                                            18
                                        }
                                        aria-hidden="true"
                                    />

                                    Verify
                                    Email
                                </>
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-zinc-400">
                                Didn&apos;t
                                receive the
                                code?
                            </p>

                            <button
                                type="button"
                                onClick={() => {
                                    void handleResend();
                                }}
                                disabled={
                                    !canResend
                                }
                                className="mt-2 inline-flex items-center justify-center gap-2 text-sm font-medium text-pink-300 transition hover:text-pink-200 disabled:cursor-not-allowed disabled:text-zinc-600"
                            >
                                {isResending ? (
                                    <>
                                        <LoaderCircle
                                            size={
                                                16
                                            }
                                            className="animate-spin"
                                            aria-hidden="true"
                                        />

                                        Sending...
                                    </>
                                ) : resendRemainingSeconds >
                                    0 ? (
                                    `Resend code in ${formatCountdown(
                                        resendRemainingSeconds
                                    )}`
                                ) : (
                                    <>
                                        <RefreshCw
                                            size={
                                                16
                                            }
                                            aria-hidden="true"
                                        />

                                        Resend
                                        Verification
                                        Code
                                    </>
                                )}
                            </button>
                        </div>

                        <div className="mt-7 border-t border-white/10 pt-6 text-center">
                            <p className="text-xs leading-5 text-zinc-500">
                                Check your spam
                                or junk folder if
                                the email is not
                                in your inbox.
                                Never share your
                                verification code
                                with anyone.
                            </p>

                            <Link
                                href="/register"
                                className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-pink-300"
                            >
                                <ArrowLeft
                                    size={
                                        16
                                    }
                                    aria-hidden="true"
                                />

                                Change Email or
                                Back to Sign Up
                            </Link>
                        </div>
                    </form>
                </section>
            </main>
        </>
    );
}