/* ============================================
   CAS PORTFOLIO — Huecos de foto y de vídeo ("slots")
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

   Los vídeos funcionan igual pero con data-video-slot:
       <figure class="vidslot"
               data-video-slot="images/experiencias/exp-01/video-01.mp4"
               data-alt="Concierto — vídeo 01">
         <div class="placeholder-img">…</div>
       </figure>
   ============================================ */
(function () {
  var slots = Array.prototype.slice.call(document.querySelectorAll('[data-slot]'));

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

  // La capa de fondo del carrusel de experiencias ya trae su propio degradado
  // (.exp-carousel__darken) en el HTML: aquí solo metemos la imagen delante y
  // quitamos el rótulo de relleno.
  function fillCarouselImg(fig, src, alt) {
    var img = document.createElement('img');
    img.setAttribute('src', src);
    img.setAttribute('alt', alt);

    var ghost = fig.querySelector('.filmstrip__ghost');
    if (ghost) ghost.remove();

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

  /* --- Huecos de vídeo ---
     Un vídeo no se puede comprobar con Image(). Usamos un <video> suelto, que
     nunca entra en el DOM, con preload="metadata": si el archivo existe y el
     navegador sabe decodificarlo dispara loadedmetadata; si no, dispara error
     y el marco se queda vacío en lugar de mostrar un reproductor roto.

     Se prueban varias extensiones sobre la misma ruta porque los vídeos de
     celular salen en .mov y no todos los navegadores los decodifican: si
     subes video-01.mov y el navegador no puede con él, el marco queda vacío
     en vez de romperse. Por eso .mp4 es la opción recomendada. */
  var VIDEO_EXTS = ['mp4', 'webm', 'mov'];

  function videoCandidates(declared) {
    var base = declared.replace(/\.[^./]+$/, '');
    var list = [declared];
    VIDEO_EXTS.forEach(function (ext) {
      var candidate = base + '.' + ext;
      if (list.indexOf(candidate) === -1) list.push(candidate);
    });
    return list;
  }

  function probeVideo(candidates, i, onFound, onNone) {
    if (i >= candidates.length) { onNone(); return; }

    var probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.muted = true;

    var settled = false;
    function settle(found) {
      if (settled) return;
      settled = true;
      // Soltamos el archivo: sin esto el navegador sigue descargando el vídeo
      // que solo queríamos comprobar.
      probe.removeAttribute('src');
      probe.load();
      if (found) onFound(candidates[i]);
      else probeVideo(candidates, i + 1, onFound, onNone);
    }

    probe.addEventListener('loadedmetadata', function () { settle(true); });
    probe.addEventListener('error', function () { settle(false); });
    probe.src = candidates[i];
  }

  function fillVideo(fig, src, alt, cap) {
    var video = document.createElement('video');
    video.setAttribute('src', src);
    video.setAttribute('controls', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'metadata');
    if (alt) video.setAttribute('aria-label', alt);

    var ph = fig.querySelector('.placeholder-img');
    if (ph) ph.remove();
    fig.insertBefore(video, fig.firstChild);

    if (cap) {
      var figcap = document.createElement('figcaption');
      figcap.className = 'vidslot__cap';
      figcap.textContent = cap;
      fig.appendChild(figcap);
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-video-slot]')).forEach(function (fig) {
    var declared = fig.getAttribute('data-video-slot');
    if (!declared) return;
    var alt = fig.getAttribute('data-alt') || '';
    var cap = fig.getAttribute('data-cap') || '';

    probeVideo(videoCandidates(declared), 0, function (src) {
      fillVideo(fig, src, alt, cap);
      fig.setAttribute('data-slot-state', 'filled');
    }, function () {
      fig.setAttribute('data-slot-state', 'empty');
    });
  });

  slots.forEach(function (fig) {
    var src = fig.getAttribute('data-slot');
    if (!src) return;
    var alt = fig.getAttribute('data-alt') || '';
    var cap = fig.getAttribute('data-cap') || '';

    var probe = new Image();
    probe.onload = function () {
      if (fig.classList.contains('exp-carousel__img')) fillCarouselImg(fig, src, alt);
      else if (fig.classList.contains('bio__shot')) fillBioShot(fig, src, alt);
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
