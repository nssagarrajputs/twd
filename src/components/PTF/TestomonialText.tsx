import type {
    PortableTextBlock,
    PortableTextComponentProps,
    PortableTextComponents,
    PortableTextMarkComponentProps,
} from "@portabletext/react";

export const testomonialTextComponents: PortableTextComponents = {
    block: {
        normal: ({
            children,
        }: PortableTextComponentProps<PortableTextBlock>) => (
            <p className="">{children}</p>
        ),
    },

    marks: {
        strong: ({ children }: PortableTextMarkComponentProps) => (
            <strong className="text-ink-primary font-bold">{children}</strong>
        ),

        em: ({ children }: PortableTextMarkComponentProps) => (
            <em className="italic">{children}</em>
        ),

        underline: ({ children }: PortableTextMarkComponentProps) => (
            <span className="underline underline-offset-4">{children}</span>
        ),
    },
};
