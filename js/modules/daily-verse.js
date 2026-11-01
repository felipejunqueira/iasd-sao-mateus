/**
 * Módulo: Pão Diário da Palavra (Versículo Inspirador)
 * Filosofia Unix: propósito único, determinístico e acessível (< 85 linhas)
 */
import { showToast, debounce } from './utils.js';

let verses = [];
let currentIndex = 0;

function getDayOfYear() {
  const now = new Date();
  return Math.floor((now - new Date(now.getFullYear(), 0, 0)) / 86400000);
}

function updateVerse(index) {
  const v = verses[index];
  if (!v) return;
  const textEl = document.getElementById('daily-verse-text');
  const refEl = document.getElementById('daily-verse-reference');
  const themeEl = document.getElementById('verse-theme-badge');
  const shareBtn = document.getElementById('btn-share-verse');

  if (textEl) {
    textEl.style.opacity = '0';
    setTimeout(() => { textEl.textContent = v.text; textEl.style.opacity = '1'; }, 150);
  }
  if (refEl) refEl.textContent = `— ${v.reference}`;
  if (themeEl) themeEl.textContent = v.theme;

  if (shareBtn) {
    const text = `"${v.text}" — ${v.reference} (IASD São Mateus)`;
    shareBtn.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  }
}

function copyVerse() {
  const v = verses[currentIndex];
  if (!v) return;
  const text = `"${v.text}" — ${v.reference} (IASD São Mateus)`;
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text)
      .then(() => showToast('Versículo copiado com sucesso!'))
      .catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
  showToast('Versículo copiado!');
}

export async function initDailyVerse() {
  if (!document.getElementById('daily-verse-text')) return;
  try {
    const res = await fetch(`data/verses.json?v=${Date.now()}`);
    verses = await res.json();
  } catch {
    verses = [{ reference: 'Isaías 41:10', theme: 'Esperança', text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.' }];
  }

  currentIndex = getDayOfYear() % verses.length;
  updateVerse(currentIndex);

  const copyBtn = document.getElementById('btn-copy-verse');
  if (copyBtn) copyBtn.addEventListener('click', debounce(copyVerse, 300));

  const refreshBtn = document.getElementById('btn-refresh-verse');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', debounce(() => {
      currentIndex = (currentIndex + 1) % verses.length;
      updateVerse(currentIndex);
    }, 250));
  }
}
