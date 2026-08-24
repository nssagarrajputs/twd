import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { groq } from "next-sanity";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import DefProjectThumbnail from "@/assets/other/default-thumbnail.webp";
import { bcsComponents } from "@/components/PTF/BlogCaseText";
import { CaseStudySchema } from "@/components/StructuredData";
import CTAFormat from "@/components/templates/CTAFormat";
import { SectionHeaderCentered } from "@/components/ui/SectionHeaderType";

type Taxonomy = {
    _id: string;
    name: string;
    slug: string;
};

type TechStack = Taxonomy & {
    category?: string;
};

type KeyResult = {
    metric: string;
    value: string;
};

type Testimonial = {
    _id: string;
    reviewerName: string;
    role?: string;
    clientHeadshot: string | null;
    companyName: string;
    companyLogo: string | null;
    rating: number;
    quote: string;
    reviewDate: string;
    source?: string;
};

type CaseStudy = {
    _id: string;
    projectName: string;
    title: string;
    slug: string;

    seoTitle: string;
    seoDescription: string;

    industries: Taxonomy[];
    solutions: Taxonomy[];
    services: Taxonomy[];
    techStack: TechStack[];

    completedAt: string;
    duration: string;
    livePreview?: string;

    thumbnail: {
        url: string;
        alt?: string;
    } | null;

    body: PortableTextBlock[];

    keyResults: KeyResult[];

    testimonials: Testimonial[];
};

type RelatedProject = {
    _id: string;
    projectName: string;
    title: string;
    slug: string;
    thumbnail: string | null;
};

const CASE_STUDY_DETAIL_QUERY = groq`
    *[
        _type == "caseStudy" &&
        slug.current == $slug
    ][0] {
        _id,
        projectName,
        title,
        "slug": slug.current,

        seoTitle,
        seoDescription,

        "industries": coalesce(
            industries[]->{
                _id,
                name,
                "slug": slug.current
            },
            []
        ),

        "solutions": coalesce(
            solutions[]->{
                _id,
                name,
                "slug": slug.current
            },
            []
        ),

        "services": coalesce(
            services[]->{
                _id,
                name,
                "slug": slug.current
            },
            []
        ),

        "techStack": coalesce(
            techStack[]->{
                _id,
                name,
                "slug": slug.current,
                category
            },
            []
        ),

        completedAt,
        duration,
        livePreview,

        "thumbnail": thumbnail {
            "url": asset->url,
            alt
        },

        body[] {
            ...,

            _type == "image" => {
                ...,
                alt,
                caption,
                "asset": asset->{
                    url
                }
            }
        },

        "keyResults": coalesce(
            keyResults[] {
                metric,
                value
            },
            []
        ),

        "testimonials": coalesce(
            testimonials[]->{
                _id,
                reviewerName,
                role,
                "clientHeadshot": clientHeadshot.asset->url,
                companyName,
                "companyLogo": companyLogo.asset->url,
                rating,
                quote,
                reviewDate,
                source
            },
            []
        )
    }
`;

const CASE_STUDY_SLUGS_QUERY = groq`
    *[
        _type == "caseStudy" &&
        defined(slug.current)
    ] {
        "slug": slug.current
    }
`;

const CASE_STUDY_RELATED_QUERY = groq`
    *[
        _type == "caseStudy" &&
        slug.current != $slug &&
        (
            count(industries[@._ref in $industryIds]) > 0 ||
            count(solutions[@._ref in $solutionIds]) > 0 ||
            count(services[@._ref in $serviceIds]) > 0
        )
    ]
    | order(completedAt desc)[0...3] {
        _id,
        projectName,
        title,
        "slug": slug.current,
        "thumbnail": thumbnail.asset->url
    }
`;

