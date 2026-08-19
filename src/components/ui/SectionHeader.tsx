/**
 * The opening block every section shares: the section's name, the line that
 * describes it, and optional intro copy. Keeping it in one place is what makes
 * nine different layouts read as one page.
 *
 * The name is the heading — the same words the nav uses, at the largest size on
 * the band. That is the point of it: someone arriving from "How It Works" in
 * the header should land on the words "HOW IT WORKS", not have to infer that
 * "Getting New Screens Is Simple" is the place they asked for. The sentence
 * under it is still doing the selling, but it is the subtitle now, and nothing
 * inside the section — a service title, a step numeral — is set larger than the
 * name above them.
 *
 * So the `h2` carries the name and takes `titleId`, which is what the section's
 * `aria-labelledby` points at: the accessible name of the region is the name
 * the navigation gave it. The descriptive line follows as copy.
 *
 * It is centred and it owns the space beneath it. The bottom margin is the same
 * `clamp(3rem, 8vw, 6rem)` the band uses for its own padding, so the header sits
 * exactly as far from the content below it as it does from the section above —
 * centred in its own gap as well as on the page. Sections therefore add no top
 * margin of their own to the block that follows.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  intro,
  className = "",
}: {
  /** The section's name — the nav's word for it. Set as the heading. */
  eyebrow: string;
  /** The line beneath it. Longer, and it does the describing. */
  title: string;
  titleId: string;
  intro?: string | readonly string[];
  className?: string;
}) {
  const paragraphs = typeof intro === "string" ? [intro] : (intro ?? []);

  return (
    <header className={`mx-auto mb-[clamp(3rem,8vw,6rem)] max-w-2xl text-center ${className}`}>
      <h2
        id={titleId}
        // Uppercase, and the tracking comes down as the size goes up: 0.16em
        // was set for a 12px label, where letters need pushing apart to read as
        // a label at all. At 44px the same value is a gap you read across
        // rather than a word, so it drops to a quarter of it.
        style={{ letterSpacing: "0.04em" }}
      >
        {eyebrow.toUpperCase()}
      </h2>

      {/* Not a heading: there is one heading per section and the name has it.
          This is the sentence under the name, set at the size the old heading
          used to be so the header still has two clear steps in it. */}
      <p
        className="font-title mx-auto mt-4"
        style={{ fontSize: "var(--text-subtitle)", fontWeight: 400, lineHeight: 1.25 }}
      >
        {title}
      </p>

      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mx-auto mt-4 text-(--on-ground-muted)">
          {paragraph}
        </p>
      ))}
    </header>
  );
}
