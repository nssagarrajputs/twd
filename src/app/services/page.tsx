import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import FAQFormat from "@/components/templates/FAQFormat";
import CTAFormat from "@/components/templates/CTAFormat";
import Industries from "./_components/Industries";
import MainServices from "./_components/MainServices";
import {
    ServicesPageSchema,
    WebServiceSchema,
    AppServiceSchema,
    EcommerceServiceSchema,
    SeoServiceSchema,
} from "@/components/StructuredData";

import { client } from "@/sanity/client";
import { FAQS_QUERY, META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "services";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "View All Services - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["view all services tecorbitron"];

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

export default async function Services() {
    const webpageSlug = "services";
    const faqs = await client.fetch(FAQS_QUERY, { webpageSlug });

    return (
        <main>
            <ServicesPageSchema />
            <WebServiceSchema />
            <AppServiceSchema />
            <EcommerceServiceSchema />
            <SeoServiceSchema />

            <PageHero
                eyebrow="What We OFFER"
                title="Explore Our Services"
                highlight="Services"
                description="Technical services scoped to your business — not cookie-cutter packages. Work within your timeline and budget."
            />

            <MainServices />
            <div className="section-edge-light"></div>

            <Industries />
            <div className="section-edge-light"></div>

            <FAQFormat
                eyebrow="FAQ"
                heading="Frequently Asked Questions"
                items={faqs}
            />

            <CTAFormat
                eyebrow="NOT SURE WHERE TO BEGIN?"
                heading="We'll help you figure out the best approach."
                highlight="best approach."
                primaryAction={{
                    text: "Discuss Your Project",
                    href: "/contact",
                }}
                secondaryAction={{
                    text: "Explore Our Work",
                    href: "/case-studies",
                }}
            />
        </main>
    );
}
