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
 * ---------------------------------------------------------------------------
 * Reading the zoom. Two methods, because no one of them works everywhere.
 *
 * 1. Window ratio — Chrome, Edge, Safari. `outerWidth` is the browser window
 *    in screen units, which zoom does not touch; `innerWidth` is the page in
 *    CSS pixels, which it does. Their ratio is the zoom, exactly, whatever the
 *    display scaling. A docked DevTools or a sidebar only makes `innerWidth`
 *    smaller, which reads as zoomed *in*, and zoom-in is left alone — so it
 *    errs towards doing nothing, never towards shrinking.
 *
 * 2. Pixel ratio — Brave and Firefox. Brave's fingerprinting protection (on
 *    by default) reports `outerWidth` as the page width plus a few pixels, and
 *    Firefox reports it in CSS pixels, so in both the ratio reads 1 and method
 *    1 sees nothing. What both do report honestly is `devicePixelRatio`, which
 *    is the display scaling times the zoom: 1.5 on a 150% Windows laptop at
 *    100%, 1.0 on the same laptop at 67%. The zoom is that divided by the
 *    display scaling — and the display scaling is exactly what those browsers
 *    will not reveal.
 *
 *    So it is learned. Display scalings come in a short list (100%, 125%,
 *    150%, …) and zoom levels in another (90%, 80%, 75%, 67%, 50%, …), and
 *    most products of the two can only be made one way: 1.35 is 150% at 90%,
 *    1.2 is 150% at 80%, 0.8 is 100% at 80%. Each such reading is recorded as
 *    the display scaling it proves, on this device, in `localStorage` — and
 *    from then on every zoom level is compensated, including the ambiguous
 *    ones (1.0 on that laptop is then read as 67%, not as a 100% monitor).
 *
 *    A reading that could be two things — 1.0, 1.5, 2.0 are all both "a
 *    display at 100%" and "a sharper display zoomed out" — teaches nothing and
 *    is taken as not zoomed. A browser zoomed out step by step from 100%
 *    always passes 90% on the way, which is unambiguous, so in practice the
 *    first zoom-out teaches it. The one case it cannot know is a first-ever
 *    visit that is *already* zoomed out on a high-DPI screen; that page draws
 *    as every other site does until the zoom is next changed.
 *
 *    A stored scaling that a new reading contradicts — no zoom level explains
 *    it — is dropped rather than obeyed, so a bad guess cannot stick.
 *
 * ---------------------------------------------------------------------------
 * Two limits on either method:
 *
 *   - Desktop pointers only (`hover: hover` and `pointer: fine`). Phones do
 *     not zoom the page this way — pinching is a different mechanism.
 *   - The page may not be drawn so large that it no longer fits the layout the
 *     CSS breakpoints have picked. Media queries see the zoomed-out width, so a
 *     900px window at 50% is laid out as an 1800px desktop; drawing it at 2x
 *     would put a 1024px layout into 900px. So the factor is capped at
 *     `innerWidth / breakpoint` for the `sm`, `md` and `lg` breakpoints. The
 *     two things that change at desktop width — the header row and the wide
 *     service card — switch on container queries, which measure the room they
 *     are actually drawn in, so nothing past `lg` needs the cap.
 *
 * Inline and synchronous, first thing in `<body>`, so the root size is right
 * before the first paint; `resize` fires on every zoom change, and re-runs it.
 */
export const zoomCompensationScript = `(function(){try{
var root=document.documentElement,desk=matchMedia('(hover: hover) and (pointer: fine)'),
KEY='screenova.display-scale.v1',
S=[1,1.25,1.5,1.75,2,2.25,2.5,3],
ZOUT=[0.9,0.8,0.75,0.67,2/3,0.5,1/3,0.3,0.25],
ZALL=ZOUT.concat([1,1.1,1.25,1.5,1.75,2,2.5,3,4,5]),
BP=[1024,768,640];
function near(a,b){return Math.abs(a/b-1)<0.004}
function any(list,v){for(var i=0;i<list.length;i++)if(near(v,list[i]))return true;return false}
function proven(d){if(any(S,d))return 0;for(var i=0;i<S.length;i++)if(any(ZOUT,d/S[i]))return S[i];return 0}
function load(){try{return parseFloat(localStorage.getItem(KEY))||0}catch(e){return 0}}
function save(v){try{v?localStorage.setItem(KEY,String(v)):localStorage.removeItem(KEY)}catch(e){}}
function fromPixels(){
  var d=window.devicePixelRatio||1,base=load();
  if(base&&!any(ZALL,d/base))base=0;
  var p=proven(d);if(p>base)base=p;
  save(base);
  return base?base/d:1;
}
function apply(){
  var k=1,o=window.outerWidth,i=window.innerWidth;
  if(desk.matches&&i>0){
    k=o>0&&o/i<0.97?i/o:fromPixels();
    if(k>1.005){for(var n=0;n<BP.length;n++){if(i>=BP[n]){k=Math.min(k,i/BP[n]);break}}}
    k=Math.min(Math.max(k,1),3);
  }
  root.style.setProperty('--zoom-k',String(Math.round(k*1000)/1000));
}
apply();window.addEventListener('resize',apply);
}catch(e){}})();`;
