/**
 * The opening block every section shares: a marked eyebrow, the title, and
 * optional intro copy. Keeping it in one place is what makes nine different
 * layouts read as one page.
 *
 * There is no `tone` prop any more. The header takes its colours from whatever
 * band it is standing in, so a section can change ground without the header
 * being told about it.
 *
 * The eyebrow used to carry a small dot in the band's rule colour. It is gone —
 * the eyebrow's own size and 0.16em tracking already separate it from the
 * title, and the mark was doing no work the type was not already doing.
 */
export function SectionHeader({
  eyebrow,
  title,
  titleId,
  intro,
  className = "",
}: {
  eyebrow: string;
  title: string;
  titleId: string;
  intro?: string | readonly string[];
  className?: string;
}) {
  const paragraphs = typeof intro === "string" ? [intro] : (intro ?? []);

  return (
    <header className={`max-w-2xl ${className}`}>
      <p
        className="font-title text-(--on-ground-muted)"
        style={{ fontSize: "var(--text-label)", fontWeight: 400, letterSpacing: "0.16em" }}
      >
        {eyebrow.toUpperCase()}
      </p>

      <h2 id={titleId} className="mt-4">
        {title}
      </h2>

      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-(--on-ground-muted)">
          {paragraph}
        </p>
      ))}
    </header>
  );
}
