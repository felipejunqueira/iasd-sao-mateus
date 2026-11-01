/**
 * Leitor de Voz Nativo Web Speech API (WCAG 2.1 AAA < 75 linhas)
 */
let synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
let isSpeaking = false;

export function initA11yVoice() {
  const btn = document.getElementById('toggle-tts');
  if (!synth || !btn) return;

  btn.addEventListener('click', () => {
    if (isSpeaking) stopVoice();
    else startVoice();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSpeaking) stopVoice();
  });
}

function getReadableText() {
  const selection = window.getSelection()?.toString().trim();
  if (selection) return selection;

  const hinarioModal = document.querySelector('#hinario-modal.active');
  if (hinarioModal) {
    const title = document.getElementById('hinario-modal-title')?.textContent || '';
    const body = document.getElementById('hinario-lyrics-body')?.textContent || '';
    return `${title}. ${body}`;
  }

  const activePanel = document.querySelector('.tab-panel.active') || document.querySelector('main');
  const title = activePanel?.querySelector('h1, h2')?.textContent || 'Igreja Adventista do Sétimo Dia São Mateus';
  const lead = activePanel?.querySelector('p')?.textContent || '';
  const service = document.querySelector('.next-service-banner')?.textContent || '';
  return `${title}. ${lead}. ${service}`.trim();
}

function startVoice() {
  if (!synth) return;
  synth.cancel();

  const text = getReadableText();
  if (!text) return;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = 1.0;

  const btn = document.getElementById('toggle-tts');

  utter.onstart = () => {
    isSpeaking = true;
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      btn.innerHTML = '<span>⏹️</span> Parar';
    }
  };

  utter.onend = utter.onerror = () => {
    isSpeaking = false;
    if (btn) {
      btn.classList.remove('active');
      btn.setAttribute('aria-pressed', 'false');
      btn.innerHTML = '<span>🔊</span> Ouvir';
    }
  };

  synth.speak(utter);
}

export function stopVoice() {
  if (synth) synth.cancel();
  isSpeaking = false;
  const btn = document.getElementById('toggle-tts');
  if (btn) {
    btn.classList.remove('active');
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML = '<span>🔊</span> Ouvir';
  }
}
