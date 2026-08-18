import type { NextConfig } from "next";

/**
 * Response headers applied to every path, including `/public` files — Next
 * checks headers before the filesystem, so the fonts and photographs are
 * covered by the same rules as the pages.
 *
 * These are the hardening headers that cost a static marketing site nothing.
 * A full `Content-Security-Policy` is deliberately not among them: this page is
 * built almost entirely out of inline `style` props and Next's own inline
 * bootstrap scripts, so a policy strict enough to be worth having needs a
 * per-request nonce from middleware — a real change, not a config line, and one
 * to make when there is something on the page worth protecting. `frame-ancestors`
 * is the one CSP directive that stands on its own, and it is here.
 */
const securityHeaders = [
  // Clickjacking: nothing may frame this page. `frame-ancestors` supersedes
  // `X-Frame-Options` in every browser that ships CSP, which is all of them.
  { key: "Content-Security-Policy", value: "frame-ancestors 'none'" },
  { key: "X-Frame-Options", value: "DENY" },
  // No MIME sniffing — an upload that lands in `/public` is served as what it
  // says it is, not as whatever the bytes look like.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Send the origin to other sites, the full path only to ourselves. The
  // outbound links here are to Maps and the social profiles; none of them needs
  // to know which section of the page the visitor left from.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site asks for no device permissions, so it declines them all up front.
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  // Two years, subdomains included, and preload-eligible. Safe here because the
  // site is HTTPS-only on Vercel.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  headers() {
    return Promise.resolve([{ source: "/:path*", headers: securityHeaders }]);
  },
};

export default nextConfig;
