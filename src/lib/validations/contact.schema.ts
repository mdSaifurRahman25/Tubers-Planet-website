import { z } from "zod";

export const contactInquiryTypes = [
    "general-service",
    "pricing-plans",
    "product-demo",
    "thumbnail-requirements",
    "team-agency",
    "bulk-generation",
    "business-partnership",
    "affiliate-collaboration",
    "other-sales",
] as const;

export type ContactInquiryType =
    (typeof contactInquiryTypes)[number];

export const contactInquiryLabels: Record<
    ContactInquiryType,
    string
> = {
    "general-service":
        "General Service Inquiry",

    "pricing-plans":
        "Pricing & Plan Information",

    "product-demo":
        "Product Demo / How It Works",

    "thumbnail-requirements":
        "Thumbnail Generation Requirements",

    "team-agency":
        "Team or Agency Solution",

    "bulk-generation":
        "Bulk Thumbnail Generation",

    "business-partnership":
        "Business Partnership",

    "affiliate-collaboration":
        "Affiliate Collaboration",

    "other-sales":
        "Other Sales Inquiry",
};

const normalizeSingleLineText = (
    value: string
): string => {
    return value
        .trim()
        .replace(/\s+/g, " ");
};

const normalizeMessageText = (
    value: string
): string => {
    return value
        .trim()
        .replace(/\r\n/g, "\n")
        .replace(/\r/g, "\n")
        .replace(/\n{3,}/g, "\n\n");
};

const whatsappSchema = z
    .string()
    .trim()
    .max(
        25,
        "WhatsApp number cannot exceed 25 characters"
    )
    .refine(
        (value) => {
            if (value.length === 0) {
                return true;
            }

            return /^[+\d][\d\s\-()]{6,24}$/.test(
                value
            );
        },
        {
            message:
                "Please enter a valid WhatsApp number",
        }
    )
    .transform((value) =>
        value.length > 0
            ? value
            : undefined
    );

export const contactFormSchema = z
    .object({
        name: z
            .string({
                error:
                    "Full name is required",
            })
            .trim()
            .min(
                2,
                "Full name must contain at least 2 characters"
            )
            .max(
                80,
                "Full name cannot exceed 80 characters"
            )
            .transform(
                normalizeSingleLineText
            ),

        email: z
            .string({
                error:
                    "Email address is required",
            })
            .trim()
            .min(
                1,
                "Email address is required"
            )
            .max(
                120,
                "Email address cannot exceed 120 characters"
            )
            .email(
                "Please enter a valid email address"
            )
            .transform((value) =>
                value.toLowerCase()
            ),

        whatsapp:
            whatsappSchema.optional(),

        inquiryType: z.enum(
            contactInquiryTypes,
            {
                error:
                    "Please select what you would like to discuss",
            }
        ),

        subject: z
            .string({
                error:
                    "Subject is required",
            })
            .trim()
            .min(
                3,
                "Subject must contain at least 3 characters"
            )
            .max(
                150,
                "Subject cannot exceed 150 characters"
            )
            .transform(
                normalizeSingleLineText
            ),

        message: z
            .string({
                error:
                    "Message is required",
            })
            .trim()
            .min(
                10,
                "Message must contain at least 10 characters"
            )
            .max(
                3000,
                "Message cannot exceed 3000 characters"
            )
            .transform(
                normalizeMessageText
            ),

        company: z
            .string()
            .trim()
            .max(
                200,
                "Invalid form submission"
            )
            .optional()
            .default(""),
    })
    .strict();

export type ContactFormInput =
    z.input<
        typeof contactFormSchema
    >;

export type ContactFormData =
    z.output<
        typeof contactFormSchema
    >;

export const isContactSpamSubmission = (
    data: Pick<
        ContactFormData,
        "company"
    >
): boolean => {
    return data.company.length > 0;
};