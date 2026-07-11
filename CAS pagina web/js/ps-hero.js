/* ============================================
   CAS PORTFOLIO — "Quién Soy" hero animation
   Word-by-word rise for the typographic hero,
   replicating the site-wide page-title effect.
   Loaded after GSAP. Static fallback if GSAP is
   missing or prefers-reduced-motion is set.
   ============================================ */
(function () {
  if (typeof gsap === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const EASE = 'power3.out';

  // Wrap each word of `el` in clip/inner spans and return the inner spans.
  function wrapWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = '';
    words.forEach((word, i) => {
      const clip = document.createElement('span');
      clip.className = 'anim-word';
      clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
      const inner = document.createElement('span');
      inner.style.display = 'inline-block';
      inner.textContent = word;
      clip.appendChild(inner);
      el.appendChild(clip);
      if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
    });
    return el.querySelectorAll('.anim-word > span');
  }

  document.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.ps-hero__title');
    const quote = document.querySelector('.ps-hero__quote');
    const attr = document.querySelector('.ps-hero__attr');

    // The <em> inside the title would be lost by textContent; keep italics by
    // marking the italic word and re-applying it after wrapping.
    let italicWords = [];
    if (title) {
      const em = title.querySelector('em');
      if (em) italicWords = em.textContent.trim().split(/\s+/);
    }

    if (title) {
      const inners = wrapWords(title);
      // Restore italics on words that came from <em>.
      inners.forEach((inner) => {
        if (italicWords.indexOf(inner.textContent) !== -1) {
          inner.style.fontStyle = 'italic';
        }
      });
      gsap.fromTo(inners,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: EASE, stagger: 0.08 });
    }

    if (quote) {
      const inners = wrapWords(quote);
      gsap.fromTo(inners,
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: EASE, stagger: 0.08, delay: 0.5 });
    }

    if (attr) {
      gsap.fromTo(attr,
        { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: EASE, delay: 1.2 });
    }
  });
})();
