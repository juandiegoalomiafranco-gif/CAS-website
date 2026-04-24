(function () {
  console.log('[hero] hero-anim.js loaded');

  if (typeof gsap === 'undefined') {
    console.error('[hero] FATAL: GSAP did not load. Check CDN <script> in index.html.');
    return;
  }
  console.log('[hero] GSAP version:', gsap.version);

  if (typeof ScrollTrigger === 'undefined') {
    console.error('[hero] FATAL: ScrollTrigger did not load. Check CDN <script> in index.html.');
    return;
  }
  console.log('[hero] ScrollTrigger loaded');
  gsap.registerPlugin(ScrollTrigger);

  function initHero() {
    console.log('[hero] initHero() running');

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      console.log('[hero] Reduced motion — skipping animation');
      return;
    }

    const hero  = document.querySelector('#hero');
    const cream = document.querySelector('.hero__cream');
    const photo = document.querySelector('.hero__photo');
    const line2 = document.querySelector('.line--2');
    const hint  = document.querySelector('.hero__hint');

    const els = { hero, cream, photo, line2 };
    for (const [name, el] of Object.entries(els)) {
      if (!el) { console.error('[hero] FATAL: missing element:', name); return; }
    }
    console.log('[hero] All DOM elements present');

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile:  '(max-width: 768px)',
        isDesktop: '(min-width: 769px)',
      },
      (context) => {
        const { isMobile } = context.conditions;
        const blurStart = isMobile ? 18 : 36;
        console.log('[hero] breakpoint —', isMobile ? 'mobile' : 'desktop', '| blurStart:', blurStart + 'px');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onEnter: () => console.log('[hero] ScrollTrigger entered'),
            onLeave: () => console.log('[hero] ScrollTrigger left'),
          },
        });

        // A: cream fades out quickly — photo (and image-in-text) visible early
        tl.to(cream, { opacity: 0, ease: 'power2.out', duration: 0.3 }, 0);

        // A: photo fades in — blur lives ONLY on this layer, never on text
        tl.to(photo, { opacity: 1, ease: 'power2.out', duration: 0.3 }, 0);
        tl.fromTo(photo,
          { filter: `blur(${blurStart}px)` },
          { filter: 'blur(0px)', ease: 'power2.out', duration: 0.7 },
          0
        );

        // B: L1 crossfade — masked (drummer inside glyphs) → solid white
        tl.to('.line--1 .line__fill--masked', { opacity: 0, ease: 'power2.inOut', duration: 0.35 }, 0.55);
        tl.to('.line--1 .line__fill--solid',  { opacity: 1, ease: 'power2.inOut', duration: 0.35 }, 0.55);

        // C: L2 reveals below L1 in solid white
        tl.to(line2, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.4 }, 0.7);

        // Scroll hint fades
        if (hint) tl.to(hint, { opacity: 0, ease: 'power1.out', duration: 0.15 }, 0);

        console.log('[hero] Timeline created, total duration:', tl.duration());
      }
    );
  }

  const fontsReady = document.fonts
    ? document.fonts.ready.then(() => console.log('[hero] Fonts ready'))
    : Promise.resolve();

  const imageReady = new Promise((resolve) => {
    const img = document.getElementById('heroImage');
    if (!img) {
      console.warn('[hero] #heroImage not found');
      return resolve();
    }
    if (img.complete && img.naturalWidth > 0) {
      console.log('[hero] Image already loaded:', img.naturalWidth, 'x', img.naturalHeight);
      return resolve();
    }
    img.addEventListener('load', () => {
      console.log('[hero] Image loaded:', img.naturalWidth, 'x', img.naturalHeight);
      resolve();
    }, { once: true });
    img.addEventListener('error', () => {
      console.error('[hero] Image FAILED to load. Verify images/drummer.jpg exists.');
      resolve();
    }, { once: true });
  });

  Promise.all([fontsReady, imageReady]).then(() => {
    console.log('[hero] All assets ready — initializing...');
    initHero();
    ScrollTrigger.refresh();
    console.log('[hero] ScrollTrigger refreshed');
  });
})();
