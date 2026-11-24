/**
 * animations.js — Animation & Interactive Effects Module
 * Handles preloader dismiss, AOS scroll reveals, GSAP triggers,
 * 3D tilt cards, magnetic buttons, custom cursor, and animated counters.
 */

export function initAnimations() {
  dismissPreloader();
  initCustomCursor();
  initAOS();
  initTiltCards();
  initMagneticButtons();
  initSkillBarsOnScroll();
  initAnimatedCounters();
}

/**
 * 1. Dismiss preloader smoothly after DOM and assets are ready
 */
function dismissPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  const hidePreloader = () => {
    preloader.classList.add('fade-out');
    setTimeout(() => {
      preloader.style.display = 'none';
    }, 400);
  };

  // Dismiss quickly once page is ready to optimize FCP and avoid blocking
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 100);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 100));
    // Hard fallback safety timer under 1.2 seconds
    setTimeout(hidePreloader, 800);
  }
}

/**
 * 2. Custom Glowing Cursor (Desktop Only)
 */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const cursorDot = document.getElementById('custom-cursor-dot');
  if (!cursor || !cursorDot) return;

  // Disable on touch devices or reduced motion
  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isTouch || prefersReducedMotion) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  });

  // Smooth lagging loop for the outer cursor ring
  const updateCursor = () => {
    const ease = 0.18;
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(updateCursor);
  };
  requestAnimationFrame(updateCursor);

  // Expand cursor on hovering interactive elements
  const hoverTargets = document.querySelectorAll('a, button, input, textarea, .tilt-card, .filter-btn');
  hoverTargets.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
  });
}

/**
 * 3. Animate On Scroll (AOS) Initialization
 */
function initAOS() {
  if (typeof window.AOS !== 'undefined') {
    window.AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }
}

/**
 * 4. 3D Tilt Cards with Vanilla-Tilt
 */
function initTiltCards() {
  const tiltElements = document.querySelectorAll('.tilt-card');
  if (tiltElements.length === 0) return;

  // Check if VanillaTilt is available
  if (typeof window.VanillaTilt !== 'undefined') {
    window.VanillaTilt.init(tiltElements, {
      max: 10,
      speed: 400,
      glare: true,
      'max-glare': 0.18,
      scale: 1.02
    });
  }
}

/**
 * 5. Magnetic Buttons
 */
function initMagneticButtons() {
  const magneticButtons = document.querySelectorAll('.magnetic-btn');
  if (magneticButtons.length === 0) return;

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  if (isTouch) return;

  magneticButtons.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Subtle pull factor
      const strength = 0.25;
      btn.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = 'translate(0px, 0px)';
    });
  });
}

/**
 * 6. Skill Bars Animation on Scroll
 */
function initSkillBarsOnScroll() {
  const skillBars = document.querySelectorAll('.skill-item__bar-fill');
  if (skillBars.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const progress = bar.getAttribute('data-progress') || '50%';
        bar.style.width = progress;
        obs.unobserve(bar);
      }
    });
  }, { threshold: 0.2 });

  skillBars.forEach((bar) => observer.observe(bar));
}

/**
 * 7. Animated Statistics Counters
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.counter-card__number');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'), 10) || 0;
        let count = 0;
        const duration = 1200; // ms
        const startTime = performance.now();

        const updateCount = (currentTime) => {
          const elapsedTime = currentTime - startTime;
          const progress = Math.min(elapsedTime / duration, 1);
          // Easing: easeOutQuad
          const easeProgress = progress * (2 - progress);
          count = Math.floor(easeProgress * target);
          counter.textContent = String(count);

          if (progress < 1) {
            requestAnimationFrame(updateCount);
          } else {
            counter.textContent = String(target);
          }
        };

        requestAnimationFrame(updateCount);
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => observer.observe(counter));
}

