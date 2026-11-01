/**
 * Módulo PWA - Registro do SW, Instalação e Status de Rede (< 75 linhas)
 */
import { showToast } from './utils.js';

let deferredPrompt = null;

function setupInstallUI() {
  const container = document.querySelector('.nav-actions') || document.body;
  const btn = document.createElement('button');
  btn.id = 'pwa-install-btn';
  btn.className = 'btn pwa-install-btn hidden';
  btn.setAttribute('aria-label', 'Instalar App da Igreja');
  btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg><span>Instalar App</span>`;

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      btn.classList.add('hidden');
      showToast('App instalado com sucesso!');
    }
    deferredPrompt = null;
  });

  container.prepend(btn);

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn.classList.remove('hidden');
  });

  window.addEventListener('appinstalled', () => {
    btn.classList.add('hidden');
    deferredPrompt = null;
    showToast('IASD São Mateus adicionado à sua tela inicial!');
  });
}

function setupNetworkStatus() {
  const badge = document.createElement('aside');
  badge.id = 'pwa-offline-badge';
  badge.className = 'pwa-offline-badge hidden';
  badge.setAttribute('role', 'status');
  badge.innerHTML = '<span class="pwa-dot"></span><span>Modo Offline (Conteúdo em Cache)</span>';
  document.body.appendChild(badge);

  const update = (online) => {
    badge.classList.toggle('hidden', online);
    showToast(online ? 'Conexão restabelecida. Você está online!' : 'Você está offline. O site continuará funcionando.');
  };

  window.addEventListener('online', () => update(true));
  window.addEventListener('offline', () => update(false));
  if (!navigator.onLine) badge.classList.remove('hidden');
}

export function initPWA() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch((err) => {
        console.warn('Falha ao registrar Service Worker:', err);
      });
    });
  }
  setupInstallUI();
  setupNetworkStatus();
}
