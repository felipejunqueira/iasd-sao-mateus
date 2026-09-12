/**
 * Central de Séries Bíblicas em Temporadas (Filosofia Unix)
 */
import { openSeriesModal, initSeriesModalEvents } from './series-modal.js';

let seriesData = null;

export async function initSeriesPlayer() {
  const tabsContainer = document.getElementById('season-tabs-container');
  const episodesContainer = document.getElementById('episodes-container');
  if (!tabsContainer || !episodesContainer) return;

  initSeriesModalEvents();

  try {
    const res = await fetch('data/series.json');
    seriesData = await res.json();
    renderSeasons(seriesData.seasons || []);
  } catch {
    episodesContainer.innerHTML = '<p style="color:#94a3b8;text-align:center;">Não foi possível carregar as séries no momento.</p>';
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
        <span class="episode-duration">${ep.duration}</span>
        <div class="episode-play-btn">
          <svg viewBox="0 0 24 24" fill="white" width="44" height="44"><circle cx="12" cy="12" r="11" fill="rgba(0,0,0,.35)"/><polygon points="10,8 17,12 10,16" fill="white"/></svg>
        </div>
      </div>
      <div class="episode-body">
        <h4>${window.currentLang === 'en' && ep.title_en ? ep.title_en : ep.title}</h4>
        <p>${window.currentLang === 'en' && ep.summary_en ? ep.summary_en : ep.summary}</p>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.episode-card').forEach((card) => {
    card.addEventListener('click', () => {
      openSeriesModal(card.dataset.video, card.dataset.title);
    });
  });
}
