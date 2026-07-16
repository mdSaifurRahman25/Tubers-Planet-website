export default function SoftBackdrop() {
    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
            <div className="absolute top-20 left-1/2 h-115 w-245 -translate-x-1/2 rounded-full bg-linear-to-tr from-pink-800/35 to-transparent blur-3xl" />

            <div className="absolute right-12 bottom-10 h-55 w-105 rounded-full bg-linear-to-bl from-red-700/35 to-transparent blur-2xl" />
        </div>
    );
}