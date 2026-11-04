/**
 * Galeria de Fotos e Feed com Filtros Interativos e Acessibilidade (WCAG AAA)
 */
import { openLightbox } from './lightbox.js';

let galleryItems = [];
let activeFilter = 'todos';

export async function initGallery() {
  const container = document.getElementById('gallery-posts-container');
  if (!container) return;

  try {
    const res = await fetch(`data/feed.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Falha ao carregar galeria');
    const data = await res.json();
    galleryItems = data.posts || [];
  } catch {
    galleryItems = [];
  }

  renderGallery(galleryItems);
  initFilterButtons();

  window.addEventListener('languageChanged', () => {
    const filtered = activeFilter === 'todos' ? galleryItems : galleryItems.filter((i) => i.category === activeFilter);
    renderGallery(filtered);
  });
}

function renderGallery(items) {
  const container = document.getElementById('gallery-posts-container');
  if (!container) return;

  if (items.length === 0) {
    const emptyMsg = window.currentLang === 'en' ? 'No photos found.' : 'Nenhuma foto encontrada.';
    container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:#94a3b8;">${emptyMsg}</p>`;
    return;
  }

  container.innerHTML = items.map((p) => {
    const isEn = window.currentLang === 'en';
    const title = isEn && p.title_en ? p.title_en : p.title;
    const cat = isEn && p.category_label_en ? p.category_label_en : p.category_label;
    const caption = isEn && p.caption_en ? p.caption_en : p.caption;
    const ariaLabel = isEn ? `Enlarge photo: ${title}` : `Ampliar foto: ${title}`;

    return `
      <article class="feed-card" data-category="${p.category}">
        <div class="feed-image-box" data-post-id="${p.id}" role="button" tabindex="0" aria-label="${ariaLabel}">
          <img src="${p.image}" alt="${title}" loading="lazy">
        </div>
        <div class="feed-content">
          <div class="gallery-overlay">
            <span class="gallery-category">${cat}</span>
            <h4>${title}</h4>
          </div>
          <p class="feed-caption">${caption}</p>
        </div>
      </article>
    `;
  }).join('');

  container.querySelectorAll('.feed-image-box').forEach((box) => {
    const handleOpen = () => {
      const post = galleryItems.find((i) => i.id === box.dataset.postId);
      if (post) openLightbox(post);
    };
    box.addEventListener('click', handleOpen);
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  });
}

function initFilterButtons() {
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach((btn) => {
    btn.addEventListener('click', () => {
      buttons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      activeFilter = btn.dataset.filter;
      const filtered = activeFilter === 'todos' ? galleryItems : galleryItems.filter((i) => i.category === activeFilter);
      renderGallery(filtered);
    });
  });
}
