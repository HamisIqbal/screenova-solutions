"use client";

import { useEffect, useId, useRef } from "react";

/**
 * The page's one modal.
 *
 * Built on the native `<dialog>` element rather than a div with `role`
 * attributes, because `showModal()` brings four things a hand-rolled overlay
 * has to reimplement badly: the focus trap, Escape to close, the rest of the
 * page marked inert to assistive tech, and the top layer — which means the
 * dialogue paints over the fixed header without a z-index arms race.
 *
 * ---------------------------------------------------------------------------
 * The one thing here that is not borrowed from the page: the mesh.
 *
 * A window screen *is* a mesh, and the site has photographs of them but nowhere
 * that draws one. The header band of this card is a woven grid — two repeating
 * gradients at 4px, drawn in the tone's own colour at low alpha over mist. It
 * is the only ornament in the component and it appears nowhere else on the
 * site, which is what makes it a signature rather than a texture: the moment
 * the page answers you, it answers on screen mesh.
 *
 * Everything else is deliberately the page's furniture. The card is paper, so
 * every role inside it — muted copy, the hairline, the pill — resolves exactly
 * as it does in the form the dialogue was opened from. Nothing here names a
 * colour except the tone, and the tone names two the tokens already define.
 *
 * ---------------------------------------------------------------------------
 * `tone` is the whole of the difference between a yes and a no:
 *
 *   go     blue    the request is in
 *   spark  sunset  the answer is "not here", which is information, not failure
 *
 * Sunset is the site's spark colour, and the system's rule for it is that it is
 * only ever a fill on white carrying navy — never text. That is exactly how it
 * is used here: the medallion and the mesh are fills, and every word on the
 * card stays in the paper ground's own ink. A red would have been a fourth
 * colour and would have called a ZIP code an error, which it is not.
 */
export type DialogTone = "go" | "spark";

const TONE: Record<DialogTone, { fill: string; on: string }> = {
  go: { fill: "var(--color-blue)", on: "var(--color-paper)" },
  spark: { fill: "var(--color-sunset)", on: "var(--color-navy)" },
};

export function Dialog({
  open,
  onClose,
  tone,
  title,
  mark,
  children,
  actions,
}: {
  open: boolean;
  onClose: () => void;
  tone: DialogTone;
  title: string;
  /** The glyph in the medallion. A `<path>` or two on a 24x24 viewBox. */
  mark: React.ReactNode;
  children: React.ReactNode;
  actions: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const { fill, on } = TONE[tone];
  const thread = `color-mix(in srgb, ${fill} 26%, transparent)`;

  // `open` is the source of truth; the element's own `open` property is the
  // thing being driven. Guarding on it matters — calling `showModal()` on an
  // already-open dialogue throws.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Escape and the form-method close both fire `close` on the element without
  // going through `onClose`, so React's state would drift out of step with the
  // DOM. This is what keeps them married.
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const onNativeClose = () => onClose();
    dialog.addEventListener("close", onNativeClose);
    return () => dialog.removeEventListener("close", onNativeClose);
  }, [onClose]);

  // A modal dialogue stops the page being *interactive* but not, in every
  // engine, being *scrolled* — a wheel over the backdrop still moves the page
  // behind it. Same lock the full-screen menu uses.
  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = previous;
    };
  }, [open]);

  return (
    <dialog
      ref={ref}
      // Named by its own heading. A `<dialog>` is announced as a dialogue
      // either way, but without this it is announced without a name.
      aria-labelledby={titleId}
      // The element is the scrim's own box, so it is sized to the window and
      // the card inside it is what gets the width. `p-0` and the transparent
      // background clear the UA's own frame; `backdrop:` styles the scrim.
      className="dialog-card m-auto max-h-dvh w-full max-w-[28rem] overflow-y-auto overscroll-contain border-0 bg-transparent p-0 backdrop:bg-black/70 backdrop:backdrop-blur-sm"
      // Clicking the scrim closes. The dialogue's own box *is* the scrim, so a
      // click that lands on the element itself rather than on the card is a
      // click outside — no second overlay element needed.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      {/* The card. `data-ground="paper"` so the pill, the muted copy and the
          hairline resolve as they do in the form — the dialogue is a piece of
          that form, not a surface with its own rules. */}
      <div
        data-ground="paper"
        className="mx-4 my-8 overflow-hidden rounded-[1.5rem] text-center sm:mx-6"
      >
        {/* The mesh band, and the medallion sitting on its lower edge. The band
            is short and the card below it is quiet: one ornament, once. */}
        <div
          aria-hidden="true"
          className="h-20 sm:h-24"
          style={{
            backgroundColor: "var(--color-mist)",
            // The weave: a 4px warp and a 4px weft in the tone's own colour,
            // mixed down to a quarter strength rather than drawn with an alpha,
            // so the crossings do not double up into a darker dot grid.
            backgroundImage: `repeating-linear-gradient(to right, ${thread} 0 1px, transparent 1px 4px), repeating-linear-gradient(to bottom, ${thread} 0 1px, transparent 1px 4px)`,
          }}
        />

        <div className="px-6 pb-7 sm:px-8 sm:pb-8">
          {/* Pulled up so it straddles the mesh's lower edge — the one thing on
              the card that crosses a boundary, and the reason the eye lands on
              it first.

              `relative` is what makes the crossing work rather than just
              overlap: the medallion is in normal flow and the mesh band above
              it is a sibling, so without a position of its own the medallion
              loses the paint order to anything positioned and the negative
              margin buries its top half under the band instead of laying it
              over. Nothing else here is positioned, so no z-index is needed —
              being positioned at all is enough. */}
          <span
            aria-hidden="true"
            className="relative -mt-8 inline-flex h-16 w-16 items-center justify-center rounded-full ring-6 ring-(--color-paper) sm:-mt-9 sm:h-18 sm:w-18"
            style={{ backgroundColor: fill, color: on }}
          >
            <svg
              viewBox="0 0 24 24"
              width="28"
              height="28"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mark}
            </svg>
          </span>

          {/* `font-title` at Black, so this reads as the page's voice rather
              than as an operating-system alert. Sized to the card rather than
              to the page: `--text-h2` is a band heading and would fill a 28rem
              box on its own, `--text-h3` is a card title and would not lead.
              This is the step between them. */}
          <h2
            id={titleId}
            className="font-title mt-4"
            style={{ fontSize: "clamp(1.25rem, 1.1rem + 0.7vw, 1.5rem)", fontWeight: 900 }}
          >
            {title}
          </h2>

          <div className="mt-3 flex flex-col gap-2.5 text-(--on-ground-muted)">{children}</div>

          {/* Column on a phone, row past it — two pills side by side at 375px
              would each be too narrow to read. `flex-col-reverse` so the
              primary action stays nearest the thumb when they stack. */}
          <div className="mt-7 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
            {actions}
          </div>
        </div>
      </div>
    </dialog>
  );
}
