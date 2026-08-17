/**
 * The opening block every section shares: a marked eyebrow, the title, and
 * optional intro copy. Keeping it in one place is what makes nine different
 * layouts read as one page.
 *
 * There is no `tone` prop any more. The header takes its colours from whatever
 * band it is standing in — the dot is that band's rule colour, blue on white,
 * white on blue, navy on green — so a section can change ground without the
 * header being told about it.
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
        className="font-title flex items-center gap-2.5 text-(--on-ground-muted)"
        style={{ fontSize: "var(--text-label)", fontWeight: 400, letterSpacing: "0.16em" }}
      >
        <span
          aria-hidden="true"
          className="inline-block size-1.5 shrink-0 rounded-full bg-(--rule)"
        />
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
