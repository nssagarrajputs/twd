import PageHero from "@/components/ui/PageHero";
import ServiceIntro from "../_components/ServiceIntro";
import ServiceWhatSolutions from "../_components/ServiceWhatSolutions";
import ServiceWhyUs from "../_components/ServiceWhyUs";
import ServiceSandM from "../_components/ServiceSandM";
import ServiceLetsConnect from "../_components/ServiceLetsConnect";
import { serviceAppDevelopment } from "@/content/services-data";
import type { Metadata } from "next";
import { AppServiceSchema } from "@/components/StructuredData";

import { client } from "@/sanity/client";
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, {
        slug: "app-development",
    });

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
        alternates: { canonical: "/app-development" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/services/app-development",
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
            <AppServiceSchema />

            <PageHero
                eyebrow="App Development"
                title="Mobile Apps Built to Perform on Every Platform"
                highlight="on Every Platform"
                description="From Android and iOS to cross-platform apps — we build mobile products that are fast, reliable, and built around your users and business goals."
            />
            <ServiceIntro data={serviceAppDevelopment.intro} />
            <div className="section-edge-light"></div>
            <ServiceWhatSolutions data={serviceAppDevelopment.whatSolutions} />

            <div className="section-edge-light"></div>
            <ServiceSandM data={serviceAppDevelopment.sandm} />
            <div className="section-edge-light"></div>
            <ServiceWhyUs data={serviceAppDevelopment.whyUs} />
            <div className="section-edge-light"></div>
            <ServiceLetsConnect />
        </main>
    );
}
