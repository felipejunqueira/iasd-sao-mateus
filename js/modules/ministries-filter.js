/**
 * Filtro por Categoria de Ministérios · IASD São Mateus (< 50 linhas)
 */
const LABELS = {
  todos: 'todos os ministérios',
  jovens: 'Jovens & Crianças',
  comunidade: 'Comunidade & Família',
  louvor: 'Louvor & Mídia',
  lideranca: 'Liderança'
};

export function initMinistriesFilter() {
  const bar = document.getElementById('ministries-filter-bar');
  const grid = document.querySelector('.ministries-grid');
  if (!bar || !grid) return;

  const buttons = Array.from(bar.querySelectorAll('.ministry-filter-btn'));
  const cards = Array.from(grid.querySelectorAll('.ministry-card'));
  const countEl = document.getElementById('ministries-count');

  const applyFilter = (cat) => {
    let visible = 0;
    cards.forEach((card) => {
      const match = cat === 'todos' || card.dataset.ministryCat === cat;
      card.hidden = !match;
      if (match) visible += 1;
    });

    buttons.forEach((btn) => {
      const active = btn.dataset.filter === cat;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    if (countEl) {
      countEl.textContent = cat === 'todos'
        ? `Exibindo todos os ${visible} ministérios e clubes`
        : `Exibindo ${visible} ministérios em ${LABELS[cat] || cat}`;
    }
  };

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.filter || 'todos'));
  });

  applyFilter('todos');
}
