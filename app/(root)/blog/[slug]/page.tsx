import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { blogPosts } from "@/lib/blog-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return { title: "Journal | Savannah Retreats Africa" };
  return {
    title: `${post.title} | Savannah Retreats Africa`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  return (
    <main className="relative overflow-hidden">
      <section className="bg-linen w-full">
        <div className="section-pad mx-auto max-w-3xl py-24 md:py-28">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-[11px] uppercase tracking-widest2 text-ink/50"
          >
            <Link href="/" className="hover:text-ochre transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-ochre transition-colors">
              Journal
            </Link>
          </nav>

          <p className="mt-6 text-[11px] uppercase tracking-widest2 text-ochre">
            {post.category} · {formatDate(post.date)}
          </p>
          <h1 className="mt-3 font-display text-4xl text-umber md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-3 text-[13px] text-ink/60">By {post.author}</p>

          <div className="relative mt-10 aspect-[16/9] overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="mt-10 space-y-5">
            {post.body.map((paragraph, i) => (
              <p key={i} className="text-[15px] leading-relaxed text-ink">
                {paragraph}
              </p>
            ))}
          </div>

          <Link
            href="/blog"
            className="mt-14 inline-block text-[11px] uppercase tracking-widest2 text-ochre hover:underline"
          >
            ← Back to Journal
          </Link>
        </div>
      </section>
    </main>
  );
}