export async function generateStaticParams() {
    const slugs = await client.fetch<{ slug: string }[]>(
        CASE_STUDY_SLUGS_QUERY,
    );

    return slugs.map((item) => ({
        slug: item.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;

    const project = await client.fetch<CaseStudy | null>(
        CASE_STUDY_DETAIL_QUERY,
        {
            slug,
        },
    );

    if (!project) {
        return {};
    }

    const title = project.seoTitle;
    const description = project.seoDescription;

    const image = project.thumbnail?.url || "/opengraph/og-global.jpg";

    return {
        title,
        description,

        alternates: {
            canonical: `/case-studies/${project.slug}`,
        },

        openGraph: {
            type: "article",
            title,
            description,
            url: `https://www.tecorbitron.com/case-studies/${project.slug}`,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: project.thumbnail?.alt || project.projectName,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

function TaxonomyGroup({ title, items }: { title: string; items: Taxonomy[] }) {
    if (items.length === 0) {
        return null;
    }

    return (
        <div>
            <h2 className="text-h3 text-ink-primary mb-6">{title}</h2>

            <div className="flex flex-wrap gap-4">
                {items.map((item) => (
                    <span
                        key={item._id}
                        className="bg-primary/20 text-primary px-4 py-2 font-medium"
                    >
                        {item.name}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default async function CaseStudyDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const project = await client.fetch<CaseStudy | null>(
        CASE_STUDY_DETAIL_QUERY,
        {
            slug,
        },
    );

    if (!project) {
        notFound();
    }

    const industryIds = project.industries.map((item) => item._id);

    const solutionIds = project.solutions.map((item) => item._id);

    const serviceIds = project.services.map((item) => item._id);

    const related = await client.fetch<RelatedProject[]>(
        CASE_STUDY_RELATED_QUERY,
        {
            slug,
            industryIds,
            solutionIds,
            serviceIds,
        },
    );

    return (
        <main>
            {/* <CaseStudySchema project={project} /> */}

            <section className="dark side-layout-spacing">
                <div className="edge-dark mx-auto max-w-7xl border-x py-24">
                    <div className="side-breathing flex-vertical mx-auto max-w-5xl gap-y-12">
                        <div className="flex-vertical flex-col-reverse gap-y-6">
                            <h1 className="section-heading font-bold">
                                {project.title}
                            </h1>

                            <Link
                                href="/case-studies"
                                className="button-text flex w-fit items-center gap-2"
                            >
                                <ArrowLeft size={18} strokeWidth={1.4} />
                                Back
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <span className="section-subtitle">
                                {project.projectName}
                            </span>

                            <span className="text-ink-muted">
                                Completed {formatDate(project.completedAt)}
                            </span>

                            {project.duration && (
                                <span className="text-ink-muted">
                                    {project.duration}
                                </span>
                            )}
                        </div>

                        <div className="edge-dark relative aspect-video w-full border">
                            <Image
                                src={
                                    project.thumbnail?.url ||
                                    DefProjectThumbnail
                                }
                                alt={
                                    project.thumbnail?.alt ||
                                    project.projectName
                                }
                                fill
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                className="w-full object-cover"
                                priority
                            />
                        </div>

                        <div className="flex-vertical gap-12">
                            <TaxonomyGroup
                                title="Industry"
                                items={project.industries}
                            />

                            <TaxonomyGroup
                                title="Solutions"
                                items={project.solutions}
                            />

                            <TaxonomyGroup
                                title="Services"
                                items={project.services}
                            />

                            {project.techStack.length > 0 && (
                                <div>
                                    <h2 className="text-h3 text-ink-primary mb-6">
                                        Tech Stack
                                    </h2>

                                    <div className="flex flex-wrap gap-4">
                                        {project.techStack.map((tech) => (
                                            <span
                                                key={tech._id}
                                                className="bg-secondary/20 text-ink-secondary px-4 py-2 font-medium"
                                            >
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="section-edge-dark" />

                        <div>
                            <PortableText
                                value={project.body}
                                components={bcsComponents}
                            />
                        </div>

                        {project.keyResults.length > 0 && (
                            <>
                                <div className="section-edge-dark" />

                                <div>
                                    <h2 className="text-h3 text-ink-primary mb-8">
                                        Key Results
                                    </h2>

                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {project.keyResults.map(
                                            (result, index) => (
                                                <div
                                                    key={`${result.metric}-${index}`}
                                                    className="edge-dark border p-8"
                                                >
                                                    <p className="text-malachite text-h2 font-bold">
                                                        {result.value}
                                                    </p>

                                                    <p className="text-ink-secondary text-body mt-2">
                                                        {result.metric}
                                                    </p>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {project.livePreview && (
                            <>
                                <div className="section-edge-dark" />

                                <div>
                                    <a
                                        href={project.livePreview}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="button-secondary"
                                    >
                                        View Live Project
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </section>

           

            {related.length > 0 && (
                <>
                    <div className="section-edge-dark" />

                    <section className="dark side-layout-spacing">
                        <div className="mx-auto max-w-7xl">
                            <div className="edge-dark border-x">
                                <SectionHeaderCentered heading="Related Projects" />
                            </div>

                            <div className="edge-dark grid grid-cols-1 border-l lg:grid-cols-3">
                                {related.map((project) => (
                                    <div
                                        key={project._id}
                                        className="edge-dark side-breathing border-t border-r py-16"
                                    >
                                        <div className="edge-dark relative aspect-video w-full border">
                                            <Image
                                                src={
                                                    project.thumbnail ||
                                                    DefProjectThumbnail
                                                }
                                                alt={project.projectName}
                                                fill
                                                loading="lazy"
                                                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 33vw, 400px"
                                                className="h-auto w-full object-cover"
                                            />
                                        </div>

                                        <h3 className="card-heading my-8 line-clamp-4">
                                            {project.title}
                                        </h3>

                                        <Link
                                            href={`/case-studies/${project.slug}`}
                                            className="button-secondary"
                                        >
                                            View Case Study
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </>
            )}

            <div className="section-edge-dark" />

            <CTAFormat
                eyebrow="YOUR TURN !"
                heading="Want Results Like This?"
                highlight="Like This?"
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
