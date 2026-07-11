/* ============================================
   CAS PORTFOLIO — "Showcase" cross-highlight
   Vanilla (no GSAP). Hovering / focusing a tile or
   list row highlights its counterpart by data-id and
   dims everything else. Touch: click toggles.
   Each container ('.showcase__layout' or '[data-showcase]')
   is an independent instance — the quien-soy hero grid and
   the "Lo que me define" section don't affect each other.
   ============================================ */
(function () {
  const isTouch = window.matchMedia('(hover: none)').matches;

  function init(container) {
    const items = Array.from(container.querySelectorAll('[data-id]'));
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
      container.addEventListener('mouseleave', clear);
    }
    container.addEventListener('focusout', (e) => {
      // Only clear when focus leaves the container entirely.
      if (!container.contains(e.relatedTarget)) clear();
    });
  }

  document.querySelectorAll('.showcase__layout, [data-showcase]').forEach(init);
})();
