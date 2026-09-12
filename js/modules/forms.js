/**
 * Formulários de Estudo Bíblico e Pedidos de Oração
 * Proteção contra cliques múltiplos acidentais
 */
import { showToast, sanitize } from './utils.js';

export function initForms() {
  initFormTabs();
  initFormSubmits();
}

function initFormTabs() {
  const tabBible = document.getElementById('tab-bible');
  const tabPrayer = document.getElementById('tab-prayer');
  const formBible = document.getElementById('form-bible-study');
  const formPrayer = document.getElementById('form-prayer-request');
  if (!tabBible || !tabPrayer || !formBible || !formPrayer) return;

  tabBible.addEventListener('click', () => {
    tabBible.classList.add('active');
    tabPrayer.classList.remove('active');
    formBible.style.display = 'grid';
    formPrayer.style.display = 'none';
  });

  tabPrayer.addEventListener('click', () => {
    tabPrayer.classList.add('active');
    tabBible.classList.remove('active');
    formPrayer.style.display = 'grid';
    formBible.style.display = 'none';
  });
}

function initFormSubmits() {
  const bibleForm = document.getElementById('form-bible-study');
  const prayerForm = document.getElementById('form-prayer-request');

  if (bibleForm) {
    bibleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = bibleForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      const rawName = document.getElementById('bible-name')?.value || 'Amigo(a)';
      const cleanName = sanitize(rawName);
      showToast(`Obrigado, ${cleanName}! Recebemos seu pedido de estudo bíblico.`, '📖');
      bibleForm.reset();

      setTimeout(() => { if (submitBtn) submitBtn.disabled = false; }, 3000);
    });
  }

  if (prayerForm) {
    prayerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = prayerForm.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      showToast('Seu pedido de oração foi enviado para nossa equipe de intercessão!', '🙏');
      prayerForm.reset();

      setTimeout(() => { if (submitBtn) submitBtn.disabled = false; }, 3000);
    });
  }
}
