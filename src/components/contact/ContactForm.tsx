"use client";

import {
    useRef,
    useState,
    type ChangeEvent,
    type FormEvent,
} from "react";

import {
    AlertCircleIcon,
    ArrowRightIcon,
    CheckCircle2Icon,
    LoaderCircleIcon,
} from "lucide-react";

import toast from "react-hot-toast";

type ContactFieldName =
    | "name"
    | "email"
    | "whatsapp"
    | "inquiryType"
    | "subject"
    | "message"
    | "company";

interface ContactValidationErrors {
    fieldErrors?: Partial<
        Record<
            ContactFieldName,
            string[]
        >
    >;

    formErrors?: string[];
}

interface ContactApiResponse {
    success: boolean;
    message: string;
    submissionId?: string;
    errors?: ContactValidationErrors;
}

interface SubmissionStatus {
    type: "success" | "error";
    message: string;
}

type FieldErrorState = Partial<
    Record<ContactFieldName, string>
>;

const MAXIMUM_MESSAGE_LENGTH = 3000;

const readApiResponse = async (
    response: Response
): Promise<ContactApiResponse> => {
    try {
        return (await response.json()) as ContactApiResponse;
    } catch {
        return {
            success: false,

            message:
                "The server returned an invalid response.",
        };
    }
};

const getFormStringValue = (
    formData: FormData,
    fieldName: string
): string => {
    const value =
        formData.get(fieldName);

    return typeof value === "string"
        ? value
        : "";
};

const getFirstFieldErrors = (
    errors:
        | ContactValidationErrors
        | undefined
): FieldErrorState => {
    if (!errors?.fieldErrors) {
        return {};
    }

    const fieldErrors: FieldErrorState =
        {};

    const fieldNames: ContactFieldName[] =
        [
            "name",
            "email",
            "whatsapp",
            "inquiryType",
            "subject",
            "message",
            "company",
        ];

    fieldNames.forEach(
        (fieldName) => {
            const message =
                errors.fieldErrors?.[
                fieldName
                ]?.[0];

            if (message) {
                fieldErrors[fieldName] =
                    message;
            }
        }
    );

    return fieldErrors;
};

const getInputClassName = (
    hasError: boolean
): string => {
    return [
        "w-full rounded-xl border bg-black/20 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500",

        hasError
            ? "border-red-400/70 focus:border-red-400 focus:ring-2 focus:ring-red-400/20"
            : "border-white/12 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
    ].join(" ");
};

