export const metaDataWebpageQuery = `
    *[_type == "webpage" && slug.current == $slug][0]{
        name,
        slug,
        metaTitle,
        metaDescription,
        keywords
    }
`;
