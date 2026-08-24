import { client } from "./client";
import { groq, PortableTextBlock } from "next-sanity";

export type WebpageMetadata = {
    name: string;
    slug: string;
    metaTitle: string;
    metaDescription: string;
    keywords?: string[];
};

export const META_DATA_WEBPAGE_QUERY = groq`
    *[
        _type == "webpage" &&
        slug.current == $slug
    ][0] {
        name,
        "slug": slug.current,
        metaTitle,
        metaDescription,
        keywords
    }
`;

export type FAQ = {
    _id: string;
    question: string;
    richAnswer: PortableTextBlock[];
    plainAnswer: string;
    sortOrder: number;
};

export const FAQS_QUERY = groq`
    *[
        _type == "faq" &&
        references(
            *[
                _type == "webpage" &&
                slug.current == $slug
            ]._id
        )
    ]
    | order(sortOrder asc) {
        _id,
        question,
        richAnswer,
        plainAnswer,
        sortOrder
    }
`;

export async function getFAQs(slug: string): Promise<FAQ[]> {
    return client.fetch<FAQ[]>(FAQS_QUERY, { slug });
}
