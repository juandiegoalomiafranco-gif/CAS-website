/* ============================================
   CAS PORTFOLIO — Galería de la bio ("Quién Soy")
   La galería queda fija (sticky) al lado del texto y va
   cambiando de foto según el avance de la lectura, hasta
   entregar el paso a la sección del Perfil IB.

   Está pensada para escalar a más de 100 fotos:

   · DESCUBRIMIENTO — no hay que declarar cada foto en el
     HTML ni mantener una lista. El script prueba en
     secuencia 01.jpg, 02.jpg, 03.jpg… y para cuando
     encuentra 3 fallos seguidos. Si subes 47 fotos,
     encuentra 47 y solo gasta 3 peticiones de más.

   · RECORRIDO — un espaciador bajo el texto alarga la
     columna para que la galería tenga por dónde deslizarse.
     Su altura crece con el número de fotos, con tope, para
     que la página nunca se vuelva interminable.

   · CARGA — con 100 fotos apiladas, loading="lazy" no sirve
     (todas cuentan como visibles). Solo se carga una
     ventana alrededor de la foto activa.

   Sin GSAP, con prefers-reduced-motion o en móvil no se
   activa la coreografía: quedan los marcos declarados en el
   HTML como columna o rejilla (ver css/quien-soy.css).
   ============================================ */
