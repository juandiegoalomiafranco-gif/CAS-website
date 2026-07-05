/* ============================================
   CAS PORTFOLIO — Hero animation (GSAP)
   Entrance on load + scroll-scrubbed pinned timeline.
   ============================================ */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    console.error('[hero] GSAP/ScrollTrigger did not load — hero stays in its static CSS state.');
    return;
  }
  gsap.registerPlugin(ScrollTrigger);

  function initHero() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero       = document.querySelector('#hero');
    const cream      = document.querySelector('.hero__cream');
    const photo      = document.querySelector('.hero__photo');
    const img        = document.getElementById('heroImage');
    const darken     = document.querySelector('.hero__photo-darken');
    const heroText   = document.querySelector('.hero__text');
    const line1      = document.querySelector('.line--1');
    const maskedFill = document.querySelector('.line--1 .line__fill--masked');
    const solidFill  = document.querySelector('.line--1 .line__fill--solid');
    const line2      = document.querySelector('.line--2');
    const hint       = document.querySelector('.hero__hint');

    const els = { hero, cream, photo, img, darken, heroText, line1, maskedFill, solidFill, line2 };
    for (const [name, el] of Object.entries(els)) {
      if (!el) { console.error('[hero] missing element:', name); return; }
    }

    // Entrance must not replay when gsap.matchMedia re-runs on a breakpoint change.
    let hasPlayedEntrance = false;

    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile:  '(max-width: 768px)',
        isDesktop: '(min-width: 769px)',
      },
      (context) => {
        const { isMobile } = context.conditions;
        const blurStart = isMobile ? 14 : 24;

        // The entrance animates the .line--1 wrapper and the hint; the scrub
        // only touches the inner fills, so the two timelines never fight over
        // an element — except the hint, handled below with immediateRender:false.
        let entranceDone = hasPlayedEntrance || window.scrollY > 10;
        let entrance = null;

        if (!entranceDone) {
          gsap.set(line1, { y: 36, opacity: 0 });
          if (hint) gsap.set(hint, { y: 8, opacity: 0 });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: hero,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate(self) {
              // User scrolled mid-entrance: jump the entrance to its end
              // state so the scrub takes over from a known baseline.
              if (!entranceDone && self.progress > 0.001) {
                if (entrance) entrance.progress(1);
                entranceDone = true;
              }
            },
          },
        });

        // A: cream gives way to the photo, which sharpens as it settles
        tl.to(cream, { opacity: 0, ease: 'power2.out', duration: 0.3 }, 0);
        tl.to(photo, { opacity: 1, ease: 'power2.out', duration: 0.3 }, 0);
        tl.fromTo(photo,
          { filter: `blur(${blurStart}px)` },
          { filter: 'blur(0px)', ease: 'power2.out', duration: 0.7 },
          0
        );
        // Ken Burns: transform-only zoom on the inner img (container keeps the filter)
        tl.fromTo(img, { scale: 1.08 }, { scale: 1, ease: 'none', duration: 1 }, 0);

        // B: L1 crossfade — photo-in-glyphs → solid white.
        // power1.in out / power1.out in keeps combined luminance steady mid-blend.
        tl.to(maskedFill, { opacity: 0, ease: 'power1.in',  duration: 0.4 }, 0.5);
        tl.to(solidFill,  { opacity: 1, ease: 'power1.out', duration: 0.4 }, 0.5);

        // C: the whole h1 drifts up as the sequence resolves, and L2 lands with it
        tl.to(heroText, { y: '-3vh', ease: 'power1.inOut', duration: 0.45 }, 0.55);
        tl.to(line2, { opacity: 1, y: 0, ease: 'power3.out', duration: 0.4 }, 0.65);

        // D: darken deepens at the end so the hand-off to the next section reads intentionally
        tl.fromTo(darken, { opacity: 0.75 }, { opacity: 1, ease: 'power1.inOut', duration: 0.3 }, 0.7);

        // Hint fades out as soon as scrolling starts. immediateRender:false +
        // position 0.01 so creating the scrub never stomps the entrance's fade-in.
        if (hint) {
          tl.fromTo(hint,
            { opacity: 0.6 },
            { opacity: 0, ease: 'power1.out', duration: 0.15, immediateRender: false },
            0.01
          );
        }

        // Entrance plays once, after the scrub is set up (pin applied, no layout jump)
        if (!entranceDone) {
          entrance = gsap.timeline({
            onComplete: () => { entranceDone = true; },
          });
          entrance.to(line1, { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }, 0.15);
          if (hint) entrance.to(hint, { y: 0, opacity: 0.6, duration: 0.7, ease: 'power2.out' }, 0.9);
          hasPlayedEntrance = true;
        }
      }
    );
  }

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();

  const imageReady = new Promise((resolve) => {
    const img = document.getElementById('heroImage');
    if (!img) return resolve();
    if (img.complete && img.naturalWidth > 0) return resolve();
    img.addEventListener('load', resolve, { once: true });
    img.addEventListener('error', resolve, { once: true });
  });

  // Wait for the serif font + hero photo so the masked text never flashes unstyled
  Promise.all([fontsReady, imageReady]).then(() => {
    initHero();
    ScrollTrigger.refresh();
  });
})();
