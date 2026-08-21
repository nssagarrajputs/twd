import PageHero from "@/components/ui/PageHero";
import ServiceIntro from "../_components/ServiceIntro";
import ServiceWhatSolutions from "../_components/ServiceWhatSolutions";
import ServiceWhyUs from "../_components/ServiceWhyUs";
import ServiceSandM from "../_components/ServiceSandM";
import ServiceLetsConnect from "../_components/ServiceLetsConnect";
import { serviceSeoAndMarketing } from "@/content/services-data";
import type { Metadata } from "next";
import { SeoServiceSchema } from "@/components/StructuredData";

import { client } from "@/sanity/client";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "seo-and-marketing";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "SEO - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["seo tecorbitron"];

    return {
        title,
        description,
        keywords,

        alternates: { canonical: `/services/${slug}` },
        openGraph: {
            type: "website",
            locale: "en_IN",
            siteName: "Tecorbitron",
            url: `https://www.tecorbitron.com/services/${slug}`,
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
            images: ["/opengraph/og-global.jpg"],
        },
    };
}

export default function page() {
    return (
        <main>
            <SeoServiceSchema />

            <PageHero
                eyebrow="SEO & Digital Growth"
                title="Search Visibility That Drives Real, Qualified Traffic"
                highlight="Qualified Traffic"
                description="From technical SEO and on-page optimisation to local and e-commerce SEO — we build search strategies that bring the right people to your business."
            />

            <ServiceIntro data={serviceSeoAndMarketing.intro} />
            <div className="section-edge-light"></div>

            <ServiceWhatSolutions data={serviceSeoAndMarketing.whatSolutions} />
            <div className="section-edge-light"></div>

            <ServiceSandM data={serviceSeoAndMarketing.sandm} />
            <div className="section-edge-light"></div>

            <ServiceWhyUs data={serviceSeoAndMarketing.whyUs} />
            <div className="section-edge-light"></div>

            <ServiceLetsConnect />
        </main>
    );
}
