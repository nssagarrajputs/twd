import PageHero from "@/components/ui/PageHero";
import Intro from "@/app/about/_components/Intro";
import Founder from "@/app/about/_components/Founder";
import Credibility from "@/app/about/_components/Credibility";
import CTAFormat from "@/components/templates/CTAFormat";
import MissionVision from "./_components/MissionVision";
import PricingPolicy from "./_components/PricingPolicy";
import { AboutPageSchema } from "@/components/StructuredData";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "about";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "About Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["about tecorbitron"];

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

export default function About() {
    return (
        <main>
            <AboutPageSchema />

            <PageHero
                eyebrow="who we are"
                title="About Tecorbitron"
                highlight="Tecorbitron"
                description="Discover our journey, mission, and the people behind every project — dedicated to building modern digital products that make a real difference."
            />

            <Intro />

            <MissionVision />

            <div className="section-edge-light"></div>
            <Founder />

            <div className="section-edge-light"></div>
            <Credibility />

            <div className="section-edge-light"></div>
            <PricingPolicy />

            <div className="section-edge-dark"></div>
            <CTAFormat
                eyebrow="Got a Project in Mind?"
                heading="Share your idea and we'll get back to you soon."
                highlight="your idea"
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
