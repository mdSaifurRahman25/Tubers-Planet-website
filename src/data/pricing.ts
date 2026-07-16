import type { PricingPlan } from "@/types/pricing.types";

export const pricingData = [
    {
        name: "Basic",
        price: 29,
        period: "month",
        features: [
            "50 AI Thumbnails/mo",
            "Basic Templates",
            "Standard Resolution",
            "No Watermark",
            "Email Support",
        ],
        mostPopular: false,
    },
    {
        name: "Pro",
        price: 79,
        period: "month",
        features: [
            "Unlimited AI Thumbnails",
            "Premium Templates",
            "4k Resolution",
            "A/B Testing Tools",
            "Priority Support",
            "Custom Fonts",
            "Brand Kit Analysis",
        ],
        mostPopular: true,
    },
    {
        name: "Enterprise",
        price: 199,
        period: "month",
        features: [
            "Everything in Pro",
            "API Access",
            "Team Collaboration",
            "Custom Branding",
            "Dedicated Account Manager",
        ],
        mostPopular: false,
    },
] satisfies PricingPlan[];