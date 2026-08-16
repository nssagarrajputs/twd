import type { Metadata } from "next";
import { ContactPageSchema } from "@/components/StructuredData";

import PageHero from "@/components/ui/PageHero";
import ProjectInquiry from "./_components/ProjectInquiry";
import WaysToConnect from "./_components/WaysToConnect";
import FAQSection from "@/components/templates/FAQFormat";
import { client } from "@/sanity/client";
import { metaDataWebpageQuery } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const page = await client.fetch(metaDataWebpageQuery, { slug: "contact" });

    const title = page?.metaTitle ?? "Tecorbitron";
    const description =
        page?.metaDescription ?? "Best IT Services and Development Company.";
    const keywords = page?.keywords ?? [
        "tecorbitron",
        "web development company",
        "app development company",
        "information technology (it) company",
    ];

    return {
        title,
        description,
        keywords,
        alternates: { canonical: "/contact" },
        openGraph: {
            title,
            description,
            url: "https://www.tecorbitron.com/contact",
            images: [
                {
                    url: "/opengraph/og-global.png",
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            title,
            description,
            images: ["/opengraph/og-global.png"],
        },
    };
}

const faqdata = [
    {
        question: "Do you work with international clients?",
        answer: "Absolutely. We work with clients across India, UAE, UK, USA, and beyond. Communication is seamless — we adapt to your timezone and handle everything remotely without compromising on quality or responsiveness.",
    },
    {
        question: "Are you a registered company?",
        answer: "Yes. Tecorbitron Solutions Private Limited is a fully registered company — incorporated under MCA, GST registered, and MSME certified. We are based in Ghaziabad, NCR, India. Enterprise clients and international partners can verify our credentials through official channels.",
    },
    {
        question: "Can you take over a project that's already been started?",
        answer: "Yes. We regularly take on projects that are partially built or stalled midway. We'll review what exists, assess the codebase and scope, and continue from where things left off — cleanly and without starting from scratch.",
    },
    {
        question: "Do you provide support after the project is delivered?",
        answer: "Yes. Every project includes 3 months of free post-launch support covering anything within the agreed scope. After that, we offer flexible options — a subscription-based maintenance plan or per-scope scheduled work — whatever fits your needs best.",
    },
    {
        question: "How do I know if my project is a good fit for Tecorbitron?",
        answer: "If you're a startup, SMB, or founder looking to build or improve a digital product — website, app, software, or anything in between — you're likely a great fit. We work across industries and project sizes. The best way to find out is to book a free call. We'll tell you honestly whether we're the right team for your project, and if not, we'll point you in the right direction.",
    },
    {
        question: "Do you sign an NDA before starting a project?",
        answer: "Yes — if you need an NDA before sharing sensitive project details, we're happy to sign one. Confidentiality is important to us and we treat every client's project with full discretion, with or without a formal agreement.",
    },
];

export default function Contact() {
    return (
        <main>
            <ContactPageSchema />

            <PageHero
                eyebrow="Get in Touch"
                title="Let's Connect"
                highlight="Connect"
                description="Share your idea and we'll get back to you shortly — free consultation, no strings attached."
            />

            <ProjectInquiry />
            <div className="section-edge-light"></div>

            <WaysToConnect />
            <div className="section-edge-light"></div>

            <FAQSection
                eyebrow="FAQS"
                heading="Before You Reach Out"
                items={faqdata}
            />
        </main>
    );
}
