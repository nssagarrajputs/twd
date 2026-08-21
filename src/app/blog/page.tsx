import BlogListing from "@/app/blog/_components/BlogListing";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { BlogPageSchema } from "@/components/StructuredData";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "blog";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "Blogs Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["blog tecorbitron"];

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

const BLOG_LISTING_QUERY = groq`
  *[_type == "blogPost"] | order(publishedAt desc) {
    title,
    "slug": slug.current,
    publishedAt,
    "coverImage": coverImage.asset->url,
  }
`;

const BLOG_CATEGORIES_QUERY = groq`
  *[_type == "blogCategory"] | order(name asc) {
    name,
    "slug": slug.current,
  }
`;

export default async function Blog() {
    const [posts, categories] = await Promise.all([
        client.fetch(BLOG_LISTING_QUERY),
        client.fetch(BLOG_CATEGORIES_QUERY),
    ]);

    return (
        <main>
            <BlogPageSchema />

            <PageHero
                eyebrow="Blogs & Insights"
                title="Blogs & Insights"
                highlight="Insights"
                description="Practical guides, expert articles, and industry updates on tech and businesses — written by the Tecorbitron team."
            />

            <BlogListing posts={posts} categories={categories} />
        </main>
    );
}
