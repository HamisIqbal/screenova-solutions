"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Phone } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/animations";
import { CtaLink } from "@/components/ui";
import { logo, navCta, navLinks, serviceMenu, type NavLink } from "@/content/nav";
import { useIsomorphicLayoutEffect, usePrefersReducedMotion } from "@/hooks";
import { contact } from "@/lib/site";

/**
 * Site header. No bar — a transparent overlay carrying three things over the
 * top of the hero photograph: the mark on the left, the links in the middle of
 * the window, the telephone number on the right.
 *
 * Because there is no bar, the hero picture begins at the very top of the
 * document rather than under a lid. It always did — the image is `inset-0` on a
 * band that starts at y=0 — but a solid header was painting over its first
 * 88px. Removing the paint is the whole of that change.
 *
 * ---------------------------------------------------------------------------
 * One size, held. The mark is 64px tall on a phone, 76px from `sm` and 80px
 * from `xl`, and it stays that size: it no longer steps down when the page
 * scrolls, and the row no longer shortens under it. A header that shrinks is a
 * header whose logo is small for nine tenths of the visit. Everything here is
 * in rem, so past 1600px — where the root size starts to grow, see `html` in
 * globals.css — the mark grows with the rest of the page rather than being
 * left the same few pixels on a far bigger window.
 *
 * Laid out as a three-column grid from `xl`: `1fr auto 1fr`. The two outer
 * columns are equal, so the links sit on the window's centre line however wide
 * the mark and the number are — and because an `fr` track never goes below its
 * content, a window too narrow for true centring shifts the links off-centre a
 * little rather than letting them run into the mark. The old absolutely-centred
 * capsule could do the second; nothing stopped it doing the first.
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
 * hundred pixels further down the page is white, and white lettering and a
 * mark that is half white type all vanish into it — the header would be
 * functionally invisible for nine tenths of the scroll. So a black scrim fades
 * in behind the whole overlay the moment the page moves. Delete `scrolled` and
 * the class it gates to remove it.
 */

/** Scroll past this many pixels and the backdrop is in. A flick of the wheel. */
const LIFT_AT = 8;
/**
 * The box `next/image` is told about, in its native 3:1 ratio. The largest
 * the mark is ever drawn is 80px, or 100px on a 2560px window where the root
 * size has grown; 96 covers that at 1x and the 2x candidate covers retina.
 */
const LOGO_HEIGHT = 96;
const LOGO_WIDTH = Math.round((LOGO_HEIGHT * logo.width) / logo.height);

/** Type size of the desktop links — the `--text-nav` token less a notch, since seven sit on one line. */
const DESKTOP_NAV_SIZE = "0.9375rem";

