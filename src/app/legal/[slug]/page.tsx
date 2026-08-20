import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHero from "@/components/ui/PageHero";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import { legalTextComponents } from "@/components/PTF/LegalText";

// ─── Queries ────────────────────────────────────────────────────────

const LEGAL_PAGE_QUERY = `*[_type == "legalPage" && slug.current == $slug][0]{
  title,
  slug,
  seoTitle,
  seoDescription,
  lastUpdatedOn,
  body
}`;

const LEGAL_PAGE_SLUGS_QUERY = `*[_type == "legalPage" && defined(slug.current)]{
  "slug": slug.current
}`;

async function getLegalPage(slug: string) {
    return client.fetch(LEGAL_PAGE_QUERY, { slug });
}

// ─── Static params (SSG) ────────────────────────────────────────────

export async function generateStaticParams() {
    const pages: { slug: string }[] = await client.fetch(
        LEGAL_PAGE_SLUGS_QUERY,
    );
    return pages.map((page) => ({ slug: page.slug }));
}

// ─── Metadata ───────────────────────────────────────────────────────

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const page = await getLegalPage(slug);

    if (!page) {
        return {};
    }

    return {
        title: page.seoTitle,
        description: page.seoDescription,
        alternates: { canonical: `/legal/${page.slug.current}` },
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

    if (!page) {
        notFound();
    }

    const formattedDate = new Date(page.lastUpdatedOn).toLocaleDateString(
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
                eyebrow="legal"
                title={page.title}
                description={`Last Updated: ${formattedDate}, Effective Immediately`}
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
