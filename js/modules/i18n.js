import { safeStorage } from './utils.js';
import { locales } from '../locales.js';

window.currentLang = safeStorage.get('iasd_lang') || 'pt';

export function initI18n() {
  const langBtn = document.getElementById('toggle-lang');
  
  const updateDOM = () => {
    const dict = locales[window.currentLang] || locales.pt;
    
    // Update texts with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Update button text
    if (langBtn) {
      langBtn.textContent = window.currentLang === 'pt' ? 'EN' : 'PT';
      langBtn.setAttribute('aria-label', window.currentLang === 'pt' ? 'Change language to English' : 'Mudar idioma para Português');
    }
    
    // Update HTML lang attribute
    document.documentElement.lang = window.currentLang === 'pt' ? 'pt-BR' : 'en';

    // Dispatch an event so other modules know lang changed
    window.dispatchEvent(new Event('languageChanged'));
  };

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      window.currentLang = window.currentLang === 'pt' ? 'en' : 'pt';
      safeStorage.set('iasd_lang', window.currentLang);
      updateDOM();
    });
  }

  // Initial render
  // Wait a small tick so components finish loading their initial HTML
  setTimeout(updateDOM, 100);
}

// Helper for dynamic content
export function t(key) {
  const dict = locales[window.currentLang] || locales.pt;
  return dict[key] || key;
}
