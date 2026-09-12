"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { serviceHashPrefix } from "@/content/nav";

/**
 * Lands every `#section` link on its section — `/#quote` above all.
 *
 * The bug this exists for: "Get a Free Quote" on a city page sometimes put the
 * visitor in How It Works rather than at the form. The browser (or the router)
 * makes its jump to the fragment once, at the first moment the element exists,
 * and the home page is not finished at that moment — photographs, fonts and the
 * scroll-triggered reveals are all still settling, and GSAP's refresh on `load`
 * restores a scroll position of its own. The jump was aimed correctly and then
 * the page moved underneath it, or it was put back.
 *
 * So the jump is not trusted to be a single event. Arriving at a hash — a full
 * load, or a client-side hop from another route — scrolls to the target and
 * then *holds* it there, re-aiming on every frame until the page has finished
 * loading and gone quiet. The hold lets go the moment the visitor does anything
 * themselves (wheel, touch, key, click), so it can never fight a person.
 *
 * Clicks on a hash link for the page you are already on are taken over as well,
 * for two reasons: the full-screen mobile menu locks the page's scroll while it
 * is open, and a native jump fired on the same click as the menu closing is a
 * jump on a page that cannot scroll yet; and `/#service-…` hashes name no
 * element — they land on the Services band, which reads the rest of the hash to
 * bring that service up. The URL is still updated, so the address bar and the
 * back button behave exactly as a native jump would leave them.
 *
 * Every link on the site that targets a section is an ordinary `href`. Nothing
 * has to opt in, and nothing breaks with scripting off — the browser's own
 * fragment navigation is still underneath.
 */

/** Longest a hold may run however slowly the page loads, in ms. */
const HOLD_CAP = 10000;
/** How long past the page's `load` event the hold keeps watching, in ms. */
const HOLD_AFTER_LOAD = 1200;
/** Shortest hold, for a page that had already loaded when the jump started. */
const HOLD_MIN = 900;

/** The element a hash should land on, or `null` when it names nothing here. */
function targetFor(hash: string): HTMLElement | null {
  let id = hash.replace(/^#/, "");
  try {
    id = decodeURIComponent(id);
  } catch {
    // A malformed escape is simply an id that does not exist.
  }
  if (!id) return null;

  return (
    document.getElementById(id) ??
    (id.startsWith(serviceHashPrefix) ? document.getElementById("services") : null)
  );
}

/** The scroll position that puts `el` at rest under the fixed header. */
function destination(el: HTMLElement): number {
  const margin = parseFloat(window.getComputedStyle(el).scrollMarginTop) || 0;
  const top = el.getBoundingClientRect().top + window.scrollY - margin;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return Math.round(Math.max(0, Math.min(top, max)));
}

/** Only one landing runs at a time; a new one ends the last. */
let endCurrent: (() => void) | null = null;

function land(hash: string, smooth: boolean) {
  endCurrent?.();

  const el = targetFor(hash);
  if (!el) return;

  const started = performance.now();
  let loadedAt = document.readyState === "complete" ? started : Infinity;
  let frame = 0;
  // A smooth scroll is left to fly and only corrected once it has come to
  // rest; an instant one is held from the first frame.
  let inFlight = smooth;
  let lastY = window.scrollY;
  let lastMove = started;

  const onLoad = () => {
    loadedAt = performance.now();
  };
  const interactions = ["wheel", "touchstart", "keydown", "pointerdown"] as const;

  const end = () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("load", onLoad);
    for (const type of interactions) window.removeEventListener(type, end);
    if (endCurrent === end) endCurrent = null;
  };
  endCurrent = end;

  window.addEventListener("load", onLoad);
  for (const type of interactions) window.addEventListener(type, end, { passive: true });

  window.scrollTo({ top: destination(el), behavior: smooth ? "smooth" : "instant" });

  const tick = () => {
    const now = performance.now();
    const want = destination(el);

    if (inFlight) {
      if (Math.abs(window.scrollY - lastY) > 0.5) {
        lastY = window.scrollY;
        lastMove = now;
      } else if (now - lastMove > 140) {
        inFlight = false;
      }
    } else if (Math.abs(window.scrollY - want) > 1) {
      window.scrollTo({ top: want, behavior: "instant" });
    }

    const holdUntil = Math.max(started + HOLD_MIN, loadedAt + HOLD_AFTER_LOAD);
    if (now > started + HOLD_CAP || (!inFlight && now > holdUntil)) {
      end();
      return;
    }
    frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** `/window-rescreening` and `/window-rescreening/` are the same page. */
function samePath(a: string, b: string) {
  return a.replace(/\/+$/, "") === b.replace(/\/+$/, "");
}

export function HashScroll() {
  const pathname = usePathname();

  // Arrival: a full load with a hash in the URL, or a client-side navigation
  // to one (`/#quote` from a city page). Runs after the new page has
  // committed, so the target exists and the URL already carries the hash.
  useEffect(() => {
    if (!window.location.hash) return;
    const hash = window.location.hash;
    const frame = requestAnimationFrame(() => land(hash, false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  // Same-page clicks, taken in the capture phase so this runs before the
  // router's own handler — which then sees `defaultPrevented` and stands down.
  // The link's own `onClick` (closing the mobile menu) still runs.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if ((anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || !url.hash) return;
      if (!samePath(url.pathname, window.location.pathname)) return;
      if (url.search !== window.location.search) return;
      if (!targetFor(url.hash)) return;

      event.preventDefault();

      const oldURL = window.location.href;
      if (window.location.hash !== url.hash) {
        window.history.pushState(window.history.state, "", url.hash);
      }
      // Announced even when the hash has not changed, so choosing the service
      // already in the URL a second time still brings it up. The listener
      // below does the landing.
      window.dispatchEvent(new HashChangeEvent("hashchange", { oldURL, newURL: url.href }));
    };

    // Every same-page hash change lands here: the clicks above, and the
    // browser's own — a hash edited in the address bar, or back and forward
    // between two of them. Two frames late: the click that closes the mobile
    // menu unlocks the page's scroll in an effect, and the jump has to start
    // after that.
    let frame = 0;
    const onHashChange = () => {
      cancelAnimationFrame(frame);
      const hash = window.location.hash;
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => land(hash, !prefersReducedMotion()));
      });
    };

    window.addEventListener("click", onClick, true);
    window.addEventListener("hashchange", onHashChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  return null;
}
