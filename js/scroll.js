/**
 * scroll.js — Cinematic Scroll Animation System (v1.1)
 * Integrates Lenis Smooth Scroll with GSAP ScrollTrigger.
 * Implements S1 through S16 with responsive matchMedia and reduced-motion fallbacks.
 *
 * Beginner-friendly: You can tweak speeds, durations, and distances in CONFIG below.
 */

// --------------------------------------------------------------------------
// CONFIGURATION — Tweak these values easily to adjust the scroll experience
// --------------------------------------------------------------------------
export const SCROLL_CONFIG = {
  // S1: Lenis smooth scroll inertia (lower = smoother/slower, e.g. 0.06 - 0.12)
  lenisLerp: 0.08,
  smoothWheel: true,

  // S2: Hero scroll-out
  heroScaleEnd: 0.92,
  heroFadeEnd: 0.15,
  heroYOffset: -60,

  // S3: Split-text headings
  headingStagger: 0.04,
  headingDuration: 0.85,

  // S6: Projects horizontal gallery
  horizontalScrub: 1,

  // S7: Stacking cards scale reduction
  cardStackScale: 0.95,

  // S10: Skills marquee
  marqueeBaseSpeed: 1.2,
  marqueeVelocityMultiplier: 0.008,

  // S11: Velocity skew limit (in degrees)
  maxSkewAngle: 3.5,

  // S14: Circular progress ring
  progressRingCircumference: 150.8 // 2 * PI * 24
};

// Module-level Lenis instance
let lenisInstance = null;

/**
 * Returns the active Lenis instance (or null if disabled / reduced motion)
 */
export function getLenis() {
  return lenisInstance;
}

/**
 * Main initialization entry point for v1.1 Scroll Experience
 */
export function initScroll() {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Register GSAP ScrollTrigger plugin
  if (typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined') {
    window.gsap.registerPlugin(window.ScrollTrigger);
  } else {
    console.warn('GSAP or ScrollTrigger not loaded. Scroll animations skipped.');
    return;
  }

  // 2. S1: Setup Lenis Smooth Scroll (unless reduced motion is preferred)
  if (!prefersReducedMotion && typeof window.Lenis !== 'undefined') {
    initLenis();
  } else {
    initNativeAnchorScroll();
  }

  // 3. Setup effects that work on both mobile and desktop (or adapt gracefully)
  initSplitTextHeadings();
  initAboutTextHighlight();
  initParallaxLayers();
  initSkillsMarquee();
  initSectionThemeShift();
  initCircularProgressRing();
  initSlidingNavIndicator();
  initImageClipReveals();
  initVelocitySkew();

  // 4. Setup Desktop vs Mobile specific effects using gsap.matchMedia()
  initResponsiveScrollEffects();

  // 5. Call ScrollTrigger.refresh() when page has finished loading assets
  window.addEventListener('load', () => {
    setTimeout(() => {
      window.ScrollTrigger.refresh();
    }, 200);
  });
}

// --------------------------------------------------------------------------
// S1: Lenis Smooth Inertia Scrolling & Anchor Links
// --------------------------------------------------------------------------
function initLenis() {
  try {
    lenisInstance = new window.Lenis({
      lerp: SCROLL_CONFIG.lenisLerp,
      smoothWheel: SCROLL_CONFIG.smoothWheel,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Synchronize Lenis scroll position with GSAP ScrollTrigger
    lenisInstance.on('scroll', window.ScrollTrigger.update);

    // Sync GSAP ticker with Lenis requestAnimationFrame
    window.gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });
    window.gsap.ticker.lagSmoothing(0);

    // Bind all anchor links to smooth glide with Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId && targetId !== '#') {
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            e.preventDefault();
            lenisInstance.scrollTo(targetEl, {
              offset: -70,
              duration: 1.2,
              easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
          }
        }
      });
    });
  } catch (err) {
    console.warn('Lenis initialization failed, falling back to browser scroll:', err);
    initNativeAnchorScroll();
  }
}

function initNativeAnchorScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

