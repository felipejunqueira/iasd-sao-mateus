/**
 * Mural de Oração Comunitário (WCAG 2.1 AAA < 100 linhas)
 */
import { safeStorage, sanitize, showToast, debounce } from './utils.js';

let prayers = [];
const K_CUSTOM = 'iasd_custom_prayers', K_COUNTS = 'iasd_prayer_counts', K_PRAYED = 'iasd_prayed_ids';
const CATS = { saude: 'Saúde & Cura', familia: 'Família', trabalho: 'Trabalho & Provisão', espiritual: 'Paz Espiritual', batismo: 'Decisão & Batismo' };
const HEART_SVG = '<svg class="pray-icon" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
const persistCounts = debounce((counts) => safeStorage.set(K_COUNTS, JSON.stringify(counts)), 300);

export async function initPrayerWall() {
  const container = document.getElementById('prayer-wall-grid');
  if (!container) return;
  try {
    const res = await fetch('data/prayers.json');
    const base = res.ok ? await res.json() : [];
    const custom = JSON.parse(safeStorage.get(K_CUSTOM, '[]'));
    prayers = [...custom, ...base];
    render(container);
    bindEvents(container);
  } catch (e) {
    console.error('Erro ao carregar mural:', e);
  }
}

function render(container) {
  const counts = JSON.parse(safeStorage.get(K_COUNTS, '{}')), prayed = new Set(JSON.parse(safeStorage.get(K_PRAYED, '[]')));
  container.innerHTML = prayers.map((p) => {
    const total = counts[p.id] ?? p.prayedCount, done = prayed.has(p.id);
    return `<article class="prayer-card" data-id="${p.id}">
      <div class="prayer-card-header">
        <span class="prayer-badge">${sanitize(p.categoryLabel || CATS[p.category] || 'Oração')}</span>
        <span class="prayer-date">${sanitize(p.date)}</span>
      </div>
      <p class="prayer-text">"${sanitize(p.request)}"</p>
      <div class="prayer-card-footer">
        <span class="prayer-author">— ${sanitize(p.author)}</span>
        <button class="btn-pray ${done ? 'prayed' : ''}" data-id="${p.id}" ${done ? 'disabled' : ''} aria-label="${done ? 'Você já orou por este pedido' : 'Orar por este pedido'}">
          ${HEART_SVG}
          <span class="pray-label">${done ? 'Já orei' : 'Estou orando'}</span>
          <span class="pray-count" id="count-${p.id}">${total}</span>
        </button>
      </div>
    </article>`;
  }).join('');
}

function bindEvents(container) {
  container.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-pray');
    if (!btn || btn.disabled) return;
    const id = btn.dataset.id, prayed = new Set(JSON.parse(safeStorage.get(K_PRAYED, '[]'))), counts = JSON.parse(safeStorage.get(K_COUNTS, '{}'));
    if (prayed.has(id)) return;

    counts[id] = (counts[id] ?? (prayers.find((p) => p.id === id)?.prayedCount || 0)) + 1;
    prayed.add(id);
    btn.classList.add('prayed');
    btn.disabled = true;
    const lbl = btn.querySelector('.pray-label'), cnt = document.getElementById(`count-${id}`);
    if (lbl) lbl.textContent = 'Já orei';
    if (cnt) cnt.textContent = counts[id];
    persistCounts(counts);
    safeStorage.set(K_PRAYED, JSON.stringify([...prayed]));
    showToast('Que bênção! Sua intercessão foi registrada diante de Deus.');
  });

  const cta = document.getElementById('btn-trigger-prayer-form');
  if (cta) cta.onclick = () => {
    document.querySelector('[data-tab="tab-comunidade"], #tab-btn-comunidade')?.click();
    setTimeout(() => {
      document.getElementById('tab-prayer')?.click();
      document.getElementById('estudo-biblico')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const form = document.getElementById('form-prayer-request');
  if (form && !form.dataset.wallBound) {
    form.dataset.wallBound = 'true';
    form.addEventListener('submit', () => {
      const name = document.getElementById('prayer-name')?.value.trim() || 'Irmão(ã) em Cristo';
      const cat = document.getElementById('prayer-category')?.value || 'espiritual';
      const text = document.getElementById('prayer-details')?.value.trim();
      if (!text) return;
      const item = { id: `user-${Date.now()}`, author: name, category: cat, categoryLabel: CATS[cat] || 'Oração', date: 'Hoje', request: text, prayedCount: 1 };
      const custom = JSON.parse(safeStorage.get(K_CUSTOM, '[]'));
      safeStorage.set(K_CUSTOM, JSON.stringify([item, ...custom]));
      prayers.unshift(item);
      render(container);
      showToast('Seu pedido de oração foi adicionado ao mural com carinho.');
    }, true);
  }
}
