"use client";

import { useEffect, useState } from "react";

/**
 * Which of the given section ids the reader is currently in, for the nav to
 * mark. Returns the id, or `""` above the first one — the hero has no nav entry
 * and nothing should be lit while you are still in it.
 *
 * Scroll position rather than an IntersectionObserver, and that is the whole
 * point of it: two bands are on screen at once for most of a scroll, so
 * "intersecting" answers a different question than the one the nav is asking.
 * The reader is in the last band whose top has passed under the header, so
 * that is what this measures — one `getBoundingClientRect` per section per
 * frame that scrolled, which for a dozen sections is nothing.
 *
 * The foot of the page is the exception. The last section is usually shorter
 * than the space left below it, so it can never get its top under the header,
 * and without a special case the nav would freeze on the second to last band
 * for the entire end of the page. Bottomed out, the last section wins.
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState("");

  // Joined rather than passed raw: the caller's array is a new object on every
  // render, and depending on it directly would tear this down and rebuild it
  // each time. The ids themselves are what matter.
  const key = ids.join(",");

  useEffect(() => {
    const list = key ? key.split(",") : [];
    if (list.length === 0) return;

    let frame = 0;

    const measure = () => {
      frame = 0;

      // The line the header sits on, plus a little, is where a band counts as
      // entered. Read from the token so it cannot drift from the real header.
      const clearance =
        parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue("--header-clearance"),
        ) || 0;
      const line = clearance * 16 + 8;

      let found = "";
      for (const id of list) {
        const top = document.getElementById(id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= line) found = id;
      }

      const bottomed = window.innerHeight + window.scrollY >= document.body.scrollHeight - 2;
      if (bottomed) found = list[list.length - 1] ?? found;

      setActive((current) => (current === found ? current : found));
    };

    // Scroll can fire many times between two frames; the answer only changes
    // once per frame at most.
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure(); // A reload part-way down the page starts on the right band.
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [key]);

  return active;
}
