/**
 * Roteador de Abas Principais (WAI-ARIA APG / WCAG 2.1 AAA < 90 linhas)
 */
import { safeStorage } from './utils.js';
import { initTabA11y } from './tab-a11y.js';

const TAB_MAP = {
  '#inicio': 'tab-inicio', '#cultos': 'tab-inicio', '#pastoral': 'tab-inicio',
  '#series': 'tab-inicio', '#hinario': 'tab-inicio', '#por-do-sol': 'tab-inicio',
  '#agenda': 'tab-inicio', '#pgs': 'tab-inicio', '#contato': 'tab-inicio',
  '#comunidade': 'tab-comunidade', '#dizimos': 'tab-comunidade', '#galeria': 'tab-comunidade',
  '#oracao': 'tab-comunidade', '#estudo-biblico': 'tab-comunidade',
  '#historia': 'tab-historia', '#saude': 'tab-historia', '#checkup-saude': 'tab-historia',
  '#ministerios': 'tab-historia', '#marcos': 'tab-historia'
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
      window.location.hash = btn.dataset.hash || '#inicio';
      switchTab(btn.dataset.tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-tab-link]');
    if (!link) return;
    const tabId = link.dataset.tabLink;
    if (tabId) {
      switchTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  window.addEventListener('hashchange', handleRoute);
  initTabA11y();

  const initialTab = safeStorage.get('iasd_active_tab', 'tab-inicio');
  const hash = window.location.hash;
  if (hash && TAB_MAP[hash]) handleRoute();
  else switchTab(initialTab);
}

function switchTab(targetId) {
  const panels = document.querySelectorAll('.tab-panel');
  const buttons = document.querySelectorAll('.main-tab-btn, .main-tab-link');

  panels.forEach((p) => {
    const isActive = p.id === targetId;
    p.classList.toggle('active', isActive);
    p.setAttribute('aria-hidden', String(!isActive));
    if (isActive) {
      p.removeAttribute('hidden');
      p.setAttribute('tabindex', '0');
    } else {
      p.setAttribute('hidden', '');
      p.removeAttribute('tabindex');
    }
  });

  buttons.forEach((b) => {
    const isActive = b.dataset.tab === targetId;
    b.classList.toggle('active', isActive);
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(isActive));
    b.setAttribute('tabindex', isActive ? '0' : '-1');
    if (b.dataset.tab) b.setAttribute('aria-controls', b.dataset.tab);
  });

  safeStorage.set('iasd_active_tab', targetId);
}
