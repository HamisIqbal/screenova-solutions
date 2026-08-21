import Link from "next/link";
import { Phone } from "lucide-react";
import { contact } from "@/lib/site";

/**
 * The sticky bar at the foot of a phone: CALL on the left, FREE QUOTE on the
 * right, and nothing else.
 *
 * Two actions, split down the middle, because those are the only two things
 * this site wants anybody to do and on a phone both of them are otherwise a
 * scroll away — the header's call link is off screen the moment the page moves,
 * and the form is at the bottom of a long page.
 *
 * ---------------------------------------------------------------------------
 * Below `lg` and nowhere else. On a desktop the header is always visible with
 * the number in it, so a second permanent bar would be furniture repeating
 * itself; `lg:hidden` on the fixed element takes it out of the layout entirely
 * rather than merely hiding it, so nothing on a desktop is sitting under an
 * invisible 64px strip.
 *
 * It cannot cover content, and that is not left to chance: `--mobile-cta-height`
 * is declared in `tokens.css`, this bar is exactly that tall, and `globals.css`
 * pads the bottom of the body by the same token under the same breakpoint. The
 * two are one number in one place — change the height here and the page's floor
 * follows. `env(safe-area-inset-bottom)` is added on top of both, for the home
 * indicator on a modern iPhone.
 *
 * The ground is `sky` — the page's black chrome, the same surface the header
 * takes when it lifts — so the bar reads as furniture rather than as a third
 * brand colour parked at the bottom of the screen. Within it the two halves are
 * ranked rather than equal: FREE QUOTE takes the filled pill's colours (white
 * on this ground, carrying black) because the form is the ask, and CALL is
 * drawn in the ground's own ink beside it. Both are full-height tap targets
 * running the whole half-width, which is the largest either could be.
 */
export function MobileCtaBar() {
  return (
    <div
      // `fixed` with `inset-x-0 bottom-0`: it sits over the page rather than in
      // it, which is what the body's matching bottom padding is for.
      data-ground="sky"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-(--on-ground)/15 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      {/* The row is the token *less* the hairline above it, so the bar's outer
          height — border included — is exactly `--mobile-cta-height` and the
          body's matching bottom padding clears it to the pixel. */}
      <div
        className="grid grid-cols-2"
        style={{ height: "calc(var(--mobile-cta-height) - 1px)" }}
      >
        {/* Dials the one number in `src/lib/site.ts` — the same one the header,
            the footer, the quote form and the closer all carry. The visible
            word is CALL; the accessible name is the number, so a screen reader
            is told what it is about to dial. */}
        <a
          href={contact.phone.href}
          aria-label={`Call Screenova on ${contact.phone.label}`}
          className="font-title flex items-center justify-center gap-2 text-(--on-ground) no-underline"
          style={{ fontSize: "var(--text-label)", fontWeight: 600, letterSpacing: "0.08em" }}
        >
          <Phone aria-hidden="true" className="h-4 w-4" />
          CALL
        </a>

        {/* Straight to the form. `/#quote` rather than `#quote` so the same bar
            works on the service and city pages, where the form is on the home
            page and a bare fragment would point at nothing. */}
        <Link
          href="/#quote"
          className="font-title flex items-center justify-center bg-(--action) text-(--on-action) no-underline"
          style={{ fontSize: "var(--text-label)", fontWeight: 600, letterSpacing: "0.08em" }}
        >
          FREE QUOTE
        </Link>
      </div>
    </div>
  );
}
