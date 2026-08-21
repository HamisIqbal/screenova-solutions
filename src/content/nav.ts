/**
 * Navigation targets. Each href matches a section id rendered in
 * `src/app/page.tsx` — keep the two in step when sections are added or renamed.
 */

import { contact } from "@/lib/site";

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

/**
 * The header's one button. It dials rather than scrolling to the form: the
 * quote form is already the destination of every section CTA on the page, and
 * the header — the one thing visible at every scroll position — is better spent
 * on the action a visitor cannot reach by scrolling. The number lives in
 * `src/lib/site.ts` so the header, the footer, the form and the closer all
 * carry the same one.
 *
 * The face used to read "Call Us Today!" with the number hidden in the
 * accessible name. It is the number now. A phone number in a header is not a
 * call to action, it is a fact somebody came to the site to find — and on a
 * desktop, where tapping the pill does nothing useful, the words were the only
 * thing on the page and the digits were nowhere. So the digits are the label,
 * and the sentence has become the accessible name instead.
 */
export const navCta: NavLink = {
  label: contact.phone.label,
  href: contact.phone.href,
};

/**
 * Absolute hrefs with a leading `/`, not bare fragments.
 *
 * The site is no longer one page: the service and city pages carry the same
 * header, and `#services` from `/window-screen-repair/` points at a section
 * that is not on that document. `/#services` resolves to the home page's
 * section from anywhere, and on the home page itself it is still a
 * same-document jump — smooth scroll and all, since nothing navigates.
 */
export const navLinks: NavLink[] = [
  { label: "Services", href: "/#services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why Choose Us", href: "/#why-us" },
  { label: "Screen Options", href: "/#screen-options" },
  { label: "Our Projects", href: "/#projects" },
  { label: "About Us", href: "/#about" },
  { label: "Service Areas", href: "/#service-area" },
  { label: "FAQ", href: "/#faq" },
];
