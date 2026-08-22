import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { legalTextComponents } from "@/components/PTF/LegalText";
import { groq } from "next-sanity";
import type { PortableTextBlock } from "@portabletext/types";
import { cache } from "react";

interface LegalPage {
    _id: string;
    title: string;
    slug: { current: string };
    seoTitle?: string;
    seoDescription?: string;
    lastUpdatedOn?: string;
    body: PortableTextBlock[];
}

// Query 1: Sirf slugs nikalo (jaise "privacy-policy", "terms")
// Isse pata chalega ki total kitne legal pages hain aur unke URL kya honge
const LEGAL_PAGE_SLUGS_QUERY = groq`
  *[_type == "legalPage" && defined(slug.current)]{
    "slug": slug.current
  }
`;

// Query 2: Ek specific slug ka poora data nikalo (title, seo, body, etc.)
const LEGAL_PAGE_QUERY = groq`
  *[_type == "legalPage" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    seoTitle,
    seoDescription,
    lastUpdatedOn,
    body
  }
`;

// Ye function ek slug leke Sanity se poora page data laata hai.
// cache() ka fayda: agar same slug ke liye 2 jagah (metadata + page) yeh
// function call ho, toh Sanity ko sirf 1 baar hi call karega, dobara nahi.
// (Bina cache() ke, Sanity 2 baar hit hoti — waste of time + slower page)
const getLegalPage = cache(async (slug: string): Promise<LegalPage | null> => {
    return client.fetch(LEGAL_PAGE_QUERY, { slug });
});

// ─── Static params (SSG) ────────────────────────────────────────────
// Generate all legal pages at build time

export async function generateStaticParams() {
    const pages: { slug: string }[] = await client.fetch(
        LEGAL_PAGE_SLUGS_QUERY,
    );
    return pages.map((page) => ({ slug: page.slug }));
}

// Agar koi aisa slug try kare jo upar wali list mein nahi hai
// (jaise /legal/random-page), toh 404 dikhao, page render mat karo.
export const dynamicParams = false;

// ─── Metadata ───────────────────────────────────────────────────────

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    if (!page) return {};

    const title = page?.seoTitle ?? "Legal - Tecorbitron";
    const description = page?.seoDescription ?? "Legal Documents.";

    return {
        title,
        description,

        alternates: { canonical: `/legal/${page.slug.current}` },

        openGraph: {
            type: "website",
            locale: "en_US",
            siteName: "Tecorbitron",
            url: `/legal/${page.slug.current}`,
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

        robots: { index: false, follow: false },
    };
}

// ─── Page ───────────────────────────────────────────────────────────

export default async function LegalPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    // Page na mile, ya body (content) khali ho, toh 404 page dikhao
    if (!page || !page.body) {
        notFound();
    }

    const formattedDate = page.lastUpdatedOn
        ? new Date(page.lastUpdatedOn).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : null;

    return (
        <main>
            <PageHero
                title={page.title}
                description={
                    formattedDate
                        ? `Last Updated: ${formattedDate}, Effective Immediately`
                        : undefined
                }
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
