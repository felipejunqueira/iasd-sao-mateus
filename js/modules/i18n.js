import { safeStorage } from './utils.js';
import { locales } from '../locales/index.js';

window.currentLang = safeStorage.get('iasd_lang') || 'pt';

export function initI18n() {
  const langBtn = document.getElementById('toggle-lang');

  const updateDOM = () => {
    const dict = locales[window.currentLang] || locales.pt;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.innerHTML = dict[key];
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria-label');
      if (dict[key]) el.setAttribute('aria-label', dict[key]);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((el) => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) el.setAttribute('title', dict[key]);
    });

    document.querySelectorAll('[data-i18n-alt]').forEach((el) => {
      const key = el.getAttribute('data-i18n-alt');
      if (dict[key]) el.setAttribute('alt', dict[key]);
    });

    if (langBtn) {
      langBtn.textContent = window.currentLang === 'pt' ? 'EN' : 'PT';
      langBtn.setAttribute('aria-label', window.currentLang === 'pt' ? 'Mudar idioma para Inglês' : 'Switch language to Portuguese');
    }

    document.documentElement.lang = window.currentLang === 'pt' ? 'pt-BR' : 'en';
    window.dispatchEvent(new Event('languageChanged'));
  };

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      window.currentLang = window.currentLang === 'pt' ? 'en' : 'pt';
      safeStorage.set('iasd_lang', window.currentLang);
      updateDOM();
    });
  }

  setTimeout(updateDOM, 60);
}

export function t(key) {
  const dict = locales[window.currentLang] || locales.pt;
  return dict[key] || key;
}
