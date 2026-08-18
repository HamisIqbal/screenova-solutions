import { Section } from "@/components/ui";
import { faq } from "@/content/home";

/**
 * Nine questions as native <details>. No JavaScript, keyboard and screen
 * reader support for free, and it still works if scripts fail — which matters
 * more here than a bespoke accordion would gain.
 *
 * White band, and the marker is the page's second and last sunset moment: a
 * sunset disc carrying a navy plus that rotates into a cross when open. Nine of
 * them down the page is the most sunset appears anywhere, and it is still only
 * nine 28px discs — the colour stays hot because it is never spent on a
 * surface.
 */
export function Faq() {
  return (
    <Section id="faq" ground="paper" labelledBy="faq-title">
      <h2 id="faq-title" className="mx-auto mb-[clamp(3rem,8vw,6rem)] max-w-2xl text-center">
        {faq.eyebrow}
      </h2>

      <div className="border-t border-(--raised-border)">
        {faq.items.map((item) => (
          <details key={item.question} className="group border-b border-(--raised-border)">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5">
              <span className="font-title" style={{ fontWeight: 400 }}>
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
    </Section>
  );
}
