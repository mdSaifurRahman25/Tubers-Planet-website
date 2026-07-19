"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    useEffect,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import type {
    AuthApiResponse,
    PasswordResetStatusResponse,
    ResetPasswordInput,
} from "@/types/auth.types";

const DEFAULT_FORM_DATA: ResetPasswordInput = {
    newPassword: "",
    confirmPassword: "",
};

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72;

const getFirstFieldError = (
    errors:
        | AuthApiResponse["errors"]
        | undefined,
    fieldName: keyof ResetPasswordInput
): string => {
    return (
        errors?.[fieldName]?.[0] ??
        ""
    );
};

const LockIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-6 w-6"
        >
            <path
                d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />

            <path
                d="M5.5 10h13v10h-13V10Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />

            <path
                d="M12 14v2.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
};

const PasswordFieldIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
        >
            <path
                d="M7.5 10V7.5a4.5 4.5 0 0 1 9 0V10"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />

            <path
                d="M5.5 10h13v10h-13V10Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />
        </svg>
    );
};

const EyeIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
        >
            <path
                d="M2.8 12s3.2-5 9.2-5 9.2 5 9.2 5-3.2 5-9.2 5-9.2-5-9.2-5Z"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinejoin="round"
            />

            <circle
                cx="12"
                cy="12"
                r="2.2"
                stroke="currentColor"
                strokeWidth="1.7"
            />
        </svg>
    );
};

const EyeOffIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5"
        >
            <path
                d="m3 3 18 18"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />

            <path
                d="M10.6 7.1A9.2 9.2 0 0 1 12 7c6 0 9.2 5 9.2 5a15.7 15.7 0 0 1-2.4 2.8"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />

            <path
                d="M6.1 8.1A15.4 15.4 0 0 0 2.8 12s3.2 5 9.2 5a9.4 9.4 0 0 0 3-.5"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
            />
        </svg>
    );
};

