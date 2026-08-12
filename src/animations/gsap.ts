"use client";

/**
 * Single place where GSAP is configured and plugins are registered.
 *
 * Always import gsap/ScrollTrigger from here rather than from "gsap" directly —
 * registering a plugin more than once, or on the server, causes subtle bugs.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);

  gsap.defaults({ ease: "power3.out" });

  // Don't fight the browser over anchor scrolling or mobile URL-bar resizes.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
