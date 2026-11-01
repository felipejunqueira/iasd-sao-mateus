/**
 * Menu de Navegação Responsivo e Mobile-First (WCAG 2.1 AAA < 40 linhas)
 */
export function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-menu');
  if (!toggleBtn || !navLinks) return;

  const closeMenu = (restoreFocus = false) => {
    navLinks.classList.remove('mobile-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '☰';
    if (restoreFocus) toggleBtn.focus();
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('mobile-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu(false));
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && e.target !== toggleBtn) closeMenu(false);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('mobile-open')) {
      closeMenu(true);
    }
  });
}
