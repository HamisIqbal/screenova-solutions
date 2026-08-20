"use client";

import { useRef, useState } from "react";
import { Dialog, Section, SectionHeader } from "@/components/ui";
import { quote } from "@/content/home";
import { contact } from "@/lib/site";
import { isServedZip, ZIP_PATTERN } from "@/lib/serviceArea";

/**
 * The quote request, rebuilt as one short card.
 *
 * The old form asked for eight fields down a single column beside a left rail,
 * ran the seven services as a wrapping row of chips, and stood about nine
 * hundred pixels tall — a wall of work at the very point the page is asking for
 * a favour. Length is the thing that stops a form being filled in, so this one
 * is built around a single question: what is the least we can ask for and still
 * be able to answer?
 *
 * Five answers, and that is the whole visible form:
 *
 *   name + phone      who you are and how we reach you
 *   email + zip       where the quote goes and whether we drive there
 *   address           the rest of the address, once the ZIP has cleared
 *   service           one select, not seven chips — a list that long is a
 *                     wrapping block three rows deep, and it is one choice
 *   details           three rows, free text, the part that actually varies
 *
 * Everything else — how many, rough sizes, photographs — is real information
 * but almost nobody has it to hand, so it sits in a closed `<details>` under
 * the fields. Shut, it is one line; open, it is the rest of the old form. The
 * cost of the fields people skip is now one line of height instead of three
 * hundred pixels, and nothing was removed to get there.
 *
 * The phone number sits beside the button because a form is not the only way to
 * ask, and the person least likely to finish this is the one most likely to
 * call.
 *
 * The band is blue and the card is white: filling fields in is the most
 * demanding thing anyone does on this page, so the work happens on paper. The
 * card re-declares the white ground, which brings back the muted label colour,
 * the mist fields and the pill styling the blue band would otherwise take away.
 *
 * ---------------------------------------------------------------------------
 * What submitting does.
 *
 * Five fields are required — name, phone, email, ZIP and the service — and the
 * browser enforces those itself. `required` is not decoration here: it means
 * the submit handler never runs against an empty field, the message is the
 * platform's own (translated, announced, positioned by the engine), and the
 * page needs no error-state machinery of its own. The ZIP additionally has to
 * be five digits, which `pattern` covers.
 *
 * Past that there is exactly one question the form can answer on the spot: do
 * we drive there? `isServedZip` decides, and the answer is a dialogue —
 * confirmed if the ZIP is on the route, out-of-area if it is not. The
 * out-of-area case is deliberately not phrased as a failure and does not clear
 * the form: the boundary is a judgement call at the edges, so the dialogue's
 * primary action is the phone number and the form is left exactly as it was
 * typed, ready for a second ZIP.
 *
 * The address is *not* required. The ZIP is the part we need to answer, and a
 * quote request should not be blocked on someone remembering their apartment
 * number.
 *
 * NOTE: there is still no back end. `preventDefault` stops the browser's own
 * navigation and nothing is transmitted anywhere — the confirmation dialogue
 * reports that the form was completed, not that a message was delivered. Wire
 * the POST in at the marked line before this goes live.
 */

/**
 * Label, field, and the gap between them — one cell of the grid. A `div` and
 * not a `p`: paragraphs carry the page's 62ch measure, which is right for copy
 * and wrong for a field that is supposed to fill its column.
 */
function Field({
  id,
  label,
  required = false,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="mb-1.5 block" htmlFor={id}>
        {label}
        {/* The mark is the page's spark colour, which on paper is a fill rather
            than text — so it is drawn as a dot, not as an asterisk in orange.
            `aria-hidden` because the field already carries `required`, and a
            screen reader announcing "required" and then reading a bullet is
            the same fact twice. */}
        {required && (
          <span
            aria-hidden="true"
            className="ml-1.5 inline-block h-1.5 w-1.5 translate-y-[-1px] rounded-full align-middle bg-(--spark)"
          />
        )}
      </label>
      {children}
    </div>
  );
}

const FIELD = "w-full";

/** Which dialogue is up, if any. `null` is the resting state. */
type Answer = null | { kind: "confirmed"; phone: string } | { kind: "outOfArea"; zip: string };

