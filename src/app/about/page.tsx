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
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, { slug: "about" });

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
        alternates: { canonical: "/about" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/about",
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
