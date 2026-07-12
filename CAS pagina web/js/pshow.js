/* ============================================
   CAS PORTFOLIO — Projects showcase (proyectos.html)
   Hero de proyectos con recorrido pinned:
   · Intro tipográfico con campo de estrellas en tinta
     sobre crema (canvas, solo con animación activa).
   · Transición "reveal": el panel activo sale hacia
     arriba y el siguiente ya está detrás — levemente
     reducido y desenfocado — y se enfoca al quedar
     al frente. Scrub largo para un ritmo pausado.
   Sin GSAP o con prefers-reduced-motion queda el
   apilado estático CSS.
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

  /* --- Campo de estrellas del intro (tinta sobre crema) --- */
  function initStars(panel) {
    var canvas = document.createElement('canvas');
    canvas.className = 'pshow__stars';
    panel.insertBefore(canvas, panel.firstChild);
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var W = 0, H = 0, stars = [];

    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = panel.clientWidth;
      H = panel.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    var COUNT = Math.max(50, Math.min(130, Math.round(W * H / 16000)));
    for (var i = 0; i < COUNT; i++) {
      stars.push({
        fx: Math.random(),               // posición como fracción (sobrevive resize)
        fy: Math.random(),
        r: 0.6 + Math.random() * 1.5,
        base: 0.06 + Math.random() * 0.2, // alfa base: siempre sutil sobre crema
        tw: 0.4 + Math.random() * 1.4,    // velocidad de parpadeo
        ph: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 9,    // deriva lenta, px/s
        vy: (Math.random() - 0.5) * 5,
      });
    }

    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(canvas);
    }

    var last = performance.now();
    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible || document.hidden) { last = now; return; }
      var dt = Math.min(now - last, 100) / 1000;
      last = now;
      ctx.clearRect(0, 0, W, H);
      var t = now / 1000;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.fx = (s.fx + (s.vx * dt) / W + 1) % 1;
        s.fy = (s.fy + (s.vy * dt) / H + 1) % 1;
        var a = s.base * (0.55 + 0.45 * Math.sin(t * s.tw + s.ph));
        if (a <= 0.01) continue;
        ctx.beginPath();
        ctx.arc(s.fx * W, s.fy * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(28, 24, 20, ' + a.toFixed(3) + ')';
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }

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

  /* --- Scroll pinned: el activo sale, el siguiente se revela detrás --- */
  function initShowcase() {
    section.classList.add('pshow--live');

    var counter = section.querySelector('[data-pshow-counter]');
    var projCount = panels.length - 1;

    var MOVE = 1;    // duración relativa de cada transición
    var HOLD = 0.6;  // pausa relativa sobre cada proyecto
    var SEG = MOVE + HOLD;
    var total = (panels.length - 1) * SEG;

    // El primero del DOM queda al frente; los demás esperan detrás,
    // apenas reducidos y desenfocados (sin opacidad: nada se transparenta).
    panels.forEach(function (panel, i) {
      panel.style.zIndex = String(panels.length - i);
    });
    gsap.set(panels.slice(1), {
      yPercent: 2.5,
      scale: 0.95,
      filter: 'blur(8px) brightness(1.04)',
      transformOrigin: 'center center',
    });

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
        // ~1.6 pantallas de scroll por transición: ritmo pausado
        end: '+=' + (panels.length * 160) + '%',
        pin: true,
        scrub: 1.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: function (self) {
          // Un proyecto es "activo" cuando el saliente pasó la mitad de su salida
          var t = self.progress * total;
          var i = Math.floor((t + SEG - MOVE * 0.5) / SEG);
          setActive(Math.max(0, Math.min(projCount, i)));
        },
      },
    });

    panels.forEach(function (panel, i) {
      if (!i) return;
      var at = (i - 1) * SEG;
      // El panel al frente sale por arriba como un telón…
      tl.to(panels[i - 1], {
        yPercent: -106,
        ease: 'power2.inOut',
        duration: MOVE,
      }, at);
      // …y el que estaba detrás se asienta y se enfoca al quedar al frente.
      tl.to(panel, {
        yPercent: 0,
        scale: 1,
        filter: 'blur(0px) brightness(1)',
        ease: 'power2.out',
        duration: MOVE * 0.9,
      }, at + MOVE * 0.15);
    });
    // Reposo final: el último proyecto queda quieto antes de soltar el pin
    tl.to({}, { duration: HOLD }, total - HOLD);

    setActive(0);
  }

  // Se espera la serif para que el título no salte al envolver las palabras
  var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  fontsReady.then(function () {
    initShowcase();
    initStars(section.querySelector('.pshow__panel--intro') || panels[0]);
    playEntrance();
    ScrollTrigger.refresh();
  });
})();
