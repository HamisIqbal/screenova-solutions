/**
 * The one thing the quote form remembers between visits: the five contact
 * fields of a request that actually went through.
 *
 * ---------------------------------------------------------------------------
 * Nothing is written until a request is *accepted*. The form is only saved from
 * the confirmed branch of the submit handler — past the browser's own required
 * and pattern checks, and past the ZIP being one we serve. A half-typed form, a
 * failed one, or an out-of-area one leaves nothing behind, which is what makes
 * the offer worth making: what comes back is a set of details that already
 * worked once, not the last thing somebody happened to type.
 *
 * ---------------------------------------------------------------------------
 * What is kept, and what deliberately is not.
 *
 * Kept: name, phone, email, ZIP, address — who you are and where you are, which
 * do not change between a torn screen in March and a torn screen in September.
 *
 * Not kept: the service, the description, the quantity, the measurements, the
 * photographs. Those belong to one job. Bringing them back would mean a second
 * request that quietly described the first one, which is worse than an empty
 * field — an empty field is obviously empty, whereas a wrong answer sitting in
 * a filled-in box gets submitted.
 *
 * ---------------------------------------------------------------------------
 * It lives in `localStorage`, on the visitor's own device, and nothing here
 * sends it anywhere. Three things can end it: the visitor pressing "Forget
 * these details", six months passing, or the service area changing under a
 * saved ZIP — `readContact` re-checks the ZIP on the way out, so a record that
 * would no longer be accepted is never offered back.
 *
 * Every access is wrapped: `localStorage` throws outright in some privacy
 * modes, and a form that cannot be filled in because a convenience feature
 * threw would be an absurd way to lose a quote request. Every failure here ends
 * with the form behaving as though nothing had ever been saved.
 *
 * ---------------------------------------------------------------------------
 * It is shaped as an external store — `subscribe` / `getSnapshot` — rather than
 * as a function the form calls in an effect, because that is what it is:
 * `localStorage` is state that lives outside React, is written by two different
 * handlers, and can change in another tab. `useSyncExternalStore` reads it at
 * exactly the right moment on the client, returns `null` on the server, and
 * needs no effect and no cascading render to get the first value in.
 *
 * The snapshot is cached because that contract demands it: `getSnapshot` has to
 * return the same reference until something actually changes, and parsing the
 * JSON afresh on every render would hand React a new object every time and spin
 * for ever.
 */
import { isServedZip } from "./serviceArea";

export type QuoteContact = {
  name: string;
  phone: string;
  email: string;
  zip: string;
  address: string;
};

const KEY = "screenova.quote-contact.v1";

/** Six months. Long enough to still be the same house, short enough to be current. */
const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

type StoredContact = QuoteContact & { savedAt: number };

/**
 * The saved details, or `null` — which is also the answer for a first visit, a
 * record that has expired, a ZIP that is no longer served, anything that does
 * not parse, and any browser that will not hand the store over.
 */
function readContact(): QuoteContact | null {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;

    const stored = JSON.parse(raw) as Partial<StoredContact>;
    const savedAt = typeof stored.savedAt === "number" ? stored.savedAt : 0;
    if (!savedAt || Date.now() - savedAt > MAX_AGE_MS) {
      // Cleared without notifying: this runs inside `getSnapshot`, and telling
      // React about a change from inside a read is how a render loop starts.
      clear();
      return null;
    }

    const contact = {
      name: String(stored.name ?? "").trim(),
      phone: String(stored.phone ?? "").trim(),
      email: String(stored.email ?? "").trim(),
      zip: String(stored.zip ?? "").trim(),
      address: String(stored.address ?? "").trim(),
    };

    // The three the form insists on, and the ZIP checked against today's
    // service area rather than the one that was in force when it was written.
    if (!contact.name || !contact.phone || !isServedZip(contact.zip)) return null;

    return contact;
  } catch {
    return null;
  }
}

/** Called from the confirmed branch of the submit handler, and nowhere else. */
export function saveContact(contact: QuoteContact): void {
  try {
    const stored: StoredContact = { ...contact, savedAt: Date.now() };
    window.localStorage.setItem(KEY, JSON.stringify(stored));
  } catch {
    // A visitor who cannot be remembered simply is not remembered.
  }
  invalidate();
}

export function forgetContact(): void {
  clear();
  invalidate();
}

function clear(): void {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to do and nothing to report.
  }
}

/* -------------------------------------------------------------------------
 * The store. See the note at the top of the file.
 * ---------------------------------------------------------------------- */

let snapshot: QuoteContact | null = null;
let snapshotIsCurrent = false;
const listeners = new Set<() => void>();

function invalidate(): void {
  snapshotIsCurrent = false;
  for (const listener of listeners) listener();
}

/** Another tab clearing or writing the same key counts as a change here. */
function onStorage(event: StorageEvent): void {
  if (event.key === KEY || event.key === null) invalidate();
}

export function subscribeContact(listener: () => void): () => void {
  listeners.add(listener);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getContactSnapshot(): QuoteContact | null {
  if (!snapshotIsCurrent) {
    snapshot = readContact();
    snapshotIsCurrent = true;
  }
  return snapshot;
}

/** The server has no store, so it has no saved details and shows no offer. */
export function getServerContactSnapshot(): null {
  return null;
}
