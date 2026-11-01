/**
 * Hinário Adventista - IASD São Mateus (WCAG 2.1 AAA < 90 linhas)
 */
import { sanitize } from './utils.js';
import { trapFocus } from './focus-trap.js';
import { copyHymnLyrics, shareHymnWhatsApp } from './hinario-share.js';

let hymns = [], currentHymn = null, fontIdx = 0, releaseFocus = null;
const FONT_SIZES = ['1.05rem', '1.25rem', '1.5rem'];

function renderHymns(list) {
  const container = document.getElementById('hinario-list');
  if (!container) return;
  if (!list.length) return (container.innerHTML = '<p class="hinario-empty">Nenhum hino encontrado.</p>');
  container.innerHTML = list.map(h => `
    <article class="hinario-card" data-num="${h.numero}" role="button" tabindex="0" aria-label="Hino ${h.numero}: ${sanitize(h.titulo)}">
      <div class="hinario-card-num">#${h.numero}</div>
      <div class="hinario-card-info">
        <h4 class="hinario-card-title">${sanitize(h.titulo)}</h4>
        <span class="hinario-card-author">${sanitize(h.autor)}</span>
      </div>
    </article>`).join('');
}

function openHymn(h) {
  if (!h) return;
  currentHymn = h;
  const modal = document.getElementById('hinario-modal');
  if (!modal) return;
  document.getElementById('hinario-modal-badge').textContent = `Hino #${h.numero}`;
  document.getElementById('hinario-modal-title').textContent = h.titulo;
  document.getElementById('hinario-modal-author').textContent = h.autor;
  const verses = h.estrofes.map(s => `<div class="hinario-verse">${sanitize(s).replace(/\s*\/\s*/g, '<br>')}</div>`).join('');
  const chorus = h.coro ? `<div class="hinario-chorus"><strong>Coro:</strong><br>${sanitize(h.coro).replace(/\s*\/\s*/g, '<br>')}</div>` : '';
  document.getElementById('hinario-lyrics-body').innerHTML = verses + chorus;
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (releaseFocus) releaseFocus();
  releaseFocus = trapFocus(modal, closeHymnModal);
}

function closeHymnModal() {
  const modal = document.getElementById('hinario-modal');
  if (!modal) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (releaseFocus) { releaseFocus(); releaseFocus = null; }
}

function toggleFontSize() {
  fontIdx = (fontIdx + 1) % FONT_SIZES.length;
  const b = document.getElementById('hinario-lyrics-body');
  if (b) b.style.fontSize = FONT_SIZES[fontIdx];
}

export async function initHinario() {
  const search = document.getElementById('hinario-search');
  const container = document.getElementById('hinario-list');
  if (!search || !container) return;
  try {
    const res = await fetch('data/hinario.json');
    hymns = await res.json();
    renderHymns(hymns);
  } catch { return; }

  const filter = () => {
    const q = search.value.trim().toLowerCase();
    renderHymns(hymns.filter(h => String(h.numero).includes(q) || h.titulo.toLowerCase().includes(q) || h.estrofes.some(s => s.toLowerCase().includes(q))));
  };
  search.addEventListener('input', filter);

  const activate = (card) => card && openHymn(hymns.find(h => h.numero === Number(card.dataset.num)));
  container.addEventListener('click', (e) => activate(e.target.closest('.hinario-card')));
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.hinario-card');
      if (card) { e.preventDefault(); activate(card); }
    }
  });

  document.querySelectorAll('.hinario-chip').forEach(btn => btn.addEventListener('click', () => {
    search.value = btn.dataset.num; filter(); openHymn(hymns.find(h => h.numero === Number(btn.dataset.num)));
  }));

  document.getElementById('hinario-close-btn')?.addEventListener('click', closeHymnModal);
  document.getElementById('hinario-font-btn')?.addEventListener('click', toggleFontSize);
  document.getElementById('hinario-copy-btn')?.addEventListener('click', () => copyHymnLyrics(currentHymn));
  document.getElementById('hinario-share-btn')?.addEventListener('click', () => shareHymnWhatsApp(currentHymn));
  document.getElementById('hinario-modal')?.addEventListener('click', (e) => { if (e.target.id === 'hinario-modal') closeHymnModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeHymnModal(); });
}
