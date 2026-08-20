import type {
    PortableTextBlock,
    PortableTextComponentProps,
    PortableTextComponents,
    PortableTextListComponent,
    PortableTextListItemComponent,
    PortableTextMarkComponentProps,
} from "@portabletext/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type LinkMark = {
    _type: "link";
    href: string;
    blank?: boolean;
};

// ─── Legal Page Portable Text Components ─────────────────────────────────────

export const legalTextComponents: PortableTextComponents = {
    // ─── Blocks ───────────────────────────────────────────────────────────────

    block: {
        h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
            <h2 className="text-h3 mt-16 mb-4">{children}</h2>
        ),

        h3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
            <h3 className="text-18 mt-4 mb-2 font-medium">{children}</h3>
        ),
        normal: ({
            children,
        }: PortableTextComponentProps<PortableTextBlock>) => (
            <p className="text-18 leading-relaxed">{children}</p>
        ),
    },

    // ─── Lists ───────────────────────────────────────────────────────────────

    list: {
        bullet: (({ children }) => (
            <ul className="my-4 list-outside list-disc pl-8">{children}</ul>
        )) as PortableTextListComponent,

        number: (({ children }) => (
            <ol className="my-4 list-outside list-decimal pl-8">{children}</ol>
        )) as PortableTextListComponent,
    },

    // ─── List Items ──────────────────────────────────────────────────────────

    listItem: {
        bullet: (({ children }) => (
            <li className="text-ink-primary text-18 mb-2">{children}</li>
        )) as PortableTextListItemComponent,

        number: (({ children }) => (
            <li className="text-ink-primary text-18 mb-2">{children}</li>
        )) as PortableTextListItemComponent,
    },

    // ─── Marks ────────────────────────────────────────────────────────────────

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

        link: ({
            children,
            value,
        }: PortableTextMarkComponentProps<LinkMark>) => (
            <a
                href={value?.href}
                target={value?.blank ? "_blank" : undefined}
                rel={value?.blank ? "noopener noreferrer" : undefined}
                className="hover:text-primary smooth-transition underline underline-offset-4"
            >
                {children}
            </a>
        ),
    },
};
