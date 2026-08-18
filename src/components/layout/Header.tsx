"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations";
import { CtaLink } from "@/components/ui";
import { logo, navCta, navLinks } from "@/content/nav";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";

/**
 * Site header. No bar — a transparent overlay carrying three things over the
 * top of the hero photograph: the mark on the left, a glass capsule of links in
 * the middle of the window, the quote button on the right.
 *
 * Because there is no bar, the hero picture begins at the very top of the
 * document rather than under a lid. It always did — the image is `inset-0` on a
 * band that starts at y=0 — but a solid header was painting over its first
 * 88px. Removing the paint is the whole of that change.
 *
 * The capsule is centred on the *window*, not on the space between the mark and
 * the button, which is why it is positioned rather than laid out: those two are
 * different widths, so a flex row would have put it visibly off-centre. The row
 * keeps the 88px height and the 24px side inset the bar had, so the mark and
 * the button have not moved by a pixel.
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
const LOGO_HEIGHT = 56;
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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50">
      {/* First in the DOM so the row below always paints on top of it. */}
      <FullScreenMenu open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      {/*
        `data-ground="sky"` for the roles — white lettering, a white quote pill
        carrying black — but `bg-transparent` to refuse the ground's own fill.
        Utilities sort after the base layer, so the class wins over the
        `[data-ground]` rule without an `!important`.
      */}
      <div
        data-ground="sky"
        className="relative z-10 flex min-h-22 items-center bg-transparent px-6"
      >
        {/* The scroll backdrop. Its own element so it can cross-fade: `-z-10`
            inside this element's stacking context puts it above the row's
            background and below everything in the row. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 bg-black transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        <a
          href="#hero"
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
            // Unchanged from the bar: 44px tall, 56px past sm, sitting 24px in
            // from the window and centred in an 88px row. Removing the bar was
            // not supposed to move it, so none of those numbers moved.
            className="h-11 w-auto sm:h-14"
          />
        </a>

        <DesktopNav />

        {/* `ml-auto` rather than a cell: with the capsule out of the flow, the
            button is the only thing left to push right. */}
        <div className="pointer-events-auto ml-auto hidden items-center xl:flex">
          <CtaLink href={navCta.href}>{navCta.label}</CtaLink>
        </div>

        <div className="pointer-events-auto ml-auto flex items-center xl:hidden">
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className={`font-title h-11 cursor-pointer rounded-xl px-5 transition-colors duration-300 ${
              // Closed, a quiet outline in the ground's own ink. Open, it fills
              // with that ink and takes the ground back as its lettering. Both
              // states are ground roles, so the button follows the overlay's
              // colour rather than naming one. Its radius matches the capsule's.
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
      <nav
        aria-label="Primary"
        className="px-gutter flex h-full flex-col justify-center pt-24 pb-12"
      >
        <ul className="flex flex-col items-start gap-1">
          {navLinks.map((link, i) => (
            <li
              key={link.href}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              style={{ opacity: 0 }}
            >
              <a
                href={link.href}
                onClick={onNavigate}
                className="font-title block py-2 no-underline"
                style={{ fontSize: "clamp(1.25rem, 5.5vw, 1.75rem)", fontWeight: 400 }}
              >
                {link.label}
              </a>
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
          <CtaLink href={navCta.href} onClick={onNavigate}>
            {navCta.label}
          </CtaLink>
        </div>
      </nav>
    </div>
  );
}

/**
 * The links, and the one piece of surface left in the header: a glass capsule
 * sitting under them and nothing else.
 *
 * Centred on the window with `left-1/2 -translate-x-1/2` rather than by the
 * flex row, because the mark and the quote button are different widths — laid
 * out, the capsule would centre on the gap between them and read as visibly
 * off. Out of the flow it also cannot push the button around as the link list
 * changes length.
 *
 * The glass is three things at once, and it needs all three: `backdrop-blur`
 * for the defocus, `backdrop-saturate` because blurring alone drains the colour
 * out of what is behind it, and a 10% white wash so the panel still has a body
 * on a surface too flat to blur interestingly. The border is the same white at
 * 15%, which is what gives the edge its lit look rather than a drawn one.
 *
 * White is `--on-ground`, not a named colour, so the capsule follows the
 * overlay's roles like everything else in here.
 *
 * Contrast, on the hero's scrim behind it: the wash lifts a worst-case blown
 * window from sRGB 0.363 to 0.427, which still leaves white lettering at
 * 5.2:1 — above the 4.5:1 body threshold, and the links are the only thing
 * riding on it.
 */
function DesktopNav() {
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-(--on-ground)/15 bg-(--on-ground)/10 px-2 py-1.5 backdrop-blur-xl backdrop-saturate-150 xl:flex"
    >
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="font-title hover:text-blue-soft rounded-lg px-2.5 py-1.5 whitespace-nowrap no-underline transition-colors"
          style={{ fontSize: "var(--text-nav)", fontWeight: 400 }}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
