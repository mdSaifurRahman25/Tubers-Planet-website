"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useRef,
    useState,
    type ChangeEvent,
    type ClipboardEvent,
    type FormEvent,
    type KeyboardEvent,
} from "react";

import type {
    AuthApiResponse,
    PasswordResetStatusResponse,
} from "@/types/auth.types";

const OTP_LENGTH = 6;
const MAX_OTP_ATTEMPTS = 5;

const createEmptyOtpDigits = (): string[] =>
    Array.from(
        {
            length: OTP_LENGTH,
        },
        () => ""
    );

const getFirstFieldError = (
    errors:
        | AuthApiResponse["errors"]
        | undefined,
    fieldName: string
): string => {
    return (
        errors?.[fieldName]?.[0] ??
        ""
    );
};

const ShieldIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
        >
            <path
                d="M12 3 5.5 5.8v5.4c0 4.1 2.6 7.8 6.5 9.3 3.9-1.5 6.5-5.2 6.5-9.3V5.8L12 3Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />

            <path
                d="m9.3 12 1.8 1.8 3.8-4"
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

const RefreshIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
        >
            <path
                d="M20 11a8 8 0 1 0-2.35 5.65"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
            />

            <path
                d="M20 5v6h-6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const LoadingSpinner = ({
    size = "h-5 w-5",
}: {
    size?: string;
}) => {
    return (
        <span
            aria-hidden="true"
            className={`
                ${size}
                animate-spin
                rounded-full
                border-2
                border-white/30
                border-t-white
            `}
        />
    );
};

const formatCountdown = (
    totalSeconds: number
): string => {
    const safeSeconds =
        Math.max(
            0,
            totalSeconds
        );

    const minutes =
        Math.floor(
            safeSeconds / 60
        );

    const seconds =
        safeSeconds % 60;

    return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
};

