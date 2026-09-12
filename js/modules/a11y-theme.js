/**
 * Acessibilidade: Modo Escuro/Claro, Alto Contraste e Escalas de Fonte
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

  if (isDark) {
    document.body.classList.add('dark-mode');
    if (themeBtn) themeBtn.innerHTML = '☀️ Claro';
  } else {
    document.body.classList.remove('dark-mode');
    if (themeBtn) themeBtn.innerHTML = '🌙 Escuro';
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const activeDark = document.body.classList.toggle('dark-mode');
      safeStorage.set('iasd_theme', activeDark ? 'dark' : 'light');
      themeBtn.innerHTML = activeDark ? '☀️ Claro' : '🌙 Escuro';
    });
  }
}

function initContrastAndFont() {
  const contrastBtn = document.getElementById('toggle-contrast');
  const grayscaleBtn = document.getElementById('toggle-grayscale');
  const fontInc = document.getElementById('font-increase');
  const fontDec = document.getElementById('font-decrease');

  if (safeStorage.get('iasd_contrast') === 'true') {
    document.body.classList.add('high-contrast');
    if (contrastBtn) contrastBtn.classList.add('active');
  }

  const savedFont = parseInt(safeStorage.get('iasd_fontzoom')) || 0;
  let currentZoom = savedFont;
  applyZoom(currentZoom);

  if (contrastBtn) {
    contrastBtn.addEventListener('click', () => {
      const isHigh = document.body.classList.toggle('high-contrast');
      contrastBtn.classList.toggle('active', isHigh);
      safeStorage.set('iasd_contrast', String(isHigh));
    });
  }

  if (grayscaleBtn) {
    grayscaleBtn.addEventListener('click', () => {
      const isGray = document.body.classList.toggle('grayscale-mode');
      grayscaleBtn.classList.toggle('active', isGray);
    });
  }

  if (fontInc) {
    fontInc.addEventListener('click', () => {
      if (currentZoom < 4) {
        currentZoom++;
        applyZoom(currentZoom);
        safeStorage.set('iasd_fontzoom', String(currentZoom));
      }
    });
  }

  if (fontDec) {
    fontDec.addEventListener('click', () => {
      if (currentZoom > 0) {
        currentZoom--;
        applyZoom(currentZoom);
        safeStorage.set('iasd_fontzoom', String(currentZoom));
      }
    });
  }
}

function applyZoom(level) {
  // Remove todas as classes de zoom
  for (let i = 1; i <= 4; i++) {
    document.body.classList.remove('font-zoom-' + i);
  }
  // Remove classes legadas
  document.body.classList.remove('font-lg', 'font-xl');
  
  if (level > 0) {
    document.body.classList.add('font-zoom-' + level);
  }
}
