/**
 * Escalas Semanais, Drive & Hub dos Adolescentes (IASD São Mateus)
 */
import { PortalDB } from './portal-db.js';
import { safeStorage, sanitize, showToast } from './utils.js';

const K_DRIVE = 'iasd_scales_drive_url';
const $ = (id) => document.getElementById(id);
const fmtDate = (iso) => (/^\d{4}-\d{2}-\d{2}$/.test(String(iso || '')) ? iso.split('-').reverse().join('/') : String(iso || 'A definir'));

function safeHttpUrl(raw) {
  try {
    const u = new URL(String(raw || '').trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.href : '';
  } catch { return ''; }
}

function scaleCardHtml(s) {
  const label = s.ministryLabel || s.ministry || 'Ministério';
  const when = s.time ? `${fmtDate(s.date)} · ${s.time}` : fmtDate(s.date);
  const msg = `Olá equipe! Lembrete da escala *${label}* — IASD São Mateus:\nData: ${when}\nEscalados: ${s.team || 'A definir'}${s.notes ? `\nObs.: ${s.notes}` : ''}`;
  const waHref = `https://wa.me/?text=${encodeURIComponent(msg)}`;
  return `<article class="scale-card" data-id="${sanitize(s.id)}"><div class="scale-card-head"><span class="scale-badge">${sanitize(label)}</span><span class="portal-sub">${sanitize(when)}</span></div><p><strong>Equipe:</strong> ${sanitize(s.team || 'A definir')}</p>${s.notes ? `<p class="portal-sub">${sanitize(s.notes)}</p>` : ''}<div class="scale-card-actions"><a href="${waHref}" target="_blank" rel="noopener noreferrer" class="btn btn-wa btn-sm">Enviar Lembrete no WhatsApp</a></div></article>`;
}

export async function initScalesPanel() {
  const grid = $('scales-grid'), filterBar = $('scales-ministry-filter'), driveLink = $('scales-drive-link');
  const editor = $('scales-editor-panel'), form = $('scale-form'), teensBox = $('hub-teens-preview');
  let scales = [], ministry = 'todos';

  const renderScales = () => {
    if (!grid) return;
    const rows = ministry === 'todos' ? scales : scales.filter((s) => s.ministry === ministry);
    grid.innerHTML = rows.length ? rows.map(scaleCardHtml).join('') : '<p class="portal-sub">Nenhuma escala cadastrada para este ministério.</p>';
  };

  filterBar?.addEventListener('click', (e) => {
    const btn = e.target.closest('.portal-pill[data-scale-ministry]');
    if (!btn) return;
    ministry = btn.dataset.scaleMinistry || 'todos';
    filterBar.querySelectorAll('.portal-pill').forEach((p) => { p.classList.toggle('active', p === btn); p.setAttribute('aria-pressed', String(p === btn)); });
    renderScales();
  });

  $('scales-drive-config-btn')?.addEventListener('click', () => {
    const next = window.prompt('Cole o link da planilha de escalas no Google Drive:', driveLink?.href || 'https://drive.google.com');
    if (next === null) return;
    const valid = safeHttpUrl(next);
    if (!valid) { showToast('Link inválido. Informe uma URL http:// ou https://.'); return; }
    safeStorage.set(K_DRIVE, valid);
    if (driveLink) driveLink.href = valid;
    showToast('Planilha do Drive vinculada!');
  });

  $('scales-edit-toggle-btn')?.addEventListener('click', () => {
    if (!PortalDB.isUnlocked()) {
      showToast('Desbloqueie com o PIN da liderança para atualizar escalas.');
      document.dispatchEvent(new CustomEvent('portal:tab', { detail: 'coord' }));
      $('coord-pin-input')?.focus();
      return;
    }
    if (editor) editor.hidden = !editor.hidden;
  });

  document.addEventListener('portal:auth', () => { if (!PortalDB.isUnlocked() && editor) editor.hidden = true; });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!PortalDB.isUnlocked()) { document.dispatchEvent(new CustomEvent('portal:tab', { detail: 'coord' })); return; }
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) submitBtn.disabled = true;
    try {
      const saved = await PortalDB.saveScale({ ministry: $('scale-ministry')?.value, date: $('scale-date')?.value, team: $('scale-team')?.value, notes: $('scale-notes')?.value });
      scales = [...scales.filter((s) => s.id !== saved.id), saved].sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
      renderScales(); form.reset(); if (editor) editor.hidden = true; showToast('Escala salva na nuvem!');
    } finally { if (submitBtn) submitBtn.disabled = false; }
  });

  const [{ driveUrl, scales: initial }, teens] = await Promise.all([PortalDB.loadInitialScales(), PortalDB.fetchTeensTop(5)]);
  scales = initial;
  const activeDrive = safeHttpUrl(safeStorage.get(K_DRIVE, '')) || safeHttpUrl(driveUrl);
  if (driveLink && activeDrive) driveLink.href = activeDrive;
  renderScales();

  if (teensBox) {
    teensBox.innerHTML = teens.length ? teens.map((t, i) => `<div class="teens-rank-row"><span><strong>#${i + 1}</strong> ${sanitize(t.name)}</span><span class="scale-badge">${Number(t.total || 0)} pts</span></div>`).join('') : '<p class="portal-sub">Ranking dos adolescentes indisponível no momento.</p>';
  }
}
