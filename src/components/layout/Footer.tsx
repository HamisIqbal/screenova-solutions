import Image from "next/image";
import { logo, navLinks, wordmark } from "@/content/nav";
import { contact, siteConfig, socials } from "@/lib/site";

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
 * Four columns, reading left to right: the mark, then Contact Us, Navigate, and
 * Join Us. The mark's column is wider than the other three — it is a picture
 * rather than a list and needs the room — and the three list columns are equal,
 * which is what makes their headings line up as a row of labels across the top
 * of the band rather than three unrelated stacks.
 *
 * The order is deliberate. The mark is first because the eye enters at the left
 * and the last thing the page should say is its own name; the lists then run
 * from the most consequential (how to reach a human) to the least (a handle to
 * follow). On narrow screens the grid collapses to two columns and then one,
 * and the mark stays first throughout — a phone reads the sign-off, then the
 * ways to get in touch.
 *
 * The mark's `alt` is empty: the site name is already in the copyright line
 * below, so a second announcement of it here would be noise.
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

/**
 * The three column headings, set as the eyebrow is set everywhere else on the
 * site — `font-title` at the label size, 0.16em tracked, upper-cased in the
 * markup so a screen reader is not handed three shouted words. Keeping them on
 * the muted role rather than full white is what holds them under the links they
 * label; at this depth muted resolves to plain white, so the separation is
 * carried by the size and the tracking, not by a tint.
 */
function ColumnTitle({ children }: { children: string }) {
  return (
    <h2
      className="font-title text-(--on-ground-muted)"
      style={{ fontSize: "var(--text-label)", fontWeight: 400, letterSpacing: "0.16em" }}
    >
      {children.toUpperCase()}
    </h2>
  );
}

/**
 * The social marks, drawn rather than fetched — three glyphs is not worth an
 * icon dependency, and inline paths inherit `currentColor`, which is how they
 * pick up the link hover without a second rule.
 */
function SocialIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    Facebook: (
      <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.55-1.5H16.7V3.6A21 21 0 0 0 14.3 3.5c-2.4 0-4 1.45-4 4.1v2.3H7.6V13h2.7v8z" />
    ),
    Instagram: (
      <>
        <path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.25.07 1.63.07 4.81s0 3.56-.07 4.81c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.25.06-1.63.07-4.85.07s-3.6 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.8 3.8 0 0 1-1.38-.9 3.8 3.8 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.56 2.2 15.18 2.2 12s0-3.56.07-4.81c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.44 2.21 8.82 2.2 12 2.2m0 1.98c-3.13 0-3.5.01-4.73.07-1.14.05-1.76.24-2.17.4-.55.21-.94.47-1.35.87-.4.41-.66.8-.87 1.35-.16.41-.35 1.03-.4 2.17-.06 1.23-.07 1.6-.07 4.73s.01 3.5.07 4.73c.05 1.14.24 1.76.4 2.17.21.55.47.94.87 1.35.41.4.8.66 1.35.87.41.16 1.03.35 2.17.4 1.23.06 1.6.07 4.73.07s3.5-.01 4.73-.07c1.14-.05 1.76-.24 2.17-.4.55-.21.94-.47 1.35-.87.4-.41.66-.8.87-1.35.16-.41.35-1.03.4-2.17.06-1.23.07-1.6.07-4.73s-.01-3.5-.07-4.73c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.87-1.35 3.6 3.6 0 0 0-1.35-.87c-.41-.16-1.03-.35-2.17-.4-1.23-.06-1.6-.07-4.73-.07" />
        <path d="M12 6.87a5.13 5.13 0 1 0 0 10.26 5.13 5.13 0 0 0 0-10.26m0 8.46a3.33 3.33 0 1 1 0-6.66 3.33 3.33 0 0 1 0 6.66" />
        <circle cx="17.34" cy="6.67" r="1.2" />
      </>
    ),
    LinkedIn: (
      <>
        <path d="M6.94 8.9H3.6V21h3.34zM5.27 3a1.93 1.93 0 1 0 0 3.87 1.93 1.93 0 0 0 0-3.87" />
        <path d="M16.6 8.66c-1.86 0-2.9.93-3.4 1.83h-.05V8.9H9.94V21h3.34v-6c0-1.58.3-3.1 2.25-3.1 1.93 0 1.95 1.8 1.95 3.2V21h3.33v-6.57c0-3.07-.66-5.77-4.21-5.77" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
      // Optically centred against the cap height of the label beside it.
      className="shrink-0 translate-y-px"
    >
      {paths[name]}
    </svg>
  );
}

