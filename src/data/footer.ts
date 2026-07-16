import type { FooterSection } from "@/types/footer.types";

export const footerData = [
    {
        title: "Product",
        links: [
            {
                name: "Home",
                href: "/",
            },
            {
                name: "Support",
                href: "/#contact",
            },
            {
                name: "Pricing",
                href: "/#pricing",
            },
            {
                name: "Affiliate",
                href: "/#affiliate",
            },
        ],
    },
    {
        title: "Resources",
        links: [
            {
                name: "Company",
                href: "/#company",
            },
            {
                name: "Blogs",
                href: "/#blogs",
            },
            {
                name: "Community",
                href: "/#community",
            },
            {
                name: "Careers",
                href: "/#careers",
            },
            {
                name: "About",
                href: "/#about",
            },
        ],
    },
    {
        title: "Legal",
        links: [
            {
                name: "Privacy",
                href: "/privacy",
            },
            {
                name: "Terms",
                href: "/terms",
            },
        ],
    },
] satisfies FooterSection[];