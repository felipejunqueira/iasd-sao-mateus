/**
 * Menu de Navegação Responsivo e Mobile-First
 */

export function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-menu');
  if (!toggleBtn || !navLinks) return;

  const closeMenu = () => {
    navLinks.classList.remove('mobile-open');
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.innerHTML = '☰';
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = navLinks.classList.toggle('mobile-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && e.target !== toggleBtn) {
      closeMenu();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });
}
