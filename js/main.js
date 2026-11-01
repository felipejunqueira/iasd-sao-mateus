/**
 * Ponto de Entrada Principal - Filosofia Unix
 * Orquestração modular e inicialização limpa (< 55 linhas)
 */
import { loadComponents } from './modules/components.js';
import { initMobileMenu } from './modules/menu.js';
import { initTabRouter } from './modules/tab-router.js';
import { initDailyVerse } from './modules/daily-verse.js';
import { initNextService } from './modules/services.js';
import { initSunset } from './modules/sunset.js';
import { initCalendar } from './modules/calendar.js';
import { initSeriesPlayer } from './modules/series.js';
import { initHinario } from './modules/hinario.js';
import { initPixCopy } from './modules/pix.js';
import { initGallery } from './modules/gallery.js';
import { initLightbox } from './modules/lightbox.js';
import { initForms } from './modules/forms.js';
import { initPrayerWall } from './modules/prayer-wall.js';
import { initA11yTheme } from './modules/a11y-theme.js';
import { initA11yVoice } from './modules/a11y-voice.js';
import { initVLibras } from './modules/vlibras.js';
import { initI18n } from './modules/i18n.js';
import { initPGs } from './modules/pgs.js';
import { initRemediesCheck } from './modules/remedies-check.js';
import { initPWA } from './modules/pwa.js';

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents();
  initI18n();
  initMobileMenu();
  initTabRouter();
  initDailyVerse();
  initNextService();
  initSunset();
  initCalendar();
  initSeriesPlayer();
  initHinario();
  initPGs();
  initPixCopy();
  initGallery();
  initLightbox();
  initForms();
  initPrayerWall();
  initA11yTheme();
  initA11yVoice();
  initVLibras();
  initRemediesCheck();
  initPWA();
});
