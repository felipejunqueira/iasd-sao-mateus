/**
 * Ponto de Entrada Principal - Filosofia Unix
 * Orquestração modular e inicialização limpa (< 35 linhas)
 */
import { loadComponents } from './modules/components.js';
import { initMobileMenu } from './modules/menu.js';
import { initTabRouter } from './modules/tab-router.js';
import { initNextService } from './modules/services.js';
import { initSeriesPlayer } from './modules/series.js';
import { initPixCopy } from './modules/pix.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { initForms } from './modules/forms.js';
import { initA11yTheme } from './modules/a11y-theme.js';
import { initVLibras } from './modules/vlibras.js';
import { initI18n } from './modules/i18n.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  initI18n();
  initMobileMenu();
  initTabRouter();
  initNextService();
  initSeriesPlayer();
  initPixCopy();
  initGallery();
  initLightbox();
  initForms();
  initA11yTheme();
  initVLibras();
});
