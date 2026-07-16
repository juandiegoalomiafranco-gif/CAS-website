/* ============================================
   CAS PORTFOLIO — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Mobile Navigation ---
  const hamburger = document.querySelector('.nav__hamburger');
  const mobileOverlay = document.querySelector('.nav__mobile-overlay');

  if (hamburger && mobileOverlay) {
    hamburger.setAttribute('aria-expanded', 'false');

    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileOverlay.classList.toggle('active');
      const isOpen = mobileOverlay.classList.contains('active');
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileOverlay.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll reveals live in js/scroll-anim.js (GSAP).

  // --- Counter Animation ---
  const animateCounter = (el, target, suffix, duration = 1400) => {
    const start = performance.now();
    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const counterEls = document.querySelectorAll('.counter-num[data-target]');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (counterEls.length > 0 && reducedMotion) {
    counterEls.forEach(el => {
      el.textContent = el.dataset.target + (el.dataset.suffix || '');
    });
  } else if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.dataset.target;
          const suffix = el.dataset.suffix || '';
          const target = parseFloat(raw);
          animateCounter(el, target, suffix);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  // --- Experience Expand/Collapse ---
  document.querySelectorAll('.exp-entry__expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.closest('.exp-entry').querySelector('.exp-entry__details');
      if (details) {
        details.classList.toggle('open');
        const isOpen = details.classList.contains('open');
        // measure instead of a fixed cap so tall (three-zone) content never clips
        details.style.maxHeight = isOpen ? details.scrollHeight + 'px' : '';
        btn.innerHTML = isOpen
          ? 'Cerrar <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>'
          : 'Leer más <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
      }
    });
  });

  // --- Project ficha Expand/Collapse (Page 3 list) ---
  document.querySelectorAll('.proj-row__expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const ficha = btn.parentElement.querySelector('.proj-row__ficha');
      if (!ficha) return;
      const isOpen = ficha.hasAttribute('hidden');
      if (isOpen) {
        ficha.removeAttribute('hidden');
        ficha.style.maxHeight = ficha.scrollHeight + 'px';
      } else {
        ficha.style.maxHeight = '';
        // wait for the collapse transition before re-hiding from a11y tree
        setTimeout(() => { ficha.setAttribute('hidden', ''); }, 500);
      }
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.innerHTML = isOpen
        ? 'Cerrar ficha <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>'
        : 'Ver ficha de aprendizaje <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
    });
  });

  // --- Reflection Expand/Collapse (Page 7) ---
  document.querySelectorAll('.reflection-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const content = btn.nextElementSibling;
      if (content && content.classList.contains('reflection-content')) {
        content.classList.toggle('open');
        const isOpen = content.classList.contains('open');
        btn.innerHTML = isOpen
          ? 'Cerrar reflexión <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>'
          : 'Reflexión personal <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
      }
    });
  });

  // --- Project Filter (Page 3) ---
  // Supports both the legacy .card grid and the .proj-row hierarchical list.
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const filterItems = document.querySelectorAll('.proj-row[data-category], .card[data-category]');

  if (filterBtns.length > 0 && filterItems.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        filterItems.forEach(item => {
          const match = filter === 'all' || item.dataset.category === filter;
          if (match) {
            item.classList.remove('hidden-filter');
            item.style.display = '';
            item.style.position = '';
            item.style.visibility = '';
          } else {
            item.classList.add('hidden-filter');
            setTimeout(() => {
              if (!item.classList.contains('hidden-filter')) return;
              // .proj-row collapses out of flow; .card is absolutely removed
              if (item.classList.contains('proj-row')) {
                item.style.display = 'none';
              } else {
                item.style.position = 'absolute';
                item.style.visibility = 'hidden';
              }
            }, 400);
          }
        });
      });
    });
  }

  // --- Experience Filter (Page 4) ---
  const expFilterBtns = document.querySelectorAll('.exp-filter-btn[data-filter]');
  const expEntries = document.querySelectorAll('.exp-entry[data-category]');

  if (expFilterBtns.length > 0 && expEntries.length > 0) {
    expFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        expFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        expEntries.forEach(entry => {
          if (filter === 'all' || entry.dataset.category === filter) {
            entry.style.display = '';
            entry.style.opacity = '1';
          } else {
            entry.style.opacity = '0';
            setTimeout(() => {
              if (!btn.classList.contains('active') || filter !== btn.dataset.filter) return;
              entry.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // --- Sort Experiences (Page 4) ---
  const sortSelect = document.querySelector('.exp-sort-select');
  const expList = document.querySelector('.exp-list');

  if (sortSelect && expList) {
    sortSelect.addEventListener('change', () => {
      const entries = Array.from(expList.querySelectorAll('.exp-entry'));
      const sortBy = sortSelect.value;

      entries.sort((a, b) => {
        if (sortBy === 'fecha') {
          return (a.dataset.date || '').localeCompare(b.dataset.date || '');
        } else if (sortBy === 'categoria') {
          return (a.dataset.category || '').localeCompare(b.dataset.category || '');
        }
        return 0;
      });

      entries.forEach(entry => expList.appendChild(entry));
    });
  }

  // --- Pillars (index, section 3): click/tap toggles .is-open, closing the
  // other two. Hover/focus-within already reveal via CSS alone; this block
  // only handles touch/click + Enter/Space so the reveal also works without
  // a mouse hover. Does not depend on GSAP. ---
  const pillars = document.querySelectorAll('.pillar');

  if (pillars.length > 0) {
    const togglePillar = (pillar) => {
      const wasOpen = pillar.classList.contains('is-open');
      pillars.forEach(p => {
        p.classList.remove('is-open');
        p.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        pillar.classList.add('is-open');
        pillar.setAttribute('aria-expanded', 'true');
      }
    };

    pillars.forEach(pillar => {
      pillar.addEventListener('click', (e) => {
        // Let the internal "Ver proyectos" link navigate normally.
        if (e.target.closest('a')) return;
        togglePillar(pillar);
      });

      pillar.addEventListener('keydown', (e) => {
        // Only react when the pillar itself (not a child link) has focus.
        if (e.target !== pillar) return;
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
          e.preventDefault();
          togglePillar(pillar);
        }
      });
    });
  }

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
