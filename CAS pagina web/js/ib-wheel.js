/* ============================================
   CAS PORTFOLIO — IB Learner Profile Wheel (index, section 4)
   Vanilla JS, no GSAP dependency.

   The SVG wheel (#ibWheel) rotates continuously via CSS. Clicking (or
   Enter/Space on) a wedge (.ib-wheel__seg) highlights that wedge, dims the
   rest, and fills the detail box (#ibWheelDetail) with the attribute's
   title + definition, read from the wedge's own data-* attributes. A close
   button in the detail box returns everything to the resting state. Nothing
   here navigates to another page.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  const wheel = document.getElementById('ibWheel');
  const detail = document.getElementById('ibWheelDetail');

  if (!wheel || !detail) return;

  const segments = wheel.querySelectorAll('.ib-wheel__seg');
  const HINT_TEXT = 'Toca un atributo de la rueda para ver su definición.';

  const resetDetail = () => {
    segments.forEach(seg => seg.setAttribute('aria-expanded', 'false'));
    wheel.classList.remove('has-active');
    detail.dataset.state = 'empty';
    detail.innerHTML = `<p class="ib-wheel__detail-hint">${HINT_TEXT}</p>`;
  };

  const activateSegment = (seg) => {
    segments.forEach(s => s.setAttribute('aria-expanded', s === seg ? 'true' : 'false'));
    wheel.classList.add('has-active');

    const color = seg.dataset.color || 'var(--ink)';
    const num = seg.dataset.num || '';
    const label = seg.dataset.label || '';
    const definition = seg.dataset.definition || '';

    detail.dataset.state = 'active';
    detail.innerHTML = `
      <button type="button" class="ib-wheel__detail-close" aria-label="Cerrar detalle">&times;</button>
      <div class="ib-wheel__detail-head">
        <span class="ib-wheel__detail-num" style="color:${color};">${num}</span>
        <span class="ib-wheel__detail-title" style="color:${color};">${label}</span>
      </div>
      <p class="ib-wheel__detail-text">${definition}</p>
    `;

    const closeBtn = detail.querySelector('.ib-wheel__detail-close');
    if (closeBtn) closeBtn.addEventListener('click', resetDetail);
  };

  const handleSegment = (seg) => {
    const isActive = seg.getAttribute('aria-expanded') === 'true';
    if (isActive) {
      resetDetail();
    } else {
      activateSegment(seg);
    }
  };

  segments.forEach(seg => {
    seg.addEventListener('click', (e) => {
      e.preventDefault();
      handleSegment(seg);
    });

    seg.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        handleSegment(seg);
      }
    });
  });

});
