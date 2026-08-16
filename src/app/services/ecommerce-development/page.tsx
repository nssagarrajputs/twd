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
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, { slug: "ecommerce-development" });

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
        alternates: { canonical: "/ecommerce-development" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/services/ecommerce-development",
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
