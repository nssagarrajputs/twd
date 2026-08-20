import type { Metadata } from "next";
import { ContactPageSchema } from "@/components/StructuredData";

import PageHero from "@/components/ui/PageHero";
import ProjectInquiry from "./_components/ProjectInquiry";
import WaysToConnect from "./_components/WaysToConnect";
import FAQSection from "@/components/templates/FAQFormat";
import { client } from "@/sanity/client";
import { FAQS_QUERY, META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "contact";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "Contact - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["contact tecorbitron"];

    return {
        title,
        description,
        keywords,

        alternates: { canonical: `/${slug}` },
        openGraph: {
            type: "website",
            locale: "en_IN",
            siteName: "Tecorbitron",
            url: `https://www.tecorbitron.com/${slug}`,
            images: [
                {
                    url: "/opengraph/og-global.png",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            images: ["/opengraph/og-global.png"],
        },
    };
}

export default async function Contact() {
    const webpageSlug = "contact";
    const faqs = await client.fetch(FAQS_QUERY, { webpageSlug });

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
