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

  const savedFont = safeStorage.get('iasd_fontsize');
  if (savedFont) document.body.classList.add(savedFont);

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
      document.body.classList.toggle('font-lg');
      safeStorage.set('iasd_fontsize', document.body.classList.contains('font-lg') ? 'font-lg' : '');
    });
  }

  if (fontDec) {
    fontDec.addEventListener('click', () => {
      document.body.classList.remove('font-lg', 'font-xl');
      safeStorage.set('iasd_fontsize', '');
    });
  }
}
