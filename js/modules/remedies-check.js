import { safeStorage } from './utils.js';

const KEY = 'iasd_remedies_check';

const MESSAGES = [
  { min: 100, title: 'Saúde Integral Abençoada', text: 'Louvado seja Deus! Seu corpo e mente estão em harmonia com as leis naturais do Criador. A medicina comprova que manter esses 8 hábitos renova a imunidade e prolonga a vida com vigor e paz. "Desejo que tenhas saúde, assim como vai bem a tua alma" (3 João 1:2).' },
  { min: 75, title: 'Excelente Vitalidade', text: 'Maravilhosa dedicação ao templo do Espírito Santo! Poucos ajustes trarão ainda mais clareza mental e paz interior para os desafios diários. Respire fundo e renove suas forças no amor de Deus.' },
  { min: 50, title: 'Bons Passos de Renovação', text: 'Você deu passos significativos hoje! O equilíbrio no estilo de vida vem com perseverança diária: priorize uma hidratação generosa, uma pausa para oração e um descanso noturno restaurador.' },
  { min: 0, title: 'Um Recomeço com Esperança', text: 'As misericórdias de Deus se renovam a cada manhã! Comece agora mesmo com passos simples: beba água pura, respire ar fresco na janela e descanse o coração em Cristo. "O coração alegre é bom remédio" (Pv 17:22).' }
];

function getFeedback(score) {
  return MESSAGES.find(m => score >= m.min) || MESSAGES[MESSAGES.length - 1];
}

export function initRemediesCheck() {
  const container = document.getElementById('remedies-check-accordion');
  if (!container) return;

  const toggleBtn = document.getElementById('check-toggle-btn');
  const panel = document.getElementById('check-accordion-panel');
  const inputs = Array.from(container.querySelectorAll('.remedy-switch'));
  const fill = document.getElementById('check-progress-fill');
  const pctTxt = document.getElementById('check-progress-pct');
  const countTxt = document.getElementById('check-progress-text');
  const calcBtn = document.getElementById('btn-calc-health');
  const resultBox = document.getElementById('check-result-box');

  const updateProgress = () => {
    const checked = inputs.filter(i => i.checked).length;
    const score = Math.round((checked / inputs.length) * 100);
    if (fill) fill.style.width = `${score}%`;
    if (pctTxt) pctTxt.textContent = `${score}%`;
    if (countTxt) countTxt.textContent = `${checked} de ${inputs.length} hábitos hoje`;
    inputs.forEach(i => i.closest('.remedy-item')?.classList.toggle('selected', i.checked));
    return { checked, score };
  };

  const renderResult = (score, dateStr) => {
    if (!resultBox) return;
    const fb = getFeedback(score);
    document.getElementById('result-score-badge').textContent = `${score}%`;
    document.getElementById('result-title').textContent = fb.title;
    document.getElementById('result-message').textContent = fb.text;
    const dateEl = document.getElementById('result-date');
    if (dateEl) dateEl.textContent = `Registrado em: ${dateStr || new Date().toLocaleDateString('pt-BR')}`;
    resultBox.hidden = false;
  };

  toggleBtn?.addEventListener('click', () => {
    const open = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!open));
    panel?.classList.toggle('collapsed', open);
  });

  inputs.forEach(input => input.addEventListener('change', updateProgress));

  calcBtn?.addEventListener('click', () => {
    const { score } = updateProgress();
    const today = new Date().toLocaleDateString('pt-BR');
    const checkedIds = inputs.filter(i => i.checked).map(i => i.id);
    safeStorage.set(KEY, JSON.stringify({ date: today, score, checkedIds }));
    renderResult(score, today);
    resultBox?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  try {
    const saved = JSON.parse(safeStorage.get(KEY, 'null'));
    if (saved && Array.isArray(saved.checkedIds)) {
      inputs.forEach(i => { i.checked = saved.checkedIds.includes(i.id); });
      updateProgress();
      if (typeof saved.score === 'number') renderResult(saved.score, saved.date);
    }
  } catch {}
}
