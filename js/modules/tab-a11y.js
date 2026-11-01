/**
 * Acessibilidade e Navegação por Teclado das Abas (WAI-ARIA APG / WCAG 2.1 AAA)
 * Suporta setas horizontais e verticais, Home e End (< 60 linhas)
 */
export function initTabA11y() {
  const tablists = document.querySelectorAll('[role="tablist"], .tabs-pill-bar, #nav-menu');
  if (tablists.length === 0) return;

  tablists.forEach((tablist) => {
    const tabs = Array.from(tablist.querySelectorAll('[role="tab"], .main-tab-btn, .main-tab-link'));
    if (tabs.length === 0) return;

    tablist.addEventListener('keydown', (e) => {
      const isNavKey = ['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key);
      if (!isNavKey) return;

      const activeIdx = tabs.findIndex((t) => t === document.activeElement || t.classList.contains('active'));
      let nextIdx = activeIdx;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIdx = (activeIdx + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIdx = (activeIdx - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIdx = 0;
      } else if (e.key === 'End') {
        nextIdx = tabs.length - 1;
      }

      if (nextIdx >= 0 && nextIdx !== activeIdx) {
        e.preventDefault();
        const nextTab = tabs[nextIdx];
        nextTab.click();
        nextTab.focus();
      }
    });
  });
}
