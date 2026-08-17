export const META_DATA_WEBPAGE_QUERY = `
    *[_type == "webpage" && slug.current == $slug][0]{
        name,
        slug,
        metaTitle,
        metaDescription,
        keywords
    }
`;
