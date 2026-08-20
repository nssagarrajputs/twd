import Image from "next/image";
import { ArrowRight } from "lucide-react";
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

type YouTubeBlock = { _type: "youtube"; url: string };

type TwitterBlock = { _type: "twitter"; url: string };

type CalloutBlock = {
    _type: "callout";
    type: "tip" | "info" | "warning" | "danger";
    content: string;
};

type DividerBlock = { _type: "divider"; style: "line" | "dots" | "star" };

type CodeBlock = {
    _type: "code";
    code: string;
    language?: string;
    filename?: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getYouTubeId(url: string) {
    const match = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? match[1] : null;
}

// ─── Callout Config ───────────────────────────────────────────────────────────

const calloutConfig = {
    tip: {
        icon: "💡",
        bg: "bg-success/10",
        border: "border-success",
        label: "Tip",
    },
    info: {
        icon: "ℹ️",
        bg: "bg-info/10",
        border: "border-info",
        label: "Info",
    },
    warning: {
        icon: "⚠️",
        bg: "bg-warning/10",
        border: "border-warning",
        label: "Warning",
    },
    danger: {
        icon: "🚨",
        bg: "bg-error/10",
        border: "border-error",
        label: "Danger",
    },
};

// ─── Shared ptComponents ──────────────────────────────────────────────────────

export const ptComponents: PortableTextComponents = {
    block: {
        normal: ({
            children,
        }: PortableTextComponentProps<PortableTextBlock>) => (
            <p className="text-body text-ink-secondary leading-relaxed">
                {children}
            </p>
        ),
        h2: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
            <h2 className="text-ink-primary text-h3 mt-10 mb-4 scroll-mt-28 font-bold">
                {children}
            </h2>
        ),
        h3: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
            <h3 className="text-ink-primary text-h4 mt-4 scroll-mt-28 font-bold">
                {children}
            </h3>
        ),
        h4: ({ children }: PortableTextComponentProps<PortableTextBlock>) => (
            <h4 className="text-ink-primary text-18 mt-4 mb-2 font-medium">
                {children}
            </h4>
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
            <ul className="flex flex-col gap-2.5 pl-1">{children}</ul>
        )) as PortableTextListComponent,
        number: (({ children }) => (
            <ol className="flex list-inside list-decimal flex-col gap-2.5 pl-1">
                {children}
            </ol>
        )) as PortableTextListComponent,
    },

    listItem: {
        bullet: (({ children }) => (
            <li className="text-ink-secondary text-body flex gap-3 leading-relaxed">
                <span className="text-malachite">•</span>
                <span>{children}</span>
            </li>
        )) as PortableTextListItemComponent,
        number: (({ children }) => (
            <li className="text-ink-secondary text-body flex gap-3 leading-relaxed">
                {children}
            </li>
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

        // YouTube Embed
        youtube: ({ value }: { value: YouTubeBlock }) => {
            const id = getYouTubeId(value.url);
            if (!id) return null;
            return (
                <div className="border-border my-2 aspect-video overflow-hidden rounded-2xl border">
                    <iframe
                        src={`https://www.youtube.com/embed/${id}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="h-full w-full"
                    />
                </div>
            );
        },

        // Twitter/X Embed
        twitter: ({ value }: { value: TwitterBlock }) => (
            <a
                href={value.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-border bg-surface text-deepspace hover:border-malachite my-2 flex items-center gap-3 rounded-2xl border px-5 py-4 text-sm font-bold transition-colors duration-200"
            >
                <span className="text-xl">𝕏</span>
                <span>View Tweet</span>
                <ArrowRight size={13} className="text-malachite ml-auto" />
            </a>
        ),

        // Callout Box
        callout: ({ value }: { value: CalloutBlock }) => {
            const cfg = calloutConfig[value.type] ?? calloutConfig.tip;
            return (
                <div
                    className={`my-2 flex gap-3 rounded-2xl border ${cfg.border} ${cfg.bg} px-5 py-4`}
                >
                    <span className="mt-0.5 shrink-0 text-xl">{cfg.icon}</span>
                    <div className="flex flex-col gap-1">
                        <span className="text-secondary text-12 font-bold tracking-widest uppercase">
                            {cfg.label}
                        </span>
                        <p className="text-ink-muted text-14 leading-relaxed font-light">
                            {value.content}
                        </p>
                    </div>
                </div>
            );
        },

        // Divider
        divider: ({ value }: { value: DividerBlock }) => {
            const map = {
                line: <hr className="border-border my-2" />,
                dots: (
                    <div className="text-border text-18 my-2 flex justify-center gap-2">
                        • • •
                    </div>
                ),
                star: (
                    <div className="text-border text-18 my-2 flex justify-center">
                        ★
                    </div>
                ),
            };
            return map[value.style] ?? map.line;
        },
    },
};
