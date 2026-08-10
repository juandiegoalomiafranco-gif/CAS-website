/* ============================================
   CAS PORTFOLIO — Huecos de foto ("photo slots")
   Rellena solo los marcos de las galerías.

   Cada marco declara la ruta donde vivirá su foto:
       <figure class="mosaic__item"
               data-slot="images/proyectos/bateria/01.jpg"
               data-alt="Batería — evidencia 01">
         <div class="placeholder-img">…</div>
       </figure>

   Este script comprueba si ese archivo existe y, solo si existe,
   inyecta la imagen. Así basta con subir la foto a su carpeta con
   el nombre correcto para que aparezca — sin tocar el HTML.

   La comprobación se hace con un Image() que nunca entra en el DOM,
   de modo que un archivo que todavía no existe NO deja el icono de
   imagen rota: el HTML solo contiene marcos, y sin JS se ven marcos.
   ============================================ */
(function () {
  // La galería de la bio se gestiona entera desde js/bio-gallery.js
  // (descubre las fotos por su cuenta), así que aquí se deja fuera para
  // no probar dos veces las mismas rutas.
  var slots = Array.prototype.slice.call(document.querySelectorAll('[data-slot]'))
    .filter(function (el) { return !el.closest('[data-bio-gallery]'); });
  if (!slots.length) return;

  function fillMosaic(fig, src, alt, cap) {
    var link = document.createElement('a');
    link.className = 'mosaic__link';
    link.setAttribute('href', src);

    var img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', alt);
    img.setAttribute('loading', 'lazy');
    link.appendChild(img);

    var ph = fig.querySelector('.placeholder-img');
    if (ph) ph.remove();
    fig.insertBefore(link, fig.firstChild);

    if (cap) {
      var figcap = document.createElement('figcaption');
      figcap.className = 'mosaic__cap';
      figcap.textContent = cap;
      fig.appendChild(figcap);
    }
  }

  function fillBioShot(fig, src, alt) {
    var img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', alt);
    img.setAttribute('loading', 'lazy');
    fig.insertBefore(img, fig.firstChild);
  }

  function fillFilmstrip(fig, src, alt) {
    var img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', alt);
    img.setAttribute('loading', 'lazy');

    // El degradado va inmediatamente después de la imagen: el CSS lo
    // engancha con el selector `img + .filmstrip__darken`.
    var darken = document.createElement('div');
    darken.className = 'filmstrip__darken';

    var ghost = fig.querySelector('.filmstrip__ghost');
    if (ghost) ghost.remove();
    var label = fig.querySelector('.filmstrip__pendinglabel');
    if (label) label.remove();

    fig.insertBefore(darken, fig.firstChild);
    fig.insertBefore(img, fig.firstChild);
  }

  slots.forEach(function (fig) {
    var src = fig.getAttribute('data-slot');
    if (!src) return;
    var alt = fig.getAttribute('data-alt') || '';
    var cap = fig.getAttribute('data-cap') || '';

    var probe = new Image();
    probe.onload = function () {
      if (fig.classList.contains('bio__shot')) fillBioShot(fig, src, alt);
      else if (fig.classList.contains('filmstrip__slide')) fillFilmstrip(fig, src, alt);
      else fillMosaic(fig, src, alt, cap);
      fig.setAttribute('data-slot-state', 'filled');
    };
    probe.onerror = function () {
      fig.setAttribute('data-slot-state', 'empty');
    };
    probe.src = src;
  });
})();
