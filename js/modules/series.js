/**
 * Central de Séries Bíblicas em Temporadas
 */

let seriesData = null;

export async function initSeriesPlayer() {
  const tabsContainer = document.getElementById('season-tabs-container');
  const episodesContainer = document.getElementById('episodes-container');
  if (!tabsContainer || !episodesContainer) return;

  try {
    const res = await fetch('data/series.json');
    seriesData = await res.json();
    renderSeasons(seriesData.seasons || []);
  } catch {
    episodesContainer.innerHTML = '<p style="color:#94a3b8; text-align:center;">Não foi possível carregar as séries no momento.</p>';
  }
}

function renderSeasons(seasons) {
  const tabsContainer = document.getElementById('season-tabs-container');
  if (!tabsContainer || seasons.length === 0) return;

  tabsContainer.innerHTML = seasons.map((s, idx) => `
    <button class="season-tab-btn ${idx === 0 ? 'active' : ''}" data-season="${s.id}">
      ${s.title.split(':')[0]}
    </button>
  `).join('');

  renderEpisodes(seasons[0]);

  tabsContainer.querySelectorAll('.season-tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      tabsContainer.querySelectorAll('.season-tab-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const target = seasons.find((s) => s.id === btn.dataset.season);
      if (target) renderEpisodes(target);
    });
  });
}

function renderEpisodes(season) {
  const container = document.getElementById('episodes-container');
  if (!container) return;

  container.innerHTML = (season.episodes || []).map((ep) => `
    <article class="episode-card" data-video="${ep.video_id}" data-title="${ep.title}">
      <div class="episode-thumb-wrap">
        <img src="${ep.image}" alt="${ep.title}" loading="lazy">
        <span class="episode-duration">⏱️ ${ep.duration}</span>
        <div class="episode-play-btn">▶</div>
      </div>
      <div class="episode-body">
        <h4>${ep.title}</h4>
        <p>${ep.summary}</p>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.episode-card').forEach((card) => {
    card.addEventListener('click', () => {
      openVideoModal(card.dataset.title, card.dataset.video);
    });
  });
}

function openVideoModal(title, videoId) {
  const modal = document.getElementById('video-modal');
  const titleEl = document.getElementById('video-modal-title');
  const frameEl = document.getElementById('video-frame');
  if (!modal || !frameEl) return;

  if (titleEl) titleEl.innerText = title;
  frameEl.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}