(function () {
  var root = document.querySelector('[data-bio-gallery]');
  if (!root) return;

  var frame = root.querySelector('.bio__frame');
  var counter = root.querySelector('[data-bio-counter]');
  if (!frame) return;

  var DIR = frame.getAttribute('data-bio-dir') || 'images/quien-soy/';
  var MAX = 200;   // tope duro de búsqueda
  var GAP = 3;     // fallos seguidos que dan por terminada la serie
  var LOTE = 8;    // cuántas se prueban a la vez
  var VENTANA = 2; // fotos cargadas a cada lado de la activa

  var declaradas = Array.prototype.slice.call(frame.querySelectorAll('.bio__shot'));
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var ruta = function (n) { return DIR + pad(n) + '.jpg'; };

  /* --- 1 · Descubrir cuántas fotos hay --- */
  function probar(n) {
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () { res(n); };
      im.onerror = function () { res(0); };
      im.src = ruta(n);
    });
  }

  function descubrir() {
    return new Promise(function (listo) {
      var halladas = [];
      var i = 1;
      (function lote() {
        var jobs = [];
        for (var k = 0; k < LOTE && i <= MAX; k++, i++) jobs.push(probar(i));
        if (!jobs.length) return listo(halladas);
        Promise.all(jobs).then(function (res) {
          res.forEach(function (n) { if (n) halladas.push(n); });
          var cola = res.slice(-GAP);
          var seAcabo = cola.length >= GAP && cola.every(function (n) { return !n; });
          if (seAcabo || i > MAX) listo(halladas);
          else lote();
        });
      })();
    });
  }

  /* --- 2 · Ajustar los marcos a lo que existe --- */
  function construir(halladas) {
    // Sin ninguna foto subida todavía: se quedan los marcos del HTML.
    if (!halladas.length) return declaradas;

    var shots = [];
    halladas.forEach(function (n, idx) {
      var fig = declaradas[idx];
      if (!fig) {
        fig = document.createElement('figure');
        fig.className = 'bio__shot';
        frame.appendChild(fig);
      }
      fig.setAttribute('data-n', n);
      fig.removeAttribute('data-slot');   // photo-slots.js no debe tocarla
      shots.push(fig);
    });

    // Marcos declarados que sobran porque no hay tantas fotos
    declaradas.slice(halladas.length).forEach(function (f) { f.remove(); });
    return shots;
  }

  /* --- 3 · Cargar solo alrededor de la foto activa --- */
  function asegurarImagen(fig) {
    if (fig.querySelector('img') || !fig.hasAttribute('data-n')) return;
    var n = fig.getAttribute('data-n');
    var img = document.createElement('img');
    img.setAttribute('src', ruta(Number(n)));
    img.setAttribute('alt', 'Juan Diego — foto ' + n);
    fig.insertBefore(img, fig.firstChild);
  }

  descubrir().then(function (halladas) {
    var shots = construir(halladas);
    var total = shots.length;
    if (!total) return;

    if (counter) counter.textContent = pad(1) + ' / ' + pad(total);

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Por debajo de 900px el layout apila texto y galería: no hay sticky que animar.
    if (!window.matchMedia('(min-width: 901px)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    root.classList.add('bio__gallery--live');

    // --- Recorrido: alargar la columna del texto con un espaciador ---
    var texto = document.querySelector('.bio__text');
    var espaciador = document.querySelector('[data-bio-spacer]');

    function ajustarEspaciador() {
      if (!espaciador || !texto) return;
      // ~0.35 pantallas por foto, nunca menos de 2.5 ni más de 10
      var pantallas = Math.min(10, Math.max(2.5, total * 0.35));
      var objetivo = pantallas * window.innerHeight;
      espaciador.style.height = '0px';
      var actual = texto.offsetHeight;
      espaciador.style.height = Math.max(0, Math.round(objetivo - actual)) + 'px';
    }
    ajustarEspaciador();

    // --- Cuando el texto se acaba, la galería se queda sola ---
    // Al alargar la columna, el texto termina mucho antes que las fotos y la
    // mitad izquierda queda vacía con la foto descolgada a la derecha. En ese
    // tramo la centramos respecto al contenedor: el recorrido largo pasa a
    // leerse como una secuencia de fotos a propósito, no como un hueco.
    function centrarSola() {
      var cont = root.closest('.container');
      if (!cont || !frame) return;
      // offsetLeft/offsetWidth son medidas de LAYOUT: el transform que ya
      // pueda tener aplicado no las altera. Con getBoundingClientRect habría
      // que descontarlo, y recalcular en cada refresco acabaría acumulando.
      // Se suma la cadena entera de offsetParent hasta el documento: la
      // cadena no siempre pasa por .container (solo lo hace si está
      // posicionado), así que compararlas a medias descuadra el centrado.
      var docX = function (el) {
        var x = 0;
        while (el) { x += el.offsetLeft; el = el.offsetParent; }
        return x;
      };
      var dx = (docX(cont) + cont.offsetWidth / 2) - (docX(frame) + frame.offsetWidth / 2);
      // en el contenedor, no en el marco: el contador es su hermano y así
      // también hereda la variable y viaja con la foto.
      root.style.setProperty('--solo-x', Math.round(dx) + 'px');
    }

    if (texto) {
      ScrollTrigger.create({
        trigger: texto,
        start: 'bottom 55%',
        end: () => 'bottom top-=' + (espaciador ? espaciador.offsetHeight : 0),
        invalidateOnRefresh: true,
        onToggle: function (self) {
          root.classList.toggle('bio__gallery--solo', self.isActive);
        },
        onRefresh: centrarSola,
      });
      centrarSola();
    }

    var activa = -1;
    function activar(i) {
      if (i === activa) return;
      activa = i;
      // carga por ventana: la activa y sus vecinas
      for (var k = Math.max(0, i - VENTANA); k <= Math.min(total - 1, i + VENTANA); k++) {
        asegurarImagen(shots[k]);
      }
      shots.forEach(function (shot, k) {
        gsap.to(shot, {
          opacity: k === i ? 1 : 0,
          scale: k === i ? 1 : 1.04,
          duration: 0.5,
          ease: 'power2.out',
          overwrite: 'auto',
        });
      });
      if (counter) counter.textContent = pad(i + 1) + ' / ' + pad(total);
    }

    gsap.set(shots, { opacity: 0, scale: 1.04 });
    gsap.set(shots[0], { opacity: 1, scale: 1 });

    // El recorrido de la columna izquierda (texto + espaciador) es el que
    // manda: las fotos se reparten a lo largo de toda la lectura.
    var columna = document.querySelector('.bio__col') || texto || root;
    ScrollTrigger.create({
      trigger: columna,
      start: 'top 65%',
      end: 'bottom 60%',
      invalidateOnRefresh: true,
      onRefresh: ajustarEspaciador,
      onUpdate: function (self) {
        var i = Math.floor(self.progress * total);
        activar(Math.max(0, Math.min(total - 1, i)));
      },
    });

    activar(0);
    ScrollTrigger.refresh();
  });
})();
