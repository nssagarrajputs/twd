import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CTAFormat from "@/components/templates/CTAFormat";
import { technologyGroups } from "@/content/technologies-data";
import TechStack from "./_components/TechStack";

import { client } from "@/sanity/client";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "technologies";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "Technology & Tools - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["tech stack tecorbitron"];

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

export default function TechnologiesPage() {
    return (
        <main className="bg-bkg-primary">
            <PageHero
                title="Tools & Technologies"
                highlight="Technologies"
                description="We pick the right technology for the right problem — modern frameworks, proven backends, reliable cloud infrastructure, and tools that are built to scale with your business. No unnecessary complexity, no outdated stacks."
            />

            <TechStack groups={technologyGroups} />

            <CTAFormat
                eyebrow="Have a Specific Tech Requirement?"
                heading="We'll build around what works best for your project."
                highlight="best for your project."
                primaryAction={{
                    text: "Start Your Project",
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
