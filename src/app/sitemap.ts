import { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";

const baseUrl = "https://www.tecorbitron.com";

type SanitySlugResult = {
    slug: string;
    updatedAt: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // ── Sanity se slugs fetch karo ── (type names update)
    const [projects, posts, legalPages] = await Promise.all([
        client.fetch<SanitySlugResult[]>(
            groq`*[_type == "caseStudy"]{ "slug": slug.current, "updatedAt": _updatedAt }`,
        ),
        client.fetch<SanitySlugResult[]>(
            groq`*[_type == "blogPost"]{ "slug": slug.current, "updatedAt": _updatedAt }`,
        ),
        client.fetch<SanitySlugResult[]>(
            groq`*[_type == "legalPage"]{ "slug": slug.current, "updatedAt": _updatedAt }`,
        ),
    ]);

    // ── Dynamic portfolio pages ──
    const portfolioUrls: MetadataRoute.Sitemap = projects.map((proj) => ({
        url: `${baseUrl}/case-studies/${proj.slug}`,
        lastModified: new Date(proj.updatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
    }));

    // ── Dynamic blog pages ──
    const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt),
        changeFrequency: "monthly",
        priority: 0.6,
    }));

    // ── Dynamic legal pages
    const legalUrls: MetadataRoute.Sitemap = legalPages.map((page) => ({
        url: `${baseUrl}/legal/${page.slug}`,
        lastModified: new Date(page.updatedAt),
        changeFrequency: "yearly",
        priority: 0.1,
    }));

    return [
        // ── Core pages ──
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/services/web-development`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/app-development`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/ecommerce-development`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services/seo-and-marketing`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/case-studies`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily",
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.9,
        },
        {
            url: `${baseUrl}/technologies`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },
        {
            url: `${baseUrl}/solutions`,
            lastModified: new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
        },

        // ── Legal ──
        ...legalUrls,

        // ── Dynamic pages ──
        ...portfolioUrls,
        ...blogUrls,
    ];
}
