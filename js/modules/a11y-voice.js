/**
 * Leitor de Voz Nativo (Web Speech API)
 */

let synth = window.speechSynthesis;
let isSpeaking = false;

export function initA11yVoice() {
  const ttsBtn = document.getElementById('toggle-tts');
  if (!synth || !ttsBtn) return;

  ttsBtn.addEventListener('click', () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      startSpeaking();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isSpeaking) stopSpeaking();
  });
}

function startSpeaking() {
  if (!synth) return;
  synth.cancel();

  const title = document.querySelector('.hero-title')?.innerText || '';
  const desc = document.querySelector('.hero-desc')?.innerText || '';
  const service = document.querySelector('.next-service-banner')?.innerText || '';
  const text = `Igreja Adventista do Sétimo Dia de São Mateus. ${title}. ${desc}. ${service}.`;

  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'pt-BR';
  utter.rate = 1.0;

  const ttsBtn = document.getElementById('toggle-tts');

  utter.onstart = () => {
    isSpeaking = true;
    if (ttsBtn) {
      ttsBtn.classList.add('active');
      ttsBtn.innerHTML = '<span>⏹️</span> Parar Áudio';
    }
  };

  utter.onend = utter.onerror = () => {
    isSpeaking = false;
    if (ttsBtn) {
      ttsBtn.classList.remove('active');
      ttsBtn.innerHTML = '<span>🔊</span> Ouvir Site';
    }
  };

  synth.speak(utter);
}

function stopSpeaking() {
  if (synth) synth.cancel();
  isSpeaking = false;
  const ttsBtn = document.getElementById('toggle-tts');
  if (ttsBtn) {
    ttsBtn.classList.remove('active');
    ttsBtn.innerHTML = '<span>🔊</span> Ouvir Site';
  }
}
