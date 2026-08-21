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
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "web-development";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "Web Development - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["web development tecorbitron"];

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
