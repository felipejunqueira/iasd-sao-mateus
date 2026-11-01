/**
 * Utilitário de Focus Trap e Navegação Acessível (WCAG 2.1 AAA)
 * Filosofia Unix: < 70 linhas
 */
const SELECTOR = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])'
].join(', ');

export function trapFocus(modalEl, onClose) {
  if (!modalEl) return () => {};
  const prevActive = document.activeElement;

  const getFocusables = () => {
    return Array.from(modalEl.querySelectorAll(SELECTOR))
      .filter((el) => el.offsetParent !== null || el.getClientRects().length > 0);
  };

  const focusFirst = () => {
    const focusables = getFocusables();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      modalEl.setAttribute('tabindex', '-1');
      modalEl.focus();
    }
  };

  requestAnimationFrame(() => focusFirst());

  const onKeydown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      e.preventDefault();
      if (onClose) onClose();
      return;
    }
    if (e.key !== 'Tab') return;

    const focusables = getFocusables();
    if (focusables.length === 0) {
      e.preventDefault();
      return;
    }

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  modalEl.addEventListener('keydown', onKeydown);

  return function releaseFocus() {
    modalEl.removeEventListener('keydown', onKeydown);
    if (prevActive && typeof prevActive.focus === 'function') {
      prevActive.focus();
    }
  };
}
