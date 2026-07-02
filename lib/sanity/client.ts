import { createClient } from "next-sanity";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = "2024-01-01";

/**
 * Public, read-only client. Safe to use anywhere (server or client
 * components) for fetching lodges, packages, journal entries, etc.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

/**
 * Server-only client with write access via SANITY_API_TOKEN.
 * NEVER import this into a "use client" component or expose it to the
 * browser — only use it inside Route Handlers (app/api/**) or Server
 * Actions, where the token stays on the server.
 */
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});