const PasswordResetOtpForm = () => {
    const router =
        useRouter();

    const inputRefs =
        useRef<
            Array<HTMLInputElement | null>
        >([]);

    const [
        otpDigits,
        setOtpDigits,
    ] =
        useState<string[]>(
            createEmptyOtpDigits
        );

    const [
        maskedEmail,
        setMaskedEmail,
    ] =
        useState("");

    const [
        resendAvailableAt,
        setResendAvailableAt,
    ] =
        useState<string | null>(
            null
        );

    const [
        resendRemainingSeconds,
        setResendRemainingSeconds,
    ] =
        useState(0);

    const [
        attemptsRemaining,
        setAttemptsRemaining,
    ] =
        useState(
            MAX_OTP_ATTEMPTS
        );

    const [
        isLoadingStatus,
        setIsLoadingStatus,
    ] =
        useState(true);

    const [
        isSubmitting,
        setIsSubmitting,
    ] =
        useState(false);

    const [
        isResending,
        setIsResending,
    ] =
        useState(false);

    const [
        formError,
        setFormError,
    ] =
        useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] =
        useState("");

    const otp =
        otpDigits.join("");

    /*
     * Page load হওয়ার সময় active password-reset
     * request-এর status check করবে।
     */
    useEffect(() => {
        const controller =
            new AbortController();

        const loadPasswordResetStatus =
            async () => {
                try {
                    const response =
                        await fetch(
                            "/api/auth/password-reset-status",
                            {
                                method:
                                    "GET",

                                credentials:
                                    "include",

                                cache:
                                    "no-store",

                                signal:
                                    controller.signal,
                            }
                        );

                    const data =
                        (await response.json().catch(
                            () =>
                                null
                        )) as
                        | PasswordResetStatusResponse
                        | null;

                    if (
                        !response.ok ||
                        !data?.success ||
                        !data.status
                    ) {
                        if (
                            data?.redirectTo
                        ) {
                            router.replace(
                                data.redirectTo
                            );

                            return;
                        }

                        setFormError(
                            data?.message ??
                            "Your password reset session could not be found."
                        );

                        return;
                    }

                    if (
                        data.status
                            .phase ===
                        "set-password"
                    ) {
                        router.replace(
                            data.redirectTo ??
                            "/forgot-password/reset"
                        );

                        return;
                    }

                    setMaskedEmail(
                        data.status
                            .maskedEmail
                    );

                    setResendAvailableAt(
                        data.status
                            .resendAvailableAt
                    );

                    setResendRemainingSeconds(
                        data.status
                            .resendRemainingSeconds
                    );

                    setAttemptsRemaining(
                        data.status
                            .attemptsRemaining
                    );

                    window.setTimeout(
                        () => {
                            inputRefs
                                .current[0]
                                ?.focus();
                        },
                        100
                    );
                } catch (error) {
                    if (
                        error instanceof
                        DOMException &&
                        error.name ===
                        "AbortError"
                    ) {
                        return;
                    }

                    console.error(
                        "Unable to load password reset status:",
                        error
                    );

                    setFormError(
                        "Unable to check your password reset session. Please refresh the page."
                    );
                } finally {
                    if (
                        !controller
                            .signal
                            .aborted
                    ) {
                        setIsLoadingStatus(
                            false
                        );
                    }
                }
            };

        void loadPasswordResetStatus();

        return () => {
            controller.abort();
        };
    }, [router]);

    /*
     * Resend button-এর live countdown।
     */
    useEffect(() => {
        if (
            !resendAvailableAt
        ) {
            setResendRemainingSeconds(
                0
            );

            return;
        }

        const updateCountdown =
            () => {
                const targetTime =
                    new Date(
                        resendAvailableAt
                    ).getTime();

                if (
                    Number.isNaN(
                        targetTime
                    )
                ) {
                    setResendRemainingSeconds(
                        0
                    );

                    return;
                }

                const remainingSeconds =
                    Math.max(
                        0,
                        Math.ceil(
                            (
                                targetTime -
                                Date.now()
                            ) /
                            1000
                        )
                    );

                setResendRemainingSeconds(
                    remainingSeconds
                );
            };

        updateCountdown();

        const intervalId =
            window.setInterval(
                updateCountdown,
                1000
            );

        return () => {
            window.clearInterval(
                intervalId
            );
        };
    }, [resendAvailableAt]);

    const clearMessages = () => {
        if (formError) {
            setFormError("");
        }

        if (successMessage) {
            setSuccessMessage("");
        }
    };

    const distributeDigits = (
        startIndex: number,
        value: string
    ) => {
        const numericValue =
            value
                .replace(/\D/g, "")
                .slice(
                    0,
                    OTP_LENGTH
                );

        if (!numericValue) {
            return;
        }

        const nextDigits = [
            ...otpDigits,
        ];

        let currentIndex =
            startIndex;

        for (
            const digit of numericValue
        ) {
            if (
                currentIndex >=
                OTP_LENGTH
            ) {
                break;
            }

            nextDigits[
                currentIndex
            ] =
                digit;

            currentIndex += 1;
        }

        setOtpDigits(
            nextDigits
        );

        const focusIndex =
            Math.min(
                currentIndex,
                OTP_LENGTH - 1
            );

        window.setTimeout(
            () => {
                inputRefs
                    .current[
                    focusIndex
                ]
                    ?.focus();

                inputRefs
                    .current[
                    focusIndex
                ]
                    ?.select();
            },
            0
        );
    };

    const handleDigitChange = (
        index: number,
        event: ChangeEvent<HTMLInputElement>
    ) => {
        clearMessages();

        const value =
            event.target.value.replace(
                /\D/g,
                ""
            );

        if (
            value.length > 1
        ) {
            distributeDigits(
                index,
                value
            );

            return;
        }

        const nextDigits = [
            ...otpDigits,
        ];

        nextDigits[index] =
            value;

        setOtpDigits(
            nextDigits
        );

        if (
            value &&
            index <
            OTP_LENGTH - 1
        ) {
            inputRefs
                .current[
                index + 1
            ]
                ?.focus();
        }
    };

    const handleDigitKeyDown = (
        index: number,
        event: KeyboardEvent<HTMLInputElement>
    ) => {
        if (
            event.key ===
            "Backspace" &&
            !otpDigits[index] &&
            index > 0
        ) {
            event.preventDefault();

            const nextDigits = [
                ...otpDigits,
            ];

            nextDigits[
                index - 1
            ] =
                "";

            setOtpDigits(
                nextDigits
            );

            inputRefs
                .current[
                index - 1
            ]
                ?.focus();

            return;
        }

        if (
            event.key ===
            "ArrowLeft" &&
            index > 0
        ) {
            event.preventDefault();

            inputRefs
                .current[
                index - 1
            ]
                ?.focus();

            return;
        }

        if (
            event.key ===
            "ArrowRight" &&
            index <
            OTP_LENGTH - 1
        ) {
            event.preventDefault();

            inputRefs
                .current[
                index + 1
            ]
                ?.focus();
        }
    };

    const handleOtpPaste = (
        event: ClipboardEvent<HTMLInputElement>
    ) => {
        event.preventDefault();

        clearMessages();

        const pastedValue =
            event.clipboardData
                .getData("text")
                .replace(/\D/g, "")
                .slice(
                    0,
                    OTP_LENGTH
                );

        if (!pastedValue) {
            return;
        }

        const nextDigits =
            createEmptyOtpDigits();

        pastedValue
            .split("")
            .forEach(
                (
                    digit,
                    index
                ) => {
                    nextDigits[
                        index
                    ] =
                        digit;
                }
            );

        setOtpDigits(
            nextDigits
        );

        const focusIndex =
            Math.min(
                pastedValue.length,
                OTP_LENGTH
            ) - 1;

        window.setTimeout(
            () => {
                inputRefs
                    .current[
                    Math.max(
                        0,
                        focusIndex
                    )
                ]
                    ?.focus();
            },
            0
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setFormError("");
        setSuccessMessage("");

        if (
            !/^\d{6}$/.test(
                otp
            )
        ) {
            setFormError(
                "Please enter the complete 6-digit verification code."
            );

            const firstEmptyIndex =
                otpDigits.findIndex(
                    (digit) =>
                        !digit
                );

            inputRefs
                .current[
                firstEmptyIndex >=
                    0
                    ? firstEmptyIndex
                    : 0
            ]
                ?.focus();

            return;
        }

        setIsSubmitting(true);

        try {
            const response =
                await fetch(
                    "/api/auth/verify-password-reset-otp",
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
                                otp,
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
                if (
                    data?.redirectTo
                ) {
                    router.replace(
                        data.redirectTo
                    );

                    return;
                }

                const otpFieldError =
                    getFirstFieldError(
                        data?.errors,
                        "otp"
                    );

                setFormError(
                    otpFieldError ||
                    data?.message ||
                    "Unable to verify the code. Please try again."
                );

                if (
                    typeof data
                        ?.details
                        ?.attemptsRemaining ===
                    "number"
                ) {
                    setAttemptsRemaining(
                        data.details
                            .attemptsRemaining
                    );
                }

                setOtpDigits(
                    createEmptyOtpDigits()
                );

                window.setTimeout(
                    () => {
                        inputRefs
                            .current[0]
                            ?.focus();
                    },
                    0
                );

                return;
            }

            setSuccessMessage(
                data.message
            );

            router.push(
                data.redirectTo ??
                "/forgot-password/reset"
            );
        } catch (error) {
            console.error(
                "Password reset OTP verification failed:",
                error
            );

            setFormError(
                "Unable to connect to the server. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResendOtp =
        async () => {
            if (
                resendRemainingSeconds >
                0 ||
                isResending ||
                isSubmitting
            ) {
                return;
            }

            setFormError("");
            setSuccessMessage("");
            setIsResending(true);

            try {
                const response =
                    await fetch(
                        "/api/auth/resend-password-reset-otp",
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
                    (await response.json().catch(
                        () => null
                    )) as
                    | AuthApiResponse
                    | null;

                if (
                    !response.ok ||
                    !data?.success
                ) {
                    if (
                        data?.redirectTo
                    ) {
                        router.replace(
                            data.redirectTo
                        );

                        return;
                    }

                    setFormError(
                        data?.message ??
                        "Unable to resend the verification code."
                    );

                    const retryAfterSeconds =
                        data?.details
                            ?.retryAfterSeconds;

                    if (
                        typeof retryAfterSeconds ===
                        "number"
                    ) {
                        setResendRemainingSeconds(
                            retryAfterSeconds
                        );

                        setResendAvailableAt(
                            new Date(
                                Date.now() +
                                retryAfterSeconds *
                                1000
                            ).toISOString()
                        );
                    }

                    return;
                }

                setSuccessMessage(
                    data.message
                );

                if (
                    data.maskedEmail
                ) {
                    setMaskedEmail(
                        data.maskedEmail
                    );
                }

                if (
                    data.resendAvailableAt
                ) {
                    setResendAvailableAt(
                        data.resendAvailableAt
                    );
                }

                if (
                    typeof data.resendRemainingSeconds ===
                    "number"
                ) {
                    setResendRemainingSeconds(
                        data.resendRemainingSeconds
                    );
                }

                setAttemptsRemaining(
                    MAX_OTP_ATTEMPTS
                );

                setOtpDigits(
                    createEmptyOtpDigits()
                );

                window.setTimeout(
                    () => {
                        inputRefs
                            .current[0]
                            ?.focus();
                    },
                    0
                );
            } catch (error) {
                console.error(
                    "Unable to resend password reset OTP:",
                    error
                );

                setFormError(
                    "Unable to connect to the server. Please try again."
                );
            } finally {
                setIsResending(false);
            }
        };

    if (isLoadingStatus) {
        return (
            <div
                className="
                    flex
                    min-h-[420px]
                    w-full
                    max-w-md
                    items-center
                    justify-center
                    rounded-3xl
                    border
                    border-white/10
                    bg-zinc-950/80
                    p-8
                    shadow-2xl
                    shadow-fuchsia-950/20
                    backdrop-blur-xl
                "
            >
                <div
                    className="
                        flex
                        flex-col
                        items-center
                        gap-4
                        text-center
                    "
                >
                    <LoadingSpinner size="h-7 w-7" />

                    <p
                        className="
                            text-sm
                            text-zinc-400
                        "
                    >
                        Checking your password reset request...
                    </p>
                </div>
            </div>
        );
    }

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
                        <ShieldIcon />
                    </div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-white
                        "
                    >
                        Check your email
                    </h1>

                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-zinc-400
                        "
                    >
                        Enter the 6-digit password reset code sent to
                    </p>

                    <p
                        className="
                            mt-1
                            break-all
                            text-sm
                            font-semibold
                            text-pink-400
                        "
                    >
                        {maskedEmail ||
                            "your email address"}
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

                {successMessage ? (
                    <div
                        role="status"
                        className="
                            mb-5
                            rounded-xl
                            border
                            border-emerald-500/30
                            bg-emerald-500/10
                            px-4
                            py-3
                            text-sm
                            leading-6
                            text-emerald-300
                        "
                    >
                        {successMessage}
                    </div>
                ) : null}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    noValidate
                >
                    <fieldset
                        disabled={
                            isSubmitting ||
                            isResending
                        }
                    >
                        <legend className="sr-only">
                            Password reset verification code
                        </legend>

                        <div
                            className="
                                flex
                                justify-center
                                gap-2
                                sm:gap-3
                            "
                            onPaste={
                                handleOtpPaste
                            }
                        >
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
                                        maxLength={
                                            1
                                        }
                                        value={
                                            digit
                                        }
                                        onChange={(
                                            event
                                        ) =>
                                            handleDigitChange(
                                                index,
                                                event
                                            )
                                        }
                                        onKeyDown={(
                                            event
                                        ) =>
                                            handleDigitKeyDown(
                                                index,
                                                event
                                            )
                                        }
                                        autoComplete={
                                            index ===
                                                0
                                                ? "one-time-code"
                                                : "off"
                                        }
                                        aria-label={`Verification code digit ${index +
                                            1
                                            }`}
                                        className="
                                            h-12
                                            w-11
                                            rounded-xl
                                            border
                                            border-white/10
                                            bg-zinc-900/90
                                            text-center
                                            text-xl
                                            font-bold
                                            text-white
                                            outline-none
                                            transition
                                            focus:border-pink-500/80
                                            focus:ring-4
                                            focus:ring-pink-500/10
                                            disabled:cursor-not-allowed
                                            disabled:opacity-60
                                            sm:h-14
                                            sm:w-12
                                            sm:text-2xl
                                        "
                                    />
                                )
                            )}
                        </div>

                        <p
                            className="
                                mt-4
                                text-center
                                text-xs
                                text-zinc-500
                            "
                        >
                            {attemptsRemaining >
                                0
                                ? `${attemptsRemaining} verification attempt${attemptsRemaining ===
                                    1
                                    ? ""
                                    : "s"
                                } remaining`
                                : "No verification attempts remaining"}
                        </p>

                        <button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isResending ||
                                otp.length !==
                                OTP_LENGTH ||
                                attemptsRemaining <=
                                0
                            }
                            className="
                                mt-6
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
                                disabled:opacity-50
                            "
                        >
                            {isSubmitting ? (
                                <>
                                    <LoadingSpinner />

                                    Verifying...
                                </>
                            ) : (
                                "Verify reset code"
                            )}
                        </button>
                    </fieldset>
                </form>

                <div
                    className="
                        mt-6
                        text-center
                    "
                >
                    <p
                        className="
                            text-sm
                            text-zinc-500
                        "
                    >
                        Didn&apos;t receive the code?
                    </p>

                    <button
                        type="button"
                        onClick={
                            handleResendOtp
                        }
                        disabled={
                            isResending ||
                            isSubmitting ||
                            resendRemainingSeconds >
                            0
                        }
                        className="
                            mt-2
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            text-sm
                            font-semibold
                            text-pink-400
                            transition
                            hover:text-pink-300
                            focus-visible:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-pink-500/40
                            disabled:cursor-not-allowed
                            disabled:text-zinc-600
                        "
                    >
                        {isResending ? (
                            <>
                                <LoadingSpinner size="h-4 w-4" />

                                Sending new code...
                            </>
                        ) : resendRemainingSeconds >
                            0 ? (
                            `Resend code in ${formatCountdown(
                                resendRemainingSeconds
                            )}`
                        ) : (
                            <>
                                <RefreshIcon />

                                Resend code
                            </>
                        )}
                    </button>
                </div>

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
                        href="/forgot-password"
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

                        Use another email
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
                The verification code expires after 10 minutes. Never
                share this code with anyone.
            </p>
        </div>
    );
};

export default PasswordResetOtpForm;