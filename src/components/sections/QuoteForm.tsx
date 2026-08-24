"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { ImagePlus, X } from "lucide-react";
import { Dialog, Section, SectionHeader } from "@/components/ui";
import { quote } from "@/content/home";
import { contact } from "@/lib/site";
import { isServedZip, ZIP_PATTERN } from "@/lib/serviceArea";
import {
  forgetContact,
  getContactSnapshot,
  getServerContactSnapshot,
  saveContact,
  subscribeContact,
  type QuoteContact,
} from "@/lib/quoteMemory";

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
 * What the form asks for, and what it insists on:
 *
 *   name              required — who you are
 *   phone             required — how we reach you
 *   zip               required — whether we drive there
 *   email             optional
 *   address           optional, the rest of the address once the ZIP has cleared
 *   service           one select, not seven chips — a list that long is a
 *                     wrapping block three rows deep, and it is one choice.
 *                     Its last option is "I'm Not Sure", which is a real answer
 *   photos            optional, and out in the open rather than behind the
 *                     disclosure — see below
 *   details           three rows, free text, the part that actually varies
 *
 * Three required fields, not five. Email and the service used to be required
 * too, and neither of them is something we cannot proceed without: we have a
 * telephone number, and "I'm Not Sure" is the honest answer for most of the
 * people this form is for. A required field that a visitor cannot answer
 * truthfully is a visitor who closes the tab.
 *
 * Quantity and rough measurements are real information but almost nobody has
 * them to hand, so they sit in a closed `<details>` under the fields. Shut, it
 * is one line; open, it is two more fields.
 *
 * The photo upload is *not* in there, and that is deliberate. It is the single
 * most useful thing on this form — a photograph settles repair-versus-rescreen-
 * versus-rebuild in a way that three paragraphs of description does not — and a
 * field nobody can see is a field nobody uses. It has a line of help text under
 * it saying exactly that.
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
 * Three fields are required — name, phone and ZIP — and the browser enforces
 * those itself. `required` is not decoration here: it means
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
  help,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  /**
   * A line under the control. Not a placeholder: a placeholder is gone the
   * moment somebody types, and both of the two that exist here — the
   * measurement format and the reason to attach a photo — are things a person
   * still needs while they are answering. Wired to the field with
   * `aria-describedby`, so it is announced with the label rather than being
   * decoration a screen reader never reaches.
   */
  help?: string;
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
      {help && (
        <p
          id={`${id}-help`}
          className="mt-1.5 max-w-none text-(--on-ground-muted)"
          style={{ fontSize: "var(--text-label)" }}
        >
          {help}
        </p>
      )}
    </div>
  );
}

/**
 * The photo upload, which is a labelled drop zone rather than a file input.
 *
 * The default control is a small grey "Choose files" button and, next to it,
 * the words "No file chosen" — the least conspicuous thing on a form whose most
 * useful field this is. Nothing about it says photographs, nothing about it
 * invites a tap, and after a tap the only feedback is a filename set in the
 * browser's own type. So the input is still the input — same name, same
 * `accept`, same `multiple`, still what the form serialises — and it is made
 * `sr-only` inside a label that is drawn as the target instead.
 *
 * `sr-only` and not `hidden`: the input keeps its place in the tab order, so
 * the control is reached by keyboard and opens with Space or Enter exactly as a
 * file input does. The label's own text is `aria-hidden`, because the field's
 * real label and its help line are supplied by `Field` above and a screen
 * reader should hear that once rather than three overlapping versions of it.
 *
 * ---------------------------------------------------------------------------
 * What the visitor is told, in the three states this control has.
 *
 *   empty     a sunset disc carrying the media mark, the line that says to tap
 *             it, and the formats. The disc is the affordance: it is the only
 *             round filled shape in the card, and it reads as something to
 *             press in a way a dashed rectangle on its own does not.
 *   dragging  the border goes solid and the whole panel takes a sunset tint, so
 *             a file held over it is visibly over something that will catch it.
 *             Anything that is not an image is let go rather than attached.
 *   chosen    the count in full ink, the panel itself switched to the accent,
 *             and every filename listed underneath with a way to take it back
 *             off. This is the half the native control does worst and the half
 *             that matters most: having tapped, you can see that the tap did
 *             something, and exactly what it did.
 *
 * The list sits in an `aria-live` region so the same fact reaches a screen
 * reader — a file input that has just been filled announces nothing by itself.
 *
 * ---------------------------------------------------------------------------
 * Drag and drop, and removing one photograph, are the same trick: a `FileList`
 * cannot be built by hand, but `DataTransfer` produces one and an input's
 * `files` will accept it. Dropped images are filtered to images, packed into a
 * carrier and handed to the input — so the form serialises them without any
 * other part of this file knowing they arrived by drag. Removing is the same in
 * reverse: everything except the one being taken off is repacked.
 */
function PhotoUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [names, setNames] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const chosen = names.length;

  /** The input is the source of truth; this mirrors it for the display. */
  const sync = (list: FileList | null) => setNames(Array.from(list ?? []).map((file) => file.name));

  /**
   * Replace the input's file list with `files`. See the note above.
   *
   * Assigning to `input.files` is well supported but not universally, and a
   * display that disagreed with what the form is actually carrying would be
   * worse than no display: it is guarded, and on failure the input is emptied
   * so the two are at least telling the same story.
   */
  const commit = (files: File[]) => {
    const input = inputRef.current;
    if (!input) return;
    try {
      const carrier = new DataTransfer();
      files.forEach((file) => carrier.items.add(file));
      input.files = carrier.files;
    } catch {
      input.value = "";
    }
    sync(input.files);
  };

  const onDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const images = Array.from(event.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/"),
    );
    if (images.length > 0) commit(images);
  };

  const removeAt = (position: number) => {
    const input = inputRef.current;
    if (!input?.files) return;
    commit(Array.from(input.files).filter((_file, i) => i !== position));
    // Focus returns to the control rather than being lost with the row that has
    // just gone — a keyboard user must not be dropped at the top of the
    // document for taking one photograph off.
    input.focus();
  };

  return (
    <div>
      <label
        htmlFor="photos"
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={[
          "flex w-full cursor-pointer items-center gap-4 rounded-(--radius-control) border border-dashed px-4 py-4",
          "transition-colors duration-200",
          // The panel reacts to the input's focus ring rather than the input
          // drawing one somewhere off screen — `sr-only` puts the real element
          // out of sight, so the visible control shows focus on its behalf.
          "has-[:focus-visible]:border-(--spark) has-[:focus-visible]:bg-(--spark)/10",
          isDragging
            ? "border-solid border-(--spark) bg-(--spark)/10"
            : chosen > 0
              ? "border-(--spark) bg-(--spark)/5 hover:bg-(--spark)/10"
              : "border-(--color-border) bg-(--color-surface) hover:border-(--spark) hover:bg-(--spark)/5",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          className="sr-only"
          id="photos"
          name="photos"
          type="file"
          accept="image/*"
          multiple
          aria-describedby="photos-help"
          onChange={(event) => sync(event.target.files)}
        />

        {/* The affordance. A filled disc in the page's accent — the same object
            the FAQ uses for its markers — so it reads as something to press. */}
        <span
          aria-hidden="true"
          className="grid size-10 shrink-0 place-items-center rounded-full bg-(--spark) text-(--on-spark)"
        >
          <ImagePlus className="size-5" />
        </span>

        <span aria-hidden="true" className="min-w-0">
          <span className="block font-medium">
            {chosen > 0
              ? `${chosen} photo${chosen === 1 ? "" : "s"} attached`
              : quote.upload.prompt}
          </span>
          <span
            className="mt-0.5 block text-(--on-ground-muted)"
            style={{ fontSize: "var(--text-label)" }}
          >
            {chosen > 0 ? quote.upload.more : quote.upload.formats}
          </span>
        </span>
      </label>

      {/* Always mounted, so the first attachment is a change to a region that
          already exists and is therefore announced. */}
      <div aria-live="polite">
        {chosen > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {names.map((name, position) => (
              <li
                key={`${name}-${position}`}
                className="flex max-w-full items-center gap-1.5 rounded-full bg-(--color-surface) py-1 pr-1 pl-3"
                style={{ fontSize: "var(--text-label)" }}
              >
                <span className="truncate">{name}</span>
                <button
                  type="button"
                  onClick={() => removeAt(position)}
                  aria-label={`Remove ${name}`}
                  className="grid size-5 shrink-0 place-items-center rounded-full bg-transparent p-0 text-(--on-ground-muted) hover:bg-(--spark) hover:text-(--on-spark)"
                >
                  <X className="size-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const FIELD = "w-full";

/** Which dialogue is up, if any. `null` is the resting state. */
type Answer = null | { kind: "confirmed"; phone: string } | { kind: "outOfArea"; zip: string };

export function QuoteForm() {
  const [answer, setAnswer] = useState<Answer>(null);
  /**
   * Bumped after a successful submit. `form.reset()` empties the file input
   * itself, but the list of chosen photographs is React state sitting beside
   * it, and nothing about a native reset reaches that — so the upload is keyed
   * on this and a new one is mounted empty. One number, one line, and no reset
   * plumbing threaded through the component.
   */
  const [formKey, setFormKey] = useState(0);
  /**
   * The details of a request that went through on this device before, or
   * `null` — which is every first visit, and which is also what the server
   * renders. Read straight from the store rather than copied into state: it is
   * written by two handlers here and can change in another tab, and
   * `useSyncExternalStore` covers all of that without an effect.
   */
  const remembered = useSyncExternalStore(
    subscribeContact,
    getContactSnapshot,
    getServerContactSnapshot,
  );
  /** True once the visitor has taken the offer, so the banner can say so. */
  const [applied, setApplied] = useState(false);
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

    // The only place anything is written. Past the browser's own checks and
    // past the ZIP, so what is kept is a set of details that was accepted —
    // which is the whole basis on which it is offered back. See
    // `lib/quoteMemory.ts` for what is kept and what is deliberately not.
    const contact: QuoteContact = {
      name: String(data.get("name") ?? "").trim(),
      phone: phone.trim(),
      email: String(data.get("email") ?? "").trim(),
      zip: zip.trim(),
      address: String(data.get("address") ?? "").trim(),
    };
    saveContact(contact);
    setApplied(false);

    setAnswer({ kind: "confirmed", phone: phone.trim() });
    formRef.current?.reset();
    setFormKey((key) => key + 1);
  }

  /**
   * Take the offer. The fields are uncontrolled — the browser owns their values
   * and the submit handler reads them out of a `FormData` — so filling them in
   * means writing to the elements themselves rather than to React state.
   *
   * Focus then goes to the service select, which is the first thing the saved
   * details cannot answer. Somebody who has just filled five fields in one
   * press should land on the sixth, not at the top of a form that is already
   * done.
   */
  function useRemembered() {
    const form = formRef.current;
    const contact = remembered;
    if (!form || !contact) return;

    for (const [name, value] of Object.entries(contact)) {
      const field = form.elements.namedItem(name);
      if (field instanceof HTMLInputElement) field.value = value;
    }

    setApplied(true);
    const service = form.elements.namedItem("service");
    if (service instanceof HTMLSelectElement) service.focus();
  }

  /** Drop the record, and the offer with it. Nothing is left on the device. */
  function forgetRemembered() {
    forgetContact();
    setApplied(false);
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

        {/* The offer, and only for somebody who has completed this form once
            already — there is no record to offer otherwise. It sits above the
            first field because it is about the whole form, and it is a button
            rather than something that has already happened: nothing is filled
            in until it is pressed, so nobody arrives to find their name in a
            box they did not put it in.

            Taken, it becomes a line of confirmation with the same way out still
            beside it. The confirmation asks the visitor to check the details
            rather than announcing success, because six-month-old details can be
            right in every field and still be for the wrong house. */}
        {remembered && (
          <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-3 rounded-(--radius-control) bg-(--color-surface) px-4 py-3">
            {applied ? (
              <p className="max-w-none" style={{ fontSize: "var(--text-label)" }}>
                {quote.remember.applied}
              </p>
            ) : (
              <p className="max-w-none" style={{ fontSize: "var(--text-label)" }}>
                <span className="font-medium">{quote.remember.question}</span>{" "}
                <span className="text-(--on-ground-muted)">
                  {remembered.name} · {remembered.phone}
                </span>
              </p>
            )}

            <div className="ml-auto flex items-center gap-3">
              {!applied && (
                <button type="button" onClick={useRemembered} className="px-4 py-2">
                  {quote.remember.use}
                </button>
              )}
              {/* The way out, in the same size of type as the way in. */}
              <button
                type="button"
                onClick={forgetRemembered}
                className="bg-transparent p-0 text-(--on-ground-muted) underline underline-offset-4 hover:bg-transparent hover:text-(--on-ground)"
                style={{ fontSize: "var(--text-label)", fontWeight: 400 }}
              >
                {quote.remember.forget}
              </button>
            </div>
          </div>
        )}

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
              placeholder={quote.hints.name}
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
              placeholder={quote.hints.phone}
              required
            />
          </Field>

          {/* Optional. A telephone number is the thing we actually need to
              get back to somebody; insisting on an address as well is a second
              hurdle for no second answer. */}
          <Field id="email" label={quote.fields.email}>
            <input
              className={FIELD}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder={quote.hints.email}
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
              placeholder={quote.hints.zip}
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
              placeholder={quote.hints.address}
            />
          </Field>

          {/* A select, not the old chip row. Seven chips wrapped to three lines
              and read as filters; this is one choice out of a known list, which
              is what a select is for — and it is one line tall. The empty
              option is `disabled`, so with `required` on the select a browser
              treats "Select a service" as no answer rather than as one. */}
          {/* Not required, because the list itself now carries the answer for
              somebody who does not know: "I'm Not Sure" is the last option and
              it is a real choice, not a cop-out. The empty option stays
              `disabled` so the prompt cannot be submitted as a value. */}
          <Field id="service" label={quote.fields.service} className="sm:col-span-2">
            <select className={FIELD} id="service" name="service" defaultValue="">
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
            <textarea
              className={FIELD}
              id="details"
              name="details"
              rows={3}
              placeholder={quote.hints.details}
            />
          </Field>

          {/* The most useful optional field on the form, so it is the one
              optional field that is not folded away. See `PhotoUpload`. */}
          <Field
            id="photos"
            label={quote.fields.photos}
            help={quote.helpText.photos}
            className="sm:col-span-2"
          >
            <PhotoUpload key={formKey} />
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
              <input
                className={FIELD}
                id="quantity"
                name="quantity"
                type="number"
                min="1"
                placeholder={quote.hints.quantity}
              />
            </Field>

            <Field
              id="measurements"
              label={quote.fields.measurements}
              help={quote.helpText.measurements}
            >
              <input
                className={FIELD}
                id="measurements"
                name="measurements"
                type="text"
                placeholder={quote.hints.measurements}
                aria-describedby="measurements-help"
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
              each of the three required labels. */}
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
