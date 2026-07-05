/* ============================================
   CAS PORTFOLIO — Project detail page
   Consistency counter + timeline interactions.
   The counter and note toggles work without GSAP
   and under prefers-reduced-motion; only the
   scroll choreography is GSAP-guarded.
   ============================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.querySelector('.timeline');
    if (!timeline) return;

    // --- Consistency counter (X de N+ días registrados) ---
    const logged = timeline.querySelectorAll('.timeline__day--logged');
    const goal = parseInt(timeline.dataset.goal, 10) || 28;
    document.querySelectorAll('.js-day-count').forEach((el) => { el.textContent = logged.length; });
    document.querySelectorAll('.js-day-goal').forEach((el) => { el.textContent = goal; });
    document.querySelectorAll('.js-meter-fill').forEach((el) => {
      el.dataset.target = String(Math.round((logged.length / goal) * 100));
    });

    // Per-week registered-day counts
    timeline.querySelectorAll('.timeline__week').forEach((week) => {
      const out = week.querySelector('.js-week-count');
      if (!out) return;
      const n = week.querySelectorAll('.timeline__day--logged').length;
      out.textContent = n ? n + ' día' + (n > 1 ? 's' : '') + ' registrado' + (n > 1 ? 's' : '') : '';
    });

    // --- Tap a logged day: expand its note (accordion per timeline) ---
    timeline.querySelectorAll('.timeline__dot[aria-controls]').forEach((dot) => {
      dot.addEventListener('click', () => {
        const note = document.getElementById(dot.getAttribute('aria-controls'));
        if (!note) return;
        const isOpen = dot.getAttribute('aria-expanded') === 'true';
        // close every note in this timeline first
        timeline.querySelectorAll('.timeline__dot[aria-expanded="true"]').forEach((d) => {
          d.setAttribute('aria-expanded', 'false');
          const n = document.getElementById(d.getAttribute('aria-controls'));
          if (n) n.hidden = true;
        });
        if (!isOpen) {
          dot.setAttribute('aria-expanded', 'true');
          note.hidden = false;
        }
      });
    });

    // --- GSAP scroll choreography (ornamental only) ---
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const line = document.querySelector('.timeline__line');
    if (line) {
      gsap.set(line, { scaleY: 0 });
      gsap.to(line, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: '.timeline-wrap',
          start: 'top 75%',
          end: 'bottom 45%',
          scrub: 0.6,
        },
      });
    }

    timeline.querySelectorAll('.timeline__day--logged .timeline__dot').forEach((dot) => {
      gsap.set(dot, { scale: 0.5, opacity: 0.3, transformOrigin: 'center center' });
      gsap.to(dot, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: 'back.out(2)',
        scrollTrigger: { trigger: dot, start: 'top 70%', once: true },
      });
    });
  });
})();
