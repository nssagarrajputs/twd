import Image from "next/image";
import type {
    PortableTextComponents,
    PortableTextComponentProps,
    PortableTextBlock,
    PortableTextMarkComponentProps,
    PortableTextListComponent,
    PortableTextListItemComponent,
} from "@portabletext/react";

import DefaultImage from "@/assets/other/default-thumbnail.webp";

// ─── Types ────────────────────────────────────────────────────────────────────

type InlineImage = {
    _type: "image";
    asset: { url: string };
    alt?: string;
    caption?: string;
};

type CodeBlock = {
    _type: "code";
    code: string;
    language?: string;
    filename?: string;
};

// ─── Shared ptComponents ──────────────────────────────────────────────────────

export const bcsComponents: PortableTextComponents = {
    block: {
        h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
            <h2 className="text-ink-primary text-h2 mt-12 mb-4">{children}</h2>
        ),
        h3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
            <h3 className="">{children}</h3>
        ),
        normal: ({
            children,
        }: PortableTextComponentProps<PortableTextBlock>) => (
            <p className="text-ink-primary text-body leading-relaxed">
                {children}
            </p>
        ),
        blockquote: ({
            children,
        }: PortableTextComponentProps<PortableTextBlock>) => (
            <blockquote className="border-malachite bg-malachite-dim text-deepspace text-16 border-l-4 py-3 pr-4 pl-5 leading-relaxed italic">
                {children}
            </blockquote>
        ),
    },

    list: {
        bullet: (({ children }) => (
            <ul className="my-4 list-outside list-disc pl-8">{children}</ul>
        )) as PortableTextListComponent,
        number: (({ children }) => (
            <ol className="my-4 list-outside list-disc pl-8">{children}</ol>
        )) as PortableTextListComponent,
    },

    listItem: {
        bullet: (({ children }) => (
            <li className="text-ink-primary mb-2">{children}</li>
        )) as PortableTextListItemComponent,
        number: (({ children }) => (
            <li className="text-ink-primary mb-2">{children}</li>
        )) as PortableTextListItemComponent,
    },

    marks: {
        strong: ({ children }: PortableTextMarkComponentProps) => (
            <strong className="font-bold">{children}</strong>
        ),
        em: ({ children }: PortableTextMarkComponentProps) => (
            <em className="italic">{children}</em>
        ),
        underline: ({ children }: PortableTextMarkComponentProps) => (
            <span className="underline underline-offset-4">{children}</span>
        ),
        code: ({ children }: PortableTextMarkComponentProps) => (
            <code className="bg-deepspace-dim border-base text-malachite-rich text-small rounded border p-4">
                {children}
            </code>
        ),
        link: ({ children, value }: PortableTextMarkComponentProps) => (
            <a
                href={value?.href}
                target={value?.blank ? "_blank" : "_self"}
                rel={value?.blank ? "noopener noreferrer" : undefined}
                className="button-text"
            >
                {children}
            </a>
        ),
    },

    types: {
        // Inline Image
        image: ({ value }: { value: InlineImage }) => (
            <figure className="my-2">
                <div className="edge-dark mx-auto my-6 max-w-4xl border">
                    <Image
                        src={value.asset?.url || DefaultImage}
                        alt={value.alt ?? "Image"}
                        width={800}
                        height={450}
                        loading="lazy"
                        className="h-auto w-full object-cover"
                    />
                </div>
                {value.caption && (
                    <figcaption className="text-ink-muted text-12 mt-2 text-center font-medium">
                        {value.caption}
                    </figcaption>
                )}
            </figure>
        ),

        // Code Block
        code: ({ value }: { value: CodeBlock }) => (
            <div className="border-border my-2 overflow-hidden rounded-2xl border">
                {value.filename && (
                    <div className="bg-deepspace-deep flex items-center gap-2 border-b border-white/10 px-4 py-2">
                        <span className="bg-error/70 h-2.5 w-2.5 rounded-full" />
                        <span className="bg-warning/70 h-2.5 w-2.5 rounded-full" />
                        <span className="bg-success/70 h-2.5 w-2.5 rounded-full" />
                        <span className="ml-2 text-xs text-white/40">
                            {value.filename}
                        </span>
                    </div>
                )}
                <pre className="bg-deepspace overflow-x-auto p-5 text-sm leading-relaxed">
                    <code className="text-white/80">{value.code}</code>
                </pre>
            </div>
        ),
    },
};
