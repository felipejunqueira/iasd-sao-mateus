/**
 * Visualizador Modal Lightbox para Fotos
 */

export function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const closeBtn = document.getElementById('lightbox-close');
  if (!modal) return;

  const close = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', close);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) close();
  });
}

export function openLightbox(post) {
  const modal = document.getElementById('lightbox-modal');
  const img = document.getElementById('lightbox-img');
  const title = document.getElementById('lightbox-title');
  const caption = document.getElementById('lightbox-caption');
  if (!modal || !img || !title || !caption) return;

  img.src = post.image;
  img.alt = post.title;
  title.innerText = post.title;
  caption.innerText = post.caption;

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
