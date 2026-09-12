/**
 * Módulo de Cópia da Chave PIX e Dízimos
 */
import { showToast, debounce } from './utils.js';

export function initPixCopy() {
  const copyBtn = document.getElementById('btn-copy-pix');
  const pixKeyEl = document.getElementById('pix-key-text');
  if (!copyBtn || !pixKeyEl) return;

  const handleCopy = debounce(() => {
    const key = pixKeyEl.innerText.trim();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(key).then(() => {
        showToast('Chave PIX copiada com sucesso!');
      }).catch(() => fallbackCopy(key));
    } else {
      fallbackCopy(key);
    }
  }, 400);

  copyBtn.addEventListener('click', handleCopy);
}

function fallbackCopy(text) {
  try {
    const tempInput = document.createElement('textarea');
    tempInput.value = text;
    tempInput.style.position = 'fixed';
    tempInput.style.opacity = '0';
    document.body.appendChild(tempInput);
    tempInput.focus();
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    showToast('Chave PIX copiada!');
  } catch {
    showToast('Copie a chave manualmente: ' + text);
  }
}
