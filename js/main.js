/**
 * main.js — Application Entry Point
 * Orchestrates data loading (profile.json & projects.json),
 * initializes feature modules, project filtering, and placeholder tooltips.
 */

import { initTheme } from './theme.js';
import { initNav } from './nav.js';
import { initHero } from './hero.js';
import { initAnimations } from './animations.js';
import { initContact } from './contact.js';
import { initScroll } from './scroll.js';

document.addEventListener('DOMContentLoaded', async () => {
  // 1. Initialize core visual & interaction modules
  initTheme();
  initNav();
  initHero();
  initAnimations();
  initContact();
  initScroll(); // v1.1 Scroll Animation System (Lenis + ScrollTrigger)

  // Update footer year dynamically
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // 2. Fetch and bind profile.json & projects.json
  await loadPortfolioData();
});

/**
 * Loads profile and project data from JSON files and binds them to the page
 */
async function loadPortfolioData() {
  try {
    const [profileRes, projectsRes] = await Promise.all([
      fetch('data/profile.json').catch(() => null),
      fetch('data/projects.json').catch(() => null)
    ]);

    let profileData = null;
    let projectsData = null;

    if (profileRes && profileRes.ok) {
      profileData = await profileRes.json();
    }
    if (projectsRes && projectsRes.ok) {
      projectsData = await projectsRes.json();
    }

    if (profileData) {
      bindProfileData(profileData);
    }

    if (projectsData && Array.isArray(projectsData)) {
      renderProjects(projectsData);
      setupProjectFilters(projectsData);
    }
  } catch (error) {
    console.warn('Failed to load dynamic JSON data, retaining HTML fallbacks:', error);
  }
}

/**
 * Bind profile.json content to DOM elements
 * @param {object} profile
 */
function bindProfileData(profile) {
  // 1. Social links binding
  const socials = profile.socials || {};
  bindSocialLink('github', socials.github);
  bindSocialLink('linkedin', socials.linkedin);
  bindSocialLink('instagram', socials.instagram);
  bindSocialLink('twitter', socials.twitter);

  // 2. Resume download button link
  const resumeBtn = document.getElementById('hero-resume-btn');
  if (resumeBtn && profile.resume) {
    resumeBtn.setAttribute('href', profile.resume);
  }

  // 3. Email links
  if (profile.email) {
    const contactEmailLink = document.getElementById('contact-email-link');
    if (contactEmailLink) {
      if (profile.email === 'YOUR_EMAIL' || !profile.email.includes('@')) {
        contactEmailLink.textContent = '[Set your email in profile.json]';
        contactEmailLink.setAttribute('href', '#contact');
      } else {
        contactEmailLink.textContent = profile.email;
        contactEmailLink.setAttribute('href', `mailto:${profile.email}`);
      }
    }
  }
}

/**
 * Helper to update social icon links or keep disabled with "Coming soon" tooltip
 * @param {string} platform
 * @param {string} url
 */
function bindSocialLink(platform, url) {
  const links = document.querySelectorAll(`[data-platform="${platform}"]`);
  const isPlaceholder = !url || url.includes('YOUR_') || url.trim() === '';

  links.forEach((link) => {
    if (isPlaceholder) {
      link.classList.add('disabled');
      link.setAttribute('href', '#');
      link.setAttribute('title', `${platform.toUpperCase()} (Coming soon)`);
      link.onclick = (e) => e.preventDefault();
    } else {
      link.classList.remove('disabled');
      link.setAttribute('href', url);
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener noreferrer');
      link.removeAttribute('title');
      link.onclick = null;
    }
  });
}

/**
 * Render project cards dynamically from projects.json
 * @param {Array} projects
 */
function renderProjects(projects) {
  const container = document.getElementById('projects-track') || document.getElementById('projects-grid');
  if (!container) return;

  container.innerHTML = ''; // Clear fallback or existing items

  projects.forEach((project) => {
    const card = createProjectCardElement(project);
    container.appendChild(card);
  });

  // Re-initialize tilt for new cards if VanillaTilt is loaded
  if (typeof window.VanillaTilt !== 'undefined') {
    const newTiltCards = container.querySelectorAll('.tilt-card');
    window.VanillaTilt.init(newTiltCards, {
      max: 8,
      speed: 400,
      glare: true,
      'max-glare': 0.15
    });
  }

  // Refresh ScrollTrigger calculations after DOM updates
  if (typeof window.ScrollTrigger !== 'undefined') {
    setTimeout(() => {
      window.ScrollTrigger.refresh();
    }, 100);
  }
}

/**
 * Create a single project card DOM element
 * @param {object} project
 * @returns {HTMLElement}
 */
function createProjectCardElement(project) {
  const card = document.createElement('div');
  card.className = 'project-card glass-card tilt-card velocity-skew';
  card.setAttribute('data-category', project.category || 'All');
  card.setAttribute('data-aos', 'fade-up');

  // Choose icon based on category or tag
  let iconClass = 'fa-solid fa-code';
  if (project.category === 'Python') iconClass = 'fa-brands fa-python';
  else if (project.category === 'Web') iconClass = 'fa-solid fa-globe';
  else if (project.category === 'Unity') iconClass = 'fa-brands fa-unity';
  else if (project.category === 'C/C++') iconClass = 'fa-solid fa-terminal';

  // Tech tags HTML
  const tagsHtml = (project.tags || [])
    .map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`)
    .join('');

  // GitHub Link setup
  const hasGithub = project.github && !project.github.includes('YOUR_') && project.github.trim() !== '';
  const githubBtn = hasGithub
    ? `<a href="${escapeHtml(project.github)}" target="_blank" rel="noopener noreferrer" class="project-card__btn" aria-label="View source code on GitHub">
         <i class="fa-brands fa-github" aria-hidden="true"></i> <span>Code</span>
       </a>`
    : `<button class="project-card__btn disabled" title="Repository coming soon" disabled>
         <i class="fa-brands fa-github" aria-hidden="true"></i> <span>Code</span>
       </button>`;

  // Live Link setup
  const hasLive = project.live && !project.live.includes('YOUR_') && project.live.trim() !== '';
  const liveBtn = hasLive
    ? `<a href="${escapeHtml(project.live)}" target="_blank" rel="noopener noreferrer" class="project-card__btn" aria-label="View live project preview">
         <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> <span>Live</span>
       </a>`
    : `<button class="project-card__btn disabled" title="Live demo coming soon" disabled>
         <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> <span>Live</span>
       </button>`;

  card.innerHTML = `
    <div class="project-card__thumbnail">
      <i class="${iconClass} project-card__thumbnail-icon" aria-hidden="true"></i>
      <span class="project-card__category-badge">${escapeHtml(project.category || 'Tech')}</span>
    </div>
    <div class="project-card__body">
      <h3 class="project-card__title">${escapeHtml(project.title)}</h3>
      <p class="project-card__desc">${escapeHtml(project.description)}</p>
      <div class="project-card__tags">
        ${tagsHtml}
      </div>
      <div class="project-card__footer">
        ${githubBtn}
        ${liveBtn}
      </div>
    </div>
  `;

  return card;
}

/**
 * Filter projects by category tab
 * @param {Array} projects
 */
function setupProjectFilters(projects) {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const track = document.getElementById('projects-track') || document.getElementById('projects-grid');
  if (!track || filterBtns.length === 0) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Toggle active tab style
      filterBtns.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterValue = btn.getAttribute('data-filter');
      const filtered = filterValue === 'all'
        ? projects
        : projects.filter((p) => p.category === filterValue);

      renderProjects(filtered);
    });
  });
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

