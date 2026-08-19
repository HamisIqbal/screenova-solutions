"use client";

import { useState } from "react";
import { BandPhoto, CtaLink, Section, SectionHeader } from "@/components/ui";
import { bandImages, whyChooseUs } from "@/content/home";

/**
 * Six reasons, on a photograph: six white blocks closed to their headings, and
 * the sentence arrives when you open one.
 *
 * The band was blue and is now `sky`, because its floor is a picture and a
 * photograph needs the text roles a dark ground provides. The blocks are
 * `data-ground="paper"`, so a white block on a dark band is a ground change
 * rather than a colour — the heading and the copy inside resolve to navy on
 * white without either of them naming one, exactly as the Services card does.
 *
 * The photograph is four windows in a row seen flat on, with the lower half of
 * the frame plain siding. That flat half is the reason it is this section's and
 * not another's: two rows of white blocks need somewhere quiet to land.
 *
 * ---------------------------------------------------------------------------
 * One layout, two ways in.
 *
 * Closed, the section is six short phrases — the six reasons, readable in a
 * single pass, which is what a list of reasons is for. Opening one brings the
 * sentence under the heading, so the summary and the detail are the same six
 * objects rather than six headings with six paragraphs already spent under them.
 *
 * A pointer opens a block by hovering it. A finger has no hover, so a tap opens
 * it and a second tap closes it — and because that is not something you can see,
 * the phone gets a line above the grid that says so. The two are the same
 * control: each block is a `button` carrying `aria-expanded`, the hover only
 * fires for `pointerType === "mouse"`, and the tap is an ordinary click, so a
 * keyboard gets the behaviour for free with no third code path.
 *
 * The open/close is grid rows rather than height, because `height: auto` cannot
 * be transitioned and a fixed height would have to be guessed for the longest of
 * the six: the copy sits in a row that goes from `0fr` to `1fr`, which measures
 * itself and which the browser can interpolate. The copy is never removed from
 * the DOM, so the six sentences are read out in order whether or not anything is
 * open.
 *
 * Nothing moves outside a block when one opens
 * --------------------------------------------
 * The band's floor is a photograph sized to the band. If the section grew every
 * time a block opened, the picture behind it would grow with it — the whole
 * image jumping a step in and out of frame under the pointer. So the row
 * reserves the room the tallest open block needs, and the block itself is
 * absolutely positioned inside that reserved space: the white box grows, the
 * grid does not, and the photograph never moves. `z-10` while open, so a block
 * that runs a line longer than the reservation paints over its neighbour rather
 * than being clipped by it.
 */
export function WhyChooseUs() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Section
      id="why-us"
      ground="sky"
      labelledBy="why-us-title"
      // `clip` rather than `hidden`: it holds the cropped edges of the
      // photograph without making a scroll container.
      bandClassName="relative overflow-clip"
    >
      <BandPhoto {...bandImages.whyChooseUs} />

      {/* `relative`, so the content paints above the picture and its scrim —
          both are positioned, and a static sibling would sit under them. */}
      <div className="relative">
        <SectionHeader title={whyChooseUs.title} titleId="why-us-title" intro={whyChooseUs.intro} />

        {/* Only where there is no hover to discover the behaviour with. */}
        <p
          className="font-title mb-5 text-(--on-ground-muted) lg:hidden"
          style={{ fontSize: "var(--text-label)", letterSpacing: "0.14em" }}
        >
          TAP A BLOCK TO EXPAND
        </p>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {whyChooseUs.benefits.map((benefit, i) => {
            const isOpen = open === i;

            return (
              // The reservation. The block inside is absolute, so opening it
              // changes nothing about the height of this row.
              <li
                key={benefit.title}
                className={`relative min-h-[9.5rem] sm:min-h-[12.5rem] lg:min-h-[13.5rem] ${
                  isOpen ? "z-10" : ""
                }`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                  onPointerEnter={(event) => {
                    if (event.pointerType === "mouse") setOpen(i);
                  }}
                  onPointerLeave={(event) => {
                    if (event.pointerType === "mouse") setOpen(null);
                  }}
                  data-ground="paper"
                  className={`absolute inset-x-0 top-0 cursor-pointer rounded-2xl px-6 py-6 text-left transition-[transform,box-shadow] duration-500 ${
                    isOpen
                      ? "-translate-y-1 shadow-[0_18px_40px_rgba(0,0,0,0.28)]"
                      : "translate-y-0 shadow-none"
                  }`}
                >
                  <h3 className="text-lg leading-snug font-bold">{benefit.title}</h3>

                  {/* `0fr` to `1fr`: a height the browser can both measure and
                      interpolate. `overflow-hidden` on the child is what makes
                      the closed row actually clip. */}
                  <div
                    className={`grid transition-[grid-template-rows] duration-500 ease-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <p
                      className={`overflow-hidden text-(--on-ground-muted) transition-[padding] duration-500 ${
                        isOpen ? "pt-3" : "pt-0"
                      }`}
                    >
                      {benefit.body}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <CtaLink href="#quote" className="mt-14">
          {whyChooseUs.cta}
        </CtaLink>
      </div>
    </Section>
  );
}
