import { type PortableTextComponents } from "@portabletext/react";

export const faqAnsTextComponents: PortableTextComponents = {
    marks: {
        strong: ({ children }) => (
            <strong className="font-semibold">{children}</strong>
        ),

        em: ({ children }) => <em>{children}</em>,

        underline: ({ children }) => (
            <span className="underline underline-offset-4">{children}</span>
        ),

        link: ({ value, children }) => {
            const href = value?.href;
            const blank = value?.blank;

            if (!href) {
                return <>{children}</>;
            }

            return (
                <a
                    href={href}
                    target={blank ? "_blank" : undefined}
                    rel={blank ? "noopener noreferrer" : undefined}
                    className="text-primary underline underline-offset-4"
                    onClick={(event) => event.stopPropagation()}
                >
                    {children}
                </a>
            );
        },
    },

    block: {
        normal: ({ children }) => <p className="">{children}</p>,
    },

    list: {
        bullet: ({ children }) => <ul className="">{children}</ul>,

        number: ({ children }) => <ol className="">{children}</ol>,
    },

    listItem: {
        bullet: ({ children }) => <li>{children}</li>,
        number: ({ children }) => <li>{children}</li>,
    },
};
