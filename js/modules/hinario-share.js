/**
 * Compartilhamento e Cópia do Hinário (Filosofia Unix < 35 linhas)
 */
import { showToast } from './utils.js';

export async function copyHymnLyrics(h) {
  if (!h) return;
  const txt = `Hino #${h.numero} - ${h.titulo}\n${h.autor}\n\n${h.estrofes.join('\n\n')}\n\nCoro:\n${h.coro}`;
  try {
    await navigator.clipboard.writeText(txt);
    showToast('Letra do hino copiada!');
  } catch {
    showToast('Não foi possível copiar.');
  }
}

export function shareHymnWhatsApp(h) {
  if (!h) return;
  const msg = encodeURIComponent(`*Hino #${h.numero} - ${h.titulo}*\nIASD São Mateus\n\n${h.estrofes[0]}\n\n*Coro:*\n${h.coro}`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}
