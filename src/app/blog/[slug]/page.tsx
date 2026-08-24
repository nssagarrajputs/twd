import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { client } from "@/sanity/client";
import DefBlogThumbnail from "@/assets/other/default-thumbnail.webp";
import { SectionHeaderCentered } from "@/components/ui/SectionHeaderType";
import { bcsComponents } from "@/components/PTF/BlogCaseText";

type TeamMember = {
    name: string;
    designation: string;
    photo: string | null;
};

type BlogPost = {
    _id: string;
    title: string;
    metaTitle: string;
    metaDescription: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    lastModifiedAt?: string;
    readTime: number;
    coverImage: {
        url: string;
        alt: string;
    } | null;
    categories: {
        name: string;
        slug: string;
    }[];
    tags: string[];
    author: TeamMember;
    contributors: TeamMember[];
    body: PortableTextBlock[];
};

type RelatedPost = {
    _id: string;
    title: string;
    slug: string;
    publishedAt: string;
    coverImage: string | null;
};

const BLOG_DETAIL_QUERY = groq`
    *[
        _type == "blogPost" &&
        slug.current == $slug
    ][0] {
        _id,
        title,
        metaTitle,
        metaDescription,
        "slug": slug.current,
        excerpt,
        publishedAt,
        lastModifiedAt,
        readTime,

        "coverImage": coverImage {
            "url": asset->url,
            alt
        },

        "categories": categories[]->{
            name,
            "slug": slug.current
        },

        tags,

        "author": author->{
            name,
            designation,
            "photo": photo.asset->url
        },

        "contributors": contributors[]->{
            name,
            designation,
            "photo": photo.asset->url
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
        }
    }
`;

const BLOG_SLUGS_QUERY = groq`
    *[
        _type == "blogPost" &&
        defined(slug.current)
    ] {
        "slug": slug.current
    }
`;

const BLOG_RELATED_QUERY = groq`
    *[
        _type == "blogPost" &&
        slug.current != $slug &&
        count(categories[@._ref in $categoryIds]) > 0
    ]
    | order(publishedAt desc)[0...3] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        "coverImage": coverImage.asset->url
    }
`;

