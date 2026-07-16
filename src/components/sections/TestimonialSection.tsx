"use client";

import Marquee from "react-fast-marquee";

import TestimonialCard from "@/components/testimonial/TestimonialCard";
import SectionTitle from "@/components/ui/SectionTitle";
import { testimonialsData } from "@/data/testimonials";

export default function TestimonialSection() {
    const repeatedTestimonials = [
        ...testimonialsData,
        ...testimonialsData,
    ];

    return (
        <section
            id="testimonials"
            aria-labelledby="testimonials-heading"
            className="px-4 md:px-16 lg:px-24 xl:px-32"
        >
            <SectionTitle
                text1="Testimonials"
                text2="Loves by creators"
                text3="See how our AI thumbnails are helping channels explode their views."
                headingId="testimonials-heading"
            />

            <Marquee
                gradient
                speed={25}
                gradientColor="#000000"
                className="mx-auto mt-11 max-w-5xl"
            >
                <div className="flex items-center justify-center overflow-hidden py-5">
                    {repeatedTestimonials.map(
                        (testimonial, index) => (
                            <TestimonialCard
                                key={`left-${testimonial.name}-${index}`}
                                index={index}
                                testimonial={testimonial}
                            />
                        )
                    )}
                </div>
            </Marquee>

            <Marquee
                gradient
                speed={25}
                direction="right"
                gradientColor="#000000"
                className="mx-auto max-w-5xl"
            >
                <div className="flex items-center justify-center overflow-hidden py-5">
                    {repeatedTestimonials.map(
                        (testimonial, index) => (
                            <TestimonialCard
                                key={`right-${testimonial.name}-${index}`}
                                index={index}
                                testimonial={testimonial}
                            />
                        )
                    )}
                </div>
            </Marquee>
        </section>
    );
}