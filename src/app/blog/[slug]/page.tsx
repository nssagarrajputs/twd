import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { groq } from "next-sanity";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/react";
import { ArrowLeft } from "lucide-react";
import { client } from "@/sanity/client";
import { BlogPostSchema } from "@/components/StructuredData";
import DefBlogThumbnail from "@/assets/other/default-thumbnail.webp";
import type { Metadata } from "next";
import { SectionHeaderCentered } from "@/components/ui/SectionHeaderType";
import { bcsComponents } from "@/components/PTF/BlogCaseText";

type BlogPost = {
    title: string;
    seoTitle: string;
    seoDescription: string;
    slug: string;
    excerpt: string;
    publishedAt: string;
    lastModifiedAt?: string;
    readTime: number;

    coverImage: {
        url: string;
        alt: string;
    } | null;

    categories: string[];
    tags: string[];

    author: {
        name: string;
        role: string;
        photo: string | null;
    };

    contributors: {
        name: string;
        role: string;
        photo: string | null;
    }[];

    body: PortableTextBlock[];
};

type RelatedPost = {
    title: string;
    slug: string;
    publishedAt: string;
    coverImage: string | null;
};

const BLOG_DETAIL_QUERY = groq`
  *[_type == "blogPost" && slug.current == $slug][0] {
    title,
    seoTitle,
    seoDescription,
    "slug": slug.current,
    excerpt,
    publishedAt,
    lastModifiedAt,
    readTime,

    "coverImage": coverImage {
      "url": asset->url,
      alt
    },

    "categories": categories[]->name,
    tags,

    "author": author->{
      name,
      role,
      "photo": photo.asset->url
    },

    "contributors": contributors[]->{
      name,
      role,
      "photo": photo.asset->url
    },

    body[]{
      ...,

      _type == "image" => {
        ...,
        alt,
        caption,
        "asset": asset->{url}
      }
    }
  }
`;

const BLOG_RELATED_QUERY = groq`
  *[_type == "blogPost" && slug.current != $slug] | order(publishedAt desc) [0...3] {
    title,
    "slug": slug.current,
    publishedAt,
    "coverImage": coverImage.asset->url,
  }
`;

// ─── Static Params ────────────────────────────────────────────────────────────

export async function generateStaticParams() {
    const slugs: { slug: string }[] = await client.fetch(
        groq`*[_type == "blogPost"]{ "slug": slug.current }`,
    );
    return slugs.map((s) => ({ slug: s.slug }));
}

// ─── generateMetadata ─────────────────────────────────────────────────────────

export async function generateMetadata(props: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await props.params;
    const post: BlogPost = await client.fetch(BLOG_DETAIL_QUERY, { slug });
    if (!post) return {};
    return {
        title: post.seoTitle,
        description: post.seoDescription,
        alternates: { canonical: `/blog/${slug}` },
        openGraph: {
            type: "article",
            title: post.seoTitle,
            description: post.seoDescription,
            url: `https://www.tecorbitron.com/blog/${slug}`,
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
            title: post.seoTitle,
            description: post.seoDescription,
            images: [post.coverImage?.url || "/opengraph/og-global.jpg"],
        },
    };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function BlogPostPage(props: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await props.params;

    const [post, related]: [BlogPost, RelatedPost[]] = await Promise.all([
        client.fetch(BLOG_DETAIL_QUERY, { slug }),
        client.fetch(BLOG_RELATED_QUERY, { slug }),
    ]);

    if (!post) notFound();

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
                                <ArrowLeft size={18} strokeWidth={1.4} /> Back
                            </Link>
                        </div>

                        <span className="section-subtitle">
                            {formatDate(post.publishedAt)}
                        </span>

                        <div className="edge-dark relative aspect-video w-full border">
                            <Image
                                src={post.coverImage?.url || DefBlogThumbnail}
                                alt={post.coverImage?.alt || post.title}
                                fill
                                sizes="(max-width: 1024px) 100vw, 900px"
                                className="w-full object-cover"
                                preload
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

                        <div className="section-edge-dark"></div>

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
                    </div>
                </div>
            </section>

            <div className="section-edge-dark"></div>

            {/* Related Posts */}
            {related?.length > 0 && (
                <section className="dark side-layout-spacing">
                    <div className="mx-auto max-w-7xl">
                        <div className="edge-dark border-x">
                            <SectionHeaderCentered heading="Related Articles" />
                            <div className="edge-dark grid grid-cols-1 border-l lg:grid-cols-3">
                                {related.map((rel) => (
                                    <div
                                        key={rel.slug}
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
