import Image from "next/image";
import { logo, navLinks, wordmark } from "@/content/nav";
import { siteConfig } from "@/lib/site";

/**
 * Site footer. Black, and the same black as the header — `data-ground="sky"`,
 * the chrome ground, not a colour named here. That single attribute is what
 * recolours everything inside it: the copy goes white at 21:1 and the rule goes
 * white at 75%, the same roles the header resolves. Nothing in this file names
 * a colour, so the footer would follow the page if the chrome ever changed.
 *
 * Black closes the page the way it opens it. The hero is a dark photograph and
 * the header floats over it; between them the page runs white and blue, and
 * ending on the chrome colour puts a floor under the whole thing and brackets
 * the content rather than letting it trail off on a white band.
 *
 * ---------------------------------------------------------------------------
 * The mark takes the right half, at the size it was drawn for.
 *
 * It is the one place on the site the logo is large. In the header it is 56px
 * tall because it is chrome there, competing with links and a button; here it
 * has a half of the page to itself and is the last thing seen, so it is set at
 * roughly a third of the measure — around 340px wide, or six times the header's
 * mark. Its lettering is half white on transparent, which is why black is the
 * one ground it can be this large on without a plate behind it.
 *
 * The halves stack on narrow screens with the mark second, so a phone reads the
 * links first and the mark signs off at the bottom, which is the same order the
 * desktop layout reads in.
 *
 * The `alt` is empty: the site name is already in the copyright line below, so
 * a second announcement of it here would be noise.
 *
 * ---------------------------------------------------------------------------
 * What is deliberately not here: a heading, a quote button, and the "Serving
 * the Tampa Bay Area" line. `FinalCta` sits immediately above this and is all
 * three of those things — the page closes on the ask, and repeating it a
 * hundred pixels lower reads as a page that has lost its place. The footer is
 * the colophon: where things are, who made it, and the mark.
 */

/** Rendered box for the mark, in its native 3:1. Six times the header's. */
const LOGO_WIDTH = 340;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * logo.height) / logo.width);

export function Footer() {
  return (
    <footer data-ground="sky">
      <div className="max-w-page px-gutter mx-auto w-full py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          {/* Left half: the map of the page, and what the page is about in one
              line for anyone who has arrived at the bottom without reading it. */}
          <div>
            <p className="max-w-md">{siteConfig.description}</p>

            <nav aria-label="Footer" className="mt-9">
              <ul className="flex flex-wrap gap-x-7 gap-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      // The header's treatment, not the page's: no underline,
                      // and the hover goes to the palette's light blue. On this
                      // ground that is the same pairing the nav links use, so
                      // the two pieces of chrome behave alike.
                      className="hover:text-blue-soft no-underline transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right half: the mark, ranged right so it sits against the measure
              rather than floating in the middle of its own column. */}
          <div className="lg:justify-self-end">
            <Image
              src={logo.src}
              // The rendered box, not the source's 2172x724 — declaring it here
              // keeps next/image's srcSet to a 1x/2x pair rather than a ladder
              // up to 3840w, which is the difference between a few KB and the
              // full 744KB source.
              width={LOGO_WIDTH}
              height={LOGO_HEIGHT}
              alt=""
              sizes="(min-width: 64rem) 340px, 280px"
              className="h-auto w-70 lg:w-85"
            />
          </div>
        </div>

        {/* The closing line. A rule above it because everything above is
            content and this is a colophon — the separation is the point. */}
        <div className="mt-14 border-t border-(--rule)/40 pt-6">
          <p style={{ fontSize: "var(--text-label)" }}>
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>

          {/* The wordmark spelled out, for anything reading the page rather
              than looking at it — the mark above carries no alt of its own. */}
          <span className="sr-only">{wordmark}</span>
        </div>
      </div>
    </footer>
  );
}
