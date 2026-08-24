import Link from "next/link";
import Image from "next/image";
import { groq } from "next-sanity";

import { SectionHeaderLeftRight } from "@/components/ui/SectionHeaderType";
import DefProjectThumbnail from "@/assets/other/default-thumbnail.webp";
import { client } from "@/sanity/client";

type CaseStudyPreview = {
    projectName: string;
    slug: string;
    thumbnail: string | null;
};

const CASE_STUDY_PREVIEW_QUERY = groq`
    *[
        _type == "caseStudy"
    ]
    | order(completedAt desc)[0...3] {
        projectName,
        "slug": slug.current,
        "thumbnail": thumbnail.asset->url
    }
`;

export default async function FeaturedProjects() {
    const projects = await client.fetch<CaseStudyPreview[]>(
        CASE_STUDY_PREVIEW_QUERY,
    );

    return (
        <section className="bg-canvas-white side-layout-spacing">
            <div className="mx-auto max-w-7xl">
                <div className="edge-light border-x">
                    <SectionHeaderLeftRight
                        eyebrow="Case Studies"
                        heading="Real Projects. Real Impact."
                        href="/case-studies"
                        hreflabel="View All Case Studies"
                    />
                </div>

                <div className="edge-light grid grid-cols-1 border-l lg:grid-cols-3">
                    {projects.map((project) => (
                        <div
                            key={project.slug}
                            className="edge-light side-breathing flex-vertical gap-y-8 border-t border-r py-16"
                        >
                            <div className="edge-light relative aspect-4/2 w-full border">
                                <Image
                                    src={
                                        project.thumbnail || DefProjectThumbnail
                                    }
                                    alt={project.projectName}
                                    fill
                                    loading="lazy"
                                    sizes="(max-width: 1024px) 100vw, (max-width: 1280px) 33vw, 400px"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div>
                                <h3 className="card-heading mb-6">
                                    {project.projectName}
                                </h3>

                                <Link
                                    href={`/case-studies/${project.slug}`}
                                    className="button-secondary"
                                >
                                    View Case Study
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
