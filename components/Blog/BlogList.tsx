import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blog-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogList() {
  if (blogPosts.length === 0) {
    return (
      <section className="bg-linen w-full">
        <div className="section-pad mx-auto max-w-8xl py-24 text-center md:py-28">
          <span className="eyebrow">Coming Soon</span>
          <h2 className="mt-4 font-display text-3xl text-umber md:text-4xl">
            The first post is on its way.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-ink">
            We're writing up trip notes, travel guides, and news worth
            sharing — check back soon.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-linen w-full">
      <div className="section-pad mx-auto max-w-8xl py-24 md:py-28">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-sand"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-[10px] uppercase tracking-widest2 text-ochre">
                  {post.category} · {formatDate(post.date)}
                </p>
                <h3 className="mt-2 font-display text-xl text-umber">
                  {post.title}
                </h3>
                <p className="mt-2 text-[13px] leading-relaxed text-ink/80">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
