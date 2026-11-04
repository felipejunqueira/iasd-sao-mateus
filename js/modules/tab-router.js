/**
 * Roteador de Abas Principais (WAI-ARIA APG / WCAG 2.1 AAA < 90 linhas)
 */
import { safeStorage } from './utils.js';
import { initTabA11y } from './tab-a11y.js';

const TAB_MAP = {
  '#inicio': 'tab-inicio', '#home': 'tab-inicio', '#horarios': 'tab-inicio', '#pastoral': 'tab-inicio', '#contato': 'tab-inicio',
  '#cultos': 'tab-cultos', '#vida-espiritual': 'tab-cultos', '#agenda': 'tab-cultos', '#hinario': 'tab-cultos', '#series': 'tab-cultos', '#pequenos-grupos': 'tab-cultos', '#mural-oracao': 'tab-cultos',
  '#ministerios': 'tab-ministerios', '#familia': 'tab-ministerios', '#saude': 'tab-ministerios', '#checkup-saude': 'tab-ministerios',
  '#comunidade': 'tab-comunidade', '#historia': 'tab-comunidade', '#marcos': 'tab-comunidade', '#galeria': 'tab-comunidade', '#dizimos': 'tab-comunidade', '#estudo-biblico': 'tab-comunidade'
};
const HASHES = { 'tab-inicio': '#inicio', 'tab-cultos': '#cultos', 'tab-ministerios': '#ministerios', 'tab-comunidade': '#comunidade' };

export function initTabRouter() {
  const buttons = document.querySelectorAll('.main-tab-btn, .main-tab-link');
  if (buttons.length === 0) return;

  const handleRoute = () => {
    const hash = (window.location.hash || '#inicio').toLowerCase();
    let target = TAB_MAP[hash] || (hash.startsWith('#') && document.querySelector(hash)?.closest('.tab-panel')?.id);
    if (!target || !document.getElementById(target)) target = 'tab-inicio';
    switchTab(target, true);
    if (hash && !['#inicio', '#cultos', '#ministerios', '#comunidade'].includes(hash)) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 80);
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const tabId = btn.dataset.tab, hash = btn.dataset.hash || HASHES[tabId] || '#inicio';
      if (window.location.hash !== hash) history.pushState(null, '', hash);
      switchTab(tabId, true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-tab-link]');
    if (!link) return;
    const tabId = link.dataset.tabLink, href = link.getAttribute('href');
    if (tabId && document.getElementById(tabId)) {
      const hash = (href && href.startsWith('#')) ? href : (HASHES[tabId] || '#inicio');
      if (window.location.hash !== hash) history.pushState(null, '', hash);
      switchTab(tabId, true);
      const targetEl = (href && href.startsWith('#') && href !== `#${tabId}` && href !== HASHES[tabId]) ? document.querySelector(href) : null;
      if (targetEl) setTimeout(() => targetEl.scrollIntoView({ behavior: 'smooth' }), 80);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  window.addEventListener('hashchange', handleRoute);
  initTabA11y();
  if (window.location.hash) handleRoute();
  else switchTab(safeStorage.get('iasd_active_tab', 'tab-inicio'), false);
}

export function switchTab(targetId, updatePill = true) {
  const panel = document.getElementById(targetId);
  if (!panel) return;

  document.querySelectorAll('.tab-panel').forEach((p) => {
    const active = p.id === targetId;
    p.classList.toggle('active', active);
    p.setAttribute('aria-hidden', String(!active));
    if (active) { p.removeAttribute('hidden'); p.setAttribute('tabindex', '0'); }
    else { p.setAttribute('hidden', ''); p.removeAttribute('tabindex'); }
  });

  document.querySelectorAll('.main-tab-btn, .main-tab-link').forEach((b) => {
    const active = b.dataset.tab === targetId;
    b.classList.toggle('active', active);
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-selected', String(active));
    b.setAttribute('tabindex', active ? '0' : '-1');
    if (b.dataset.tab) b.setAttribute('aria-controls', b.dataset.tab);
  });

  if (updatePill) {
    const pill = document.querySelector(`.tabs-pill-bar .main-tab-btn[data-tab="${targetId}"]`);
    pill?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  safeStorage.set('iasd_active_tab', targetId);
}
