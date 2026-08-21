import PageHero from "@/components/ui/PageHero";
import ByServices from "./_components/ByServices";
import ByIndustries from "./_components/ByIndustries";
import ByCloudAi from "./_components/ByCloudAi";
import CTAFormat from "@/components/templates/CTAFormat";
import ByThirdParty from "./_components/ByThirdParty";

import type { Metadata } from "next";
import { SolutionsPageSchema } from "@/components/StructuredData";

import { client } from "@/sanity/client";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "solutions";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "Solutions - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["solutions tecorbitron"];

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

function Page() {
    return (
        <main>
            <SolutionsPageSchema />

            <PageHero
                title="View All Solutions"
                highlight="Solutions"
                description="From early-stage startups to established enterprises — we build web, app, e-commerce, and custom digital solutions that are scoped to your business and built to deliver results."
            />

            <ByServices />
            <div className="section-edge-light"></div>

            <ByIndustries />
            <div className="section-edge-light"></div>

            <ByCloudAi />
            <div className="section-edge-light"></div>
            <ByThirdParty />

            <CTAFormat
                eyebrow="Can't Find What You're Looking For?"
                heading="Build solution scoped to your business, budget, and timeline."
                highlight="business, budget, and timeline."
                primaryAction={{
                    text: "Build Your Own",
                    href: "/contact",
                }}
                secondaryAction={{
                    text: "Explore Our Services",
                    href: "/services",
                }}
            />
        </main>
    );
}

export default Page;
