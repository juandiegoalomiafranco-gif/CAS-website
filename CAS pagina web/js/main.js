/* ============================================
   CAS PORTFOLIO — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar ---
  const progressBar = document.querySelector('.scroll-progress');
  if (progressBar) {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      progressBar.style.width = progress + '%';
    };
    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
  }

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

  // --- Progress Bar Animation ---
  const progressBars = document.querySelectorAll('.progress-bar__fill');

  if (progressBars.length > 0) {
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target.dataset.target || '0';
          entry.target.style.width = target + '%';
          progressObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    progressBars.forEach(bar => progressObserver.observe(bar));
  }

  // --- Experience Expand/Collapse ---
  document.querySelectorAll('.exp-entry__expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const details = btn.closest('.exp-entry').querySelector('.exp-entry__details');
      if (details) {
        details.classList.toggle('open');
        const isOpen = details.classList.contains('open');
        btn.innerHTML = isOpen
          ? 'Cerrar <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>'
          : 'Leer más <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>';
      }
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
  const filterBtns = document.querySelectorAll('.filter-btn[data-filter]');
  const filterCards = document.querySelectorAll('.card[data-category]');

  if (filterBtns.length > 0 && filterCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;

        filterCards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.classList.remove('hidden-filter');
            card.style.position = '';
            card.style.visibility = '';
          } else {
            card.classList.add('hidden-filter');
            setTimeout(() => {
              if (card.classList.contains('hidden-filter')) {
                card.style.position = 'absolute';
                card.style.visibility = 'hidden';
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

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

});
