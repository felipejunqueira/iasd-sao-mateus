/**
 * Acessibilidade e Navegação por Teclado das Abas
 * Permite alternar abas com as setas do teclado (ArrowLeft / ArrowRight)
 */
export function initTabA11y() {
  const tabContainer = document.querySelector('.tabs-nav-container');
  const buttons = document.querySelectorAll('.main-tab-btn');
  if (!tabContainer || buttons.length === 0) return;

  tabContainer.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const arr = Array.from(buttons);
    const curr = arr.findIndex((b) => b.classList.contains('active'));
    let next = -1;
    if (e.key === 'ArrowRight') next = (curr + 1) % arr.length;
    if (e.key === 'ArrowLeft') next = (curr - 1 + arr.length) % arr.length;
    if (next >= 0) {
      arr[next].click();
      arr[next].focus();
    }
  });
}
