/**
 * Hinário Adventista - IASD São Mateus (WCAG 2.1 AAA < 90 linhas)
 */
import { sanitize, safeStorage, showToast } from './utils.js';
import { trapFocus } from './focus-trap.js';
import { copyHymnLyrics, shareHymnWhatsApp } from './hinario-share.js';

let hymns = [], currentHymn = null, releaseFocus = null;
const FONT_SIZES = ['1.05rem', '1.25rem', '1.5rem', '1.75rem'];
let fontIdx = parseInt(safeStorage.get('iasd_hinario_font', '0'), 10) || 0;

function renderHymns(list) {
  const c = document.getElementById('hinario-list');
  if (!c) return;
  if (!list.length) return (c.innerHTML = '<p class="hinario-empty">Nenhum hino encontrado.</p>');
  c.innerHTML = list.map(h => `
    <article class="hinario-card" data-num="${h.numero}" role="button" tabindex="0" aria-label="Hino ${h.numero}: ${sanitize(h.titulo)}">
      <div class="hinario-card-num">#${h.numero}</div>
      <div class="hinario-card-info"><h4 class="hinario-card-title">${sanitize(h.titulo)}</h4><span class="hinario-card-author">${sanitize(h.autor)}</span></div>
    </article>`).join('');
}

function applyFontSize() {
  const b = document.getElementById('hinario-lyrics-body');
  if (b) b.style.fontSize = FONT_SIZES[fontIdx % FONT_SIZES.length];
}

function toggleFontSize() {
  fontIdx = (fontIdx + 1) % FONT_SIZES.length;
  safeStorage.set('iasd_hinario_font', String(fontIdx));
  applyFontSize();
  showToast(`Fonte ajustada (${FONT_SIZES[fontIdx]})`);
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
  const body = document.getElementById('hinario-lyrics-body');
  if (body) { body.innerHTML = verses + chorus; applyFontSize(); }
  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  if (releaseFocus) releaseFocus();
  releaseFocus = trapFocus(modal, closeHymnModal);
}

function closeHymnModal() {
  const modal = document.getElementById('hinario-modal');
  if (!modal || !modal.classList.contains('active')) return;
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (releaseFocus) { releaseFocus(); releaseFocus = null; }
}

const norm = (s) => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export async function initHinario() {
  const search = document.getElementById('hinario-search');
  const container = document.getElementById('hinario-list');
  if (!search || !container) return;
  try {
    const res = await fetch('data/hinario.json');
    hymns = res.ok ? await res.json() : [];
    renderHymns(hymns);
  } catch { return; }

  const filter = () => {
    const q = norm(search.value);
    if (!q) return renderHymns(hymns);
    renderHymns(hymns.filter(h => String(h.numero).includes(q) || norm(h.titulo).includes(q) || norm(h.autor).includes(q) || h.estrofes.some(s => norm(s).includes(q))));
  };
  search.addEventListener('input', filter);

  const activate = (card) => card && openHymn(hymns.find(h => h.numero === Number(card.dataset.num)));
  container.addEventListener('click', (e) => activate(e.target.closest('.hinario-card')));
  container.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.closest('.hinario-card')) { e.preventDefault(); activate(e.target.closest('.hinario-card')); }
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
