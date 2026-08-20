import { SectionHeaderCentered } from "@/components/ui/SectionHeaderType";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";

const TESTIMONIALS_QUERY = groq`
    *[
        _type == "testimonial"
    ] | order(reviewDate desc) {
        _id,
        reviewerName,
        role,
        companyName,
        quote,
        rating,
        reviewDate,
        source
    }
`;

type Testimonial = {
    _id: string;
    reviewerName: string;
    role?: string;
    companyName: string;
    rating: number;
    quote: PortableTextBlock[];
    source?: string;
    reviewDate: string;
    forProjectTitle?: string;
};

export default async function Testimonials() {
    const testimonials: Testimonial[] = await client.fetch(TESTIMONIALS_QUERY);

    return (
        <section className="bg-canvas-white dark side-layout-spacing">
            <div className="bg-canvas mx-auto max-w-7xl">
                <div className="edge-dark border-x">
                    <SectionHeaderCentered
                        eyebrow="What Our Clients Say"
                        heading="Verified feedback from clients across industries —
                            in their own words"
                    />
                </div>

                <div className="edge-dark grid grid-cols-1 border-l md:grid-cols-2 xl:grid-cols-3">
                    {testimonials.map((review) => (
                        <div
                            key={review._id}
                            className="edge-dark side-breathing border-t border-r py-12"
                        >
                            <div className="flex-vertical gap-6">
                                <div className="flex-ic-jb text-ink-muted">
                                    <div className="text-16">
                                        <span className="text-malachite">
                                            {review.rating.toFixed(1)}
                                        </span>{" "}
                                        | {review.source ?? "Verified Client"}
                                    </div>
                                    <span className="font-black">
                                        {review.companyName}
                                    </span>
                                </div>
                                <blockquote className="text-body text-ink-secondary line-clamp-4 leading-relaxed tracking-wide">
                                    <PortableText value={review.quote} />
                                </blockquote>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
