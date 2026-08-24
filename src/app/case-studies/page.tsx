import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { groq } from "next-sanity";

import PageHero from "@/components/ui/PageHero";
import { CaseStudiesPageSchema } from "@/components/StructuredData";
import { client } from "@/sanity/client";
import DefProjectThumbnail from "@/assets/other/default-thumbnail.webp";
import {
    META_DATA_WEBPAGE_QUERY,
    type WebpageMetadata,
} from "@/sanity/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "case-studies";

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

        alternates: {
            canonical: `/${slug}`,
        },

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

export type CaseStudyCard = {
    _id: string;
    projectName: string;
    slug: string;
    thumbnail: string | null;
};

const CASE_STUDIES_QUERY = groq`
    *[
        _type == "caseStudy"
    ]
    | order(completedAt desc) {
        _id,
        projectName,
        "slug": slug.current,
        "thumbnail": thumbnail.asset->url
    }
`;

export default async function CaseStudiesPage() {
    const projects = await client.fetch<CaseStudyCard[]>(CASE_STUDIES_QUERY);

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
                            {projects.map((project) => (
                                <div
                                    key={project._id}
                                    className="group flex-vertical cursor-pointer justify-between"
                                >
                                    <div>
                                        <div className="edge-dark aspect-6/3 w-full overflow-hidden border">
                                            <Image
                                                src={
                                                    project.thumbnail ||
                                                    DefProjectThumbnail
                                                }
                                                alt={project.projectName}
                                                width={500}
                                                height={500}
                                                loading="lazy"
                                                className="smooth-transition h-full w-full object-cover group-hover:scale-102"
                                            />
                                        </div>

                                        <h2 className="card-heading my-8 line-clamp-3">
                                            {project.projectName}
                                        </h2>
                                    </div>

                                    <Link
                                        href={`/case-studies/${project.slug}`}
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
