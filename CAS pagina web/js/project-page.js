/* ============================================
   CAS PORTFOLIO — Project detail page
   Coreografía de scroll de las páginas de proyecto:
   numeral del hero + filmstrip de fotos verticales.

   Todo lo de aquí es ornamental. Sin GSAP o con
   prefers-reduced-motion la página queda estática y
   sigue siendo completamente utilizable: el filmstrip
   se recorre con scroll horizontal nativo (ver el
   fallback de .filmstrip__track en styles.css).
   ============================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    // Numeral del hero: se asienta al cargar (el parallax lo pone scroll-anim.js)
    const heroNum = document.querySelector('.proj-hero__num');
    if (heroNum) {
      gsap.fromTo(heroNum,
        { opacity: 0, scale: 1.15 },
        { opacity: 0.06, scale: 1, duration: 1.4, ease: 'power3.out' });
    }

    // --- Filmstrip: banda de tarjetas verticales que avanza en horizontal
    // mientras la sección está pinned. El recorrido es exactamente lo que
    // sobresale del viewport, así que la última tarjeta termina alineada al
    // borde y no sobra ni falta scroll.
    const strip = document.querySelector('.filmstrip');
    const track = strip && strip.querySelector('.filmstrip__track');
    if (!strip || !track) return;

    strip.classList.add('filmstrip--live');

    // scrollWidth es una medida de layout: no la afecta el transform que
    // le estamos aplicando, así que sigue siendo válida en cada refresh.
    const overflow = () => Math.max(0, track.scrollWidth - window.innerWidth);

    // En pantallas anchas puede que las tarjetas quepan enteras: entonces no
    // hay nada que desplazar y no tiene sentido secuestrar el scroll.
    if (overflow() === 0) {
      strip.classList.remove('filmstrip--live');
      return;
    }

    gsap.to(track, {
      x: () => -overflow(),
      ease: 'none',
      scrollTrigger: {
        trigger: strip,
        start: 'top top',
        end: () => '+=' + overflow(),
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    });
  });
})();
