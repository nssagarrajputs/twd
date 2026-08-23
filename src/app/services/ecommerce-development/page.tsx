import PageHero from "@/components/ui/PageHero";
import ServiceIntro from "../_components/ServiceIntro";
import ServiceWhatSolutions from "../_components/ServiceWhatSolutions";
import ServiceWhyUs from "../_components/ServiceWhyUs";
import ServiceSandM from "../_components/ServiceSandM";
import ServiceLetsConnect from "../_components/ServiceLetsConnect";
import { serviceEcommerceDevelopment } from "@/content/services-data";
import type { Metadata } from "next";
import { EcommerceServiceSchema } from "@/components/StructuredData";

import { client } from "@/sanity/client";
import {
    META_DATA_WEBPAGE_QUERY,
    type WebpageMetadata,
} from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "ecommerce-development";

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

export default function page() {
    return (
        <main>
            <EcommerceServiceSchema />

            <PageHero
                eyebrow="E-Commerce Development"
                title="Online Stores Built to Sell — Fast, Smart & Scalable"
                highlight="Fast, Smart & Scalable"
                description="From Shopify and WooCommerce to fully custom stores — we build e-commerce solutions that convert visitors into customers and scale with your business."
            />

            <ServiceIntro data={serviceEcommerceDevelopment.intro} />
            <div className="section-edge-light"></div>

            <ServiceWhatSolutions
                data={serviceEcommerceDevelopment.whatSolutions}
            />
            <div className="section-edge-light"></div>

            <ServiceSandM data={serviceEcommerceDevelopment.sandm} />
            <div className="section-edge-light"></div>

            <ServiceWhyUs data={serviceEcommerceDevelopment.whyUs} />
            <div className="section-edge-light"></div>

            <ServiceLetsConnect />
        </main>
    );
}
