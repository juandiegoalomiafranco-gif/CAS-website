/* ============================================
   CAS PORTFOLIO — Site-wide scroll animations (GSAP)
   Loaded on every page, after GSAP + ScrollTrigger.
   All initial hidden states are set from JS, so content
   stays visible without JS, without GSAP, or under
   prefers-reduced-motion.
   ============================================ */
(function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const EASE = 'power3.out';
  const REVEAL = { y: 28, duration: 0.9 };
  const TRIGGER_START = 'top 85%';

  document.addEventListener('DOMContentLoaded', () => {

    // --- Page title: word-by-word rise (skipped on index — the hero owns its h1) ---
    document.querySelectorAll('.page-head__title').forEach((title) => {
      const words = title.textContent.trim().split(/\s+/);
      title.textContent = '';
      words.forEach((word, i) => {
        const clip = document.createElement('span');
        clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:bottom;';
        const inner = document.createElement('span');
        inner.style.display = 'inline-block';
        inner.textContent = word + (i < words.length - 1 ? ' ' : '');
        clip.appendChild(inner);
        title.appendChild(clip);
      });
      const inners = title.querySelectorAll('span > span');
      gsap.set(inners, { yPercent: 110 });
      gsap.to(inners, { yPercent: 0, duration: 1, ease: EASE, stagger: 0.06, delay: 0.1 });

      // Companion pieces of the same header fade in alongside the words
      const head = title.closest('.page-head') || title.parentElement;
      if (head) {
        const pieces = head.querySelectorAll('.eyebrow, .page-head__sub, .count-note, .lead');
        if (pieces.length) {
          gsap.set(pieces, { opacity: 0, y: 12 });
          gsap.to(pieces, { opacity: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.1, delay: 0.35 });
        }
      }
    });

    // --- Rules that draw themselves in ---
    document.querySelectorAll('.page-head__rule, hr.divider').forEach((rule) => {
      gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
      gsap.to(rule, {
        scaleX: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: rule, start: TRIGGER_START, once: true },
      });
    });

    // --- Fade-rise reveals (page-heads animate via the word sequence above) ---
    document.querySelectorAll('.reveal').forEach((el) => {
      if (el.querySelector('.page-head__title') || el.classList.contains('page-head')) return;
      gsap.set(el, { opacity: 0, y: REVEAL.y });
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: REVEAL.duration,
        ease: EASE,
        scrollTrigger: { trigger: el, start: TRIGGER_START, once: true },
      });
    });

    // --- Staggered children ---
    document.querySelectorAll('.stagger-children').forEach((parent) => {
      const children = parent.children;
      if (!children.length) return;
      gsap.set(children, { opacity: 0, y: 16 });
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: EASE,
        stagger: 0.08,
        scrollTrigger: { trigger: parent, start: TRIGGER_START, once: true },
      });
    });

    // --- Zone-head numerals settle slightly after their zone reveals ---
    document.querySelectorAll('.zone-head__num').forEach((num) => {
      gsap.set(num, { y: 16, opacity: 0 });
      gsap.to(num, {
        y: 0,
        opacity: 0.45,
        duration: 0.9,
        ease: EASE,
        delay: 0.15,
        scrollTrigger: { trigger: num, start: TRIGGER_START, once: true },
      });
    });

    // --- Evidence / pending frames + mosaics: soft cascade ---
    document.querySelectorAll('.evidence-grid, .mosaic').forEach((grid) => {
      const frames = grid.children;
      if (!frames.length) return;
      gsap.set(frames, { opacity: 0, y: 16 });
      gsap.to(frames, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: EASE,
        stagger: 0.06,
        scrollTrigger: { trigger: grid, start: TRIGGER_START, once: true },
      });
    });

    // --- Watermark parallax (subtle upward drift while its section scrolls) ---
    document.querySelectorAll('.section__bg-text, .section__bg-number, .project-block__number, .proj-hero__num').forEach((el) => {
      gsap.to(el, {
        y: -40,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });
    });

    // --- Nav: hide on scroll down, return on scroll up ---
    const nav = document.querySelector('.nav');
    if (nav) {
      let hidden = false;
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        onUpdate(self) {
          const overlayOpen = document.querySelector('.nav__mobile-overlay.active');
          const shouldHide = self.direction === 1 && window.scrollY > 200 && !overlayOpen;
          if (shouldHide !== hidden) {
            hidden = shouldHide;
            gsap.to(nav, { yPercent: hidden ? -100 : 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
          }
        },
      });
    }
  });

  // Recalculate trigger positions once everything (fonts, images) has settled.
  // ScrollTrigger's refresh can swallow the browser's deferred hash jump, so
  // re-scroll to the anchor explicitly (scrollIntoView honors scroll-margin-top).
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) requestAnimationFrame(() => target.scrollIntoView());
    }
  });
})();
