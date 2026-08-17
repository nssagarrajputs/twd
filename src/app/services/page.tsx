import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import FAQFormat from "@/components/templates/FAQFormat";
import CTAFormat from "@/components/templates/CTAFormat";
import Industries from "./_components/Industries";
import MainServices from "./_components/MainServices";
import {
    ServicesPageSchema,
    WebServiceSchema,
    AppServiceSchema,
    EcommerceServiceSchema,
    SeoServiceSchema,
} from "@/components/StructuredData";

import { client } from "@/sanity/client";
import { META_DATA_WEBPAGE_QUERY } from "@/sanity/lib/queries";

export async function generateMetadata(): Promise<Metadata> {
    const slug = "services";

    const metaData = await client.fetch(META_DATA_WEBPAGE_QUERY, {
        slug,
    });

    const title = metaData?.metaTitle ?? "View All Services - Tecorbitron";
    const description =
        metaData?.metaDescription ?? "Best IT Services Company.";
    const keywords = metaData?.keywords ?? ["view all services tecorbitron"];

    return {
        title,
        description,
        keywords,

        alternates: { canonical: `/${slug}` },
        openGraph: {
            type: "website",
            locale: "en_IN",
            siteName: "Tecorbitron",
            url: `https://www.tecorbitron.com/${slug}`,
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
            images: ["/opengraph/og-global.png"],
        },
    };
}

const faqdata = [
    {
        question: "What services does Tecorbitron offer?",
        answer: "We offer web development, app development, e-commerce development, and SEO services. From simple business websites to complex web apps, mobile apps, and online stores — we cover the full spectrum of digital product development.",
    },
    {
        question: "How long does it take to complete a project?",
        answer: "It depends on the scope and complexity of your project. A standard business website typically takes 2–4 weeks, while a custom web app or mobile app can take 6–16 weeks. We share a clear timeline before we begin so you always know what to expect.",
    },
    {
        question: "What is your pricing? Do you have fixed packages?",
        answer: "We don't offer one-size-fits-all packages. Every project is scoped and priced based on your specific requirements. We offer Fixed Quote, Pay as You Go, Staged Delivery, and Monthly Retainer models — so you always get a pricing structure that fits your project.",
    },
    {
        question: "What happens after the project is delivered?",
        answer: "Every project includes 3 months of free post-launch support. During this period, we handle bug fixes, minor adjustments, and technical issues at no extra cost. After that, we offer ongoing support and maintenance through our best pricing model plans.",
    },
    {
        question: "Can you work with our existing team or codebase?",
        answer: "Absolutely. We're comfortable jumping into existing projects, reviewing codebases, and collaborating with in-house teams. Whether you need extra development capacity or a fresh perspective on an ongoing project, we can plug in wherever needed.",
    },
    {
        question: "How do we communicate during the project?",
        answer: "We keep it simple — WhatsApp for quick updates, email for formal communication, and weekly video calls for project reviews. You always know what's happening.",
    },
    {
        question: "Do you work with international clients?",
        answer: "Yes. We work with clients across India, USA, UK, UAE, and beyond. We're comfortable with different time zones and communicate in English. Payments in multiple currencies accepted.",
    },
    {
        question: "Are you a registered company?",
        answer: "Yes. We are Tecorbitron Solutions Pvt. Ltd., incorporated in August 2024, GST registered, and based in Ghaziabad, NCR, India.",
    },
];

export default function Services() {
    return (
        <main>
            <ServicesPageSchema />
            <WebServiceSchema />
            <AppServiceSchema />
            <EcommerceServiceSchema />
            <SeoServiceSchema />

            <PageHero
                eyebrow="What We OFFER"
                title="Explore Our Services"
                highlight="Services"
                description="Technical services scoped to your business — not cookie-cutter packages. Work within your timeline and budget."
            />

            <MainServices />
            <div className="section-edge-light"></div>

            <Industries />
            <div className="section-edge-light"></div>

            <FAQFormat
                eyebrow="FAQ"
                heading="Frequently Asked Questions"
                items={faqdata}
            />

            <CTAFormat
                eyebrow="NOT SURE WHERE TO BEGIN?"
                heading="We'll help you figure out the best approach."
                highlight="best approach."
                primaryAction={{
                    text: "Discuss Your Project",
                    href: "/contact",
                }}
                secondaryAction={{
                    text: "Explore Our Work",
                    href: "/case-studies",
                }}
            />
        </main>
    );
}
