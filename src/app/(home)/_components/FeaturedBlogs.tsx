import Link from "next/link";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import Image from "next/image";
import { SectionHeaderLeftRight } from "@/components/ui/SectionHeaderType";
import DefProjectThumbnail from "@/assets/other/default-thumbnail.webp";

type BlogTeaserPost = {
    title: string;
    slug: string;
    publishedAt: string;
    coverImage: string | null;
};

const BLOG_TEASER_QUERY = groq`
    *[
        _type == "blogPost"
    ]
    | order(publishedAt desc)[0...3] {
        title,
        "slug": slug.current,
        publishedAt,
        "coverImage": coverImage.asset->url
    }
`;

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default async function FeaturedBlogs() {
    const posts: BlogTeaserPost[] = await client.fetch(BLOG_TEASER_QUERY);

    return (
        <section className="bg-canvas-white side-layout-spacing">
            <div className="mx-auto max-w-7xl">
                <div className="edge-light border-x">
                    <SectionHeaderLeftRight
                        eyebrow="Insights"
                        heading="From Our Experts"
                        href="/blog"
                        hreflabel="Read All Insights"
                    />
                </div>

                <div className="edge-light grid grid-cols-1 border-l lg:grid-cols-3">
                    {posts.map((post) => (
                        <div
                            key={post.slug}
                            className="edge-light flex-vertical side-breathing gap-y-8 border-t border-r py-16"
                        >
                            {/* Thumbnail */}
                            <div className="edge-light relative aspect-4/2 w-full border">
                                <Image
                                    src={post.coverImage || DefProjectThumbnail}
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 33vw, 400px"
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-vertical h-full justify-between gap-y-8">
                                <h3 className="card-heading mb-6 line-clamp-3">
                                    {post.title}
                                </h3>
                                <div className="flex flex-wrap items-center justify-between gap-y-4">
                                    <Link
                                        href={`/blog/${post.slug}`}
                                        className="button-secondary"
                                    >
                                        Read Article
                                    </Link>

                                    <p className="text-ink-muted text-body">
                                        {formatDate(post.publishedAt)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
