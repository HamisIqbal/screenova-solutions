"use client";

import { useState } from "react";

import { CtaLink, Section } from "@/components/ui";
import { faq } from "@/content/home";
import { contact } from "@/lib/site";

/**
 * Nine questions as native <details>, with the answer now opening on hover as
 * well as on click.
 *
 * ---------------------------------------------------------------------------
 * Why this component holds state at all.
 *
 * <details> opens on click and nothing else — a closed one's content is hidden
 * by the user agent itself, so there is no CSS that can show it on hover in
 * every browser that matters. The `open` attribute is therefore driven from
 * React instead, and the element keeps everything it was chosen for: the
 * disclosure semantics, the keyboard behaviour, the screen reader announcement.
 * `summary`'s own click is prevented, because this component is the one deciding
 * what is open.
 *
 * One thing is open at a time. Nine answers that could all be open at once is a
 * page that changes height under the pointer as it travels down the list, and a
 * hover-opened answer that never closes is just an answer.
 *
 * ---------------------------------------------------------------------------
 * Hover and click are two different intents, so the state records which one is
 * holding the question open:
 *
 *   hover  — a pointer resting on the row. It closes again when the pointer
 *            leaves, which is what makes hovering cheap: nothing is left behind
 *            and the reader can graze the whole list without cleaning up after
 *            themselves.
 *   pinned — a click, a tap, or Enter on a focused row. It stays open when the
 *            pointer leaves, and clicking it again closes it. Reading a long
 *            answer means moving the pointer away from the question, and an
 *            answer that vanished when you did would be unreadable.
 *
 * Hover is gated on `pointerType === "mouse"`. A touch screen sends a synthetic
 * pointerenter with the tap, and without the guard every tap would arrive as
 * both a hover-open and a pin — which cancel out, and the FAQ would not open on
 * a phone at all. Keyboard focus opens the row too, by the same route hover
 * takes, so tabbing through reads the same way as grazing with a mouse.
 *
 * ---------------------------------------------------------------------------
 * White band, and the marker is the page's second and last sunset moment: a
 * sunset disc carrying a navy plus that rotates into a cross when open. Nine of
 * them down the page is the most sunset appears anywhere, and it is still only
 * nine 28px discs — the colour stays hot because it is never spent on a
 * surface.
 */

/** Which question is open, and what is holding it open. */
type OpenState = { question: string; pinned: boolean } | null;

export function Faq() {
  const [open, setOpen] = useState<OpenState>(null);

  const isOpen = (question: string) => open?.question === question;

  /** Hover and focus. A pinned question ignores it — the pointer wandering off
      a question somebody clicked must not close it. */
  const preview = (question: string) => {
    setOpen((current) => (current?.pinned ? current : { question, pinned: false }));
  };

  const endPreview = (question: string) => {
    setOpen((current) => (current?.question === question && !current.pinned ? null : current));
  };

  /** Click, tap, Enter. The only thing that can close a question. */
  const toggle = (question: string) => {
    setOpen((current) =>
      current?.question === question && current.pinned ? null : { question, pinned: true },
    );
  };

  return (
    <Section id="faq" ground="paper" labelledBy="faq-title">
      {/* This band has no visible header at all now. It never had a describing
          line — the questions are the description — and with the section name
          gone there is nothing left to show. The heading stays in the markup
          because the section is `aria-labelledby` it: the region still has to
          announce itself as the FAQ, it simply does so to a screen reader and
          not to the page. `sr-only` takes it out of the layout entirely, so the
          first question starts at the top of the band rather than under a
          header's worth of empty space. */}
      <h2 id="faq-title" className="sr-only">
        {faq.eyebrow}
      </h2>

      <div className="border-t border-(--raised-border)">
        {faq.items.map((item) => (
          <details
            key={item.question}
            open={isOpen(item.question)}
            className="group border-b border-(--raised-border)"
            // On the <details> rather than the <summary>: the answer is inside
            // it, so moving the pointer from the question down into the answer
            // never leaves the element that is holding it open.
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") preview(item.question);
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") endPreview(item.question);
            }}
          >
            <summary
              className="flex cursor-pointer list-none items-center justify-between gap-6 py-5"
              // The element's own toggle is prevented at every width: `open` is
              // this component's to set, and letting the browser set it too
              // would fight the hover state.
              onClick={(event) => {
                event.preventDefault();
                toggle(item.question);
              }}
              onFocus={() => preview(item.question)}
              onBlur={() => endPreview(item.question)}
            >
              <span
                className="font-title transition-colors duration-200 group-hover:text-(--spark)"
                style={{ fontWeight: 400 }}
              >
                {item.question}
              </span>
              <span
                aria-hidden="true"
                className="grid size-7 shrink-0 place-items-center rounded-full bg-(--spark) text-(--on-spark) transition-transform duration-300 group-open:rotate-45"
              >
                <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor">
                  <path d="M6 1v10M1 6h10" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </span>
            </summary>

            <p className="max-w-3xl pb-6 text-(--on-ground-muted)">{item.answer}</p>
          </details>
        ))}
      </div>

      {/* Nine answers, and then the way to ask the tenth. The telephone rather
          than the form: somebody still reading at the bottom of an FAQ has a
          question the page did not anticipate, and that is a conversation. */}
      <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-4">
        <p className="max-w-none font-medium">{faq.ctaIntro}</p>
        <CtaLink href={contact.phone.href} ariaLabel={`${faq.cta} on ${contact.phone.label}`}>
          {faq.cta}
        </CtaLink>
      </div>
    </Section>
  );
}
