import PageHero from "@/components/ui/PageHero";
import ServiceIntro from "../_components/ServiceIntro";
import ServiceWhatSolutions from "../_components/ServiceWhatSolutions";
import ServiceWhyUs from "../_components/ServiceWhyUs";
import ServiceSandM from "../_components/ServiceSandM";
import ServiceLetsConnect from "../_components/ServiceLetsConnect";
import { serviceWebDevelopment } from "@/content/services-data";
import type { Metadata } from "next";
import { WebServiceSchema } from "@/components/StructuredData";

import { client } from "@/sanity/client";
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, { slug: "web-development" });

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
        alternates: { canonical: "/web-development" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/services/web-development",
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
            <WebServiceSchema />

            <PageHero
                eyebrow="Web Development"
                title="Fast, Scalable Websites & Web Apps Built for Growth"
                highlight="Built for Growth"
                description="From landing pages and business websites to custom web apps and portals — we build modern, high-performance web solutions tailored to your goals and budget."
            />

            <ServiceIntro data={serviceWebDevelopment.intro} />
            <div className="section-edge-light"></div>

            <ServiceWhatSolutions data={serviceWebDevelopment.whatSolutions} />
            <div className="section-edge-light"></div>

            <ServiceSandM data={serviceWebDevelopment.sandm} />
            <div className="section-edge-light"></div>

            <ServiceWhyUs data={serviceWebDevelopment.whyUs} />
            <div className="section-edge-light"></div>

            <ServiceLetsConnect />
        </main>
    );
}
