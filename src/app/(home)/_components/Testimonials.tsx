import { SectionHeaderCentered } from "@/components/ui/SectionHeaderType";
import { client } from "@/sanity/client";
import { groq } from "next-sanity";

const TESTIMONIALS_QUERY = groq`
    *[
        _type == "testimonial"
    ] | order(reviewDate desc)[0...6] {
        _id,
        companyName,
        quote,
        rating,
        source
    }
`;

type Testimonial = {
    _id: string;
    companyName: string;
    rating: number;
    quote: string;
    source?: string;
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
                                <div className="flex gap-x-2">
                                    <span className="text-malachite text-16 font-black">
                                        {review.rating.toFixed(1)}
                                    </span>

                                    <span className="text-ink-primary font-bold">
                                        {review.companyName}
                                    </span>
                                </div>
                                <blockquote className="text-body text-ink-secondary line-clamp-4 leading-relaxed tracking-wide">
                                    {review.quote}
                                </blockquote>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
