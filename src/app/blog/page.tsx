import BlogListing from "@/app/blog/_components/BlogListing";
import { client } from "@/sanity/client";
import { metaDataWebpageQuery } from "@/sanity/lib/queries";
import { groq } from "next-sanity";
import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import { BlogPageSchema } from "@/components/StructuredData";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, { slug: "blog" });

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
        alternates: { canonical: "/blog" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/blog",
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
                title="Stay Informed. Stay Ahead."
                highlight="Stay Ahead."
                description="Practical guides, expert articles, and industry updates on tech and businesses — written by the Tecorbitron team."
            />

            <BlogListing posts={posts} categories={categories} />
        </main>
    );
}