// --------------------------------------------------------------------------
// S2, S6, S7, S8, S16: Responsive GSAP matchMedia Setup (Desktop ≥ 1024px)
// --------------------------------------------------------------------------
function initResponsiveScrollEffects() {
  const mm = window.gsap.matchMedia();

  // DESKTOP ONLY: 1024px and wider
  mm.add('(min-width: 1024px)', () => {
    // S2: Hero scroll-out (scale, fade, upward parallax)
    initHeroScrollOut();

    // S6: Pinned horizontal-scroll project gallery
    initProjectsHorizontalScroll();

    // S7: Stacking cards for Community
    initCommunityStackingCards();

    // S8: SVG Line-drawing timeline for Education
    initEducationSvgTimeline();

    // S16: Footer curtain reveal
    initFooterCurtainReveal();
  });

  // TABLET & MOBILE ONLY: Under 1024px (simple, fast, vertical)
  mm.add('(max-width: 1023px)', () => {
    // Simple vertical scroll reveals for mobile projects and community
    window.gsap.utils.toArray('.project-card').forEach((card) => {
      window.gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  });
}

// --------------------------------------------------------------------------
// S2: Hero Scroll-Out (Scrubbed Scale, Fade, and Particle Parallax)
// --------------------------------------------------------------------------
function initHeroScrollOut() {
  const heroSection = document.getElementById('home');
  const heroContent = document.querySelector('.hero__content');
  const heroVisual = document.querySelector('.hero__visual');
  const heroParticles = document.getElementById('tsparticles');

  if (!heroSection || !heroContent) return;

  const tl = window.gsap.timeline({
    scrollTrigger: {
      trigger: heroSection,
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    }
  });

  // Scale down and fade content upward
  tl.to(
    heroContent,
    {
      scale: SCROLL_CONFIG.heroScaleEnd,
      opacity: SCROLL_CONFIG.heroFadeEnd,
      y: SCROLL_CONFIG.heroYOffset,
      ease: 'none'
    },
    0
  );

  if (heroVisual) {
    tl.to(
      heroVisual,
      {
        scale: 0.95,
        opacity: 0.2,
        y: SCROLL_CONFIG.heroYOffset * 0.8,
        ease: 'none'
      },
      0
    );
  }

  // Particle canvas moves slower for depth
  if (heroParticles) {
    tl.to(
      heroParticles,
      {
        y: 80,
        opacity: 0.4,
        ease: 'none'
      },
      0
    );
  }
}

// --------------------------------------------------------------------------
// S3: Split-Text Heading Reveals (Masked Word Stagger)
// --------------------------------------------------------------------------
function initSplitTextHeadings() {
  const headingTitles = document.querySelectorAll('.section-header__title');
  if (headingTitles.length === 0) return;

  headingTitles.forEach((heading) => {
    // Avoid double-wrapping if already split
    if (heading.dataset.splitDone) return;
    heading.dataset.splitDone = 'true';

    // Split text into spans wrapped with overflow:hidden container
    const originalHTML = heading.innerHTML;
    const words = heading.textContent.trim().split(/\s+/);

    // If SplitType library is available on window, use it
    if (typeof window.SplitType !== 'undefined') {
      try {
        const st = new window.SplitType(heading, { types: 'lines,words' });
        window.gsap.from(st.words, {
          y: '115%',
          opacity: 0,
          duration: SCROLL_CONFIG.headingDuration,
          stagger: SCROLL_CONFIG.headingStagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: heading,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        });
        return;
      } catch (e) {
        heading.innerHTML = originalHTML; // Fallback
      }
    }

    // Native lightweight splitter fallback
    const wrappedWords = words
      .map(
        (w) =>
          `<span class="split-word" style="overflow: hidden; display: inline-block; vertical-align: top;"><span class="split-inner" style="display: inline-block;">${w}</span></span>`
      )
      .join(' ');
    heading.innerHTML = wrappedWords;

    const innerSpans = heading.querySelectorAll('.split-inner');
    window.gsap.from(innerSpans, {
      y: '120%',
      opacity: 0,
      duration: SCROLL_CONFIG.headingDuration,
      stagger: SCROLL_CONFIG.headingStagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: heading,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  });
}

// --------------------------------------------------------------------------
// S4: Scrubbed Text Highlight on About Paragraph
// --------------------------------------------------------------------------
function initAboutTextHighlight() {
  const bioPara = document.getElementById('about-bio');
  if (!bioPara || bioPara.dataset.scrubDone) return;
  bioPara.dataset.scrubDone = 'true';

  const text = bioPara.textContent.trim();
  const words = text.split(/\s+/);

  bioPara.innerHTML = words
    .map((word) => `<span class="scrub-word">${word}</span>`)
    .join(' ');

  const scrubWords = bioPara.querySelectorAll('.scrub-word');

  window.gsap.to(scrubWords, {
    opacity: 1,
    color: '#ffffff',
    stagger: 0.03,
    ease: 'none',
    scrollTrigger: {
      trigger: bioPara,
      start: 'top 78%',
      end: 'bottom 55%',
      scrub: 0.8
    }
  });
}

// --------------------------------------------------------------------------
// S5: Multi-Layer Parallax with data-speed Attributes
// --------------------------------------------------------------------------
function initParallaxLayers() {
  const parallaxElements = document.querySelectorAll('[data-speed]');
  if (parallaxElements.length === 0) return;

  parallaxElements.forEach((el) => {
    const speed = parseFloat(el.getAttribute('data-speed')) || 0.2;
    const distance = speed * 150;

    window.gsap.to(el, {
      y: distance,
      ease: 'none',
      scrollTrigger: {
        trigger: el.closest('section') || el,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });
}

// --------------------------------------------------------------------------
// S6: Pinned Horizontal-Scroll Gallery for Projects (Desktop ≥ 1024px)
// --------------------------------------------------------------------------
function initProjectsHorizontalScroll() {
  const pinnedSection = document.getElementById('projects-pinned-container');
  const track = document.getElementById('projects-track');
  if (!pinnedSection || !track) return;

  // Calculate distance the track needs to slide horizontally
  const getScrollDistance = () => {
    return track.scrollWidth - window.innerWidth + 200;
  };

  const tween = window.gsap.to(track, {
    x: () => -getScrollDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: pinnedSection,
      start: 'top top',
      end: () => `+=${getScrollDistance()}`,
      pin: true,
      scrub: SCROLL_CONFIG.horizontalScrub,
      invalidateOnRefresh: true,
      anticipatePin: 1
    }
  });

  return tween;
}

// --------------------------------------------------------------------------
// S7: Stacking Cards for Community
// --------------------------------------------------------------------------
function initCommunityStackingCards() {
  const cards = window.gsap.utils.toArray('.community-stack-card');
  if (cards.length < 2) return;

  cards.forEach((card, index) => {
    if (index === cards.length - 1) return; // Last card stays flat

    window.gsap.to(card, {
      scale: SCROLL_CONFIG.cardStackScale,
      opacity: 0.75,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: cards[index + 1],
        start: 'top 70%',
        end: 'top 20%',
        scrub: true
      }
    });
  });
}

// --------------------------------------------------------------------------
// S8: SVG Line-Drawing Timeline for Education
// --------------------------------------------------------------------------
function initEducationSvgTimeline() {
  const svgPath = document.getElementById('edu-svg-line-progress');
  const eduCards = document.querySelectorAll('.edu-card');
  if (!svgPath) return;

  const pathLength = svgPath.getTotalLength ? svgPath.getTotalLength() : 800;

  // Initialize dash properties
  window.gsap.set(svgPath, {
    strokeDasharray: pathLength,
    strokeDashoffset: pathLength
  });

  // Scrub the line drawing as the education section scrolls
  window.gsap.to(svgPath, {
    strokeDashoffset: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '#education',
      start: 'top 65%',
      end: 'bottom 80%',
      scrub: 1
    }
  });

  // Activate milestone nodes as the line passes each card
  eduCards.forEach((card) => {
    const dot = card.querySelector('.edu-node-dot');
    if (!dot) return;

    window.ScrollTrigger.create({
      trigger: card,
      start: 'top 70%',
      onEnter: () => dot.classList.add('active'),
      onLeaveBack: () => dot.classList.remove('active')
    });
  });
}

// --------------------------------------------------------------------------
// S9: Clip-Path Image Reveal
// --------------------------------------------------------------------------
function initImageClipReveals() {
  const clipTargets = document.querySelectorAll('.clip-reveal');
  if (clipTargets.length === 0) return;

  clipTargets.forEach((target) => {
    window.gsap.fromTo(
      target,
      { clipPath: 'inset(100% 0% 0% 0%)' },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: target,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      }
    );
  });
}

// --------------------------------------------------------------------------
// S10: Velocity-Reactive Skills Marquee
// --------------------------------------------------------------------------
function initSkillsMarquee() {
  const track = document.getElementById('skills-marquee-track');
  if (!track) return;

  let currentX = 0;
  let targetVelocity = 1;
  const baseSpeed = SCROLL_CONFIG.marqueeBaseSpeed;

  // Update velocity multiplier based on scroll speed
  window.ScrollTrigger.create({
    onUpdate: (self) => {
      const v = self.getVelocity();
      targetVelocity = 1 + Math.abs(v) * SCROLL_CONFIG.marqueeVelocityMultiplier;
      // Reverse direction if user is scrolling upward rapidly
      if (v < -200) targetVelocity = -targetVelocity;
    }
  });

  // Infinite smooth marquee tick loop
  const tick = () => {
    currentX -= baseSpeed * targetVelocity;
    // Reset to create seamless infinite loop (track contains duplicate elements)
    const halfWidth = track.scrollWidth / 2;
    if (Math.abs(currentX) >= halfWidth) {
      currentX = 0;
    }
    track.style.transform = `translate3d(${currentX}px, 0, 0)`;

    // Decay velocity back to 1 smoothly
    targetVelocity += (1 - targetVelocity) * 0.05;
    requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// --------------------------------------------------------------------------
// S11: Velocity Skew on Cards and Headings
// --------------------------------------------------------------------------
function initVelocitySkew() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  const skewTargets = document.querySelectorAll('.velocity-skew');
  if (skewTargets.length === 0) return;

  const proxy = { skew: 0 };
  const skewSetter = window.gsap.quickSetter(skewTargets, 'skewY', 'deg');
  const clamp = window.gsap.utils.clamp(-SCROLL_CONFIG.maxSkewAngle, SCROLL_CONFIG.maxSkewAngle);

  window.ScrollTrigger.create({
    onUpdate: (self) => {
      const skew = clamp(self.getVelocity() / -400);
      if (Math.abs(skew) > Math.abs(proxy.skew)) {
        proxy.skew = skew;
        window.gsap.to(proxy, {
          skew: 0,
          duration: 0.8,
          ease: 'power3.out',
          overwrite: true,
          onUpdate: () => skewSetter(proxy.skew)
        });
      }
    }
  });
}

// --------------------------------------------------------------------------
// S12: Section-Based Background Theme Shift
// --------------------------------------------------------------------------
function initSectionThemeShift() {
  const sections = document.querySelectorAll('section[id]');
  if (sections.length === 0) return;

  sections.forEach((section) => {
    const sectionId = section.getAttribute('id');
    window.ScrollTrigger.create({
      trigger: section,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => document.body.setAttribute('data-section', sectionId),
      onEnterBack: () => document.body.setAttribute('data-section', sectionId)
    });
  });
}

// --------------------------------------------------------------------------
// S14: Circular Scroll-Progress Ring (Replaces Plain Back-to-Top)
// --------------------------------------------------------------------------
function initCircularProgressRing() {
  const ringContainer = document.getElementById('scroll-progress-ring');
  const progressCircle = document.getElementById('progress-ring-circle');
  if (!ringContainer || !progressCircle) return;

  const circumference = SCROLL_CONFIG.progressRingCircumference;
  progressCircle.style.strokeDasharray = `${circumference}`;
  progressCircle.style.strokeDashoffset = `${circumference}`;

  // Update ring offset on scroll
  const handleScrollProgress = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    if (docHeight > 0) {
      const progress = Math.min(scrollY / docHeight, 1);
      const offset = circumference - progress * circumference;
      progressCircle.style.strokeDashoffset = `${offset}`;
    }

    if (scrollY > 300) {
      ringContainer.classList.add('visible');
    } else {
      ringContainer.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScrollProgress, { passive: true });
  handleScrollProgress();

  // Glide back to top on click
  ringContainer.addEventListener('click', () => {
    if (lenisInstance) {
      lenisInstance.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

// --------------------------------------------------------------------------
// S15: Sliding Active-Nav Indicator Pill
// --------------------------------------------------------------------------
function initSlidingNavIndicator() {
  const navMenu = document.getElementById('navbar-menu');
  const navLinks = document.querySelectorAll('.navbar__link');
  if (!navMenu || navLinks.length === 0) return;

  // Create sliding pill indicator element if not already present
  let indicator = document.querySelector('.navbar__active-indicator');
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.className = 'navbar__active-indicator';
    navMenu.appendChild(indicator);
  }

  const updateIndicator = (activeLink) => {
    if (!activeLink) return;
    const linkRect = activeLink.getBoundingClientRect();
    const menuRect = navMenu.getBoundingClientRect();

    const left = linkRect.left - menuRect.left;
    const width = linkRect.width;

    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = '1';
  };

  // Listen to active class changes on nav links
  const observer = new MutationObserver(() => {
    const activeLink = document.querySelector('.navbar__link.active');
    if (activeLink) updateIndicator(activeLink);
  });

  navLinks.forEach((link) => {
    observer.observe(link, { attributes: true, attributeFilter: ['class'] });
    link.addEventListener('mouseenter', () => updateIndicator(link));
  });

  navMenu.addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('.navbar__link.active');
    if (activeLink) updateIndicator(activeLink);
  });

  // Initial position
  setTimeout(() => {
    const currentActive = document.querySelector('.navbar__link.active') || navLinks[0];
    if (currentActive) updateIndicator(currentActive);
  }, 300);
}

// --------------------------------------------------------------------------
// S16: Footer Curtain Reveal (Desktop ≥ 1024px)
// --------------------------------------------------------------------------
function initFooterCurtainReveal() {
  const footer = document.querySelector('.footer');
  const mainContent = document.getElementById('main-content');
  if (!footer || !mainContent) return;

  // Ensure footer height is matched by bottom spacing so curtain uncovers cleanly
  const adjustFooterSpacing = () => {
    if (window.innerWidth >= 1024) {
      const footerHeight = footer.offsetHeight;
      mainContent.style.marginBottom = `${footerHeight}px`;
      footer.style.position = 'fixed';
      footer.style.bottom = '0';
      footer.style.zIndex = '1';
    } else {
      mainContent.style.marginBottom = '0px';
      footer.style.position = 'static';
    }
  };

  adjustFooterSpacing();
  window.addEventListener('resize', adjustFooterSpacing);
}

