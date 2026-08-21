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
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "app-development";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "App Development - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["app development tecorbitron"];

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
