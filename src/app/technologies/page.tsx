import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import CTAFormat from "@/components/templates/CTAFormat";
import { technologyGroups } from "@/content/technologies-data";
import TechStack from "./_components/TechStack";

import { client } from "@/sanity/client";
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, {
        slug: "technologies",
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
        alternates: { canonical: "/technologies" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/technologies",
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

export default function TechnologiesPage() {
    return (
        <main className="bg-bkg-primary">
            <PageHero
                eyebrow="Tools & Tech"
                title="The Stack Behind Every Project"
                highlight="Every Project"
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
