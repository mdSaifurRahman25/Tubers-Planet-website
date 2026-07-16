"use client";

import type { FormEvent } from "react";
import {
    ArrowRightIcon,
    MailIcon,
    UserIcon,
} from "lucide-react";
import { motion } from "motion/react";

import SectionTitle from "@/components/ui/SectionTitle";

export default function ContactSection() {
    const handleSubmit = (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        // Contact API তৈরি করার পর এখানে যুক্ত করব।
    };

    return (
        <section
            id="contact"
            aria-labelledby="contact-heading"
            className="px-4 md:px-16 lg:px-24 xl:px-32"
        >
            <SectionTitle
                text1="Contact"
                text2="Grow your channel"
                text3="Have questions about our AI? Ready to scale your views? Let's talk."
                headingId="contact-heading"
            />

            <form
                onSubmit={handleSubmit}
                className="mx-auto mt-16 grid w-full max-w-2xl gap-3 text-slate-300 sm:grid-cols-2 sm:gap-5"
            >
                {/* Name */}
                <motion.div
                    initial={{
                        y: 150,
                        opacity: 0,
                    }}
                    whileInView={{
                        y: 0,
                        opacity: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 70,
                        mass: 1,
                    }}
                >
                    <label
                        htmlFor="contact-name"
                        className="mb-2 block font-medium"
                    >
                        Your name
                    </label>

                    <div className="flex items-center rounded-lg border border-slate-700 pl-3 focus-within:border-pink-500">
                        <UserIcon
                            aria-hidden="true"
                            className="size-5 shrink-0"
                        />

                        <input
                            id="contact-name"
                            name="name"
                            type="text"
                            autoComplete="name"
                            placeholder="Enter your name"
                            required
                            className="w-full bg-transparent p-3 text-slate-300 outline-none placeholder:text-slate-600"
                        />
                    </div>
                </motion.div>

                {/* Email */}
                <motion.div
                    initial={{
                        y: 150,
                        opacity: 0,
                    }}
                    whileInView={{
                        y: 0,
                        opacity: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 70,
                        mass: 1,
                    }}
                >
                    <label
                        htmlFor="contact-email"
                        className="mb-2 block font-medium"
                    >
                        Email id
                    </label>

                    <div className="flex items-center rounded-lg border border-slate-700 pl-3 focus-within:border-pink-500">
                        <MailIcon
                            aria-hidden="true"
                            className="size-5 shrink-0"
                        />

                        <input
                            id="contact-email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            placeholder="Enter your email"
                            required
                            className="w-full bg-transparent p-3 text-slate-300 outline-none placeholder:text-slate-600"
                        />
                    </div>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{
                        y: 150,
                        opacity: 0,
                    }}
                    whileInView={{
                        y: 0,
                        opacity: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 240,
                        damping: 70,
                        mass: 1,
                    }}
                    className="sm:col-span-2"
                >
                    <label
                        htmlFor="contact-message"
                        className="mb-2 block font-medium"
                    >
                        Message
                    </label>

                    <textarea
                        id="contact-message"
                        name="message"
                        rows={8}
                        placeholder="Enter your message"
                        required
                        className="w-full resize-none rounded-lg border border-slate-700 bg-transparent p-3 text-slate-300 outline-none placeholder:text-slate-600 focus:border-pink-500"
                    />
                </motion.div>

                {/* Submit button */}
                <motion.button
                    type="submit"
                    initial={{
                        y: 150,
                        opacity: 0,
                    }}
                    whileInView={{
                        y: 0,
                        opacity: 1,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 280,
                        damping: 70,
                        mass: 1,
                    }}
                    className="flex w-max items-center gap-2 rounded-full bg-pink-600 px-10 py-3 text-white transition hover:bg-pink-700"
                >
                    Submit

                    <ArrowRightIcon
                        aria-hidden="true"
                        className="size-5"
                    />
                </motion.button>
            </form>
        </section>
    );
}