export async function generateStaticParams() {
    const slugs = await client.fetch<{ slug: string }[]>(BLOG_SLUGS_QUERY);

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

    const post = await client.fetch<BlogPost | null>(BLOG_DETAIL_QUERY, {
        slug,
    });

    if (!post) {
        return {};
    }

    return {
        title: post.metaTitle,
        description: post.metaDescription,

        alternates: {
            canonical: `/blog/${post.slug}`,
        },

        openGraph: {
            type: "article",
            locale: "en_US",
            siteName: "Tecorbitron",
            title: post.metaTitle,
            description: post.metaDescription,
            url: `https://www.tecorbitron.com/blog/${post.slug}`,
            publishedTime: post.publishedAt,
            modifiedTime: post.lastModifiedAt || post.publishedAt,
            authors: post.author?.name ? [post.author.name] : undefined,
            images: [
                {
                    url: post.coverImage?.url || "/opengraph/og-global.jpg",
                    width: 1200,
                    height: 630,
                    alt: post.coverImage?.alt || post.title,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: post.metaTitle,
            description: post.metaDescription,
            images: [post.coverImage?.url || "/opengraph/og-global.jpg"],
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

export default async function BlogPostPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const post = await client.fetch<BlogPost | null>(BLOG_DETAIL_QUERY, {
        slug,
    });

    if (!post) {
        notFound();
    }

    const categoryIds = post.categories.map((category) => category.slug);

    const related = await client.fetch<RelatedPost[]>(BLOG_RELATED_QUERY, {
        slug,
        categoryIds,
    });

    return (
        <main>
            {/* <BlogPostSchema post={post} /> */}

            <section className="dark side-layout-spacing">
                <div className="edge-dark mx-auto max-w-7xl border-x py-24">
                    <div className="side-breathing flex-vertical mx-auto max-w-4xl gap-y-12">
                        <div className="flex-vertical flex-col-reverse gap-y-6">
                            <h1 className="section-heading font-bold">
                                {post.title}
                            </h1>

                            <Link
                                href="/blog"
                                className="button-text flex w-fit items-center gap-2"
                            >
                                <ArrowLeft size={18} strokeWidth={1.4} />
                                Back
                            </Link>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                            <span className="section-subtitle">
                                {formatDate(post.publishedAt)}
                            </span>

                            <span className="text-ink-muted">
                                {post.readTime} min read
                            </span>
                        </div>

                        <div className="edge-dark relative aspect-video w-full border">
                            <Image
                                src={post.coverImage?.url || DefBlogThumbnail}
                                alt={post.coverImage?.alt || post.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 900px"
                                className="w-full object-cover"
                                priority
                            />
                        </div>

                        {post.excerpt && (
                            <p className="text-ink-primary border-malachite text-18 mt-16 border-l-4 pl-6 leading-relaxed">
                                {post.excerpt}
                            </p>
                        )}

                        <div className="flex-vertical gap-8">
                            <PortableText
                                value={post.body}
                                components={bcsComponents}
                            />
                        </div>

                        <div className="section-edge-dark" />

                        {post.categories.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {post.categories.map((category) => (
                                    <span
                                        key={category.slug}
                                        className="text-malachite border-primary text-16 border px-4 py-2 font-medium"
                                    >
                                        {category.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {post.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-4">
                                {post.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-malachite border-primary text-16 border px-4 py-2 font-medium"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="section-edge-dark" />

                        <div className="flex-vertical gap-8">
                            <div>
                                <p className="text-ink-muted text-14 mb-2">
                                    Written by
                                </p>

                                <div className="flex items-center gap-4">
                                    {post.author.photo && (
                                        <div className="relative h-12 w-12 overflow-hidden rounded-full">
                                            <Image
                                                src={post.author.photo}
                                                alt={post.author.name}
                                                fill
                                                sizes="48px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div>
                                        <p className="font-medium">
                                            {post.author.name}
                                        </p>

                                        <p className="text-ink-muted text-14">
                                            {post.author.designation}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {post.contributors?.length > 0 && (
                                <div>
                                    <p className="text-ink-muted text-14 mb-2">
                                        Contributors
                                    </p>

                                    <div className="flex flex-wrap gap-6">
                                        {post.contributors.map(
                                            (contributor) => (
                                                <div
                                                    key={contributor.name}
                                                    className="flex items-center gap-3"
                                                >
                                                    {contributor.photo && (
                                                        <div className="relative h-10 w-10 overflow-hidden rounded-full">
                                                            <Image
                                                                src={
                                                                    contributor.photo
                                                                }
                                                                alt={
                                                                    contributor.name
                                                                }
                                                                fill
                                                                sizes="40px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}

                                                    <div>
                                                        <p className="text-14 font-medium">
                                                            {contributor.name}
                                                        </p>

                                                        <p className="text-ink-muted text-14">
                                                            {
                                                                contributor.designation
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            <div className="section-edge-dark" />

            {related.length > 0 && (
                <section className="dark side-layout-spacing">
                    <div className="mx-auto max-w-7xl">
                        <div className="edge-dark border-x">
                            <SectionHeaderCentered heading="Related Articles" />

                            <div className="edge-dark grid grid-cols-1 border-l lg:grid-cols-3">
                                {related.map((rel) => (
                                    <div
                                        key={rel._id}
                                        className="edge-dark side-breathing border-t border-r py-16"
                                    >
                                        <div className="edge-dark relative aspect-video w-full border">
                                            <Image
                                                src={
                                                    rel.coverImage ||
                                                    DefBlogThumbnail
                                                }
                                                alt={rel.title}
                                                fill
                                                loading="lazy"
                                                sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 33vw, 400px"
                                                className="h-auto w-full object-cover"
                                            />
                                        </div>

                                        <div className="flex flex-col-reverse gap-6 pt-8">
                                            <h3 className="card-heading">
                                                {rel.title}
                                            </h3>

                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={`/blog/${rel.slug}`}
                                                    className="button-text"
                                                >
                                                    Read Article
                                                </Link>

                                                <span className="text-ink-muted text-14">
                                                    {formatDate(
                                                        rel.publishedAt,
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </main>
    );
}
