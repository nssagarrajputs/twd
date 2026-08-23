import type { Metadata } from "next";
import { cache } from "react";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { legalTextComponents } from "@/components/PTF/LegalText";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";

// ─── Types

type LegalPage = {
    _id: string;
    title: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    effectiveDate: string;
    body: PortableTextBlock[];
};

// ─── Queries

const LEGAL_PAGE_SLUGS_QUERY = groq`
    *[
        _type == "legalPage" &&
        defined(slug.current)
    ] {
        "slug": slug.current
    }
`;

const LEGAL_PAGE_QUERY = groq`
    *[
        _type == "legalPage" &&
        slug.current == $slug
    ][0] {
        _id,
        title,
        "slug": slug.current,
        metaTitle,
        metaDescription,
        effectiveDate,
        body
    }
`;

// ─── Data
// Ye function ek slug leke Sanity se poora page data laata hai. cache() ka fayda: agar same slug ke liye 2 jagah (metadata + page) yeh function call ho, toh Sanity ko sirf 1 baar hi call karega, dobara nahi. (Bina cache() ke, Sanity 2 baar hit hoti — waste of time + slower page)

const getLegalPage = cache(async (slug: string): Promise<LegalPage | null> => {
    return client.fetch<LegalPage | null>(LEGAL_PAGE_QUERY, {
        slug,
    });
});

// ─── Static Params
// Generate all legal pages at build time

export async function generateStaticParams() {
    const pages: { slug: string }[] = await client.fetch(
        LEGAL_PAGE_SLUGS_QUERY,
    );

    return pages.map((page) => ({
        slug: page.slug,
    }));
}

export const dynamicParams = false;

// ─── Metadata

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    if (!page) return {};

    return {
        title: page.metaTitle,
        description: page.metaDescription,

        alternates: {
            canonical: `/legal/${page.slug}`,
        },

        openGraph: {
            type: "website",
            locale: "en_US",
            siteName: "Tecorbitron",
            url: `/legal/${page.slug}`,
            title: page.metaTitle,
            description: page.metaDescription,
            images: [
                {
                    url: "/opengraph/og-global.jpg",
                    width: 1200,
                    height: 630,
                    alt: page.metaTitle,
                },
            ],
        },

        twitter: {
            card: "summary_large_image",
            title: page.metaTitle,
            description: page.metaDescription,
            images: ["/opengraph/og-global.jpg"],
        },

        robots: {
            index: false,
            follow: false,
        },
    };
}

// ─── Page

export default async function LegalPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    if (!page || !page.body) {
        notFound();
    }

    const effectiveDate = new Date(page.effectiveDate).toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric",
        },
    );

    return (
        <main>
            <PageHero
                title={page.title}
                description={`Effective Date: ${effectiveDate}`}
            />

            <section className="side-layout-spacing">
                <div className="edge-light bg-canvas-white side-breathing mx-auto max-w-7xl border-x py-24">
                    <article className="mx-auto max-w-4xl">
                        <PortableText
                            value={page.body}
                            components={legalTextComponents}
                        />
                    </article>
                </div>
            </section>
        </main>
    );
}
