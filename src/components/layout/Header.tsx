"use client";

import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations";
import { CtaLink } from "@/components/ui";
import { logo, navCta, navLinks } from "@/content/nav";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";
import { contact } from "@/lib/site";

/**
 * Site header. No bar — a transparent overlay carrying three things over the
 * top of the hero photograph: the mark on the left, a glass capsule of links in
 * the middle of the window, the call button on the right.
 *
 * Because there is no bar, the hero picture begins at the very top of the
 * document rather than under a lid. It always did — the image is `inset-0` on a
 * band that starts at y=0 — but a solid header was painting over its first
 * 88px. Removing the paint is the whole of that change.
 *
 * The capsule is centred on the *window*, not on the space between the mark and
 * the button, which is why it is positioned rather than laid out: those two are
 * different widths, so a flex row would have put it visibly off-centre. The row
 * is 96px tall, sized around the mark rather than the other way round, and
 * keeps the 24px side inset the bar had.
 *
 * `--header-clearance` is the room the overlay needs before page content can
 * start, and the first section's top padding and every anchor's scroll offset
 * are both derived from that one token.
 *
 * ---------------------------------------------------------------------------
 * The one thing here that is not in the brief: a backdrop that fades in on
 * scroll.
 *
 * A transparent header is designed against the hero, and the hero is dark. Two
 * hundred pixels further down the page is white, and white lettering, a white
 * quote pill and a mark that is half white type all vanish into it — the header
 * would be functionally invisible for nine tenths of the scroll. So a black
 * scrim fades in behind the whole overlay.
 *
 * It arrives on the first flick of the wheel rather than at the foot of the
 * hero: the moment the page moves the header is a floating thing over moving
 * picture, and it wants its own ground from then on. Only the resting state at
 * the very top is left bare. Delete `scrolled` and the class it gates to
 * remove it.
 */

