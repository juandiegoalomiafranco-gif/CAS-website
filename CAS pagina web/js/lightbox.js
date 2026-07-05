/* ============================================
   CAS PORTFOLIO — Lightbox (vanilla, no deps)
   Opens any <a class="mosaic__link"> inside a
   [data-lightbox] container in a fullscreen viewer.
   Without JS the links simply open the raw image.
   ============================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('[data-lightbox]')) return;

    // Build the overlay once
    const box = document.createElement('div');
    box.className = 'lightbox';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Visor de fotos');
    box.innerHTML =
      '<button class="lightbox__close" aria-label="Cerrar">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<button class="lightbox__prev" aria-label="Anterior">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M15 18l-6-6 6-6"/></svg>' +
      '</button>' +
      '<button class="lightbox__next" aria-label="Siguiente">' +
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 6l6 6-6 6"/></svg>' +
      '</button>' +
      '<div class="lightbox__zone lightbox__zone--prev" aria-hidden="true"></div>' +
      '<div class="lightbox__zone lightbox__zone--next" aria-hidden="true"></div>' +
      '<div class="lightbox__stage">' +
        '<img class="lightbox__img" alt="">' +
        '<div class="lightbox__caption-row">' +
          '<span class="lightbox__cap"></span>' +
          '<span class="lightbox__count" aria-live="polite"></span>' +
        '</div>' +
      '</div>';
    document.body.appendChild(box);

    const img = box.querySelector('.lightbox__img');
    const cap = box.querySelector('.lightbox__cap');
    const count = box.querySelector('.lightbox__count');
    const btnClose = box.querySelector('.lightbox__close');
    const btnPrev = box.querySelector('.lightbox__prev');
    const btnNext = box.querySelector('.lightbox__next');

    let items = [];
    let index = 0;
    let opener = null;

    function render() {
      const item = items[index];
      img.src = item.src;
      img.alt = item.alt;
      cap.textContent = item.cap;
      count.textContent = (index + 1) + ' / ' + items.length;
      const single = items.length < 2;
      btnPrev.style.visibility = single ? 'hidden' : '';
      btnNext.style.visibility = single ? 'hidden' : '';
    }

    function open(container, startIndex) {
      items = [...container.querySelectorAll('a.mosaic__link')].map((a) => {
        const fig = a.closest('figure');
        const capEl = fig && fig.querySelector('figcaption');
        const image = a.querySelector('img');
        return {
          src: a.getAttribute('href'),
          alt: image ? image.alt : '',
          cap: capEl ? capEl.textContent.trim() : (image ? image.alt : ''),
        };
      });
      if (!items.length) return;
      index = startIndex;
      render();
      box.classList.add('open');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
    }

    function close() {
      box.classList.remove('open');
      document.body.style.overflow = '';
      img.src = '';
      if (opener) { opener.focus(); opener = null; }
    }

    const step = (dir) => { index = (index + dir + items.length) % items.length; render(); };

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a.mosaic__link');
      if (!link) return;
      const container = link.closest('[data-lightbox]');
      if (!container) return;
      e.preventDefault();
      opener = link;
      const links = [...container.querySelectorAll('a.mosaic__link')];
      open(container, links.indexOf(link));
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', () => step(-1));
    btnNext.addEventListener('click', () => step(1));
    box.querySelector('.lightbox__zone--prev').addEventListener('click', () => step(-1));
    box.querySelector('.lightbox__zone--next').addEventListener('click', () => step(1));
    box.addEventListener('click', (e) => { if (e.target === box) close(); });

    // Swipe on touch devices
    let downX = null;
    box.addEventListener('pointerdown', (e) => { downX = e.clientX; });
    box.addEventListener('pointerup', (e) => {
      if (downX === null) return;
      const dx = e.clientX - downX;
      downX = null;
      if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    });

    document.addEventListener('keydown', (e) => {
      if (!box.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'Tab') {
        // focus-trap-lite between the three buttons
        const focusables = [btnPrev, btnNext, btnClose].filter((b) => b.style.visibility !== 'hidden');
        const i = focusables.indexOf(document.activeElement);
        e.preventDefault();
        const next = e.shiftKey
          ? focusables[(i - 1 + focusables.length) % focusables.length]
          : focusables[(i + 1) % focusables.length];
        next.focus();
      }
    });
  });
})();
