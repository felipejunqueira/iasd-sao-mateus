/**
 * Camada de Dados do Portal Operacional & Recepção (Supabase + Cache Local)
 * Isolamento na tabela teen_scores: prefixos portal_visita_ e portal_escala_
 */
import { safeStorage } from './utils.js';

export const PORTAL_CONFIG = { url: 'https://akqckxynvvavroiwijxo.supabase.co', anonKey: 'sb_publishable_TKCbyuzHCtNvtgWzNXlnwQ_XgLegHFn', leadershipPin: '1001', pastorWa: '5511996338938' };
const K_VIS = 'iasd_portal_visitors', K_SCL = 'iasd_portal_scales', K_PIN = 'iasd_portal_unlocked';
const LABELS = { diaconato: 'Diáconos & Diaconisas', recepcao: 'Ministério da Recepção', ancionato: 'Ancionato & Púlpito', sonoplastia: 'Áudio & Transmissão', louvor: 'Música & Louvor' };
const str = (v) => String(v ?? '').trim(), todayISO = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const isoDate = (d) => (/^\d{4}-\d{2}-\d{2}$/.test(str(d)) ? str(d) : todayISO());
const readArr = (k) => { try { const v = JSON.parse(safeStorage.get(k, '[]')); return Array.isArray(v) ? v : []; } catch { return []; } };
const upsert = (arr, it) => (arr.some((x) => x.id === it.id) ? arr.map((x) => (x.id === it.id ? it : x)) : [it, ...arr]);
const ts = (x) => Date.parse(x?.updatedAt || x?.createdAt || 0) || 0, sess = (fn) => { try { return fn(sessionStorage); } catch { return false; } };
const api = (qs = '', opt = {}) => fetch(`${PORTAL_CONFIG.url}/rest/v1/teen_scores${qs}`, { ...opt, headers: { apikey: PORTAL_CONFIG.anonKey, Authorization: `Bearer ${PORTAL_CONFIG.anonKey}`, 'Content-Type': 'application/json', ...opt.headers } });
const getJSON = async (qs) => { const r = await api(qs); if (!r.ok) throw r.status; return (await r.json()) || []; };
const rowFor = (tipo, name, date, subAt, data) => ({ id: data.id, name, date: isoDate(date), total: 0, answers: [{ tipo, ...data }], submitted_at: subAt });
function setBadge(on) {
  const el = typeof document !== 'undefined' && document.getElementById('portal-sync-badge');
  if (el) { el.dataset.state = on ? 'online' : 'local'; el.classList.toggle('is-online', on); el.classList.toggle('is-offline', !on); el.textContent = on ? 'Nuvem ativa' : 'Modo local'; }
}
function mergeById(local, cloud) {
  const map = new Map(); [...local, ...cloud].forEach((it) => { if (it?.id && (!map.has(it.id) || ts(it) >= ts(map.get(it.id)))) map.set(it.id, it); });
  return [...map.values()];
}
async function persist(key, item, row) {
  safeStorage.set(key, JSON.stringify(upsert(readArr(key), item)));
  let ok = false;
  try { ok = (await api('', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }, body: JSON.stringify(row) })).ok; } catch {}
  setBadge(ok);
  return { ...item, _synced: ok };
}
export const PortalDB = {
  getVisitors: () => readArr(K_VIS), getScales: () => readArr(K_SCL),
  isUnlocked: () => sess((s) => s.getItem(K_PIN) === '1'), lock: () => { sess((s) => s.removeItem(K_PIN)); },
  unlock(pin) { const ok = str(pin) === PORTAL_CONFIG.leadershipPin; if (ok) sess((s) => s.setItem(K_PIN, '1')); return ok; },
  async fetchAll() {
    const localVis = readArr(K_VIS), localScl = readArr(K_SCL), cVis = [], cScl = [];
    try {
      (await getJSON('?id=like.portal_%25&select=*&order=submitted_at.desc')).forEach((r) => {
        const p = Array.isArray(r.answers) && r.answers[0], id = str(r.id);
        if (!p || p.archived || p.tipo === 'sys_check') return;
        if (id.startsWith('portal_visita_')) cVis.push({ ...p, id, name: p.name || r.name, date: p.date || r.date, createdAt: p.createdAt || r.submitted_at });
        else if (id.startsWith('portal_escala_')) cScl.push({ ...p, id, date: p.date || r.date });
      });
      const visitors = mergeById(localVis, cVis).sort((a, b) => str(b.createdAt).localeCompare(str(a.createdAt)));
      const scales = mergeById(localScl, cScl);
      safeStorage.set(K_VIS, JSON.stringify(visitors)); safeStorage.set(K_SCL, JSON.stringify(scales)); setBadge(true);
      return { visitors, scales, online: true };
    } catch { setBadge(false); return { visitors: localVis, scales: localScl, online: false }; }
  },
  saveVisitor(v = {}) {
    const now = new Date().toISOString(), rawId = str(v.id);
    const id = rawId.startsWith('portal_visita_') ? rawId : `portal_visita_${rawId || `${Date.now()}_${Math.random().toString(36).slice(2, 6)}`}`;
    const interests = Array.isArray(v.interests) ? v.interests : (v.interests ? [str(v.interests)] : []);
    const it = { id, name: str(v.name) || 'Visitante', phone: str(v.phone), address: str(v.address), invitedBy: str(v.invitedBy), interests, notes: str(v.notes), origin: v.origin || 'recepcao', status: v.status || 'novo', date: v.date || todayISO(), createdAt: v.createdAt || now, updatedAt: now };
    return persist(K_VIS, it, rowFor('visita', it.name, it.date, it.createdAt, it));
  },
  updateVisitorStatus(id, status) {
    const cur = readArr(K_VIS).find((x) => x.id === id);
    if (!cur) return Promise.resolve(null);
    const u = { ...cur, status, updatedAt: new Date().toISOString() };
    return persist(K_VIS, u, rowFor('visita', u.name, u.date, u.createdAt, u));
  },
  saveScale(s = {}) {
    const min = str(s.ministry) || 'diaconato', date = str(s.date) || todayISO(), rawId = str(s.id);
    const id = rawId.startsWith('portal_escala_') ? rawId : `portal_escala_${min}_${date.replace(/\D/g, '') || Date.now()}`;
    const prev = readArr(K_SCL).find((x) => x.id === id);
    const it = { id, ministry: min, ministryLabel: s.ministryLabel || LABELS[min] || min, date, time: str(s.time ?? prev?.time), team: str(s.team), notes: str(s.notes), updatedAt: new Date().toISOString() };
    return persist(K_SCL, it, rowFor('escala', it.ministryLabel, it.date, it.updatedAt, it));
  },
  async loadInitialScales() {
    let base = [], driveUrl = '';
    try { const r = await fetch('data/scales.json'); if (r.ok) { const j = await r.json(); base = Array.isArray(j.scales) ? j.scales : []; driveUrl = j.driveUrl || ''; } } catch {}
    return { driveUrl, scales: mergeById(base, (await this.fetchAll()).scales).sort((a, b) => str(a.date).localeCompare(str(b.date))) };
  },
  async fetchTeensTop(limit = 5) {
    try {
      const agg = new Map();
      (await getJSON('?select=id,name,total&id=not.like.portal_%25')).forEach((r) => {
        const name = str(r.name); if (!name || str(r.id).startsWith('portal_')) return;
        const k = name.toLowerCase(), p = agg.get(k) || { name, total: 0, count: 0 };
        p.total += Number(r.total || 0); p.count += 1; agg.set(k, p);
      });
      return [...agg.values()].sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, 'pt-BR')).slice(0, limit);
    } catch { return []; }
  },
  exportVisitorsCSV(list) {
    const rows = Array.isArray(list) ? list : readArr(K_VIS);
    if (typeof document === 'undefined' || !rows.length) return false;
    const esc = (v) => `"${str(v).replace(/"/g, '""')}"`;
    const body = rows.map((v) => [v.date, v.name, v.phone, v.address, v.invitedBy, (v.interests || []).join(' | '), v.origin, v.status, v.notes].map(esc).join(';')).join('\n');
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([`\ufeffData;Nome;Telefone;Bairro;Convidado Por;Interesses;Origem;Status;Observações\n${body}`], { type: 'text/csv;charset=utf-8;' })), download: `visitantes_iasd_sm_${todayISO()}.csv` });
    document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); return true;
  }
};
