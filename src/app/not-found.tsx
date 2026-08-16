import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Page Not Found — Tecorbitron",
    description:
        "This page doesn't exist or has moved. Head back home or get in touch — we'll help you find what you're looking for.",
    robots: { index: false, follow: true },
};

export default function NotFound() {
    return (
        <main className="flex-center side-layout-spacing relative min-h-screen w-full flex-col">
            {/* Radial glow */}
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    background:
                        "radial-gradient(ellipse 80% 60% at 50% 40%, #00d06050 0%, transparent 80%)",
                }}
            />

            {/* Grid */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.2]"
                style={{
                    backgroundImage:
                        "linear-gradient(#ffffff20 1px, transparent 1px), linear-gradient(90deg, #ffffff20 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                }}
            />

            {/* Giant 404 background text */}
            <div
                className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center select-none"
                aria-hidden
            >
                <span
                    className="text-malachite/10 leading-none font-black"
                    style={{ fontSize: "clamp(180px, 40vw, 420px)" }}
                >
                    404
                </span>
            </div>

            {/* Content */}
            <div className="relative z-50 flex max-w-xl flex-col items-center gap-6 text-center">
                <div className="dark">
                    <span className="eyebrow mx-auto">Error 404</span>
                    <h1 className="display-page-heading mt-4 mb-8">
                        Lost In <span className="text-malachite">Orbit</span>
                    </h1>
                    <p className="display-subtitle">
                        {
                            "The page you're looking for doesn't exist or has been moved. Lets get you back on track."
                        }
                    </p>
                </div>

                <div className="mt-12 flex items-center gap-6 max-sm:flex-col">
                    <Link href={"/"} className="brand-btn-primary">
                        Back To Home
                    </Link>
                    <Link href={"/contact"} className="brand-btn-secondary">
                        Contact Us
                    </Link>
                </div>
            </div>
        </main>
    );
}
