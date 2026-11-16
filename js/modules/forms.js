/**
 * Formulários de Estudo Bíblico e Pedidos de Oração
 * Proteção contra cliques múltiplos acidentais + envio ao Portal da Liderança
 */
import { showToast, sanitize } from './utils.js';
import { PortalDB } from './portal-db.js';

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

  const toggle = (showBible) => {
    tabBible.classList.toggle('active', showBible);
    tabPrayer.classList.toggle('active', !showBible);
    formBible.style.display = showBible ? 'grid' : 'none';
    formPrayer.style.display = showBible ? 'none' : 'grid';
  };
  tabBible.addEventListener('click', () => toggle(true));
  tabPrayer.addEventListener('click', () => toggle(false));
}

const optText = (id) => {
  const el = document.getElementById(id);
  return el?.selectedOptions?.[0]?.text || el?.value || '';
};

function lockSubmit(form) {
  const btn = form.querySelector('button[type="submit"]');
  if (!btn) return;
  btn.disabled = true;
  setTimeout(() => { btn.disabled = false; }, 3000);
}

function initFormSubmits() {
  const bibleForm = document.getElementById('form-bible-study');
  const prayerForm = document.getElementById('form-prayer-request');

  bibleForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    lockSubmit(bibleForm);
    const name = document.getElementById('bible-name')?.value.trim() || 'Amigo(a)';
    const phone = document.getElementById('bible-whatsapp')?.value.trim() || '';
    const modality = optText('bible-modality'), topic = optText('bible-topic');

    PortalDB.saveVisitor({
      name, phone,
      interests: ['Estudo Bíblico', topic].filter(Boolean),
      notes: [modality && `Modalidade: ${modality}`, topic && `Tema: ${topic}`].filter(Boolean).join(' · '),
      origin: 'site-estudo-biblico'
    }).catch(() => {});

    showToast(`Obrigado, ${sanitize(name)}! Recebemos seu pedido de estudo bíblico.`);
    bibleForm.reset();
  });

  prayerForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    lockSubmit(prayerForm);
    const name = document.getElementById('prayer-name')?.value.trim() || 'Pedido de Oração (Anônimo)';
    const category = optText('prayer-category');
    const details = document.getElementById('prayer-details')?.value.trim() || '';

    PortalDB.saveVisitor({
      name, phone: '',
      interests: ['Oração', category].filter(Boolean),
      notes: details,
      origin: 'site-oracao'
    }).catch(() => {});

    showToast('Seu pedido de oração foi enviado para nossa equipe de intercessão!');
    prayerForm.reset();
  });
}