export function QuoteForm() {
  const [answer, setAnswer] = useState<Answer>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const zipRef = useRef<HTMLInputElement>(null);

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    // The browser has already checked every `required` field and the ZIP's
    // pattern by the time this runs — a submit event does not fire otherwise.
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const zip = String(data.get("zip") ?? "");
    const phone = String(data.get("phone") ?? "");

    if (!isServedZip(zip)) {
      setAnswer({ kind: "outOfArea", zip: zip.trim() });
      return;
    }

    // TODO: POST `data` to the quote endpoint. Until that exists, the
    // confirmation below is reporting a completed form and nothing more.
    setAnswer({ kind: "confirmed", phone: phone.trim() });
    formRef.current?.reset();
  }

  /** Shut the dialogue and put the cursor back on the ZIP, ready to retype. */
  function retryZip() {
    setAnswer(null);
    // After the dialogue has actually gone, or the focus lands on an element
    // the top layer still has trapped.
    requestAnimationFrame(() => {
      zipRef.current?.focus();
      zipRef.current?.select();
    });
  }

  return (
    <Section id="quote" ground="blue" labelledBy="quote-title">
      <SectionHeader title={quote.title} titleId="quote-title" intro={quote.intro[0]} />

      <form
        ref={formRef}
        onSubmit={onSubmit}
        // The browser's own validation, not a hand-rolled one — see the note
        // above. `noValidate` is deliberately absent.
        aria-labelledby="quote-form-title"
        data-ground="paper"
        className="mx-auto max-w-3xl rounded-[2rem] p-6 sm:p-8 lg:p-10"
      >
        <h3 id="quote-form-title" className="sr-only">
          {quote.formTitle}
        </h3>

        {/* Two across from `sm` and never more: short fields in pairs is the
            whole shape of the thing, and a third column would make them too
            narrow to read what you had typed. */}
        <div className="grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field id="name" label={quote.fields.name} required>
            <input
              className={FIELD}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
            />
          </Field>

          <Field id="phone" label={quote.fields.phone} required>
            <input
              className={FIELD}
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
            />
          </Field>

          <Field id="email" label={quote.fields.email} required>
            <input
              className={FIELD}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </Field>

          {/* Its own field now, out of the address line. It is the one answer
              the form acts on, so it cannot be a hint inside a free-text box:
              `inputMode="numeric"` puts a phone on the digits, `pattern` holds
              it to five of them, and `maxLength` stops a ZIP+4 being typed into
              a field that only reads the first five. */}
          <Field id="zip" label={quote.fields.zip} required>
            <input
              ref={zipRef}
              className={FIELD}
              id="zip"
              name="zip"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              pattern={ZIP_PATTERN}
              maxLength={5}
              required
            />
          </Field>

          <Field id="address" label={quote.fields.address} className="sm:col-span-2">
            <input
              className={FIELD}
              id="address"
              name="address"
              type="text"
              autoComplete="street-address"
            />
          </Field>

          {/* A select, not the old chip row. Seven chips wrapped to three lines
              and read as filters; this is one choice out of a known list, which
              is what a select is for — and it is one line tall. The empty
              option is `disabled`, so with `required` on the select a browser
              treats "Select a service" as no answer rather than as one. */}
          <Field id="service" label={quote.fields.service} required className="sm:col-span-2">
            <select className={FIELD} id="service" name="service" defaultValue="" required>
              <option value="" disabled>
                Select a service
              </option>
              {quote.serviceOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </Field>

          <Field id="details" label={quote.fields.details} className="sm:col-span-2">
            <textarea className={FIELD} id="details" name="details" rows={3} />
          </Field>
        </div>

        {/* The three fields most people leave empty, folded away. Native
            <details>: keyboard operable, announced as a disclosure, and it
            works with scripts off — the same reason the FAQ is built this way. */}
        <details className="group mt-5 border-t border-(--raised-border) pt-4">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-(--on-ground-muted)">
            <span
              aria-hidden="true"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-(--raised-border) leading-none transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
            <span style={{ fontSize: "var(--text-label)" }}>{quote.optional}</span>
          </summary>

          <div className="mt-4 grid gap-x-5 gap-y-4 sm:grid-cols-2">
            <Field id="quantity" label={quote.fields.quantity}>
              <input className={FIELD} id="quantity" name="quantity" type="number" min="1" />
            </Field>

            <Field id="measurements" label={quote.fields.measurements}>
              <input className={FIELD} id="measurements" name="measurements" type="text" />
            </Field>

            <Field id="photos" label={quote.fields.photos} className="sm:col-span-2">
              <input
                className={FIELD}
                id="photos"
                name="photos"
                type="file"
                accept="image/*"
                multiple
              />
            </Field>
          </div>
        </details>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          {/* Blue with white lettering, against the green the paper ground
              would otherwise hand it. This is the one button on the site that
              overrides `--action`, and it is worth saying why: green is the
              page's "go" on every white *band*, but this card is white inside a
              blue one, and a green pill there reads as a third colour dropped
              into the middle of the brand's own blue. In blue it is the same
              blue the band is made of, which makes the button the card's
              conclusion rather than an object sitting on it. White on this blue
              is 4.7:1. */}
          <button
            type="submit"
            className="bg-(--color-blue) text-(--color-paper) hover:bg-(--color-blue-deep)"
          >
            {quote.submit}
          </button>

          {/* The dot's key. One line, under the button, rather than a note on
              each of the five labels. */}
          <p
            className="flex items-center gap-1.5 text-(--on-ground-muted)"
            style={{ fontSize: "var(--text-label)" }}
          >
            <span
              aria-hidden="true"
              className="inline-block h-1.5 w-1.5 rounded-full bg-(--spark)"
            />
            {quote.requiredNote}
          </p>

          <p className="text-(--on-ground-muted)" style={{ fontSize: "var(--text-label)" }}>
            {quote.callInstead}{" "}
            <a href={contact.phone.href} className="whitespace-nowrap">
              {contact.phone.label}
            </a>
          </p>
        </div>
      </form>

      {/* Both dialogues, one at a time. They live outside the form on purpose:
          a `<dialog>` inside a form is inside the thing it is reporting on, and
          `form.reset()` would run over its contents. */}
      <Dialog
        open={answer?.kind === "confirmed"}
        onClose={() => setAnswer(null)}
        tone="go"
        title={quote.dialog.confirmed.title}
        mark={<path d="m5 12.5 4.5 4.5L19 7.5" />}
        actions={
          <button
            type="button"
            autoFocus
            onClick={() => setAnswer(null)}
            className="bg-(--color-blue) text-(--color-paper) hover:bg-(--color-blue-deep)"
          >
            {quote.dialog.confirmed.dismiss}
          </button>
        }
      >
        {quote.dialog.confirmed.body.map((line) => (
          <p key={line}>
            {line.replace("{phone}", answer?.kind === "confirmed" ? answer.phone : "")}
          </p>
        ))}
      </Dialog>

      <Dialog
        open={answer?.kind === "outOfArea"}
        onClose={() => setAnswer(null)}
        tone="spark"
        title={quote.dialog.outOfArea.title}
        // A pin with its point on the ground and nothing inside it: the place
        // exists, we are just not at it.
        mark={
          <>
            <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
            <path d="M9.5 10.5h5" />
          </>
        }
        actions={
          <>
            {/* Secondary, and first in the DOM so a keyboard reaches the call
                before the retype on a phone, where the row reverses. */}
            <button
              type="button"
              onClick={retryZip}
              className="border border-(--raised-border) bg-transparent text-(--on-ground) hover:bg-(--raised)"
            >
              {quote.dialog.outOfArea.retry}
            </button>

            {/* The primary action is the telephone, not the form. At the edge
                of a service area a person decides, not a table of ZIPs. */}
            <a
              href={contact.phone.href}
              autoFocus
              className="font-title inline-flex items-center justify-center rounded-(--radius-control) bg-(--color-blue) px-6 py-3 whitespace-nowrap text-(--color-paper) no-underline transition-colors hover:bg-(--color-blue-deep)"
              style={{ fontSize: "var(--text-label)", fontWeight: 600, letterSpacing: "0.01em" }}
            >
              {quote.dialog.outOfArea.call} {contact.phone.label}
            </a>
          </>
        }
      >
        {quote.dialog.outOfArea.body.map((line) => (
          <p key={line}>{line.replace("{zip}", answer?.kind === "outOfArea" ? answer.zip : "")}</p>
        ))}
      </Dialog>
    </Section>
  );
}
