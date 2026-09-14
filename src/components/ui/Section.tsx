/**
 * A band of the page.
 *
 * The section element runs edge to edge so its ground colour reaches the
 * window; the measure is re-applied by the container inside. `ground` is the
 * only colour decision a section makes — every role beneath it (text, rules,
 * cards, the action pill, focus) is re-pointed by the `[data-ground]` block in
 * `globals.css`, so a band can change colour without a single child changing.
 *
 * The page runs black → blue → white → black → black → blue → blue → white →
 * blue → black. Green is still a ground the system can produce, but no band
 * uses it — it lives on the page as the action pill on every white band
 * instead, which is the one place it is unambiguous.
 *
 * `sky` is the black chrome ground, and every band that uses it is a band whose
 * floor is a photograph: the hero, Why Choose Us, Screen Options, About and
 * the closer. That is the whole reason the ground exists. A photograph needs
 * the text roles a dark ground provides, and the band colour itself is only
 * ever seen behind the image while it loads — which is also why black is the
 * right thing to be waiting under, rather than a flash of white.
 *
 * Why Choose Us → Screen Options is a deliberate repeat: they are two different
 * photographs, and the edge between them is the picture changing rather than a
 * colour band ending.
 */
import { RevealGroup } from "./RevealGroup";

export type Ground = "paper" | "blue" | "green" | "sky";

export function Section({
  id,
  ground,
  labelledBy,
  className = "",
  bandClassName = "",
  reveal = true,
  floor,
  children,
}: {
  id: string;
  ground: Ground;
  labelledBy?: string;
  /** On the container that holds children to the measure. */
  className?: string;
  /**
   * On the band itself, outside the measure. For a section that has to position
   * something against the window rather than the text — the hero photograph is
   * the only one — this is where `relative` and its clip go.
   */
  bandClassName?: string;
  /**
   * `false` for a band that should simply be there — no block fades in as it
   * is reached. How It Works is the one that asks.
   */
  reveal?: boolean;
  /**
   * A band photograph — a pinned `BandPhoto` — rendered outside the measure, so
   * it sizes itself against the band and not the text column. With one, the
   * measure is positioned so the content paints above it, while each block
   * stays a direct child of the measure and still arrives on its own. The band
   * needs `relative overflow-clip` in `bandClassName`.
   */
  floor?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-ground={ground} aria-labelledby={labelledBy} className={bandClassName}>
      {floor}

      {/* The measure — and, because it is a `RevealGroup`, the thing that fades
          each block of the band in as you reach it. See `RevealGroup`. */}
      <RevealGroup
        enabled={reveal}
        className={`max-w-page px-gutter mx-auto w-full ${floor ? "relative" : ""} ${className}`}
      >
        {children}
      </RevealGroup>
    </section>
  );
}
