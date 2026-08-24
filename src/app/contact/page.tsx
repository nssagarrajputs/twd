import type { Metadata } from "next";
import { ContactPageSchema } from "@/components/StructuredData";

import PageHero from "@/components/ui/PageHero";
import ProjectInquiry from "./_components/ProjectInquiry";
import WaysToConnect from "./_components/WaysToConnect";
import FAQSection from "@/components/templates/FAQFormat";
import { client } from "@/sanity/client";
import {
    getFAQs,
    META_DATA_WEBPAGE_QUERY,
    type WebpageMetadata,
} from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "contact";

    const metaData = await client.fetch<WebpageMetadata | null>(
        META_DATA_WEBPAGE_QUERY,
        {
            slug,
        },
    );

    const title = metaData?.metaTitle ?? "Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["tecorbitron"];

    return {
        title,
        description,
        keywords,

        alternates: { canonical: `/${slug}` },
        openGraph: {
            type: "website",
            locale: "en_US",
            siteName: "Tecorbitron",
            url: `/${slug}`,
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
    };
}

export default async function Contact() {
    const faqs = await getFAQs("contact");

    return (
        <main>
            <ContactPageSchema />

            <PageHero
                title="Contact Us"
                highlight="Us"
                description="Share your idea and we'll get back to you shortly — free consultation, no strings attached."
            />

            <ProjectInquiry />
            <div className="section-edge-light"></div>

            <WaysToConnect />
            <div className="section-edge-light"></div>

            <FAQSection
                eyebrow="FAQS"
                heading="Before You Reach Out"
                items={faqs}
            />
        </main>
    );
}
