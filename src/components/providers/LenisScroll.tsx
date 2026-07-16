"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisScroll() {
    useEffect(() => {
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (prefersReducedMotion) {
            return;
        }

        const lenis = new Lenis({
            duration: 1.2,
            smoothWheel: true,
            autoRaf: false,

            // Fixed navbar-এর নিচে anchor section দেখাবে
            anchors: {
                offset: -100,
            },
        });

        let animationFrameId = 0;

        const updateScroll = (time: number) => {
            lenis.raf(time);

            animationFrameId =
                window.requestAnimationFrame(updateScroll);
        };

        animationFrameId =
            window.requestAnimationFrame(updateScroll);

        return () => {
            window.cancelAnimationFrame(animationFrameId);
            lenis.destroy();
        };
    }, []);

    return null;
}