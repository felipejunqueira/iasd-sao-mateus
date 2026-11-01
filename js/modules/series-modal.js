/**
 * Modal de Vídeo das Séries Bíblicas (WCAG 2.1 AAA - Filosofia Unix)
 */
import { trapFocus } from './focus-trap.js';

let releaseFocus = null;

export function openSeriesModal(youtubeId, title) {
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('video-frame');
  const modalTitle = document.getElementById('video-modal-title');
  if (!modal || !frame) return;

  frame.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
  if (modalTitle) modalTitle.textContent = title || 'Série Bíblica';
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  if (releaseFocus) releaseFocus();
  releaseFocus = trapFocus(modal, closeSeriesModal);
}

export function closeSeriesModal() {
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('video-frame');
  if (!modal) return;

  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  if (frame) frame.src = '';
  document.body.style.overflow = '';

  if (releaseFocus) {
    releaseFocus();
    releaseFocus = null;
  }
}

export function initSeriesModalEvents() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-modal-close');
  if (!modal) return;

  modal.setAttribute('aria-hidden', 'true');
  if (closeBtn) closeBtn.addEventListener('click', closeSeriesModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeSeriesModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeSeriesModal();
    }
  });
}
