/* ============================================
   CAS PORTFOLIO — Experiences hero carousel
   Pinned, scroll-driven infinite loop: curved rail
   of circular nodes on the right, full-bleed image
   + CTA on the left. Without GSAP or under
   prefers-reduced-motion the section stays static:
   first image + the five nodes listed and clickable.
   ============================================ */
(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const root = document.querySelector('.exp-carousel');
    if (!root) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.registerPlugin(ScrollTrigger);

    const track = root.querySelector('.exp-carousel__track');
    const originals = [...track.querySelectorAll('a')];
    const N = originals.length;
    if (N < 2) return;

    // Two extra copies for the seamless wrap
    for (let c = 0; c < 2; c++) originals.forEach((n) => track.appendChild(n.cloneNode(true)));
    const nodes = [...track.querySelectorAll('a')];

    root.classList.add('exp-carousel--live');

    const images = [...root.querySelectorAll('.exp-carousel__img')];
    const panelMeta = root.querySelector('.exp-carousel__panel .eyebrow');
    const panelTitle = root.querySelector('.exp-carousel__title');
    const cta = root.querySelector('.exp-carousel__cta');
    const count = root.querySelector('.exp-carousel__count');
    const panel = root.querySelector('.exp-carousel__panel');

    const LOOPS = 2;          // full cycles across the pinned distance
    const STEPS = N * LOOPS;  // snap steps
    let itemH = 0;
    let railH = 0;
    let active = -1;

    function measure() {
      railH = root.querySelector('.exp-carousel__rail').clientHeight;
      itemH = Math.max(96, railH / 4.2);
    }
    measure();

    function layout(p) {
      // p in item units, wraps over N
      const phase = ((p % N) + N) % N;
      const centerY = railH / 2;
      nodes.forEach((node, j) => {
        // node j sits at (j - phase - N) item-heights from the center of copy 2
        const d = j - phase - N; // distance from center in items
        if (Math.abs(d) > 3.2) { node.style.visibility = 'hidden'; return; }
        node.style.visibility = '';
        const y = centerY + d * itemH - node.offsetHeight / 2;
        const closeness = Math.max(0, 1 - Math.abs(d) * 0.45);
        const x = -44 * closeness;                 // curve: center bows toward the content
        const scale = 0.72 + 0.5 * closeness;      // active ≈ 1.22, far ≈ 0.72
        const opacity = 0.3 + 0.7 * closeness;
        gsap.set(node, { y, x, scale, opacity, transformOrigin: 'right center' });
        node.classList.toggle('is-active', Math.abs(d) < 0.5);
      });
    }

    function setActive(idx) {
      if (idx === active) return;
      active = idx;
      const src = originals[idx];
      images.forEach((img, k) => {
        gsap.to(img, { opacity: k === idx ? 1 : 0, scale: k === idx ? 1 : 1.04, duration: 0.55, ease: 'power2.out', overwrite: 'auto' });
      });
      panelMeta.textContent = src.dataset.meta;
      panelTitle.textContent = src.querySelector('.exp-carousel__label-title').textContent;
      cta.setAttribute('href', src.getAttribute('href'));
      count.textContent = String(idx + 1).padStart(2, '0') + ' / ' + String(N).padStart(2, '0');
      gsap.fromTo(panel, { opacity: 0.35, y: 8 }, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out', overwrite: 'auto' });
    }

    gsap.set(images.slice(1), { opacity: 0, scale: 1.04 });
    images.length && gsap.set(images[0], { opacity: 1, scale: 1 });

    ScrollTrigger.create({
      trigger: root,
      start: 'top top',
      end: '+=' + STEPS * 60 + '%',
      pin: true,
      scrub: 0.8,
      anticipatePin: 1,
      snap: { snapTo: 1 / STEPS, duration: { min: 0.15, max: 0.4 }, ease: 'power1.inOut' },
      onUpdate(self) {
        const p = self.progress * STEPS;
        layout(p);
        setActive(Math.round(p) % N);
      },
      onRefresh(self) {
        measure();
        layout(self.progress * STEPS);
      },
    });

    layout(0);
    setActive(0);
  });
})();
