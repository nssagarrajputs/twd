import { groq } from "next-sanity";

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

export const FAQS_QUERY = groq`
    *[
        _type == "faq" && references(*[_type == "webpage" && slug.current == $webpageSlug][0]._id)
    ] | order(
        defined(sortOrder) desc,
        sortOrder asc
    ) {
        _id,
        question,
        plainAnswer,
        richAnswer,
        sortOrder
    }
`;
