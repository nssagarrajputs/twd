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
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, { slug: "seo-and-marketing" });

    const title = page?.metaTitle ?? "Tecorbitron";
    const description =
        page?.metaDescription ?? "Best IT Services and Development Company.";
    const keywords = page?.keywords ?? [
        "tecorbitron",
        "web development company",
        "app development company",
        "information technology (it) company",
    ];

    return {
        title,
        description,
        keywords,
        alternates: { canonical: "/seo-and-marketing" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/services/seo-and-marketing",
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
            title,
            description,
            images: ["/opengraph/og-global.png"],
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
