/**
 * Ponto de Entrada Principal - Filosofia Unix
 * Orquestração modular e inicialização limpa
 */

import { initMobileMenu } from './modules/menu.js';
import { initTabRouter } from './modules/tab-router.js';
import { initNextService } from './modules/services.js';
import { initSeriesPlayer } from './modules/series.js';
import { initPixCopy } from './modules/pix.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { initForms } from './modules/forms.js';
import { initA11yTheme } from './modules/a11y-theme.js';
import { initA11yVoice } from './modules/a11y-voice.js';
import { initVLibras } from './modules/vlibras.js';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initTabRouter();
  initNextService();
  initSeriesPlayer();
  initPixCopy();
  initGallery();
  initLightbox();
  initForms();
  initA11yTheme();
  initA11yVoice();
  initVLibras();
  initVideoModalClose();
});

function initVideoModalClose() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-modal-close');
  const frame = document.getElementById('video-frame');
  if (!modal) return;

  const close = () => {
    modal.classList.remove('active');
    if (frame) frame.src = '';
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
}
