/**
 * Zoom compensation: the page keeps its size when the browser is zoomed out.
 *
 * Browser zoom does not change any CSS value — it changes what a CSS pixel is.
 * At 67% every pixel is two thirds of its usual size, so everything drawn in
 * pixels, rems, ems or anything else shrinks together, and no choice of unit
 * can prevent it. The only lever is to *measure* the zoom and draw the page
 * larger by the inverse amount. This script does exactly that, and nothing
 * else: it writes one number, `--zoom-k`, to the root, and the root font size
 * in `globals.css` is multiplied by it. Every size on the site is in rem —
 * type, spacing, the measure, the header, the logo, the icons — so the whole
 * interface comes back to its 100% size while the window keeps the extra room
 * the zoom-out gave it: the layout still sees a wider page.
 *
 * `vw` terms need no help. 1vw is always 1% of the window whatever the zoom,
 * so a `clamp(1rem, 2vw, 2rem)` is zoom-proof once its rem bounds are.
 *
 * How the zoom is read: `outerWidth` is the browser window in screen pixels,
 * which zoom does not touch; `innerWidth` is the page in CSS pixels, which it
 * does. Their ratio is the zoom. Anything else taking width from the page — a
 * docked DevTools, a browser sidebar — only makes `innerWidth` smaller, which
 * reads as zoomed *in*, and zoom-in is left alone. So the error is always
 * towards doing too little, never towards shrinking a page that was not zoomed.
 *
 * Two limits:
 *
 *   - Desktop pointers only (`hover: hover` and `pointer: fine`). Phones do
 *     not zoom the page this way — pinching is a different mechanism — and
 *     their two widths do not mean the same thing.
 *   - The page may not be drawn so large that it no longer fits the layout the
 *     CSS breakpoints have picked. Media queries see the zoomed-out width, so a
 *     900px window at 50% is laid out as an 1800px desktop; drawing it at 2x
 *     would put a 1024px layout into 900px. So the factor is capped at
 *     `innerWidth / breakpoint` for the `sm`, `md` and `lg` breakpoints, which
 *     keeps the drawn width at or above the one the layout was chosen for.
 *     Nothing past `lg` needs the cap: the two things that change at desktop
 *     width — the header row and the wide service card — switch on container
 *     queries, which measure the room they are actually drawn in. On any
 *     window 1024px or wider the compensation is therefore close to full; on
 *     a smaller one zoomed far out it is partial rather than broken.
 *
 * Firefox reports `outerWidth` in CSS pixels, so the ratio reads 1 there and
 * the page behaves as it always did — natively zoomed.
 *
 * Inline and synchronous, first thing in `<body>`, so the root size is right
 * before the first paint; `resize` fires on every zoom change, and re-runs it.
 */
export const zoomCompensationScript = `(function(){try{var r=document.documentElement,d=window.matchMedia('(hover: hover) and (pointer: fine)'),bp=[1024,768,640];function a(){var k=1,o=window.outerWidth,i=window.innerWidth;if(d.matches&&o>0&&i>0&&o/i<0.97){k=i/o;for(var n=0;n<bp.length;n++){if(i>=bp[n]){k=Math.min(k,i/bp[n]);break}}k=Math.min(Math.max(k,1),3)}r.style.setProperty('--zoom-k',String(Math.round(k*1000)/1000))}a();window.addEventListener('resize',a)}catch(e){}})();`;