/** Scroll past this many pixels and the backdrop is in. A flick of the wheel. */
const LIFT_AT = 8;
/** Rendered box for the brand mark at its largest, in its native 3:1 ratio. */
const LOGO_HEIGHT = 72;
const LOGO_WIDTH = Math.round((LOGO_HEIGHT * logo.width) / logo.height);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // A single threshold a few pixels down, so the backdrop is keyed to "the page
  // has moved" and nothing else. Nothing to measure and nothing to re-measure
  // on resize — the old hero-bottom trigger needed both.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > LIFT_AT);

    onScroll(); // A reload part-way down the page starts scrolled.
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape closes the full-screen layer, and the page must not scroll behind it.
  useEffect(() => {
    if (!menuOpen) return;

    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    // Past xl both the panel and its close button are display:none. Without
    // this, rotating a tablet mid-menu would leave the page scroll-locked with
    // nothing left on screen to unlock it.
    const onResize = () => {
      if (window.matchMedia("(min-width: 80rem)").matches) setMenuOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onResize);

    return () => {
      root.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onResize);
    };
  }, [menuOpen]);

  return (
    // The entrance brings the header in on the same frame as the headline —
    // both are `data-intro-at="0"` — and it comes down from above the window
    // rather than up from the page, which is the one direction a fixed header
    // at the top of the document can arrive from without reading as content.
    <header
      data-intro
      data-intro-at="0"
      data-intro-y="-14"
      className="pointer-events-none fixed inset-x-0 top-0 z-50"
    >
      {/* First in the DOM so the row below always paints on top of it. */}
      <FullScreenMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      {/*
        `data-ground="sky"` for the roles — white lettering, a white quote pill
        carrying black — but `bg-transparent` to refuse the ground's own fill.
        Utilities sort after the base layer, so the class wins over the
        `[data-ground]` rule without an `!important`.
      */}
      {/* The header redesign changed one thing about this row: it steps down on
          scroll, 96px at rest to 72px once the page has moved. A tall header is
          right when it is the top of a photograph and wrong when it is a bar
          following you down a page, and the reclaimed 24px is 24px more of
          whatever is being read.

          The row stays against the window rather than inside the page measure.
          That was tried and reverted: the nav is centred on this element, and
          pulling the element in to a 1152px column moves the nav 144px right of
          where the mark ends on a 1440px display, which is a collision at every
          width the desktop nav exists at. */}
      <div
        data-ground="sky"
        className={`relative z-10 flex items-center bg-transparent px-6 transition-[min-height] duration-500 ${
          scrolled ? "min-h-[4.5rem]" : "min-h-24"
        }`}
      >
        {/* The scroll backdrop. Its own element so it can cross-fade: `-z-10`
            inside this element's stacking context puts it above the row's
            background and below everything in the row.

            The header redesign adds the hairline along its foot. A solid black bar
            ending in nothing reads as a panel floating over the page; a bar
            that ends in a line reads as the top edge of a document. It fades in
            with the backdrop it belongs to. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 border-b border-white/10 bg-black transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* `next/link`, not a bare anchor: the mark is on every page in the
            app, and from a service or city page this is a real navigation back
            to the home page rather than a jump within the document. */}
        <Link
          href="/#hero"
          onClick={() => setMenuOpen(false)}
          aria-label={`${logo.alt} — back to top`}
          className="pointer-events-auto flex shrink-0 items-center no-underline"
        >
          <Image
            src={logo.src}
            // The mark's own pixels are 2172x724. Declaring the *rendered* box
            // instead keeps next/image's srcSet to a 1x/2x pair around 130px
            // rather than a ladder up to 3840w, which is the difference between
            // a few KB and the full 744KB source in the header.
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            alt=""
            priority
            // 56px tall, 72px past sm — a step up from the 44/56 it was, so
            // the mark reads as the mark rather than as a third piece of
            // chrome. `--header-clearance` is 120px, so the row still clears
            // the page content at its full height.
            //
            // It steps down with the row on scroll, so the optical
            // breathing room above and below the mark is the same at both
            // heights rather than the mark suddenly filling a shorter bar.
            className={`w-auto transition-[height] duration-500 ${
              scrolled ? "h-11 sm:h-13" : "h-14 sm:h-18"
            }`}
          />
        </Link>

        <DesktopNav />

        {/* `ml-auto` rather than a cell: with the nav out of the flow, the
            number is the only thing left to push right. */}
        <div className="pointer-events-auto ml-auto hidden items-center xl:flex">
          {/* The number, and it is written as a number rather than dressed as a
              button.

              The header redesign takes it out of the white pill. A filled capsule in a
              header is a product's primary action; a phone number set large and
              plain, with a rule under it, is how a company that answers the
              phone puts its number on a page. It is still the same `tel:` link
              with the same accessible name, and it is now the largest type in
              the row — which is the correct hierarchy for a business whose best
              outcome is that you call.

              The icon is decoration; the digits beside it are the label. */}
          <a
            href={navCta.href}
            aria-label={`Call Screenova today on ${contact.phone.label}`}
            className="font-title group flex items-center gap-2.5 text-(--on-ground) no-underline"
          >
            <Phone
              aria-hidden="true"
              className="h-[1.05rem] w-[1.05rem] shrink-0 transition-colors duration-300 group-hover:text-(--color-green)"
            />
            <span
              className="border-b border-white/25 pb-0.5 tabular-nums transition-colors duration-300 group-hover:border-white/80"
              style={{ fontSize: "1.0625rem", fontWeight: 500, letterSpacing: "0.005em" }}
            >
              {navCta.label}
            </span>
          </a>
        </div>

        <div className="pointer-events-auto ml-auto flex items-center gap-2 sm:gap-3 xl:hidden">
          {/* Below the desktop breakpoint there is no room for the pill beside
              the mark and the menu button, but the number still has to be one
              tap away. So it is a bare link rather than a pill: the icon alone
              on the narrowest phones, icon and digits from `sm` where the row
              has the width for them. Either way it is the same `tel:` href, and
              either way its accessible name is the number itself. */}
          <a
            href={navCta.href}
            aria-label={`Call Screenova on ${contact.phone.label}`}
            className="font-title flex h-11 items-center gap-2 rounded-(--radius-control) px-3 text-(--on-ground) no-underline transition-colors duration-300 hover:text-(--color-green)"
            style={{ fontSize: "0.8125rem", fontWeight: 500 }}
          >
            <Phone aria-hidden="true" className="h-4 w-4 shrink-0" />
            <span className="hidden whitespace-nowrap sm:inline">{navCta.label}</span>
          </a>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className={`font-title h-11 cursor-pointer rounded-(--radius-control) px-5 transition-colors duration-300 ${
              // Closed, a quiet outline in the ground's own ink. Open, it fills
              // with that ink and takes the ground back as its lettering. Both
              // states are ground roles, so the button follows the overlay's
              // colour rather than naming one.
              //
              // The header redesign only squares the corner off, from
              // `rounded-xl` to `--radius-control` — the radius the form fields
              // already use — so the two controls in the mobile row are the
              // same shape as each other and as the rest of the site's
              // controls, rather than a third radius invented for the header.
              menuOpen
                ? "bg-(--on-ground) text-(--ground)"
                : "border border-(--on-ground)/35 bg-transparent text-(--on-ground) hover:border-(--on-ground)/70"
            }`}
            style={{ fontSize: "var(--text-nav)", fontWeight: 400, letterSpacing: "0.12em" }}
          >
            {menuOpen ? "CLOSE" : "MENU"}
          </button>
        </div>
      </div>
    </header>
  );
}

