/**
 * Orquestrador da Central da Equipe & Recepção (IASD São Mateus)
 */
import { loadComponents } from './components.js';
import { PortalDB, PORTAL_CONFIG } from './portal-db.js';
import { initScalesPanel } from './portal-scales.js';
import { safeStorage, sanitize, showToast } from './utils.js';

const HASH_TAB = { '#recepcao': 'reception', '#interessados': 'coord', '#escalas': 'scales', '#adolescentes': 'hub', '#ministerios': 'hub' };
const TAB_HASH = { reception: '#recepcao', coord: '#interessados', scales: '#escalas', hub: '#adolescentes' };
const ORIGINS = { recepcao: 'Recepção', 'site-estudo-biblico': 'Estudo Bíblico', 'site-oracao': 'Pedido de Oração' };
const STATUS = [['novo', 'Novo'], ['acompanhamento', 'Em Acompanhamento'], ['integrado', 'Integrado']];
const K_TAB = 'iasd_portal_tab', $ = (id) => document.getElementById(id), emit = (n) => document.dispatchEvent(new CustomEvent(n));
const toWa = (raw) => { const d = String(raw || '').replace(/\D/g, '').replace(/^0+/, ''); return !d ? '' : (d.startsWith('55') && d.length >= 12 ? d : (d.length <= 9 ? `5511${d}` : `55${d}`)); };

function initTabs() {
  const tabs = [...document.querySelectorAll('.portal-tab[data-portal-tab]')], panels = [...document.querySelectorAll('.portal-panel')];
  const activate = (key, push = false) => {
    const t = $(`panel-${key}`) ? key : 'reception';
    tabs.forEach((b) => { const on = b.dataset.portalTab === t; b.classList.toggle('active', on); b.setAttribute('aria-selected', String(on)); b.setAttribute('tabindex', on ? '0' : '-1'); });
    panels.forEach((p) => { const on = p.id === `panel-${t}`; p.classList.toggle('active', on); p.hidden = !on; p.setAttribute('aria-hidden', String(!on)); });
    safeStorage.set(K_TAB, t);
    if (push && location.hash !== TAB_HASH[t]) history.replaceState(null, '', TAB_HASH[t]);
  };
  const fromHash = () => { const h = location.hash.toLowerCase(); return HASH_TAB[h] || (TAB_HASH[h.slice(1)] ? h.slice(1) : ''); };
  tabs.forEach((b) => b.addEventListener('click', () => activate(b.dataset.portalTab, true)));
  document.querySelector('.portal-tablist')?.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(e.target.closest('.portal-tab'));
    if (i >= 0 && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) { const nx = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; nx.focus(); activate(nx.dataset.portalTab, true); }
  });
  window.addEventListener('hashchange', () => { const k = fromHash(); if (k) { activate(k, false); window.scrollTo({ top: 0, behavior: 'smooth' }); } });
  document.addEventListener('portal:tab', (e) => activate(e.detail, true));
  activate(fromHash() || safeStorage.get(K_TAB, 'reception'), !fromHash());
}

function initReceptionForm() {
  const form = $('portal-visitor-form'), post = $('vis-post-save'), btn = $('vis-submit-btn');
  if (!form || !post) return;
  const btnLabel = btn?.textContent || 'Salvar Visita na Nuvem', kicker = post.querySelector('.portal-saved-kicker');
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); if (btn) { btn.disabled = true; btn.textContent = 'Salvando...'; }
    try {
      const interests = [...form.querySelectorAll('input[name="vis-interest"]:checked')].map((c) => c.value);
      const v = await PortalDB.saveVisitor({ name: $('vis-name')?.value, phone: $('vis-phone')?.value, address: $('vis-address')?.value, invitedBy: $('vis-invited-by')?.value, interests, notes: $('vis-notes')?.value, origin: 'recepcao' });
      $('vis-saved-name').textContent = v.name;
      if (kicker) kicker.textContent = v._synced ? 'Visita registrada na nuvem' : 'Salvo no aparelho (sem conexão)';
      const waNum = toWa(v.phone), waBtn = $('vis-wa-welcome-btn'), pastorBtn = $('vis-wa-pastor-btn');
      const hi = `Olá ${v.name}! Que alegria receber você na IASD São Mateus (Rua Antônio Previato, 1001). Conte conosco e tenha uma semana abençoada!`;
      const pMsg = `Olá Pastor! Nova visita na recepção IASD São Mateus:\nNome: ${v.name}\nTel: ${v.phone || '-'}\nBairro: ${v.address || '-'}\nConvite: ${v.invitedBy || '-'}\nInteresses: ${interests.join(', ') || '-'}\nObs: ${v.notes || '-'}`;
      if (waBtn) { waBtn.href = waNum ? `https://wa.me/${waNum}?text=${encodeURIComponent(hi)}` : '#'; waBtn.hidden = !waNum; }
      if (pastorBtn) pastorBtn.href = `https://wa.me/${PORTAL_CONFIG.pastorWa}?text=${encodeURIComponent(pMsg)}`;
      form.reset(); post.hidden = false; post.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      showToast(v._synced ? 'Visita salva na nuvem!' : 'Salvo localmente (nuvem indisponível).'); emit('portal:visitors');
    } finally { if (btn) { btn.disabled = false; btn.textContent = btnLabel; } }
  });
  $('vis-new-btn')?.addEventListener('click', () => { form.reset(); post.hidden = true; $('vis-name')?.focus(); });
}

