/**
 * The opening block every section shares: the line that describes the section,
 * and optional intro copy. Keeping it in one place is what makes nine different
 * layouts read as one page.
 *
 * The band's name used to sit above that line, set in caps as the heading — the
 * nav's word for the place you had just arrived at. It is gone, and the
 * describing line is the heading again. So the sentence takes `--text-h2` and
 * the `titleId` the section's `aria-labelledby` points at: the accessible name
 * of the region is now the sentence, which still says what the band is.
 *
 * Nothing was left behind where the name was. Removing it and keeping its
 * spacing would have opened a gap at the top of every band with nothing in it —
 * the sentence simply starts where the name started, and the space between the
 * header and the content below it is unchanged.
 *
 * That space is the same `clamp(3rem, 8vw, 6rem)` the band uses for its own
 * padding, so the header sits exactly as far from the content below it as it
 * does from the section above. Sections therefore add no top margin of their
 * own to the block that follows.
 */
export function SectionHeader({
  title,
  titleId,
  intro,
  className = "",
}: {
  /** The line that describes the section. It is the heading. */
  title: string;
  titleId: string;
  intro?: string | readonly string[];
  className?: string;
}) {
  const paragraphs = typeof intro === "string" ? [intro] : (intro ?? []);

  return (
    <header className={`mx-auto mb-[clamp(3rem,8vw,6rem)] max-w-2xl text-center ${className}`}>
      <h2 id={titleId}>{title}</h2>

      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mx-auto mt-5 text-(--on-ground-muted)">
          {paragraph}
        </p>
      ))}
    </header>
  );
}
