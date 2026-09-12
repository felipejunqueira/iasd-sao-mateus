/**
 * Roteador de Abas Principais (Filosofia Unix)
 * Divide o site em 3 seções limpas sem amontoamento
 */
import { safeStorage } from './utils.js';
import { initTabA11y } from './tab-a11y.js';

const TAB_MAP = {
  '#inicio': 'tab-inicio',
  '#cultos': 'tab-inicio',
  '#pastoral': 'tab-inicio',
  '#series': 'tab-inicio',
  '#contato': 'tab-inicio',
  '#comunidade': 'tab-comunidade',
  '#dizimos': 'tab-comunidade',
  '#galeria': 'tab-comunidade',
  '#estudo-biblico': 'tab-comunidade',
  '#historia': 'tab-historia',
  '#saude': 'tab-historia',
  '#ministerios': 'tab-historia',
  '#marcos': 'tab-historia'
};

export function initTabRouter() {
  const buttons = document.querySelectorAll('.main-tab-btn, .main-tab-link');
  if (buttons.length === 0) return;

  const handleRoute = () => {
    const hash = window.location.hash.toLowerCase() || '#inicio';
    const targetId = TAB_MAP[hash] || 'tab-inicio';
    switchTab(targetId);
    if (hash && !['#inicio', '#comunidade', '#historia'].includes(hash)) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.dataset.tab;
      window.location.hash = btn.dataset.hash || '#inicio';
      switchTab(targetId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  window.addEventListener('hashchange', handleRoute);
  initTabA11y();

  const initialTab = safeStorage.get('iasd_active_tab', 'tab-inicio');
  const hash = window.location.hash;
  if (hash && TAB_MAP[hash]) {
    handleRoute();
  } else {
    switchTab(initialTab);
  }
}

function switchTab(targetId) {
  const panels = document.querySelectorAll('.tab-panel');
  const buttons = document.querySelectorAll('.main-tab-btn, .main-tab-link');

  panels.forEach((p) => p.classList.toggle('active', p.id === targetId));
  buttons.forEach((b) => {
    const isActive = b.dataset.tab === targetId;
    b.classList.toggle('active', isActive);
    b.setAttribute('aria-selected', String(isActive));
  });

  safeStorage.set('iasd_active_tab', targetId);
}
