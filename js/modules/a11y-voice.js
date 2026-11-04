/**
 * Leitor de Voz Nativo Web Speech API (WCAG 2.1 AAA < 85 linhas)
 * Sintetizador otimizado para português brasileiro (pt-BR)
 */
let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let isSpeaking = false, ptVoice = null;

function loadVoice() {
  if (!synth) return;
  const voices = synth.getVoices();
  ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR') || voices.find(v => v.lang.startsWith('pt'));
}

export function initA11yVoice() {
  const btn = document.getElementById('toggle-tts');
  if (!synth || !btn) return;

  loadVoice();
  if (synth.onvoiceschanged !== undefined) synth.onvoiceschanged = loadVoice;

  btn.addEventListener('click', () => {
    if (isSpeaking) stopVoice();
    else startVoice();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSpeaking) stopVoice();
  });
  window.addEventListener('beforeunload', stopVoice);
}

function getReadableText() {
  const sel = window.getSelection()?.toString().trim();
  if (sel) return sel;

  const modal = document.querySelector('#hinario-modal.active');
  if (modal) {
    const title = document.getElementById('hinario-modal-title')?.textContent || '';
    const body = document.getElementById('hinario-lyrics-body')?.textContent || '';
    return `${title}. ${body}`.replace(/\s+/g, ' ').trim();
  }

  const panel = document.querySelector('.tab-panel.active') || document.querySelector('main');
  const title = panel?.querySelector('h1, h2')?.textContent || 'Igreja Adventista São Mateus';
  const lead = panel?.querySelector('.section-lead, .hero-lead, p')?.textContent || '';
  return `${title}. ${lead}`.replace(/\s+/g, ' ').trim();
}

function startVoice() {
  if (!synth) return;
  stopVoice();

  const text = getReadableText();
  if (!text) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = 1.0;
  if (ptVoice) utter.voice = ptVoice;

  const btn = document.getElementById('toggle-tts');
  utter.onstart = () => {
    isSpeaking = true;
    if (btn) { btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true'); btn.innerHTML = '<span>⏹️</span> Parar'; }
  };

  utter.onend = utter.onerror = () => {
    isSpeaking = false;
    if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); btn.innerHTML = '<span>🔊</span> Ouvir'; }
  };

  synth.speak(utter);
}

export function stopVoice() {
  if (synth) synth.cancel();
  isSpeaking = false;
  const btn = document.getElementById('toggle-tts');
  if (btn) { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); btn.innerHTML = '<span>🔊</span> Ouvir'; }
}
