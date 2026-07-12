/* ============================================
   CAS PORTFOLIO — Projects showcase (proyectos.html)
   Réplica adaptada del hero de productos de referencia:
   sección pinned donde cada panel de proyecto sube desde
   abajo cubriendo al anterior, que se atenúa, desenfoca
   y deriva hacia arriba (parallax). Entrada tipográfica
   del intro al cargar. Sin GSAP o con
   prefers-reduced-motion queda el apilado estático CSS.
   ============================================ */
(function () {
  var section = document.querySelector('.pshow');
  if (!section) return;
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  gsap.registerPlugin(ScrollTrigger);

  var panels = Array.prototype.slice.call(section.querySelectorAll('[data-pshow-panel]'));
  if (panels.length < 2) return;

  var EASE = 'power3.out';

  /* --- Entrada del intro: título palabra a palabra + fades --- */
  function playEntrance() {
    var title = section.querySelector('.pshow__title');
    var eyebrow = section.querySelector('.pshow__intro-eyebrow');
    var quote = section.querySelector('.pshow__quote');
    var attr = section.querySelector('.pshow__attr');
    var hint = section.querySelector('.pshow__hint');

    if (title) {
      // El <em> se perdería con textContent; se marca la palabra itálica
      // y se restaura tras envolver cada palabra en su clip.
      var em = title.querySelector('em');
      var italicWords = em ? em.textContent.trim().split(/\s+/) : [];
      var words = title.textContent.trim().split(/\s+/);
      title.textContent = '';
      words.forEach(function (word, i) {
        var clip = document.createElement('span');
        clip.style.cssText = 'display:inline-block;overflow:hidden;vertical-align:top;';
        var inner = document.createElement('span');
        inner.style.display = 'inline-block';
        if (italicWords.indexOf(word) !== -1) inner.style.fontStyle = 'italic';
        inner.textContent = word;
        clip.appendChild(inner);
        title.appendChild(clip);
        if (i < words.length - 1) title.appendChild(document.createTextNode(' '));
      });
      gsap.fromTo(title.querySelectorAll('span > span'),
        { yPercent: 110, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 1.1, ease: EASE, stagger: 0.09, delay: 0.1 });
    }
    if (eyebrow) {
      gsap.fromTo(eyebrow, { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, ease: EASE, delay: 0.05 });
    }
    if (quote) {
      gsap.fromTo(quote, { opacity: 0, y: 18 },
        { opacity: 0.75, y: 0, duration: 1, ease: EASE, delay: 0.55 });
    }
    if (attr) {
      gsap.fromTo(attr, { opacity: 0 },
        { opacity: 1, duration: 0.8, ease: EASE, delay: 0.95 });
    }
    if (hint) {
      gsap.fromTo(hint, { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.7, ease: EASE, delay: 1.2 });
    }
  }

  /* --- Scroll pinned: paneles apilados --- */
  function initShowcase() {
    section.classList.add('pshow--live');

    var counter = section.querySelector('[data-pshow-counter]');
    var projCount = panels.length - 1;

    var MOVE = 1;    // duración relativa de cada transición
    var HOLD = 0.5;  // pausa relativa sobre cada proyecto
    var SEG = MOVE + HOLD;
    // total: N-1 transiciones + reposo final sobre el último proyecto
    var total = (panels.length - 1) * SEG;

    gsap.set(panels.slice(1), { yPercent: 101 });

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };
    var active = -1;
    function setActive(i) {
      if (i === active || !counter) { active = i; return; }
      active = i;
      if (i <= 0) { counter.style.opacity = 0; return; }
      counter.textContent = pad(i) + ' / ' + pad(projCount);
      counter.style.opacity = 1;
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=' + (panels.length * 100) + '%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          // Un proyecto es "activo" cuando su panel entrante pasó la mitad
          var t = self.progress * total;
          var i = Math.floor((t + SEG - MOVE * 0.5) / SEG);
          setActive(Math.max(0, Math.min(projCount, i)));
        },
      },
    });

    panels.forEach(function (panel, i) {
      if (!i) return;
      var at = (i - 1) * SEG;
      // El saliente deriva hacia arriba mientras se apaga y desenfoca…
      tl.to(panels[i - 1], {
        yPercent: -16,
        opacity: 0.15,
        filter: 'blur(9px)',
        ease: 'power1.in',
        duration: MOVE,
      }, at);
      // …y el entrante lo cubre subiendo desde el borde inferior.
      tl.to(panel, { yPercent: 0, ease: 'power1.inOut', duration: MOVE }, at);
    });
    // Reposo final: el último proyecto queda quieto antes de soltar el pin
    tl.to({}, { duration: HOLD }, (panels.length - 1) * SEG - HOLD);

    setActive(0);
  }

  // Se espera la serif para que el título no salte al envolver las palabras
  var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(function () {
    initShowcase();
    playEntrance();
    ScrollTrigger.refresh();
  });
})();
