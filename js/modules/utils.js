/**
 * Utilitários seguros e defensivos - Filosofia Unix
 * Proteção contra cliques múltiplos, falhas de storage e injeção XSS
 */

export const safeStorage = {
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val !== null ? val : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, val);
    } catch {}
  }
};

export function sanitize(str) {
  if (typeof str !== 'string') return '';
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#x27;' };
  return str.replace(/[&<>"']/g, (m) => map[m]);
}

let toastTimer = null;
export function showToast(message, icon = '🙏') {
  let toast = document.getElementById('toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.className = 'toast-alert';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span>${icon}</span><div>${sanitize(message)}</div>`;
  toast.classList.add('show');

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4500);
}

export function debounce(func, wait = 300) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}
