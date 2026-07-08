(() => {
  const journey = document.getElementById('journey');
  const items = Array.from(document.querySelectorAll('.spiral-item'));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const n = items.length; // one full page-scroll "slot" per phrase

  // how far each phrase swings left/right at the midpoint of its orbit
  function radius() {
    return Math.min(150, window.innerWidth * 0.32);
  }

  // gives the section enough scroll room for every phrase to get its own slot
  function setHeight() {
    journey.style.height = `${n * window.innerHeight}px`;
  }

  // Runs on every scroll tick. Figures out how far the user has scrolled
  // through the section (0-1), then works out where each phrase currently
  // sits along its own orbit loop.
  function updateOrbit() {
    const rect = journey.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const scrollable = Math.max(1, rect.height - viewportH);
    const progress = Math.min(1, Math.max(0, -rect.top / scrollable));

    const slice = 1 / n; // each item gets an equal share of the scroll range
    const r = radius();

    items.forEach((item, i) => {
      const start = i * slice;
      // local: 0 -> 1 progress through *this item's* own slot
      const local = Math.min(1, Math.max(0, (progress - start) / slice));

      // one full orbit per item: starts behind the center object, swings
      // toward the viewer (peak size, angle 0), then swings away and behind again
      const angleDeg = 180 + local * 360;
      const angleRad = (angleDeg * Math.PI) / 180;

      const depth = Math.cos(angleRad); // -1 (far, behind) .. 1 (near, in front)
      const xOffset = Math.sin(angleRad) * r; // left/right swing of the orbit

      const scale = 0.35 + ((depth + 1) / 2) * 1.0; // bigger the closer it is
      const opacity = local <= 0.01 || local >= 0.99 ? 0 : 0.35 + ((depth + 1) / 2) * 0.65;
      const tilt = (xOffset / r) * 10; // slight rotation for a "swinging past" feel

      item.style.transform = `translate(calc(-50% + ${xOffset}px), -50%) scale(${scale}) rotate(${tilt}deg)`;
      item.style.opacity = opacity;
      // in front of the center circle on the near half of the orbit, behind it on the far half
      item.style.zIndex = depth > 0 ? 6 : 4;
    });
  }

  function init() {
    setHeight();
    updateOrbit();
  }

  if (!reduceMotion) {
    // requestAnimationFrame throttle: skip extra recalcs if a frame is already queued
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateOrbit();
          ticking = false;
        });
        ticking = true;
      }
    });

    // recompute the layout if the viewport changes size (debounced)
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    });

    init();
  } else {
    // motion-sensitive users just get the phrases listed statically, no animation
    journey.style.height = 'auto';
    items.forEach((item) => {
      item.style.position = 'static';
      item.style.transform = 'none';
      item.style.opacity = '1';
      item.style.display = 'block';
      item.style.textAlign = 'center';
      item.style.margin = '0.5rem 0';
    });
  }

  // ---- Intro orbit: the three headline phrases circling the intro star.
  // Same depth math as updateOrbit() above (bigger/brighter swinging toward
  // the viewer, smaller/dimmer swinging away), but driven by elapsed time
  // instead of scroll position, since this section isn't scroll-linked —
  // it just loops for as long as the intro is on screen.
  const introStage = document.querySelector('.intro-orbit-stage');
  const introItems = introStage ? Array.from(introStage.querySelectorAll('.intro-orbit-text')) : [];

  function introRadius() {
    return Math.min(110, window.innerWidth * 0.28);
  }

  function initIntroOrbit() {
    const m = introItems.length;

    if (reduceMotion) {
      introItems.forEach((item) => {
        item.style.position = 'static';
        item.style.display = 'inline-block';
        item.style.transform = 'none';
        item.style.opacity = '1';
        item.style.margin = '0.3rem 0.6rem';
      });
      return;
    }

    const lapMs = 12000; // time for one phrase to complete a full orbit

    function frame(now) {
      const r = introRadius();

      introItems.forEach((item, i) => {
        // each phrase's own 0-1 progress around the loop, evenly offset
        // from the others by its share of one lap
        const local = (((now / lapMs) + i / m) % 1 + 1) % 1;

        const angleDeg = 180 + local * 360;
        const angleRad = (angleDeg * Math.PI) / 180;

        const depth = Math.cos(angleRad);
        const xOffset = Math.sin(angleRad) * r;

        const scale = 0.35 + ((depth + 1) / 2) * 1.0;
        const opacity = 0.35 + ((depth + 1) / 2) * 0.65;
        const tilt = (xOffset / r) * 10;

        item.style.transform = `translate(calc(-50% + ${xOffset}px), -50%) scale(${scale}) rotate(${tilt}deg)`;
        item.style.opacity = opacity;
        item.style.zIndex = depth > 0 ? 6 : 1;
      });

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  if (introItems.length) {
    initIntroOrbit();
  }

  // "Choose Private/Group" buttons: pre-select the matching radio and jump to the form
  const ctaButtons = document.querySelectorAll('.option-cta');
  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const option = btn.dataset.option;
      const radio = document.querySelector(`input[name="lessonType"][value="${option}"]`);
      if (radio) radio.checked = true;
      document.getElementById('signup').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Signup form: front-end only for now — validates, then just swaps in a
  // success message. Nothing is actually sent anywhere yet.
  const form = document.getElementById('signup-form');
  const success = document.getElementById('signup-success');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    form.hidden = true;
    success.hidden = false;
  });
})();
