/**
 * A band of the page.
 *
 * The section element runs edge to edge so its ground colour reaches the
 * window; the measure is re-applied by the container inside. `ground` is the
 * only colour decision a section makes — every role beneath it (text, rules,
 * cards, the action pill, focus) is re-pointed by the `[data-ground]` block in
 * `globals.css`, so a band can change colour without a single child changing.
 *
 * The page runs white → blue → white → blue → white → blue → blue → white →
 * blue → white: two grounds alternating, five bands each. Green is still a
 * ground the system can produce, but no band uses it — it lives on the page as
 * the action pill on every white band instead, which is the one place it is
 * unambiguous. See `FinalCta`.
 *
 * The single repeat is About → ServiceArea, and it is deliberate: who we are
 * and where we work are one answer, so they share a floor.
 *
 * `sky` is the black chrome ground, and the hero is the one band that uses it —
 * because the hero's floor is a photograph, and a photograph needs the text
 * roles a dark ground provides. The band colour itself is only ever seen behind
 * the image while it loads.
 */
export type Ground = "paper" | "blue" | "green" | "sky";

export function Section({
  id,
  ground,
  labelledBy,
  className = "",
  bandClassName = "",
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
  children: React.ReactNode;
}) {
  return (
    <section id={id} data-ground={ground} aria-labelledby={labelledBy} className={bandClassName}>
      <div className={`max-w-page px-gutter mx-auto w-full ${className}`}>{children}</div>
    </section>
  );
}
