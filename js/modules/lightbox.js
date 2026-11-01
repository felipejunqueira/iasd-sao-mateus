/**
 * Visualizador Modal Lightbox para Fotos (WCAG 2.1 AAA - Filosofia Unix)
 */
import { trapFocus } from './focus-trap.js';

let releaseFocus = null;

export function closeLightbox() {
  const modal = document.getElementById('lightbox-overlay') || document.getElementById('lightbox-modal');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';

  if (releaseFocus) {
    releaseFocus();
    releaseFocus = null;
  }
}

export function initLightbox() {
  const modal = document.getElementById('lightbox-overlay') || document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  if (!modal) return;

  modal.setAttribute('aria-hidden', 'true');
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeLightbox();
  });
}

export function openLightbox(post) {
  const modal = document.getElementById('lightbox-overlay') || document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const caption = document.getElementById('lightbox-caption');
  if (!modal || !img) return;

  img.src = post.image;
  img.alt = post.title || 'Foto da Galeria Adventista';
  if (title) title.innerText = post.title || '';
  if (caption) caption.innerText = post.caption || '';

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (releaseFocus) releaseFocus();
  releaseFocus = trapFocus(modal, closeLightbox);
}
