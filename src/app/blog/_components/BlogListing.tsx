"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

import DefBlogThumbnail from "@/assets/other/default-thumbnail.webp";
import type { BlogCategory, BlogCard } from "../page";

type Props = {
    posts: BlogCard[];
    categories: BlogCategory[];
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function BlogListing({ posts, categories }: Props) {
    const [active, setActive] = useState("All");

    const filtered =
        active === "All"
            ? posts
            : posts.filter((post) => post.categories.includes(active));

    return (
        <section className="dark py-24">
            <div className="side-breathing mx-auto max-w-7xl">
                <div className="mx-auto mb-24 flex flex-wrap gap-4 select-none">
                    <button
                        type="button"
                        onClick={() => setActive("All")}
                        className={`text-16 smooth-transition text-ink-primary border-secondary-active cursor-pointer border px-4 py-2 font-medium ${
                            active === "All"
                                ? "bg-primary border-primary"
                                : "hover:border-primary active:border-primary"
                        }`}
                    >
                        All Blogs
                    </button>

                    {categories.map((cat) => (
                        <button
                            type="button"
                            key={cat.slug}
                            onClick={() => setActive(cat.slug)}
                            className={`text-16 smooth-transition text-ink-primary border-secondary-active cursor-pointer border px-4 py-2 font-medium ${
                                active === cat.slug
                                    ? "bg-primary border-primary"
                                    : "hover:border-primary active:border-primary"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 gap-12 gap-y-24 md:grid-cols-2 lg:grid-cols-3">
                        {filtered.map((post) => (
                            <Link href={`/blog/${post.slug}`} key={post._id}>
                                <div className="group flex-vertical overflow-hidden">
                                    <div className="edge-dark relative aspect-4/2 border">
                                        <Image
                                            src={
                                                post.coverImage ||
                                                DefBlogThumbnail
                                            }
                                            alt={post.title}
                                            fill
                                            loading="eager"
                                            className="object-cover transition-transform duration-500 group-hover:scale-102 group-active:scale-103 group-active:grayscale-0"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        />
                                    </div>

                                    <div className="flex flex-col-reverse gap-6 py-4">
                                        <h3 className="card-heading group-hover:text-primary smooth-transition">
                                            {post.title}
                                        </h3>

                                        <div className="text-14 mt-auto flex items-center gap-4 pt-3">
                                            <span className="text-primary smooth-transition group-hover:text-malachite group-active:text-malachite underline-offset-4 group-hover:underline group-active:underline">
                                                Read Article
                                            </span>

                                            <span className="text-ink-muted">
                                                {formatDate(post.publishedAt)}
                                            </span>

                                            <span className="text-ink-muted">
                                                {post.readTime} min read
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex-center py-32 text-center">
                        <p className="text-ink-muted text-h4 font-medium">
                            No articles found in the category
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