const CheckIcon = () => {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            fill="none"
            className="h-4 w-4"
        >
            <path
                d="m4 10 3.5 3.5L16 5"
                stroke="currentColor"
                strokeWidth="1.8"
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

const ResetPasswordForm = () => {
    const router =
        useRouter();

    const [
        formData,
        setFormData,
    ] =
        useState<ResetPasswordInput>(
            DEFAULT_FORM_DATA
        );

    const [
        maskedEmail,
        setMaskedEmail,
    ] =
        useState("");

    const [
        newPasswordError,
        setNewPasswordError,
    ] =
        useState("");

    const [
        confirmPasswordError,
        setConfirmPasswordError,
    ] =
        useState("");

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

    const [
        showNewPassword,
        setShowNewPassword,
    ] =
        useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] =
        useState(false);

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

    /*
     * New Password page সরাসরি খুললে active এবং
     * authorized password-reset request আছে কি না
     * যাচাই করবে।
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
                            () => null
                        )) as
                        | PasswordResetStatusResponse
                        | null;

                    if (
                        !response.ok ||
                        !data?.success ||
                        !data.status
                    ) {
                        router.replace(
                            data?.redirectTo ??
                            "/forgot-password"
                        );

                        return;
                    }

                    /*
                     * OTP এখনো verify না হলে user সরাসরি
                     * New Password form ব্যবহার করতে পারবে না।
                     */
                    if (
                        data.status.phase !==
                        "set-password"
                    ) {
                        router.replace(
                            data.redirectTo ??
                            "/forgot-password/verify"
                        );

                        return;
                    }

                    setMaskedEmail(
                        data.status.maskedEmail
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
                        "Unable to verify your password reset session. Please refresh the page."
                    );
                } finally {
                    if (
                        !controller.signal
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

    const passwordRequirements = {
        minimumLength:
            formData.newPassword.length >=
            MIN_PASSWORD_LENGTH,

        maximumLength:
            formData.newPassword.length <=
            MAX_PASSWORD_LENGTH,

        passwordsMatch:
            Boolean(
                formData.confirmPassword
            ) &&
            formData.newPassword ===
            formData.confirmPassword,
    };

    const clearGeneralMessages = () => {
        if (formError) {
            setFormError("");
        }

        if (successMessage) {
            setSuccessMessage("");
        }
    };

    const handleNewPasswordChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const value =
            event.target.value;

        setFormData(
            (currentData) => ({
                ...currentData,

                newPassword:
                    value,
            })
        );

        if (newPasswordError) {
            setNewPasswordError("");
        }

        if (confirmPasswordError) {
            setConfirmPasswordError("");
        }

        clearGeneralMessages();
    };

    const handleConfirmPasswordChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const value =
            event.target.value;

        setFormData(
            (currentData) => ({
                ...currentData,

                confirmPassword:
                    value,
            })
        );

        if (confirmPasswordError) {
            setConfirmPasswordError("");
        }

        clearGeneralMessages();
    };

    const validateForm =
        (): boolean => {
            let isValid =
                true;

            setNewPasswordError("");
            setConfirmPasswordError("");

            if (!formData.newPassword) {
                setNewPasswordError(
                    "New password is required"
                );

                isValid =
                    false;
            } else if (
                formData.newPassword
                    .length <
                MIN_PASSWORD_LENGTH
            ) {
                setNewPasswordError(
                    `Password must contain at least ${MIN_PASSWORD_LENGTH} characters`
                );

                isValid =
                    false;
            } else if (
                formData.newPassword
                    .length >
                MAX_PASSWORD_LENGTH
            ) {
                setNewPasswordError(
                    `Password cannot exceed ${MAX_PASSWORD_LENGTH} characters`
                );

                isValid =
                    false;
            }

            if (
                !formData.confirmPassword
            ) {
                setConfirmPasswordError(
                    "Please confirm your new password"
                );

                isValid =
                    false;
            } else if (
                formData.newPassword !==
                formData.confirmPassword
            ) {
                setConfirmPasswordError(
                    "Passwords do not match"
                );

                isValid =
                    false;
            }

            return isValid;
        };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setFormError("");
        setSuccessMessage("");

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response =
                await fetch(
                    "/api/auth/reset-password",
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
                                newPassword:
                                    formData.newPassword,

                                confirmPassword:
                                    formData.confirmPassword,
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
                const serverNewPasswordError =
                    getFirstFieldError(
                        data?.errors,
                        "newPassword"
                    );

                const serverConfirmPasswordError =
                    getFirstFieldError(
                        data?.errors,
                        "confirmPassword"
                    );

                if (
                    serverNewPasswordError
                ) {
                    setNewPasswordError(
                        serverNewPasswordError
                    );
                }

                if (
                    serverConfirmPasswordError
                ) {
                    setConfirmPasswordError(
                        serverConfirmPasswordError
                    );
                }

                if (
                    !serverNewPasswordError &&
                    !serverConfirmPasswordError
                ) {
                    setFormError(
                        data?.message ??
                        "Unable to reset your password. Please try again."
                    );
                }

                if (
                    data?.redirectTo
                ) {
                    router.replace(
                        data.redirectTo
                    );
                }

                return;
            }

            setSuccessMessage(
                data.message
            );

            /*
             * Forgot Password form-এ রাখা temporary
             * email data আর প্রয়োজন নেই।
             */
            sessionStorage.removeItem(
                "thumblify_password_reset_email"
            );

            setFormData(
                DEFAULT_FORM_DATA
            );

            router.replace(
                data.redirectTo ??
                "/login?passwordReset=success"
            );
        } catch (error) {
            console.error(
                "Reset password request failed:",
                error
            );

            setFormError(
                "Unable to connect to the server. Please check your connection and try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoadingStatus) {
        return (
            <div
                className="
                    flex
                    min-h-[480px]
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
                        Verifying your password reset session...
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
                        <LockIcon />
                    </div>

                    <h1
                        className="
                            text-3xl
                            font-bold
                            tracking-tight
                            text-white
                        "
                    >
                        Create a new password
                    </h1>

                    <p
                        className="
                            mt-3
                            text-sm
                            leading-6
                            text-zinc-400
                        "
                    >
                        Choose a secure password for your Thumblify account.
                    </p>

                    {maskedEmail ? (
                        <p
                            className="
                                mt-2
                                break-all
                                text-sm
                                font-semibold
                                text-pink-400
                            "
                        >
                            {maskedEmail}
                        </p>
                    ) : null}
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
                    className="space-y-5"
                >
                    <div>
                        <label
                            htmlFor="new-password"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-zinc-200
                            "
                        >
                            New Password
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
                                <PasswordFieldIcon />
                            </span>

                            <input
                                id="new-password"
                                name="newPassword"
                                type={
                                    showNewPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    formData.newPassword
                                }
                                onChange={
                                    handleNewPasswordChange
                                }
                                autoComplete="new-password"
                                autoFocus
                                disabled={
                                    isSubmitting
                                }
                                placeholder="Enter a new password"
                                aria-invalid={
                                    Boolean(
                                        newPasswordError
                                    )
                                }
                                aria-describedby={
                                    newPasswordError
                                        ? "new-password-error"
                                        : "password-requirements"
                                }
                                className={`
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    bg-zinc-900/80
                                    pl-12
                                    pr-12
                                    text-sm
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-zinc-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    ${newPasswordError
                                        ? "border-red-500/70 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                                        : "border-white/10 focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/10"
                                    }
                                `}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowNewPassword(
                                        (
                                            currentValue
                                        ) =>
                                            !currentValue
                                    )
                                }
                                disabled={
                                    isSubmitting
                                }
                                aria-label={
                                    showNewPassword
                                        ? "Hide new password"
                                        : "Show new password"
                                }
                                className="
                                    absolute
                                    inset-y-0
                                    right-0
                                    flex
                                    items-center
                                    px-4
                                    text-zinc-500
                                    transition
                                    hover:text-pink-400
                                    focus-visible:outline-none
                                    focus-visible:text-pink-400
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {showNewPassword ? (
                                    <EyeOffIcon />
                                ) : (
                                    <EyeIcon />
                                )}
                            </button>
                        </div>

                        {newPasswordError ? (
                            <p
                                id="new-password-error"
                                role="alert"
                                className="
                                    mt-2
                                    text-sm
                                    text-red-400
                                "
                            >
                                {newPasswordError}
                            </p>
                        ) : null}
                    </div>

                    <div>
                        <label
                            htmlFor="confirm-new-password"
                            className="
                                mb-2
                                block
                                text-sm
                                font-medium
                                text-zinc-200
                            "
                        >
                            Confirm New Password
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
                                <PasswordFieldIcon />
                            </span>

                            <input
                                id="confirm-new-password"
                                name="confirmPassword"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                value={
                                    formData.confirmPassword
                                }
                                onChange={
                                    handleConfirmPasswordChange
                                }
                                autoComplete="new-password"
                                disabled={
                                    isSubmitting
                                }
                                placeholder="Re-enter your new password"
                                aria-invalid={
                                    Boolean(
                                        confirmPasswordError
                                    )
                                }
                                aria-describedby={
                                    confirmPasswordError
                                        ? "confirm-new-password-error"
                                        : undefined
                                }
                                className={`
                                    h-12
                                    w-full
                                    rounded-xl
                                    border
                                    bg-zinc-900/80
                                    pl-12
                                    pr-12
                                    text-sm
                                    text-white
                                    outline-none
                                    transition
                                    placeholder:text-zinc-600
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                    ${confirmPasswordError
                                        ? "border-red-500/70 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
                                        : "border-white/10 focus:border-pink-500/70 focus:ring-4 focus:ring-pink-500/10"
                                    }
                                `}
                            />

                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        (
                                            currentValue
                                        ) =>
                                            !currentValue
                                    )
                                }
                                disabled={
                                    isSubmitting
                                }
                                aria-label={
                                    showConfirmPassword
                                        ? "Hide confirmed password"
                                        : "Show confirmed password"
                                }
                                className="
                                    absolute
                                    inset-y-0
                                    right-0
                                    flex
                                    items-center
                                    px-4
                                    text-zinc-500
                                    transition
                                    hover:text-pink-400
                                    focus-visible:outline-none
                                    focus-visible:text-pink-400
                                    disabled:cursor-not-allowed
                                    disabled:opacity-60
                                "
                            >
                                {showConfirmPassword ? (
                                    <EyeOffIcon />
                                ) : (
                                    <EyeIcon />
                                )}
                            </button>
                        </div>

                        {confirmPasswordError ? (
                            <p
                                id="confirm-new-password-error"
                                role="alert"
                                className="
                                    mt-2
                                    text-sm
                                    text-red-400
                                "
                            >
                                {confirmPasswordError}
                            </p>
                        ) : null}
                    </div>

                    <div
                        id="password-requirements"
                        className="
                            rounded-xl
                            border
                            border-white/10
                            bg-zinc-900/50
                            p-4
                        "
                    >
                        <p
                            className="
                                mb-3
                                text-xs
                                font-semibold
                                uppercase
                                tracking-wide
                                text-zinc-500
                            "
                        >
                            Password requirements
                        </p>

                        <div className="space-y-2">
                            <p
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    ${passwordRequirements.minimumLength
                                        ? "text-emerald-400"
                                        : "text-zinc-500"
                                    }
                                `}
                            >
                                <CheckIcon />

                                At least {MIN_PASSWORD_LENGTH} characters
                            </p>

                            <p
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    ${passwordRequirements.maximumLength
                                        ? "text-emerald-400"
                                        : "text-red-400"
                                    }
                                `}
                            >
                                <CheckIcon />

                                No more than {MAX_PASSWORD_LENGTH} characters
                            </p>

                            <p
                                className={`
                                    flex
                                    items-center
                                    gap-2
                                    text-xs
                                    ${passwordRequirements.passwordsMatch
                                        ? "text-emerald-400"
                                        : "text-zinc-500"
                                    }
                                `}
                            >
                                <CheckIcon />

                                Both passwords match
                            </p>
                        </div>
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

                                Updating password...
                            </>
                        ) : (
                            "Reset password"
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
                After resetting your password, all existing login
                sessions will be signed out for security.
            </p>
        </div>
    );
};

export default ResetPasswordForm;