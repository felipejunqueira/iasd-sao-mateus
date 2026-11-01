import { safeStorage, sanitize, showToast, debounce } from './utils.js';

let prayers = [];
const K_CUSTOM = 'iasd_custom_prayers', K_COUNTS = 'iasd_prayer_counts', K_PRAYED = 'iasd_prayed_ids';
const CATS = { saude: 'Saúde & Cura', familia: 'Família', trabalho: 'Trabalho & Provisão', espiritual: 'Paz Espiritual', batismo: 'Decisão & Batismo' };
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
        <button class="btn-pray ${done ? 'prayed' : ''}" data-id="${p.id}" ${done ? 'disabled' : ''}>
          <span class="pray-icon">🙏</span>
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
    showToast('Que bênção! Sua intercessão foi registrada diante de Deus. 🙏');
  });

  const cta = document.getElementById('btn-trigger-prayer-form');
  if (cta) cta.onclick = () => {
    document.getElementById('tab-prayer')?.click();
    document.getElementById('estudo-biblico')?.scrollIntoView({ behavior: 'smooth' });
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
    }, true);
  }
}
