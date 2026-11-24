/**
 * theme.js — Theme Management Module
 * Handles dark and light mode switching, saves user preference to localStorage,
 * and detects system preference when no saved choice exists.
 */

const THEME_STORAGE_KEY = 'kapish_portfolio_theme';

/**
 * Initialize theme based on localStorage or system preferences
 */
export function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;

  // 1. Determine initial theme: saved choice > system preference > default 'dark'
  const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  const systemPrefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

  let currentTheme = 'dark';
  if (savedTheme) {
    currentTheme = savedTheme;
  } else if (systemPrefersLight) {
    currentTheme = 'light';
  }

  // Apply theme to <html> tag
  applyTheme(currentTheme, root);

  // 2. Attach click listener to the theme toggle button
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = root.getAttribute('data-theme') || 'dark';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, root);
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    });
  }

  // 3. Listen to system preference changes if user hasn't explicitly set a preference
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
      if (!localStorage.getItem(THEME_STORAGE_KEY)) {
        const autoTheme = e.matches ? 'light' : 'dark';
        applyTheme(autoTheme, root);
      }
    });
  }
}

/**
 * Apply the theme to DOM and update meta theme-color
 * @param {string} theme - 'dark' or 'light'
 * @param {HTMLElement} root - document.documentElement
 */
function applyTheme(theme, root) {
  root.setAttribute('data-theme', theme);

  // Update mobile browser header color
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#0a0b14' : '#f4f6fc');
  }
}

