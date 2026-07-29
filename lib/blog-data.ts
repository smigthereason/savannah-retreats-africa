// Empty on purpose — no real posts exist yet. The page itself is fully
// built and ready (app/(root)/blog); the nav link is commented out in
// lib/data.ts's navLinks until there's real content to show. Add posts
// here (or wire this up to Sanity later, same pattern as the rest of
// this file) and the listing + individual post pages both work as-is.

export type BlogPost = {
  slug: string;
  title: string;
  category: "News" | "Travel Guide" | "Testimonial" | "Team";
  excerpt: string;
  body: string[]; // one paragraph per entry
  author: string;
  date: string; // ISO date
  image: string;
};

export const blogPosts: BlogPost[] = [];
