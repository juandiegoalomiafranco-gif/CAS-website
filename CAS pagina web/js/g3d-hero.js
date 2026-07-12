/* ============================================
   CAS PORTFOLIO — "Quién Soy" 3D gallery hero
   Photos float at different depths and travel toward
   the viewer as the section's pinned scroll advances
   (GSAP ScrollTrigger). The central phrase sits at
   z = 0 inside the same 3D scene, so far photos pass
   behind it and near ones in front. Auto-play resumes
   after 3 s of inactivity; arrow keys step card by card.
   Without GSAP or under prefers-reduced-motion the CSS
   static collage fallback stays in place.
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

  var SPACING = 620;                 // depth gap between consecutive cards
  var START_Z = 260;                 // first card starts in front of the text
  var TRAVEL = (cards.length - 1) * SPACING + 600; // total depth swept over the pin
  var NEAR_FADE_START = 320;         // approaching the camera…
  var NEAR_FADE_END = 780;           // …fully gone past this z
  var FAR_GONE = -1650;              // invisible beyond this distance
  var FAR_FULL = -380;               // fully opaque from here forward
  var AUTOPLAY_DELAY = 3000;
  var AUTOPLAY_FULL_SWEEP = 26;      // seconds for a full idle sweep

  var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };

  section.classList.add('g3d--live');

  var target = 0;
  var current = -1; // force first render

  function render(p) {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    for (var i = 0; i < cards.length; i++) {
      var pos = LAYOUT[i % LAYOUT.length];
      var z = START_Z - i * SPACING + p * TRAVEL;
      // washed-out when far, full in the mid range, quick fade passing the camera
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

  gsap.ticker.add(function () {
    if (Math.abs(target - current) < 0.0004) return;
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0004) current = target;
    render(current);
  });
  render(0);
  current = 0;

  var st = ScrollTrigger.create({
    trigger: section,
    start: 'top ' + getComputedStyle(document.documentElement).getPropertyValue('--nav-height').trim(),
    end: '+=260%',
    pin: true,
    anticipatePin: 1,
    onUpdate: function (self) { target = self.progress; },
  });

  window.addEventListener('resize', function () { render(current); });

  /* --- Auto-play: after 3 s without input, glide the pinned scroll forward. --- */
  var idleTimer = null;
  var scrollTween = null;

  function killScrollTween() {
    if (scrollTween) { scrollTween.kill(); scrollTween = null; }
  }

  function tweenScrollTo(y, duration, ease) {
    killScrollTween();
    var proxy = { y: window.scrollY };
    scrollTween = gsap.to(proxy, {
      y: y,
      duration: duration,
      ease: ease,
      onUpdate: function () { window.scrollTo({ top: proxy.y, behavior: 'instant' }); },
      onComplete: function () { scrollTween = null; },
    });
  }

  function startAutoplay() {
    if (!st.isActive || target >= 0.999) { scheduleAutoplay(); return; }
    var remaining = st.end - window.scrollY;
    if (remaining <= 0) { scheduleAutoplay(); return; }
    tweenScrollTo(st.end, (remaining / (st.end - st.start)) * AUTOPLAY_FULL_SWEEP, 'none');
  }

  function scheduleAutoplay() {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(startAutoplay, AUTOPLAY_DELAY);
  }

  ['wheel', 'touchstart', 'pointerdown', 'keydown'].forEach(function (ev) {
    window.addEventListener(ev, function () {
      killScrollTween();
      scheduleAutoplay();
    }, { passive: true });
  });
  scheduleAutoplay();

  /* --- Arrow keys: step one card at a time while the gallery is pinned.
         Registered after the interrupt handler above, so the generic kill
         runs first and this tween survives. --- */
  window.addEventListener('keydown', function (e) {
    if (!st.isActive) return;
    var dir = 0;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') dir = 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') dir = -1;
    if (!dir) return;
    e.preventDefault();
    var step = (st.end - st.start) / cards.length;
    var y = Math.max(st.start, Math.min(st.end, window.scrollY + dir * step));
    tweenScrollTo(y, 0.7, 'power2.out');
  });
})();
