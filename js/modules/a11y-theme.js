/**
 * Acessibilidade: Modo Escuro, Alto Contraste e Zoom de Fonte (WCAG 2.1 AAA < 85 linhas)
 */
import { safeStorage } from './utils.js';

export function initA11yTheme() {
  initDarkMode();
  initContrastAndFont();
}

function initDarkMode() {
  const themeBtn = document.getElementById('toggle-theme');
  const savedTheme = safeStorage.get('iasd_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;

  document.body.classList.toggle('dark-mode', isDark);
  if (themeBtn) {
    themeBtn.setAttribute('aria-pressed', String(isDark));
    themeBtn.innerHTML = isDark ? '☀️ Claro' : '🌙 Escuro';
    themeBtn.addEventListener('click', () => {
      const activeDark = document.body.classList.toggle('dark-mode');
      safeStorage.set('iasd_theme', activeDark ? 'dark' : 'light');
      themeBtn.setAttribute('aria-pressed', String(activeDark));
      themeBtn.innerHTML = activeDark ? '☀️ Claro' : '🌙 Escuro';
    });
  }
}

function initContrastAndFont() {
  const contrastBtn = document.getElementById('toggle-contrast');
  const grayscaleBtn = document.getElementById('toggle-grayscale');
  const fontInc = document.getElementById('font-increase');
  const fontDec = document.getElementById('font-decrease');

  const isContrast = safeStorage.get('iasd_contrast') === 'true';
  if (isContrast) {
    document.body.classList.add('high-contrast');
    if (contrastBtn) contrastBtn.classList.add('active');
  }
  if (contrastBtn) contrastBtn.setAttribute('aria-pressed', String(isContrast));

  let currentZoom = parseInt(safeStorage.get('iasd_fontzoom')) || 0;
  applyZoom(currentZoom);

  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      const isHigh = document.body.classList.toggle('high-contrast');
      contrastBtn.classList.toggle('active', isHigh);
      contrastBtn.setAttribute('aria-pressed', String(isHigh));
      safeStorage.set('iasd_contrast', String(isHigh));
    });
  }

  if (grayscaleBtn) {
    grayscaleBtn.addEventListener('click', () => {
      const isGray = document.body.classList.toggle('grayscale-mode');
      grayscaleBtn.classList.toggle('active', isGray);
      grayscaleBtn.setAttribute('aria-pressed', String(isGray));
    });
  }

  const updateZoom = (delta) => {
    const next = Math.max(0, Math.min(4, currentZoom + delta));
    if (next !== currentZoom) {
      currentZoom = next;
      applyZoom(currentZoom);
      safeStorage.set('iasd_fontzoom', String(currentZoom));
    }
  };

  if (fontInc) fontInc.addEventListener('click', () => updateZoom(1));
  if (fontDec) fontDec.addEventListener('click', () => updateZoom(-1));
}

function applyZoom(level) {
  for (let i = 1; i <= 4; i++) document.documentElement.classList.remove('font-zoom-' + i);
  document.documentElement.classList.remove('font-lg', 'font-xl');
  if (level > 0) document.documentElement.classList.add('font-zoom-' + level);
}
