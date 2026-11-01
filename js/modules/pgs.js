/**
 * Módulo de Pequenos Grupos (PGs) - Filosofia Unix (< 90 linhas)
 * Renderização dinâmica, filtros por bairro/perfil e contato WhatsApp direto.
 */

let allPGs = [];

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (m) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

function createCard(pg) {
  const msg = encodeURIComponent(`Olá! Vi o ${pg.nome} no site da IASD São Mateus e gostaria de participar dos encontros.`);
  const waUrl = `https://wa.me/${pg.whatsapp}?text=${msg}`;
  const badgeClass = `pg-badge-${pg.perfil.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}`;
  return `
    <article class="pg-card" data-bairro="${escapeHtml(pg.bairro)}" data-perfil="${escapeHtml(pg.perfil)}">
      <div class="pg-card-header">
        <h3 class="pg-name">${escapeHtml(pg.nome)}</h3>
        <span class="pg-badge ${badgeClass}">${escapeHtml(pg.perfil)}</span>
      </div>
      <div class="pg-details">
        <p class="pg-info"><span class="pg-icon">📍</span><strong>Bairro:</strong> ${escapeHtml(pg.bairro)}</p>
        <p class="pg-info"><span class="pg-icon">🗓️</span><strong>Dia:</strong> ${escapeHtml(pg.dia)}</p>
        <p class="pg-info"><span class="pg-icon">🤝</span><strong>Líderes:</strong> ${escapeHtml(pg.lideres)}</p>
      </div>
      <p class="pg-desc">${escapeHtml(pg.descricao)}</p>
      <div class="pg-action">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary pg-btn">
          <span>💬 Quero Participar / Falar no WhatsApp</span>
        </a>
      </div>
    </article>
  `;
}

function renderPGs(filterBairro = 'todos', filterPerfil = 'todos') {
  const grid = document.getElementById('pgs-grid');
  const empty = document.getElementById('pgs-empty');
  if (!grid) return;

  const filtered = allPGs.filter((pg) => {
    const matchB = filterBairro === 'todos' || pg.bairro === filterBairro;
    const matchP = filterPerfil === 'todos' || pg.perfil === filterPerfil;
    return matchB && matchP;
  });

  if (filtered.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.hidden = false;
  } else {
    if (empty) empty.hidden = true;
    grid.innerHTML = filtered.map(createCard).join('');
  }
}

export async function initPGs() {
  const grid = document.getElementById('pgs-grid');
  if (!grid) return;

  try {
    const res = await fetch('data/pgs.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    allPGs = await res.json();
    renderPGs();

    const fBairro = document.getElementById('pg-filter-bairro');
    const fPerfil = document.getElementById('pg-filter-perfil');
    const update = () => renderPGs(fBairro?.value || 'todos', fPerfil?.value || 'todos');

    fBairro?.addEventListener('change', update);
    fPerfil?.addEventListener('change', update);
  } catch (err) {
    console.error('Erro ao carregar Pequenos Grupos:', err);
    grid.innerHTML = '<p class="pgs-error">Não foi possível carregar os Pequenos Grupos no momento.</p>';
  }
}
