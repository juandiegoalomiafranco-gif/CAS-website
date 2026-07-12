/* ============================================
   CAS PORTFOLIO — "Quién Soy" 3D gallery hero
   Photos float at different depths and travel toward
   the viewer in an ENDLESS LOOP: their depth wraps
   around (modulo the cycle), so a photo that passes
   the camera reappears washed-out at the back.
   Motion = pinned scroll (GSAP ScrollTrigger) + an
   internal drift that auto-plays after 3 s without
   input — the drift spins the gallery only, it never
   moves the page. The central phrase is an overlay
   above the scene (see CSS: mix-blend-mode).
   Without GSAP or under prefers-reduced-motion the
   CSS static collage fallback stays in place.
   ============================================ */
(function () {
  var section = document.querySelector('.g3d');
  if (!section) return;
  var world = section.querySelector('[data-g3d-world]');
  var cards = world ? Array.prototype.slice.call(world.querySelectorAll('.g3d__card')) : [];
  if (!world || !cards.length) return;

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  /* Collage positions per card (fractions of viewport width/height from center),
     curated so photos cluster around the phrase like the reference. */
  var LAYOUT = [
    { x: -0.16, y: -0.02 },
    { x: 0.10, y: 0.12 },
    { x: 0.24, y: -0.15 },
    { x: -0.25, y: 0.13 },
    { x: 0.01, y: -0.18 },
    { x: 0.23, y: 0.15 },
    { x: -0.11, y: -0.12 },
    { x: 0.15, y: 0.02 },
  ];

  var SPACING = 620;                    // depth gap between consecutive cards
  var CYCLE = cards.length * SPACING;   // wrap-around length (>= visible range: no pop-in)
  var TRAVEL = CYCLE;                   // one full pinned scroll = exactly one cycle
  var NEAR_FADE_START = 320;            // approaching the camera…
  var NEAR_FADE_END = 780;              // …fully gone past this z
  var FAR_GONE = -1650;                 // invisible beyond this distance
  var FAR_FULL = -380;                  // fully opaque from here forward
  var START_Z = 260;                    // first card starts in front of the phrase
  var IDLE_DELAY = 3000;                // ms without input before the drift resumes
  var DRIFT_SECONDS = 35;               // seconds per full idle cycle

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  section.classList.add('g3d--live');

  function render(total) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    for (var i = 0; i < cards.length; i++) {
      var pos = LAYOUT[i % LAYOUT.length];
      var raw = START_Z - i * SPACING + total;
      // wrap depth into (NEAR_FADE_END - CYCLE, NEAR_FADE_END]: past the camera
      // the card re-enters at the washed-out far end — the loop never runs out
      var z = NEAR_FADE_END - (((NEAR_FADE_END - raw) % CYCLE + CYCLE) % CYCLE);
      var opacity = clamp01((z - FAR_GONE) / (FAR_FULL - FAR_GONE));
      if (z > NEAR_FADE_START) {
        opacity *= 1 - clamp01((z - NEAR_FADE_START) / (NEAR_FADE_END - NEAR_FADE_START));
      }
      var style = cards[i].style;
      style.transform = 'translate(-50%, -50%) translate3d(' +
        (pos.x * vw).toFixed(1) + 'px, ' + (pos.y * vh).toFixed(1) + 'px, ' + z.toFixed(1) + 'px)';
      style.opacity = opacity.toFixed(3);
      style.visibility = opacity <= 0.01 ? 'hidden' : 'visible';
    }
  }

  var scrollP = 0;      // ScrollTrigger progress (0..1 across the pin)
  var loopOffset = 0;   // extra depth from the idle drift / arrow keys
  var current = 0;      // smoothed total depth actually rendered
  var lastInput = performance.now();

  var st = ScrollTrigger.create({
    trigger: section,
    start: 'top ' + getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim(),
    end: '+=260%',
    pin: true,
    anticipatePin: 1,
    onUpdate: function (self) { scrollP = self.progress; },
  });

  gsap.ticker.add(function (time, deltaTime) {
    // idle drift: spin the gallery (never the page) while the hero is on screen
    if (performance.now() - lastInput > IDLE_DELAY && window.scrollY <= st.end) {
      loopOffset += (Math.min(deltaTime, 100) / 1000) * (CYCLE / DRIFT_SECONDS);
    }
    var target = scrollP * TRAVEL + loopOffset;
    if (Math.abs(target - current) < 0.05) return;
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.05) current = target;
    render(current);
  });
  render(0);

  window.addEventListener('resize', function () { render(current); });

  /* Any input pauses the drift; it resumes IDLE_DELAY later. */
  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () { lastInput = performance.now(); }, { passive: true });
  });

  /* Arrow keys: step the loop one card at a time while the gallery is pinned. */
  var arrowTween = null;
  window.addEventListener('keydown', function (e) {
    if (!st.isActive) return;
    var dir = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') dir = 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') dir = -1;
    if (!dir) return;
    e.preventDefault();
    if (arrowTween) arrowTween.kill();
    var proxy = { v: loopOffset };
    arrowTween = gsap.to(proxy, {
      v: loopOffset + dir * SPACING,
      duration: 0.7,
      ease: 'power2.out',
      onUpdate: function () { loopOffset = proxy.v; },
      onComplete: function () { arrowTween = null; },
    });
  });
})();
