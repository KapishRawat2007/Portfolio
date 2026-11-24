/**
 * hero.js — Hero Section Enhancements
 * Initializes Typed.js for dynamic role rotation and tsParticles
 * for futuristic constellation/node background effects.
 */

export function initHero() {
  initTypedRoles();
  initParticles();
}

/**
 * Initialize Typed.js role rotation
 */
function initTypedRoles() {
  const targetElement = document.getElementById('typed-roles');
  if (!targetElement) return;

  // Check if Typed library is loaded
  if (typeof window.Typed === 'function') {
    new window.Typed('#typed-roles', {
      strings: [
        'BCA Student',
        'Python Developer',
        'Game Dev Enthusiast',
        'IEEE Member',
        'GitHub Club Member'
      ],
      typeSpeed: 60,
      backSpeed: 40,
      backDelay: 1800,
      loop: true,
      smartBackspace: true,
      cursorChar: '|'
    });
  } else {
    // Fallback if Typed.js failed to load from CDN
    targetElement.textContent = 'BCA Student & Developer';
  }
}

/**
 * Initialize interactive tsParticles background
 */
async function initParticles() {
  const container = document.getElementById('tsparticles');
  if (!container) return;

  // Respect user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  // Check if tsParticles engine is loaded
  if (typeof window.tsParticles === 'undefined') return;

  try {
    // If using @tsparticles/slim, load the slim preset
    if (typeof window.loadSlim === 'function') {
      await window.loadSlim(window.tsParticles);
    }

    await window.tsParticles.load({
      id: 'tsparticles',
      options: {
        background: {
          color: {
            value: 'transparent'
          }
        },
        fpsLimit: 60,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'grab'
            },
            resize: true
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
                color: '#00e5ff'
              }
            }
          }
        },
        particles: {
          color: {
            value: ['#00e5ff', '#7c5cff', '#ff2a85']
          },
          links: {
            color: '#7c5cff',
            distance: 130,
            enable: true,
            opacity: 0.22,
            width: 1
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce'
            },
            random: false,
            speed: 0.85,
            straight: false
          },
          number: {
            density: {
              enable: true,
              area: 900
            },
            value: 42
          },
          opacity: {
            value: { min: 0.2, max: 0.7 }
          },
          shape: {
            type: 'circle'
          },
          size: {
            value: { min: 1.5, max: 3 }
          }
        },
        detectRetina: true
      }
    });
  } catch (error) {
    console.warn('Particles initialization skipped or unsupported in this environment:', error);
  }
}

