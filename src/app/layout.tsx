import "./globals.css";
import { Mulish } from "next/font/google";
import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { GoogleTagManager } from "@next/third-parties/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
import { GlobalSchema } from "@/components/StructuredData";
import { client } from "@/sanity/client";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug: "global",
    });

    const title = metaData?.metaTitle ?? "Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["tecorbitron"];

    return {
        metadataBase: new URL("https://www.tecorbitron.com"),

        title,
        description,
        keywords,

        authors: [{ name: "Tecorbitron Solutions Private Limited" }],
        creator: "Tecorbitron Solutions Private Limited",
        publisher: "Tecorbitron Solutions Private Limited",

        alternates: {
            canonical: "/",
        },

        icons: {
            icon: [
                { url: "/favicon.ico", sizes: "any" },
                {
                    url: "/favicon-16x16.png",
                    sizes: "16x16",
                    type: "image/png",
                },
                {
                    url: "/favicon-32x32.png",
                    sizes: "32x32",
                    type: "image/png",
                },
                {
                    url: "/favicon-48x48.png",
                    sizes: "48x48",
                    type: "image/png",
                },
            ],
            apple: [
                {
                    url: "/apple-touch-icon.png",
                    sizes: "180x180",
                    type: "image/png",
                },
            ],
        },

        openGraph: {
            type: "website",
            locale: "en_US",
            url: "/",
            siteName: "Tecorbitron",
            title,
            description,
            images: [
                {
                    url: "/opengraph/og-global.jpg",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/opengraph/og-global.jpg"],
        },

        category: "technology",
        manifest: "/site.webmanifest",

        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1,
            },
        },
    };
}

const sans = Mulish({
    subsets: ["latin"],
    display: "swap",
    weight: ["300", "400", "600", "700", "800"],
    variable: "--font-sans",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
            {process.env.NEXT_PUBLIC_GTM_ID && (
                <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
            )}
            <body className={`${sans.variable}`}>
                <GlobalSchema />
                <SpeedInsights />
                <Analytics />
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
