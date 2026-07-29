import BlogHero from "@/components/Blog/BlogHero";
import BlogList from "@/components/Blog/BlogList";

export const metadata = {
  title: "Journal | Savannah Retreats Africa",
  description:
    "News, travel guides, and stories from the Savannah Retreats Africa team.",
};

export default function BlogPage() {
  return (
    <main className="relative overflow-hidden">
      <BlogHero />
      <BlogList />
    </main>
  );
}
