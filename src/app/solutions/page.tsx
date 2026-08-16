import PageHero from "@/components/ui/PageHero";
import ByServices from "./_components/ByServices";
import ByIndustries from "./_components/ByIndustries";
import ByCloudAi from "./_components/ByCloudAi";
import CTAFormat from "@/components/templates/CTAFormat";
import ByThirdParty from "./_components/ByThirdParty";

import type { Metadata } from "next";
import { SolutionsPageSchema } from "@/components/StructuredData";

import { client } from "@/sanity/client";
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, {
        slug: "solutions",
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
        alternates: { canonical: "/solutions" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/solutions",
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

function Page() {
    return (
        <main>
            <SolutionsPageSchema />

            <PageHero
                eyebrow="Our Solutions"
                title="Right Solution for Every Business Need"
                highlight="Every Business Need"
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
