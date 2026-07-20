"use client";

import type { PointerEvent } from "react";
import { useRef } from "react";
import Image from "next/image";
import {
    motion,
    useSpring,
} from "motion/react";

interface TiltedImageProps {
    rotateAmplitude?: number;
}

const springConfig = {
    damping: 30,
    stiffness: 100,
    mass: 2,
};

export default function TiltedImage({
    rotateAmplitude = 3,
}: TiltedImageProps) {
    const figureRef =
        useRef<HTMLElement | null>(null);

    const rotateX = useSpring(0, springConfig);
    const rotateY = useSpring(0, springConfig);

    const handlePointerMove = (
        event: PointerEvent<HTMLElement>
    ) => {
        // Touch device-এ tilt effect চালাব না
        if (
            event.pointerType !== "mouse" ||
            !figureRef.current
        ) {
            return;
        }

        const rect =
            figureRef.current.getBoundingClientRect();

        const offsetX =
            event.clientX -
            rect.left -
            rect.width / 2;

        const offsetY =
            event.clientY -
            rect.top -
            rect.height / 2;

        const rotationX =
            (offsetY / (rect.height / 2)) *
            -rotateAmplitude;

        const rotationY =
            (offsetX / (rect.width / 2)) *
            rotateAmplitude;

        rotateX.set(rotationX);
        rotateY.set(rotationY);
    };

    const resetTilt = () => {
        rotateX.set(0);
        rotateY.set(0);
    };

    return (
        <motion.figure
            ref={figureRef}
            onPointerMove={handlePointerMove}
            onPointerLeave={resetTilt}
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
            className="relative mx-auto mt-16 flex w-full max-w-4xl items-center justify-center perspective-[1200px]"
        >
            <motion.div
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                }}
                className="relative w-full max-w-4xl transform-gpu will-change-transform"
            >
                <div className="rounded-[15px] bg-linear-180 from-pink-500 to-transparent p-[1px]">
                    <Image
                        src="/hero_img.png"
                        alt="Thumblify AI thumbnail generator dashboard preview"
                        width={1600}
                        height={900}
                        priority
                        sizes="(max-width: 768px) 100vw, 896px"
                        className="h-auto w-full rounded-[14px]"
                    />
                </div>
            </motion.div>
        </motion.figure>
    );
}