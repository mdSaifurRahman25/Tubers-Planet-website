export interface Testimonial {
    image: string;
    name: string;
    handle: string;
    date: string;
    quote: string;
}

export interface TestimonialCardProps {
    testimonial: Testimonial;
    index: number;
}