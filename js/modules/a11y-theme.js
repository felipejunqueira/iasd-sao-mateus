/**
 * Acessibilidade: Tema Claro por padrão, Modo Escuro, Alto Contraste e Zoom
 */
import { safeStorage } from './utils.js';

export function initA11yTheme() {
  initDarkMode();
  initA11yDrawer();
  initContrastAndFont();
}

function initDarkMode() {
  const themeBtn = document.getElementById('toggle-theme');
  const isDark = safeStorage.get('iasd_theme') === 'dark';

  const applyThemeUI = (dark) => {
    const isEn = window.currentLang === 'en';
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#07101a' : '#FAF8F5');
    if (!themeBtn) return;
    themeBtn.setAttribute('aria-pressed', String(dark));
    themeBtn.textContent = dark ? (isEn ? 'Light Mode' : 'Modo Claro') : (isEn ? 'Dark Mode' : 'Modo Escuro');
  };

  document.body.classList.toggle('dark-mode', isDark);
  applyThemeUI(isDark);
  if (!themeBtn) return;

  themeBtn.addEventListener('click', () => {
    const activeDark = document.body.classList.toggle('dark-mode');
    safeStorage.set('iasd_theme', activeDark ? 'dark' : 'light');
    applyThemeUI(activeDark);
  });
  window.addEventListener('languageChanged', () => applyThemeUI(document.body.classList.contains('dark-mode')));
}

function initA11yDrawer() {
  const drawer = document.getElementById('a11y-drawer');
  if (!drawer) return;
  const label = drawer.querySelector('.a11y-trigger-label');
  const summary = drawer.querySelector('summary');

  window.addEventListener('languageChanged', () => {
    if (label) label.textContent = window.currentLang === 'en' ? 'Accessibility' : 'Acessibilidade';
  });
  document.addEventListener('click', (e) => {
    if (drawer.open && !drawer.contains(e.target)) drawer.open = false;
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.open) { drawer.open = false; summary?.focus(); }
  });
}

function initContrastAndFont() {
  const contrastBtn = document.getElementById('toggle-contrast');
  const grayscaleBtn = document.getElementById('toggle-grayscale');
  const isContrast = safeStorage.get('iasd_contrast') === 'true';

  document.body.classList.toggle('high-contrast', isContrast);
  if (contrastBtn) {
    contrastBtn.classList.toggle('active', isContrast);
    contrastBtn.setAttribute('aria-pressed', String(isContrast));
    contrastBtn.addEventListener('click', () => {
      const isHigh = document.body.classList.toggle('high-contrast');
      contrastBtn.classList.toggle('active', isHigh);
      contrastBtn.setAttribute('aria-pressed', String(isHigh));
      safeStorage.set('iasd_contrast', String(isHigh));
    });
  }

  grayscaleBtn?.addEventListener('click', () => {
    const isGray = document.body.classList.toggle('grayscale-mode');
    grayscaleBtn.classList.toggle('active', isGray);
    grayscaleBtn.setAttribute('aria-pressed', String(isGray));
  });

  let currentZoom = parseInt(safeStorage.get('iasd_fontzoom')) || 0;
  applyZoom(currentZoom);
  const updateZoom = (delta) => {
    const next = Math.max(0, Math.min(4, currentZoom + delta));
    if (next === currentZoom) return;
    currentZoom = next;
    applyZoom(currentZoom);
    safeStorage.set('iasd_fontzoom', String(currentZoom));
  };
  document.getElementById('font-increase')?.addEventListener('click', () => updateZoom(1));
  document.getElementById('font-decrease')?.addEventListener('click', () => updateZoom(-1));
}

function applyZoom(level) {
  for (let i = 1; i <= 4; i++) document.documentElement.classList.remove('font-zoom-' + i);
  document.documentElement.classList.remove('font-lg', 'font-xl');
  if (level > 0) document.documentElement.classList.add('font-zoom-' + level);
}
