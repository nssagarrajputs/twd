import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import DefBlogThumbnail from "@/assets/other/default-thumbnail.webp";
import { ptComponents } from "@/components/PortableTextFormat";
import { CaseStudySchema } from "@/components/StructuredData";
import type { Metadata } from "next";
import CTAFormat from "@/components/templates/CTAFormat";
import { SectionHeaderCentered } from "@/components/ui/SectionHeaderType";

type TechStack = {
    name: string;
    category: string;
};

type RelatedProject = {
    projectName: string;
    title: string;
    slug: string;
    thumbnail: string | null;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

const PORTFOLIO_DETAIL_QUERY = groq`
  *[_type == "caseStudy" && slug.current == $slug][0] {
    projectName,
    title,
    "slug": slug.current,
    "thumbnail": thumbnail.asset->url,
    "industries": industries[]->name,
    "techStack": techStack[]->{name, category},
    completedAt,
    livePreview,
    body[]{
      ...,
      _type == "image" => {
        ...,
        "asset": asset->{url}
      }
    }
    
  }
`;

const PORTFOLIO_RELATED_QUERY = groq`
  *[_type == "caseStudy" && slug.current != $slug] | order(completedAt desc) [0...3] {
    projectName,
    title,
    "slug": slug.current,
    "thumbnail": thumbnail.asset->url,
  }
`;

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
    const slugs: { slug: string }[] = await client.fetch(
        groq`*[_type == "project"]{ "slug": slug.current }`,
    );
    return slugs.map((s) => ({ slug: s.slug }));
}

export const revalidate = 86400;

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;
    const proj = await client.fetch(PORTFOLIO_DETAIL_QUERY, { slug });
    if (!proj) return {};
    return {
        title: proj.projectName,
        description: proj.summary
            ? proj.summary.slice(0, 155)
            : `${proj.projectName} — A project by Tecorbitron Solutions`,
        alternates: { canonical: `/case-studies/${slug}` },
        openGraph: {
            type: "article",
            title: `${proj.projectName} — Tecorbitron Portfolio`,
            description: proj.summary?.slice(0, 155) ?? "",
            url: `https://www.tecorbitron.com/case-studies/${slug}`,
            images: proj.thumbnail
                ? [
                      {
                          url: proj.thumbnail,
                          width: 1200,
                          height: 630,
                          alt: proj.projectName,
                      },
                  ]
                : [
                      {
                          url: "/opengraph/og-casestudies.png",
                          width: 1200,
                          height: 630,
                          alt: proj.projectName,
                      },
                  ],
        },
        twitter: {
            card: "summary_large_image",
            title: `${proj.projectName} — Tecorbitron Portfolio`,
            description: proj.summary?.slice(0, 155) ?? "",
            images: proj.thumbnail
                ? [proj.thumbnail]
                : ["/opengraph/og-casestudies.png"],
        },
    };
}

// ─── Case Study Section ───────────────────────────────────────────────────────

function CaseStudySection({
    title,
    content,
}: {
    title: string;
    content: PortableTextBlock[] | null;
}) {
    if (!content || content.length === 0) return null;
    return (
        <div className="flex flex-col gap-4">
            <h2 className="text-h3 text-ink-primary">{title}</h2>
            <div className="flex flex-col gap-3">
                <PortableText value={content} components={ptComponents} />
            </div>
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function ProjectDetailPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;

    const [projData, related] = await Promise.all([
        client.fetch(PORTFOLIO_DETAIL_QUERY, { slug }),
        client.fetch(PORTFOLIO_RELATED_QUERY, { slug }),
    ]);

    if (!projData) notFound();

    return (
        <main>
            <CaseStudySchema project={projData} />

            <section className="dark side-layout-spacing">
                <div className="edge-dark mx-auto max-w-7xl border-x py-24">
                    <div className="side-breathing flex-vertical mx-auto max-w-5xl gap-y-12">
                        <div className="flex-vertical flex-col-reverse gap-y-6">
                            <h1 className="section-heading font-bold">
                                {projData.title}
                            </h1>
                            <Link
                                href="/case-studies"
                                className="button-text flex w-fit items-center gap-2"
                            >
                                <ArrowLeft size={18} strokeWidth={1.4} /> Back
                            </Link>
                        </div>

                        <div className="edge-dark relative aspect-video w-full border">
                            <Image
                                src={projData.thumbnail || DefBlogThumbnail}
                                alt={projData.projectName}
                                fill
                                sizes="(max-width: 1024px) 100vw, 1024px"
                                className="w-full object-cover"
                                preload
                            />
                        </div>

                        {projData.industries?.length > 0 && (
                            <div className="">
                                <h2 className="text-h3 text-ink-primary mb-6">
                                    Industry
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                    {projData.industries.map((ind: string) => (
                                        <span
                                            key={ind}
                                            className="bg-primary/20 text-primary px-4 py-2 font-medium capitalize"
                                        >
                                            {ind}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {projData.techStack?.length > 0 && (
                            <div className="">
                                <h2 className="text-h3 text-ink-primary mb-6">
                                    Tech Stack
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                    {projData.techStack.map(
                                        (tech: TechStack) => (
                                            <span
                                                key={tech.name}
                                                className="bg-secondary/20 text-ink-secondary px-4 py-2 font-medium capitalize"
                                            >
                                                {tech.name}
                                            </span>
                                        ),
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="section-edge-dark"></div>

                        <div className="flex-vertical">
                            <PortableText
                                value={projData.body}
                                components={ptComponents}
                            />
                        </div>

                        {projData.summary && (
                            <div className="flex flex-col gap-3">
                                <h2 className="text-h3 text-ink-primary">
                                    Summary
                                </h2>
                                <p className="text-body text-ink-secondary leading-relaxed">
                                    {projData.summary}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <div className="section-edge-dark"></div>

            {/* Related Projects */}
            {related?.length > 0 && (
                <section className="dark side-layout-spacing">
                    <div className="mx-auto max-w-7xl">
                        <div className="edge-dark border-x">
                            <SectionHeaderCentered heading="Related Projects" />
                        </div>
                        <div className="edge-dark grid grid-cols-1 border-l lg:grid-cols-3">
                            {related.map((proj: RelatedProject) => (
                                <div
                                    key={proj.slug}
                                    className="edge-dark side-breathing border-t border-r py-16"
                                >
                                    <div className="edge-dark relative aspect-video w-full border">
                                        <Image
                                            src={
                                                proj.thumbnail ||
                                                DefBlogThumbnail
                                            }
                                            alt={proj.projectName}
                                            fill
                                            loading="lazy"
                                            sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 33vw, 400px"
                                            className="h-auto w-full object-cover"
                                        />
                                    </div>

                                    <h3 className="card-heading my-8 line-clamp-4">
                                        {proj.title}
                                    </h3>
                                    <Link
                                        href={`/case-studies/${proj.slug}`}
                                        className="button-secondary"
                                    >
                                        View Case Study
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <div className="section-edge-dark"></div>

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