/** The link treatment shared by all three lists: the header's, not the page's. */
const LINK = "hover:text-blue-soft no-underline transition-colors";

/**
 * The rule between columns. `--rule` is the ground's own line role, which at
 * this depth resolves to white — so this is a white hairline without this file
 * naming white, the same rule the colophon below the grid draws.
 *
 * It has to change axis with the grid, because "between the columns" means a
 * different edge at every width. Stacked on a phone the columns sit one above
 * the next, so the line is horizontal and sits on top of each. From `sm` the
 * lists pair up, so Navigate — the only one of the three that is ever a second
 * column in its row — takes a vertical line on its left as well. At `lg` all
 * four are side by side and every line is vertical.
 */
const DIVIDER = "border-(--rule)/40";

export function Footer() {
  return (
    <footer data-ground="sky">
      <div className="max-w-page px-gutter mx-auto w-full py-16 lg:py-20">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_repeat(3,minmax(0,1fr))] lg:gap-x-10">
          {/* Far left: the mark, at the size it was drawn for. It is the one
              place on the site the logo is large — in the header it is 72px
              tall because it is chrome there, competing with links and a
              button. Its lettering is half white on transparent, which is why
              black is the one ground it can be this size on without a plate
              behind it. The line beneath says what the page is, for anyone who
              has arrived at the bottom without reading it. */}
          <div className="sm:col-span-2 lg:col-span-1">
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

            <p className="mt-7 max-w-sm text-(--on-ground-muted)">{siteConfig.description}</p>
          </div>

          {/* Contact: the most consequential of the three lists, so it comes
              first. Both lines are live targets — the number dials, the mailbox
              composes. No street address: the work happens at the customer's
              property, so an address here would only be a place nobody visits. */}
          <div className={`${DIVIDER} border-t pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10`}>
            <ColumnTitle>Contact Us</ColumnTitle>

            <address className="mt-6 space-y-4 not-italic">
              <a href={contact.phone.href} className={`${LINK} block`}>
                {contact.phone.label}
              </a>

              <a href={contact.email.href} className={`${LINK} block break-words`}>
                {contact.email.label}
              </a>
            </address>
          </div>

          {/* Navigate: the map of the page. The same list the header carries,
              from the same source, stacked here rather than laid in a row — a
              footer nav is scanned down a column, not read across. */}
          <nav
            aria-label="Footer"
            className={`${DIVIDER} border-t pt-10 sm:border-l sm:pl-8 lg:border-t-0 lg:pt-0 lg:pl-10`}
          >
            <ColumnTitle>Navigate</ColumnTitle>

            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  {/* `min-h-6`: a 17px line of type is a 17px tap target, and
                      these are stacked list items rather than links inside a
                      sentence, so the 24px minimum applies to them. */}
                  <a href={link.href} className={`${LINK} inline-flex min-h-6 items-center`}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Join Us: the handles. Mark and word together rather than a row of
              bare glyphs — three unlabelled circles is a guessing game, and the
              column has the width for the words. */}
          <div className={`${DIVIDER} border-t pt-10 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-10`}>
            <ColumnTitle>Join Us</ColumnTitle>

            <ul className="mt-6 space-y-3">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className={`${LINK} inline-flex items-center gap-2.5`}
                  >
                    <SocialIcon name={social.label} />
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
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
