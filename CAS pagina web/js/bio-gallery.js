/* ============================================
   CAS PORTFOLIO — Galería de la bio ("Quién Soy")
   La galería queda fija (sticky) al lado del texto y va
   cambiando de foto según el avance de la lectura.

   Quién hace qué:
   · js/photo-slots.js  rellena los marcos con las fotos
     que ya existan en images/quien-soy/.
   · este archivo       solo se encarga de la coreografía.

   Sin GSAP, con prefers-reduced-motion o por debajo de
   900px no se activa nada de aquí: la galería queda como
   una columna (o rejilla) de fotos, todas visibles. Ver el
   fallback de .bio__frame en css/quien-soy.css.
   ============================================ */
(function () {
  var root = document.querySelector('[data-bio-gallery]');
  if (!root) return;

  var shots = Array.prototype.slice.call(root.querySelectorAll('.bio__shot'));
  if (!shots.length) return;

  var counter = root.querySelector('[data-bio-counter]');
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  if (counter) counter.textContent = pad(1) + ' / ' + pad(shots.length);

  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  // Por debajo de 900px el layout apila texto y galería: no hay sticky que animar.
  if (!window.matchMedia('(min-width: 901px)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  root.classList.add('bio__gallery--live');

  var active = -1;
  function setActive(i) {
    if (i === active) return;
    active = i;
    shots.forEach(function (shot, k) {
      gsap.to(shot, {
        opacity: k === i ? 1 : 0,
        scale: k === i ? 1 : 1.04,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
    if (counter) counter.textContent = pad(i + 1) + ' / ' + pad(shots.length);
  }

  gsap.set(shots, { opacity: 0, scale: 1.04 });
  gsap.set(shots[0], { opacity: 1, scale: 1 });

  // Manda el recorrido de la columna de texto: repartimos las fotos a lo
  // largo de la lectura, no del alto total de la sección.
  var text = document.querySelector('.bio__text');
  ScrollTrigger.create({
    trigger: text || root,
    start: 'top 65%',
    end: 'bottom 60%',
    invalidateOnRefresh: true,
    onUpdate: function (self) {
      var i = Math.floor(self.progress * shots.length);
      setActive(Math.max(0, Math.min(shots.length - 1, i)));
    },
  });

  setActive(0);
})();