/**
 * The full-screen layer. It wipes in from the right rather than popping,
 * echoing the load cover and the direction the desktop pill grows.
 *
 * `visibility` is what takes it out of the tab order and the accessibility
 * tree while closed — a clipped-away panel is still focusable otherwise.
 */
function FullScreenMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLElement[]>([]);
  const mounted = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const panel = panelRef.current;
    const items = itemsRef.current.filter(Boolean);
    if (!panel) return;

    // The closed state is already in the markup; don't animate into it on load.
    if (!mounted.current) {
      mounted.current = true;
      if (!open) return;
    }

    const wipe = prefersReducedMotion ? 0 : 0.6;
    const fade = prefersReducedMotion ? 0 : 0.45;
    const timeline = gsap.timeline();

    if (open) {
      timeline
        .set(panel, { visibility: "visible" })
        .fromTo(
          panel,
          { clipPath: "inset(0 0 0 100%)" },
          { clipPath: "inset(0 0 0 0%)", duration: wipe, ease: "power3.inOut" },
        )
        .fromTo(
          items,
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, duration: fade, stagger: 0.05, ease: "power2.out" },
          wipe * 0.4,
        );
    } else {
      timeline
        .to(items, {
          y: 10,
          opacity: 0,
          duration: prefersReducedMotion ? 0 : 0.2,
          stagger: { each: 0.03, from: "end" },
          ease: "power2.in",
        })
        .to(
          panel,
          { clipPath: "inset(0 0 0 100%)", duration: wipe * 0.75, ease: "power3.inOut" },
          prefersReducedMotion ? 0 : 0.12,
        )
        .set(panel, { visibility: "hidden" });
    }

    return () => {
      timeline.kill();
    };
  }, [open, prefersReducedMotion]);

  return (
    <div
      ref={panelRef}
      id="mobile-menu"
      data-ground="sky"
      className="pointer-events-auto fixed inset-0 z-0 xl:hidden"
      style={{ visibility: "hidden", clipPath: "inset(0 0 0 100%)" }}
    >
      {/* The panel has to survive a viewport shorter than its own contents — a
          phone held sideways is 375px tall and this list is not. Two things do
          that, and it needs both. `overflow-y-auto` gives the overflow somewhere
          to go; `m-auto` on the inner block is what centres it, in place of
          `justify-center` on the column. A centred *flex* column with more
          content than room overflows equally off both ends, and the top end is
          unreachable by scrolling — the first two links simply cannot be
          reached. Auto margins collapse to zero the moment there is no free
          space, so the same block centres when it fits and pins to the top when
          it does not. */}
      <nav
        aria-label="Primary"
        className="px-gutter flex h-full flex-col overflow-y-auto overscroll-contain pt-24 pb-12"
      >
        <div className="m-auto w-full">
          <ul className="flex flex-col items-start gap-1">
            {navLinks.map((link, i) => (
              <li
                key={link.href}
                ref={(el) => {
                  if (el) itemsRef.current[i] = el;
                }}
                style={{ opacity: 0 }}
              >
                <Link
                  href={link.href}
                  onClick={onNavigate}
                  className="font-title block py-2 no-underline"
                  style={{ fontSize: "clamp(1.25rem, 5.5vw, 1.75rem)", fontWeight: 400 }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            ref={(el) => {
              if (el) itemsRef.current[navLinks.length] = el;
            }}
            className="mt-10"
            style={{ opacity: 0 }}
          >
            <CtaLink
              href={navCta.href}
              onClick={onNavigate}
              ariaLabel={`Call Screenova today on ${contact.phone.label}`}
              className="gap-2"
            >
              <Phone aria-hidden="true" className="h-4 w-4" />
              {navCta.label}
            </CtaLink>
          </div>
        </div>
      </nav>
    </div>
  );
}

/**
 * The links. The header redesign took the glass capsule out from under them.
 *
 * The capsule was three effects stacked — a backdrop blur, a saturation boost
 * and a translucent navy wash — which is the house style of software, not of a
 * trade. It also made the navigation the second most conspicuous object in the
 * header after the mark, when navigation is the thing a visitor uses only if
 * the hero has failed to answer them.
 *
 * What is left is the eight words, spaced properly, with a rule that draws
 * itself under whichever one the pointer is on. Nothing is filled, nothing is
 * blurred and nothing is highlighted except the link actually being pointed at
 * — the underline grows from its left edge, which is the same direction the
 * word is read in.
 *
 * The original note on the capsule follows, for whoever reverts this.
 *
 * Centred on the window with `left-1/2 -translate-x-1/2` rather than by the
 * flex row, because the mark and the quote button are different widths — laid
 * out, the capsule would centre on the gap between them and read as visibly
 * off. Out of the flow it also cannot push the button around as the link list
 * changes length.
 *
 * The glass is three things at once, and it needs all three: `backdrop-blur`
 * for the defocus, `backdrop-saturate` because blurring alone drains the colour
 * out of what is behind it, and a navy wash so the panel still has a body on a
 * surface too flat to blur interestingly. The wash is dark rather than the
 * white it was: at 55% navy the capsule reads as its own dark pane over the
 * photograph instead of as a lightened patch of it, and white lettering on it
 * clears 12:1 against a blown window rather than the 5.2:1 the white wash left.
 * The border is white at 18%, which is what gives the edge its lit look rather
 * than a drawn one.
 *
 * It is deliberately small. Eight links on one line is a lot of capsule, and a
 * bar that spans most of the window stops reading as a floating object over the
 * photograph and starts reading as the header it was removed to avoid. Tighter
 * padding, a smaller radius and type a notch under `--text-nav` pull it back to
 * a pill the eye takes in at once. It is also centred on both axes now —
 * `top-1/2` with a matching translate — so it stays on the middle of the row
 * whatever the row's height, rather than being stretched by the flex row.
 *
 * Hover is a colour shift and nothing else — the word takes soft blue and the
 * glass under it stays as it is. Soft blue rather than green: it is the same
 * hover the footer's links take, so the two navigation lists on the page behave
 * identically, and on a pane this dark #6FB6FF is the light end of the brand
 * blue rather than a second accent colour introduced for one state. It was a solid white pill before, and
 * on a pane this dark that inversion was the loudest thing in the header: it
 * read as a selected item rather than as a pointed-at one. Nothing in the row
 * is marked except the link the mouse is actually on.
 */
function DesktopNav() {
  return (
    <nav
      aria-label="Primary"
      // Centred on the window with `left-1/2 -translate-x-1/2`, and pinned to
      // the middle of the row with `top-1/2 -translate-y-1/2` — so it rides the
      // row's height as the header steps down on scroll, with nothing to
      // synchronise.
      //
      // The spacing here is the capsule's own, to the pixel: `gap-0.5` with
      // `px-2` on each link. That is not inertia. Eight links, a 216px mark and
      // a phone number is very nearly more than a 1280px window holds, and the
      // capsule's measurements were the ones that fitted. Opening the spacing
      // is what pushed the nav into the mark; the surface was the thing worth
      // removing, not the geometry.
      className="pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-0.5 xl:flex"
    >
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          // The rule is an `after` pseudo-element scaled from its left edge, so
          // it draws itself under the word rather than appearing beneath it,
          // and it runs the width of the text rather than the padding box.
          // `bg-current` means it is always the colour of the word above it and
          // never a second colour to keep in step.
          //
          // `after:content-['']` is not optional. Tailwind v4 does not imply a
          // `content` for `before:`/`after:` variants, and without one the
          // pseudo-element is never generated — the rule simply never appears,
          // silently and only on hover, which is the kind of thing that ships.
          className="font-title relative px-2 py-1 whitespace-nowrap text-(--on-ground)/85 no-underline transition-colors duration-300 after:absolute after:inset-x-2 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:text-(--on-ground) hover:after:scale-x-100"
          // A notch under `--text-nav`. This is the one place on the page
          // carrying eight items on a single line, and the token's 14px is
          // sized for the standalone MENU button rather than for a run of them.
          style={{ fontSize: "0.8125rem", fontWeight: 400 }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
