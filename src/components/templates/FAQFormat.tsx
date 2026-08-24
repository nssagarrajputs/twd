"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { faqAnsTextComponents } from "@/components/PTF/FaqAnsText";
import type { FAQ } from "@/sanity/queries";

type FAQSectionProps = {
    eyebrow: string;
    heading: string;
    items: FAQ[];
    defaultOpenIndex?: number | null;
};

export default function FAQFormat({
    eyebrow,
    heading,
    items,
    defaultOpenIndex = null,
}: FAQSectionProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(defaultOpenIndex);

    return (
        <section className="bg-canvas-surface side-layout-spacing">
            <div className="edge-light side-breathing mx-auto max-w-7xl border-x">
                <div className="mx-auto max-w-5xl py-24 md:py-40">
                    <div className="mb-12 md:mb-24">
                        <div className="max-w-4xl">
                            <span className="eyebrow">{eyebrow}</span>
                            <h2 className="section-heading">{heading}</h2>
                        </div>
                    </div>

                    <div className="">
                        {items.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <article
                                    key={faq._id}
                                    onClick={() =>
                                        setOpenIndex(isOpen ? null : index)
                                    }
                                    className="edge-light border-b"
                                >
                                    <div className="group flex w-full items-center justify-between gap-4 py-4">
                                        <h3 className="faq-question group-hover:text-primary group-active:text-primary">
                                            {faq.question}
                                        </h3>

                                        <div
                                            className={`text-ink-primary smooth-transition flex-center ${
                                                isOpen
                                                    ? "rotate-45"
                                                    : "rotate-0"
                                            }`}
                                        >
                                            <Plus size={24} strokeWidth={1} />
                                        </div>
                                    </div>

                                    {isOpen && (
                                        <div
                                            className="max-w-3xl pb-8"
                                            onClick={(event) =>
                                                event.stopPropagation()
                                            }
                                        >
                                            <PortableText
                                                value={faq.richAnswer}
                                                components={
                                                    faqAnsTextComponents
                                                }
                                            />
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
