/**
 * Navigation targets. Each href matches a section id rendered in
 * `src/app/page.tsx` — keep the two in step when sections are added or renamed.
 */

export type NavLink = {
  label: string;
  href: string;
};

export const wordmark = "Screenova Solutions";

/**
 * The brand mark. Its lettering is white on transparent, so it only ever sits
 * on navy — the header bar and the load cover. Intrinsic size is recorded here
 * so `next/image` can reserve the box without a layout shift.
 */
export const logo = {
  src: "/images/Screenova-solution-Window-And-Door-Screens-LOGO.png",
  width: 2172,
  height: 724,
  alt: `${wordmark} — window and door screens`,
} as const;

export const navCta: NavLink = {
  label: "Get a Free Quote",
  href: "#quote",
};

export const navLinks: NavLink[] = [
  { label: "Services", href: "#services" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Why Choose Us", href: "#why-us" },
  { label: "Screen Options", href: "#screen-options" },
  { label: "About Us", href: "#about" },
  { label: "Service Areas", href: "#service-area" },
  { label: "FAQ", href: "#faq" },
];
