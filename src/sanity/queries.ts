import { groq } from "next-sanity";

export const META_DATA_WEBPAGE_QUERY = groq`
    *[_type == "webpage" && slug.current == $slug][0]
    {
        name,
        slug,
        metaTitle,
        metaDescription,
        keywords,
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
