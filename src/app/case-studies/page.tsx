import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/ui/PageHero";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";

import type { Metadata } from "next";
import DefProjectThumbnail from "@/assets/other/default-thumbnail.webp";
import { CaseStudiesPageSchema } from "@/components/StructuredData";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "case-studies";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "Case Studies - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["case studies tecorbitron"];

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

export type Project = {
    title: string;
    slug: string;
    thumbnail: string | null;
    techStack: string[];
};

const PORTFOLIO_LIST_QUERY = groq`
  *[_type == "caseStudy"] | order(completedAt desc) {
    title,
    "slug": slug.current,
    "thumbnail": thumbnail.asset->url,
    "techStack": techStack[]->name,
  }
`;

export default async function PortfolioPage() {
    const projects = await client.fetch<Project[]>(PORTFOLIO_LIST_QUERY);

    return (
        <main>
            <CaseStudiesPageSchema />

            <PageHero
                eyebrow="Case Studies"
                title="Projects That Matter"
                highlight="That Matter"
                description="A curated selection of our work across web, mobile, software, and AI — each project measured by real business outcomes."
            />

            <section className="side-layout-spacing dark py-24">
                <div className="side-breathing mx-auto max-w-7xl">
                    {projects.length === 0 ? (
                        <div className="flex-vertical items-center gap-4 text-center">
                            <span className="text-d1">🚧</span>
                            <h2 className="text-ink-primary text-h2 font-medium">
                                Projects Coming Soon
                            </h2>
                            <p className="text-ink-muted text-body max-w-sm">
                                We&apos;re currently updating our portfolio.
                                Check back soon or{" "}
                                <Link href="/contact" className="button-text">
                                    contact us
                                </Link>{" "}
                                to see our work directly.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-x-16 gap-y-24 lg:grid-cols-2">
                            {projects.map((proj) => (
                                <div
                                    key={proj.slug}
                                    className="group flex-vertical cursor-pointer justify-between"
                                >
                                    <div>
                                        <div className="edge-dark aspect-6/3 w-full overflow-hidden border">
                                            <Image
                                                src={
                                                    proj.thumbnail ||
                                                    DefProjectThumbnail
                                                }
                                                alt={proj.title}
                                                width={500}
                                                height={500}
                                                loading="lazy"
                                                className="smooth-transition h-full w-full object-cover group-hover:scale-102"
                                            />
                                        </div>

                                        <h2 className="card-heading my-8 line-clamp-3">
                                            {proj.title}
                                        </h2>
                                    </div>
                                    <Link
                                        href={`/case-studies/${proj.slug}`}
                                        className="button-secondary uppercase"
                                    >
                                        View Case Study
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