/** A `/#section` link lands through `HashScroll`, not through the router's own jump. */
const scrollFor = (href: string) => (href.includes("#") ? false : undefined);

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // A single threshold a few pixels down, so the backdrop is keyed to "the page
  // has moved" and nothing else.
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
        `data-ground="sky"` for the roles — white lettering, a white pill
        carrying black — but `bg-transparent` to refuse the ground's own fill.
        Utilities sort after the base layer, so the class wins over the
        `[data-ground]` rule without an `!important`.

        One height at rest and scrolled: 80px on a phone, 96px from `sm`. The
        row used to step down on scroll and take the mark with it; both now
        hold still.
      */}
      <div
        data-ground="sky"
        className="relative z-10 flex min-h-20 items-center gap-4 bg-transparent px-4 sm:min-h-24 sm:px-6 xl:grid xl:grid-cols-[1fr_auto_1fr] xl:gap-6"
      >
        {/* The scroll backdrop. Its own element so it can cross-fade: `-z-10`
            inside this element's stacking context puts it above the row's
            background and below everything in the row. The hairline along its
            foot fades in with it. */}
        <div
          aria-hidden="true"
          className={`absolute inset-0 -z-10 border-b border-white/10 bg-black transition-opacity duration-500 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* `next/link`, not a bare anchor: the mark is on every page in the
            app, and from a service or city page this is a real navigation back
            to the home page rather than a jump within the document. The href
            is the home page itself and not `/#hero`, so no stray fragment ends
            up in the address bar. */}
        <Link
          href="/"
          onClick={() => setMenuOpen(false)}
          aria-label={`${logo.alt} — back to top`}
          className="pointer-events-auto flex shrink-0 items-center justify-self-start no-underline"
        >
          <Image
            src={logo.src}
            // The mark's own pixels are 2172x724. Declaring a rendered box
            // instead keeps next/image's srcSet to a 1x/2x pair rather than a
            // ladder up to 3840w — a few KB instead of the 744KB source.
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            alt=""
            priority
            // 64px, 76px from `sm`, 80px from `xl` — a fixed size per range,
            // never tied to scroll position. `max-w-none` so a flex row can
            // never squeeze the mark narrower than its height asks for.
            className="h-16 w-auto max-w-none sm:h-19 xl:h-20"
          />
        </Link>

        <DesktopNav />

        {/* The number, from `sm` up — a tablet and a desktop both have the
            room, and on either it is the one thing a visitor is most likely to
            have come to the header for. Set large and plain with a rule under
            it rather than dressed as a button: that is how a company that
            answers the phone puts its number on a page. It is still a `tel:`
            link with the sentence as its accessible name.

            Below `sm` it is not in the header at all. A phone already has CALL
            pinned to the foot of every screen (`MobileCtaBar`), and a third
            object squeezed between the mark and MENU is exactly the clutter a
            320px row cannot afford. */}
        <div className="pointer-events-auto ml-auto flex items-center gap-3 justify-self-end sm:gap-5 xl:ml-0">
          <a
            href={navCta.href}
            aria-label={`Call Screenova today on ${contact.phone.label}`}
            className="font-title group hidden items-center gap-2.5 whitespace-nowrap text-(--on-ground) no-underline sm:flex"
          >
            <Phone
              aria-hidden="true"
              className="h-[1.125rem] w-[1.125rem] shrink-0 transition-colors duration-300 group-hover:text-(--color-green) xl:h-5 xl:w-5"
            />
            <span
              className="border-b border-white/25 pb-0.5 text-[1.0625rem] tabular-nums transition-colors duration-300 group-hover:border-white/80 xl:text-[1.1875rem]"
              style={{ fontWeight: 500, letterSpacing: "0.005em" }}
            >
              {navCta.label}
            </span>
          </a>

          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            className={`font-title h-11 cursor-pointer rounded-(--radius-control) px-5 transition-colors duration-300 xl:hidden ${
              // Closed, a quiet outline in the ground's own ink. Open, it fills
              // with that ink and takes the ground back as its lettering. Both
              // states are ground roles, so the button follows the overlay's
              // colour rather than naming one.
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
 *
 * Services is the first entry and a disclosure rather than a link: it opens
 * in place onto the same seven services the desktop dropdown lists.
 */
function FullScreenMenu({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLElement[]>([]);
  const mounted = useRef(false);
  const prefersReducedMotion = usePrefersReducedMotion();
  const [servicesOpen, setServicesOpen] = useState(false);

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

  const linkSize = { fontSize: "clamp(1.5rem, 6vw, 2rem)", fontWeight: 400 };

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
          unreachable by scrolling. Auto margins collapse to zero the moment
          there is no free space, so the same block centres when it fits and
          pins to the top when it does not. */}
      <nav
        aria-label="Primary"
        className="px-gutter flex h-full flex-col overflow-y-auto overscroll-contain pt-24 pb-12"
      >
        <div className="m-auto w-full">
          <ul className="flex flex-col items-start gap-1">
            <li
              ref={(el) => {
                if (el) itemsRef.current[0] = el;
              }}
              style={{ opacity: 0 }}
            >
              <button
                type="button"
                aria-expanded={servicesOpen}
                aria-controls="mobile-services"
                onClick={() => setServicesOpen((value) => !value)}
                // `button` is the action pill by default — see globals. This
                // one is a heading-sized word, so it opts out of the fill.
                className="font-title flex items-center gap-2 bg-transparent px-0 py-2 text-(--on-ground) hover:bg-transparent"
                style={linkSize}
              >
                Services
                <ChevronDown
                  aria-hidden="true"
                  className={`h-6 w-6 transition-transform duration-300 ${servicesOpen ? "rotate-180" : ""}`}
                />
              </button>

              <ul
                id="mobile-services"
                hidden={!servicesOpen}
                className="mt-1 mb-3 flex flex-col gap-0.5 border-l border-(--on-ground)/25 pl-4"
              >
                {serviceMenu.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      scroll={scrollFor(item.href)}
                      onClick={onNavigate}
                      className="font-title block py-1.5 no-underline"
                      style={{ fontSize: "clamp(1.0625rem, 4.5vw, 1.25rem)", fontWeight: 400 }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {navLinks.map((link, i) => (
              <li
                key={link.href}
                ref={(el) => {
                  if (el) itemsRef.current[i + 1] = el;
                }}
                style={{ opacity: 0 }}
              >
                <Link
                  href={link.href}
                  scroll={scrollFor(link.href)}
                  onClick={onNavigate}
                  className="font-title block py-2 no-underline"
                  style={linkSize}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          <div
            ref={(el) => {
              if (el) itemsRef.current[navLinks.length + 1] = el;
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
 * The underline-on-hover treatment every desktop link shares: a rule that
 * draws itself from the word's left edge, the direction it is read in.
 *
 * `after:content-['']` is not optional. Tailwind v4 does not imply a `content`
 * for `before:`/`after:` variants, and without one the pseudo-element is never
 * generated — the rule simply never appears, silently and only on hover.
 */
const DESKTOP_LINK =
  "font-title relative px-2.5 py-1 whitespace-nowrap text-(--on-ground)/85 no-underline transition-colors duration-300 after:absolute after:inset-x-2.5 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 after:content-[''] hover:text-(--on-ground) hover:after:scale-x-100";

/**
 * The links: Services first, as a dropdown of the seven services, then the
 * sections of the home page. The middle cell of the header's grid, so it is
 * centred on the window and cannot collide with the mark or the number.
 *
 * Nothing is filled, nothing is blurred and nothing is highlighted except the
 * link actually being pointed at. Hover is soft blue on the word — the same
 * hover the footer's links take — plus the rule drawing in beneath it.
 */
function DesktopNav() {
  return (
    <nav
      aria-label="Primary"
      className="pointer-events-auto hidden items-center gap-0.5 xl:flex 2xl:gap-2"
    >
      <ServicesDropdown />

      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          scroll={scrollFor(link.href)}
          className={DESKTOP_LINK}
          style={{ fontSize: DESKTOP_NAV_SIZE, fontWeight: 400 }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

/**
 * Services, as a dropdown of the seven.
 *
 * Opens on hover for a mouse, and on click, tap or Enter/Space for everything
 * else — the trigger is a real button with `aria-expanded`, so a keyboard or a
 * screen reader gets the same menu a pointer does. Escape closes it and hands
 * focus back to the button; so does tabbing or clicking anywhere outside it.
 *
 * The panel hangs from a transparent strip (`pt-3`) rather than a margin, so
 * the pointer crossing the gap from the word to the list never leaves the
 * element that is holding it open. A short grace period on leaving covers a
 * pointer that cuts a corner.
 */
function ServicesDropdown() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  /** True between a hover opening the menu and the next click, so that click keeps it open. */
  const openedByHover = useRef(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse") return;
        window.clearTimeout(closeTimer.current);
        if (!open) openedByHover.current = true;
        setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        closeTimer.current = window.setTimeout(() => setOpen(false), 160);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls="services-menu"
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            setOpen(true);
            return;
          }
          setOpen((value) => !value);
        }}
        // `button` is the action pill by default — see globals. This is a nav
        // word, so it takes the links' treatment and none of the pill's.
        className={`${DESKTOP_LINK} flex cursor-pointer items-center gap-1 rounded-none bg-transparent hover:bg-transparent ${
          open ? "text-(--on-ground) after:scale-x-100" : ""
        }`}
        style={{ fontSize: DESKTOP_NAV_SIZE, fontWeight: 400, letterSpacing: "normal" }}
      >
        Services
        <ChevronDown
          aria-hidden="true"
          className={`h-4 w-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        id="services-menu"
        hidden={!open}
        className="absolute top-full left-1/2 z-20 -translate-x-1/2 pt-3"
      >
        <ul className="w-max min-w-[17rem] rounded-2xl border border-white/12 bg-black p-2 shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          {serviceMenu.map((item: NavLink) => (
            <li key={item.href}>
              <Link
                href={item.href}
                scroll={scrollFor(item.href)}
                onClick={() => {
                  openedByHover.current = false;
                  setOpen(false);
                }}
                className="font-title hover:text-blue-soft block rounded-lg px-4 py-2.5 whitespace-nowrap text-(--on-ground) no-underline transition-colors duration-200 hover:bg-white/8 focus-visible:bg-white/8"
                style={{ fontSize: "var(--text-nav)", fontWeight: 400 }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
