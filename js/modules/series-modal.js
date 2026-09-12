/**
 * Modal de Vídeo das Séries Bíblicas (Filosofia Unix)
 * Gerencia a reprodução limpa no iframe sem vazamento de áudio
 */
export function openSeriesModal(youtubeId, title) {
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('video-frame');
  const modalTitle = document.getElementById('video-modal-title');
  if (!modal || !frame) return;

  frame.src = `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`;
  if (modalTitle) modalTitle.textContent = title || 'Série Bíblica';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

export function closeSeriesModal() {
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('video-frame');
  if (!modal) return;

  modal.classList.remove('active');
  if (frame) frame.src = '';
  document.body.style.overflow = '';
}

export function initSeriesModalEvents() {
  const modal = document.getElementById('video-modal');
  const closeBtn = document.getElementById('video-modal-close');
  if (!modal) return;

  if (closeBtn) closeBtn.addEventListener('click', closeSeriesModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeSeriesModal(); });
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSeriesModal(); });
}
