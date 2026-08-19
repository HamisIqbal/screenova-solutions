"use client";

import { useEffect, useState } from "react";
import { sectionIndex } from "@/content/sectionIndex";

/**
 * A rail of section names down the left of the window, and a panel that opens
 * beside it. Desktop only — it is a pointer's affordance, it needs room the
 * page's own measure is not using, and both of those are true from `xl` up.
 * Below that it renders nothing at all and the page is exactly as it was.
 *
 * Hover a name and that section opens in the panel: its heading, a line of its
 * copy, and what is inside it — the six services, the four steps, the cities.
 * The content is read from `sectionIndex`, which reads it from `home.ts`, so the
 * rail cannot drift from the bands it is previewing.
 *
 * What is open stays open until another name is hovered. That is the whole
 * behaviour, and it is the reason the panel is worth having: a preview that
 * closed the moment you left the name would be unreadable — you would have to
 * keep the pointer on the word you are not reading. Leaving the rail entirely
 * changes nothing, and there is always exactly one section open once you have
 * hovered one.
 *
 * Two ways back to nothing, because a panel that only ever opens is a panel
 * that is always in the way: clicking a name takes you to the real section and
 * closes it, and Escape closes it where it stands.
 *
 * The panel is a preview, not a second copy of the page, and it is
 * `aria-hidden` for exactly that reason — every word in it is already on the
 * page, in the band it belongs to. What a screen reader gets from the rail is
 * seven links to seven sections, which is what the rail actually is.
 *
 * It carries its own ground rather than following the band behind it. The rail
 * floats over black photographs and white paper alike, and a surface that
 * changed colour under the pointer as the page scrolled would be unreadable at
 * the crossings — so it is the header's navy glass, with the header's white
 * lettering, at every scroll position.
 */
export function SectionRail() {
  const [openHref, setOpenHref] = useState<string | null>(null);
  const open = sectionIndex.find((section) => section.href === openHref) ?? null;

  useEffect(() => {
    if (!openHref) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenHref(null);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openHref]);

  return (
    <div
      data-ground="sky"
      // Under the header's z-50 — the header is chrome over everything, this is
      // chrome over the page. `pointer-events-none` on the frame and back on
      // for the rail itself, so the column of dead space either side of it does
      // not swallow clicks meant for the page.
      className="pointer-events-none fixed top-1/2 left-6 z-40 hidden -translate-y-1/2 items-start gap-3 bg-transparent xl:flex"
    >
      <nav
        aria-label="Sections"
        className="bg-navy/55 pointer-events-auto rounded-xl border border-(--on-ground)/18 p-1.5 backdrop-blur-xl backdrop-saturate-150"
      >
        <ul className="flex flex-col gap-0.5">
          {sectionIndex.map((section) => {
            const isOpen = section.href === openHref;

            return (
              <li key={section.href}>
                <a
                  href={section.href}
                  onPointerEnter={() => setOpenHref(section.href)}
                  onFocus={() => setOpenHref(section.href)}
                  onClick={() => setOpenHref(null)}
                  className={`font-title block rounded-lg px-3 py-2 whitespace-nowrap no-underline transition-colors duration-300 ${
                    isOpen
                      ? "bg-paper text-navy"
                      : "hover:bg-paper hover:text-navy text-(--on-ground)"
                  }`}
                  style={{ fontSize: "var(--text-label)", letterSpacing: "0.12em" }}
                >
                  {section.label.toUpperCase()}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* The panel is always mounted and always the same box — it slides and
          fades rather than appearing, and it holds its width so the rail beside
          it never shifts. `max-h` with its own scroll is what keeps the longest
          preview inside a laptop window. */}
      <div
        aria-hidden="true"
        className={`bg-navy/70 pointer-events-none max-h-[70vh] w-80 overflow-y-auto rounded-2xl border border-(--on-ground)/18 p-6 backdrop-blur-xl backdrop-saturate-150 transition-all duration-500 ease-out ${
          open ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0"
        }`}
      >
        {open ? (
          <>
            <p
              className="font-title text-(--on-ground)/70"
              style={{ fontSize: "var(--text-label)", letterSpacing: "0.16em" }}
            >
              {open.label.toUpperCase()}
            </p>

            <p className="font-title mt-3 text-lg leading-snug" style={{ fontWeight: 700 }}>
              {open.title}
            </p>

            <p className="mt-3 text-(--on-ground-muted)" style={{ fontSize: "var(--text-label)" }}>
              {open.blurb}
            </p>

            {open.items.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2 border-t border-(--on-ground)/15 pt-4">
                {open.items.map((item) => (
                  <li
                    key={item}
                    className="font-title whitespace-pre"
                    style={{ fontSize: "var(--text-label)" }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
}
