/**
 * Navigation targets. Each href matches a section id rendered in
 * `src/app/page.tsx` — keep the two in step when sections are added or renamed.
 */

import { contact } from "@/lib/site";
import { services } from "./home";

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
 * The footer's floor: a two-storey house front, one of Screenova's own
 * photographs, shown at a fifth of its strength over the footer's black so it
 * is texture rather than a picture. Decorative, so no `alt` — see `Footer`.
 */
export const footerPhoto = {
  src: "/images/bands/home-image-01.jpg",
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
 * Where every quote and contact action on the site goes: the form on the home
 * page. One constant, so no button anywhere can drift to a different section.
 *
 * Absolute (`/#quote`, not `#quote`) so it resolves from a city or service page
 * as well as from the home page. Arriving at it is handled by `HashScroll`,
 * which re-aims the scroll at the form until the page has finished loading —
 * the browser's own jump fires early and lands wherever the page happened to
 * be laid out at that instant.
 */
export const quoteHref = "/#quote";

/**
 * The prefix of a hash that asks for one service in the Services carousel —
 * `/#service-solar-screens`. No element carries these ids: `HashScroll` lands
 * them on the Services band and the carousel reads the rest of the hash to
 * bring that service up.
 */
export const serviceHashPrefix = "service-";

/**
 * Absolute hrefs with a leading `/`, not bare fragments.
 *
 * The site is no longer one page: the service and city pages carry the same
 * header, and `#services` from `/window-screen-repair/` points at a section
 * that is not on that document. `/#services` resolves to the home page's
 * section from anywhere, and on the home page itself it is still a
 * same-document jump — smooth scroll and all, since nothing navigates.
 *
 * Services is not in this list: the header renders it first, as a dropdown of
 * the seven services — see `serviceMenu` below. Service Areas is not in it
 * either; the footer still carries it (see `footerLinks`).
 */
export const navLinks: NavLink[] = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Why Choose Us", href: "/#why-us" },
  { label: "Screen Options", href: "/#screen-options" },
  { label: "Our Projects", href: "/#projects" },
  { label: "About Us", href: "/#about" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * The header's Services dropdown: the seven services from the Services band,
 * by their own names and in their own order, read from the same list so the
 * two cannot disagree.
 *
 * A service with a page of its own goes to that page. The other three go to
 * the Services band on the home page with that service brought up in the
 * carousel.
 */
export const serviceMenu: NavLink[] = services.items.map((service) => ({
  label: service.title,
  href: "href" in service && service.href ? service.href : `/#${serviceHashPrefix}${service.id}`,
}));

/** The footer's map of the page — the full list, Services and Service Areas included. */
export const footerLinks: NavLink[] = [
  { label: "Services", href: "/#services" },
  ...navLinks.slice(0, 5),
  { label: "Service Areas", href: "/#service-area" },
  ...navLinks.slice(5),
];
