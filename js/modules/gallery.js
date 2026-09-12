/**
 * Galeria de Fotos e Feed com Filtros Interativos
 */
import { openLightbox } from './lightbox.js';

let galleryItems = [];

export async function initGallery() {
  const container = document.getElementById('gallery-posts-container');
  if (!container) return;

  try {
    const res = await fetch('data/feed.json');
    const data = await res.json();
    galleryItems = data.posts || [];
  } catch {
    galleryItems = [];
  }

  renderGallery(galleryItems);
  initFilterButtons();
}

function renderGallery(items) {
  const container = document.getElementById('gallery-posts-container');
  if (!container) return;

  if (items.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1;text-align:center;color:#94a3b8;">Nenhuma foto encontrada.</p>';
    return;
  }

  container.innerHTML = items.map((p) => `
    <article class="feed-card" data-category="${p.category}">
      <div class="feed-image-box" data-post-id="${p.id}">
        <img src="${p.image}" alt="${p.title}" loading="lazy">
      </div>
      <div class="feed-content">
        <h3 class="feed-title">${p.title}</h3>
        <p class="feed-caption">${p.caption}</p>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.feed-image-box').forEach((box) => {
    box.addEventListener('click', () => {
      const post = galleryItems.find((i) => i.id === box.dataset.postId);
      if (post) openLightbox(post);
    });
  });
}

function initFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      if (filter === 'todos') {
        renderGallery(galleryItems);
      } else {
        renderGallery(galleryItems.filter((i) => i.category === filter));
      }
    });
  });
}
