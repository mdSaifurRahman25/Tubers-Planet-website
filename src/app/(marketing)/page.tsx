import type { Metadata } from "next";

import FeaturesSection from "@/components/sections/FeaturesSection";
import HeroSection from "@/components/sections/HeroSection";
import PricingSection from "@/components/sections/PricingSection";
import TestimonialSection from "@/components/sections/TestimonialSection";
import ContactSection from "@/components/sections/ContactSection";
import CTASection from "@/components/sections/CTASection";

export const metadata: Metadata = {
    title: "AI YouTube Thumbnail Generator",
    description:
        "Create professional, high-converting YouTube thumbnails with Thumblify's AI-powered thumbnail generator.",
};

export default function HomePage() {
    return (
        <main>
            <HeroSection />
            <FeaturesSection />
            <TestimonialSection />
            <PricingSection />
            <ContactSection />
            <CTASection />
        </main>
    );
}