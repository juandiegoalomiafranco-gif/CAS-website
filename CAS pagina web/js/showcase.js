/* ============================================
   CAS PORTFOLIO — "Showcase" cross-highlight
   Vanilla (no GSAP). Hovering / focusing a tile or
   list row highlights its counterpart by data-id and
   dims everything else. Touch: click toggles.
   ============================================ */
(function () {
  const layout = document.querySelector('.showcase__layout');
  if (!layout) return;

  const items = Array.from(layout.querySelectorAll('[data-id]'));
  if (!items.length) return;

  let activeId = null;

  function render() {
    items.forEach((el) => {
      el.classList.remove('is-active', 'is-dim');
      if (activeId === null) return;
      if (el.dataset.id === activeId) el.classList.add('is-active');
      else el.classList.add('is-dim');
    });
  }

  function setActive(id) {
    if (activeId === id) return;
    activeId = id;
    render();
  }

  function clear() {
    if (activeId === null) return;
    activeId = null;
    render();
  }

  const isTouch = window.matchMedia('(hover: none)').matches;

  items.forEach((el) => {
    const id = el.dataset.id;

    if (isTouch) {
      el.addEventListener('click', () => {
        if (activeId === id) clear();
        else setActive(id);
      });
    } else {
      el.addEventListener('mouseenter', () => setActive(id));
    }

    // Keyboard focus works on both.
    el.addEventListener('focusin', () => setActive(id));
  });

  if (!isTouch) {
    layout.addEventListener('mouseleave', clear);
  }
  layout.addEventListener('focusout', (e) => {
    // Only clear when focus leaves the layout entirely.
    if (!layout.contains(e.relatedTarget)) clear();
  });
})();