function visitorCardHtml(v) {
  const wa = toWa(v.phone), st = v.status || 'novo';
  const tags = (v.interests || []).map((i) => `<span class="scale-badge">${sanitize(i)}</span>`).join(' ');
  const meta = [v.address && `Bairro: ${sanitize(v.address)}`, v.invitedBy && `Convite: ${sanitize(v.invitedBy)}`].filter(Boolean).join(' · ');
  const opts = STATUS.map(([val, lbl]) => `<option value="${val}" ${st === val ? 'selected' : ''}>${lbl}</option>`).join('');
  return `<article class="visitor-card" data-id="${sanitize(v.id)}"><div class="visitor-card-head"><div><strong>${sanitize(v.name)}</strong><div class="portal-sub">${sanitize(v.phone || 'Sem telefone')} · ${sanitize(v.date || '')}</div></div><span class="scale-badge">${sanitize(ORIGINS[v.origin] || v.origin || 'Recepção')}</span></div>${meta ? `<p class="portal-sub">${meta}</p>` : ''}${tags ? `<div>${tags}</div>` : ''}${v.notes ? `<p class="portal-sub">${sanitize(v.notes)}</p>` : ''}<div class="visitor-card-actions"><select data-visitor-status="${sanitize(v.id)}" aria-label="Status de ${sanitize(v.name)}">${opts}</select>${wa ? `<a href="https://wa.me/${wa}" target="_blank" rel="noopener noreferrer" class="btn btn-wa btn-sm">WhatsApp</a>` : ''}</div></article>`;
}

function initCoordinationPanel() {
  const lockBox = $('coord-lock-box'), box = $('coord-content-box'), pin = $('coord-pin-input'), err = $('coord-lock-error'), listEl = $('coord-visitors-list');
  if (!lockBox || !box || !listEl) return;
  const filtered = () => {
    const q = ($('coord-search')?.value || '').trim().toLowerCase(), st = $('coord-status-filter')?.value || 'todos';
    return PortalDB.getVisitors().filter((v) => (st === 'todos' || (v.status || 'novo') === st) && (!q || [v.name, v.phone, v.address, v.invitedBy, v.notes, ...(v.interests || [])].join(' ').toLowerCase().includes(q)));
  };
  const render = () => {
    if (!PortalDB.isUnlocked()) return;
    const rows = filtered(), countEl = $('coord-count');
    if (countEl) countEl.textContent = `${rows.length} ${rows.length === 1 ? 'registro' : 'registros'}`;
    listEl.innerHTML = rows.length ? rows.map(visitorCardHtml).join('') : '<p class="portal-sub">Nenhum visitante encontrado.</p>';
  };
  const syncAuth = () => { const ok = PortalDB.isUnlocked(); lockBox.hidden = ok; box.hidden = !ok; if (ok) render(); };
  const tryUnlock = async () => {
    if (!PortalDB.unlock(pin?.value)) { if (err) err.textContent = 'PIN inválido. Tente novamente.'; pin?.focus(); return; }
    if (err) err.textContent = ''; if (pin) pin.value = ''; syncAuth(); await PortalDB.fetchAll(); render(); emit('portal:auth');
  };
  $('coord-unlock-btn')?.addEventListener('click', tryUnlock);
  pin?.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); tryUnlock(); } });
  $('coord-lock-btn')?.addEventListener('click', () => { PortalDB.lock(); syncAuth(); emit('portal:auth'); });
  $('coord-search')?.addEventListener('input', render); $('coord-status-filter')?.addEventListener('change', render);
  listEl.addEventListener('change', async (e) => { const s = e.target.closest('select[data-visitor-status]'); if (s) { await PortalDB.updateVisitorStatus(s.dataset.visitorStatus, s.value); showToast('Status atualizado!'); render(); } });
  $('coord-export-csv')?.addEventListener('click', () => { if (!PortalDB.exportVisitorsCSV(filtered())) showToast('Nenhum registro para exportar.'); });
  document.addEventListener('portal:visitors', render);
  syncAuth();
}

document.addEventListener('DOMContentLoaded', async () => {
  await loadComponents(); initTabs(); initReceptionForm(); initCoordinationPanel();
  await initScalesPanel(); emit('portal:visitors');
});