export default function ContactForm() {
    const formRef =
        useRef<HTMLFormElement | null>(
            null
        );

    const statusRef =
        useRef<HTMLDivElement | null>(
            null
        );

    const [
        isSubmitting,
        setIsSubmitting,
    ] = useState(false);

    const [
        fieldErrors,
        setFieldErrors,
    ] = useState<FieldErrorState>(
        {}
    );

    const [
        submissionStatus,
        setSubmissionStatus,
    ] =
        useState<SubmissionStatus | null>(
            null
        );

    const [
        messageLength,
        setMessageLength,
    ] = useState(0);

    const clearFieldError = (
        fieldName: ContactFieldName
    ) => {
        setFieldErrors(
            (currentErrors) => {
                if (
                    !currentErrors[fieldName]
                ) {
                    return currentErrors;
                }

                const nextErrors = {
                    ...currentErrors,
                };

                delete nextErrors[
                    fieldName
                ];

                return nextErrors;
            }
        );

        if (
            submissionStatus?.type ===
            "error"
        ) {
            setSubmissionStatus(null);
        }
    };

    const handleFieldChange = (
        event: ChangeEvent<
            | HTMLInputElement
            | HTMLTextAreaElement
            | HTMLSelectElement
        >
    ) => {
        const fieldName =
            event.target
                .name as ContactFieldName;

        clearFieldError(fieldName);

        if (
            fieldName === "message"
        ) {
            setMessageLength(
                event.target.value.length
            );
        }
    };

    const focusSubmissionStatus = () => {
        window.requestAnimationFrame(
            () => {
                statusRef.current?.focus();
            }
        );
    };

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        const form =
            event.currentTarget;

        const formData =
            new FormData(form);

        const requestBody = {
            name:
                getFormStringValue(
                    formData,
                    "name"
                ),

            email:
                getFormStringValue(
                    formData,
                    "email"
                ),

            whatsapp:
                getFormStringValue(
                    formData,
                    "whatsapp"
                ),

            inquiryType:
                getFormStringValue(
                    formData,
                    "inquiryType"
                ),

            subject:
                getFormStringValue(
                    formData,
                    "subject"
                ),

            message:
                getFormStringValue(
                    formData,
                    "message"
                ),

            company:
                getFormStringValue(
                    formData,
                    "company"
                ),
        };

        setIsSubmitting(true);
        setFieldErrors({});
        setSubmissionStatus(null);

        try {
            const response =
                await fetch(
                    "/api/contact",
                    {
                        method: "POST",

                        credentials:
                            "same-origin",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Accept:
                                "application/json",
                        },

                        body: JSON.stringify(
                            requestBody
                        ),
                    }
                );

            const data =
                await readApiResponse(
                    response
                );

            if (
                !response.ok ||
                !data.success
            ) {
                const apiFieldErrors =
                    getFirstFieldErrors(
                        data.errors
                    );

                setFieldErrors(
                    apiFieldErrors
                );

                const formError =
                    data.errors
                        ?.formErrors?.[0];

                const errorMessage =
                    formError ||
                    data.message ||
                    "Unable to send your inquiry.";

                setSubmissionStatus({
                    type: "error",

                    message:
                        errorMessage,
                });

                toast.error(
                    errorMessage
                );

                focusSubmissionStatus();

                return;
            }

            const successMessage =
                data.message ||
                "Your inquiry has been sent successfully.";

            setSubmissionStatus({
                type: "success",

                message:
                    successMessage,
            });

            formRef.current?.reset();

            setFieldErrors({});
            setMessageLength(0);

            toast.success(
                successMessage
            );

            focusSubmissionStatus();
        } catch (error: unknown) {
            console.error(
                "Contact form submission failed:",
                error
            );

            const errorMessage =
                error instanceof Error
                    ? error.message
                    : "Unable to send your inquiry. Please try again.";

            setSubmissionStatus({
                type: "error",

                message:
                    errorMessage,
            });

            toast.error(
                errorMessage
            );

            focusSubmissionStatus();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form
            ref={formRef}
            onSubmit={handleSubmit}
            noValidate
            className="mt-8 space-y-5"
        >
            <div
                aria-hidden="true"
                className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden"
            >
                <label htmlFor="contact-company">
                    Company website
                </label>

                <input
                    id="contact-company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    onChange={
                        handleFieldChange
                    }
                />
            </div>

            {submissionStatus && (
                <div
                    ref={statusRef}
                    role={
                        submissionStatus.type ===
                            "error"
                            ? "alert"
                            : "status"
                    }
                    aria-live="polite"
                    tabIndex={-1}
                    className={[
                        "flex items-start gap-3 rounded-xl border p-4 outline-none",

                        submissionStatus.type ===
                            "success"
                            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
                            : "border-red-400/25 bg-red-400/10 text-red-200",
                    ].join(" ")}
                >
                    {submissionStatus.type ===
                        "success" ? (
                        <CheckCircle2Icon
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                    ) : (
                        <AlertCircleIcon
                            aria-hidden="true"
                            className="mt-0.5 size-5 shrink-0"
                        />
                    )}

                    <div>
                        <p className="text-sm font-semibold">
                            {submissionStatus.type ===
                                "success"
                                ? "Inquiry sent"
                                : "Inquiry not sent"}
                        </p>

                        <p className="mt-1 text-sm leading-6 opacity-90">
                            {
                                submissionStatus.message
                            }
                        </p>
                    </div>
                </div>
            )}

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="contact-full-name"
                        className="block text-sm font-medium text-zinc-200"
                    >
                        Full Name
                    </label>

                    <input
                        id="contact-full-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={80}
                        placeholder="Enter your full name"
                        aria-invalid={
                            Boolean(
                                fieldErrors.name
                            )
                        }
                        aria-describedby={
                            fieldErrors.name
                                ? "contact-name-error"
                                : undefined
                        }
                        onChange={
                            handleFieldChange
                        }
                        className={getInputClassName(
                            Boolean(
                                fieldErrors.name
                            )
                        )}
                    />

                    {fieldErrors.name && (
                        <p
                            id="contact-name-error"
                            className="flex items-start gap-1.5 text-xs leading-5 text-red-300"
                        >
                            <AlertCircleIcon
                                aria-hidden="true"
                                className="mt-0.5 size-3.5 shrink-0"
                            />

                            {
                                fieldErrors.name
                            }
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="contact-email"
                        className="block text-sm font-medium text-zinc-200"
                    >
                        Email Address
                    </label>

                    <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={120}
                        placeholder="you@example.com"
                        aria-invalid={
                            Boolean(
                                fieldErrors.email
                            )
                        }
                        aria-describedby={
                            fieldErrors.email
                                ? "contact-email-error"
                                : undefined
                        }
                        onChange={
                            handleFieldChange
                        }
                        className={getInputClassName(
                            Boolean(
                                fieldErrors.email
                            )
                        )}
                    />

                    {fieldErrors.email && (
                        <p
                            id="contact-email-error"
                            className="flex items-start gap-1.5 text-xs leading-5 text-red-300"
                        >
                            <AlertCircleIcon
                                aria-hidden="true"
                                className="mt-0.5 size-3.5 shrink-0"
                            />

                            {
                                fieldErrors.email
                            }
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label
                        htmlFor="contact-whatsapp"
                        className="block text-sm font-medium text-zinc-200"
                    >
                        WhatsApp Number{" "}
                        <span className="font-normal text-zinc-500">
                            (optional)
                        </span>
                    </label>

                    <input
                        id="contact-whatsapp"
                        name="whatsapp"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        maxLength={25}
                        placeholder="+880 1XXX-XXXXXX"
                        aria-invalid={
                            Boolean(
                                fieldErrors.whatsapp
                            )
                        }
                        aria-describedby={
                            fieldErrors.whatsapp
                                ? "contact-whatsapp-error"
                                : undefined
                        }
                        onChange={
                            handleFieldChange
                        }
                        className={getInputClassName(
                            Boolean(
                                fieldErrors.whatsapp
                            )
                        )}
                    />

                    {fieldErrors.whatsapp && (
                        <p
                            id="contact-whatsapp-error"
                            className="flex items-start gap-1.5 text-xs leading-5 text-red-300"
                        >
                            <AlertCircleIcon
                                aria-hidden="true"
                                className="mt-0.5 size-3.5 shrink-0"
                            />

                            {
                                fieldErrors.whatsapp
                            }
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="contact-inquiry-type"
                        className="block text-sm font-medium text-zinc-200"
                    >
                        What Are You Interested In?
                    </label>

                    <select
                        id="contact-inquiry-type"
                        name="inquiryType"
                        required
                        defaultValue=""
                        aria-invalid={
                            Boolean(
                                fieldErrors.inquiryType
                            )
                        }
                        aria-describedby={
                            fieldErrors.inquiryType
                                ? "contact-inquiry-type-error"
                                : undefined
                        }
                        onChange={
                            handleFieldChange
                        }
                        className={[
                            getInputClassName(
                                Boolean(
                                    fieldErrors.inquiryType
                                )
                            ),

                            "bg-zinc-950",
                        ].join(" ")}
                    >
                        <option
                            value=""
                            disabled
                        >
                            Select an inquiry
                        </option>

                        <option value="general-service">
                            General Service Inquiry
                        </option>

                        <option value="pricing-plans">
                            Pricing &amp; Plan Information
                        </option>

                        <option value="product-demo">
                            Product Demo / How It Works
                        </option>

                        <option value="thumbnail-requirements">
                            Thumbnail Generation Requirements
                        </option>

                        <option value="team-agency">
                            Team or Agency Solution
                        </option>

                        <option value="bulk-generation">
                            Bulk Thumbnail Generation
                        </option>

                        <option value="business-partnership">
                            Business Partnership
                        </option>

                        <option value="affiliate-collaboration">
                            Affiliate Collaboration
                        </option>

                        <option value="other-sales">
                            Other Sales Inquiry
                        </option>
                    </select>

                    {fieldErrors.inquiryType && (
                        <p
                            id="contact-inquiry-type-error"
                            className="flex items-start gap-1.5 text-xs leading-5 text-red-300"
                        >
                            <AlertCircleIcon
                                aria-hidden="true"
                                className="mt-0.5 size-3.5 shrink-0"
                            />

                            {
                                fieldErrors.inquiryType
                            }
                        </p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <label
                    htmlFor="contact-subject"
                    className="block text-sm font-medium text-zinc-200"
                >
                    Subject
                </label>

                <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    required
                    minLength={3}
                    maxLength={150}
                    placeholder="What would you like to discuss?"
                    aria-invalid={
                        Boolean(
                            fieldErrors.subject
                        )
                    }
                    aria-describedby={
                        fieldErrors.subject
                            ? "contact-subject-error"
                            : undefined
                    }
                    onChange={
                        handleFieldChange
                    }
                    className={getInputClassName(
                        Boolean(
                            fieldErrors.subject
                        )
                    )}
                />

                {fieldErrors.subject && (
                    <p
                        id="contact-subject-error"
                        className="flex items-start gap-1.5 text-xs leading-5 text-red-300"
                    >
                        <AlertCircleIcon
                            aria-hidden="true"
                            className="mt-0.5 size-3.5 shrink-0"
                        />

                        {
                            fieldErrors.subject
                        }
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                    <label
                        htmlFor="contact-message"
                        className="block text-sm font-medium text-zinc-200"
                    >
                        Tell Us About Your Goals
                    </label>

                    <span className="text-xs text-zinc-500">
                        {messageLength}/
                        {
                            MAXIMUM_MESSAGE_LENGTH
                        }
                    </span>
                </div>

                <textarea
                    id="contact-message"
                    name="message"
                    rows={8}
                    required
                    minLength={10}
                    maxLength={
                        MAXIMUM_MESSAGE_LENGTH
                    }
                    placeholder="Tell us about your channel, content niche, publishing frequency, thumbnail volume, team requirements, or the result you want to achieve."
                    aria-invalid={
                        Boolean(
                            fieldErrors.message
                        )
                    }
                    aria-describedby={
                        fieldErrors.message
                            ? "contact-message-error"
                            : "contact-message-help"
                    }
                    onChange={
                        handleFieldChange
                    }
                    className={[
                        getInputClassName(
                            Boolean(
                                fieldErrors.message
                            )
                        ),

                        "resize-y leading-6",
                    ].join(" ")}
                />

                {fieldErrors.message ? (
                    <p
                        id="contact-message-error"
                        className="flex items-start gap-1.5 text-xs leading-5 text-red-300"
                    >
                        <AlertCircleIcon
                            aria-hidden="true"
                            className="mt-0.5 size-3.5 shrink-0"
                        />

                        {
                            fieldErrors.message
                        }
                    </p>
                ) : (
                    <p
                        id="contact-message-help"
                        className="text-xs leading-5 text-zinc-500"
                    >
                        Including your channel niche,
                        monthly video volume, current
                        challenges, and goals will help
                        us understand your requirements.
                    </p>
                )}
            </div>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="max-w-sm text-xs leading-5 text-zinc-500">
                    By submitting this form,
                    you agree that Thumblify
                    may contact you about your
                    service inquiry.
                </p>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex min-w-40 shrink-0 items-center justify-center gap-2 rounded-xl bg-linear-to-b from-pink-500 to-pink-600 px-7 py-3 text-sm font-semibold text-white transition hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {isSubmitting ? (
                        <>
                            <LoaderCircleIcon
                                aria-hidden="true"
                                className="size-4 animate-spin"
                            />

                            Sending...
                        </>
                    ) : (
                        <>
                            Send Inquiry

                            <ArrowRightIcon
                                aria-hidden="true"
                                className="size-4"
                            />
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}