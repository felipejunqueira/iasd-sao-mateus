/**
 * Pôr do Sol e Boas-Vindas ao Sábado · IASD São Mateus (-23.5997, -46.4883)
 * Cálculo astronômico NOAA preciso com contagem regressiva e saudação sabática
 */
export function getSunset(d, lat = -23.5997, lng = -46.4883) {
  const start = new Date(d.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((d - start) / 86400000);
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 0.75);
  const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma);
  const latRad = lat * (Math.PI / 180);
  const cosOmega = (Math.cos(90.833 * Math.PI / 180) - Math.sin(latRad) * Math.sin(decl)) /
    (Math.cos(latRad) * Math.cos(decl));
  const omega = Math.acos(Math.max(-1, Math.min(1, cosOmega))) * (180 / Math.PI);
  const localMinutes = 720 - 4 * lng - eq + 4 * omega - 180; // Horário padrão de Brasília (UTC-3)
  const res = new Date(d);
  res.setHours(Math.floor(localMinutes / 60) % 24, Math.round(localMinutes % 60), 0, 0);
  return res;
}

const fmt = (d) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function initSunset() {
  const container = document.getElementById('sunset-widget');
  if (!container) return;

  const [titleEl, badgeEl, descEl] = ['title', 'badge', 'desc'].map(k => document.getElementById(`sunset-${k}`));
  const shareBtn = document.getElementById('sunset-share-btn');

  function update() {
    const now = new Date(), day = now.getDay(), todaySunset = getSunset(now);
    const set = (t, b, d) => {
      if (titleEl) { titleEl.textContent = t; titleEl.removeAttribute('data-i18n'); }
      if (badgeEl) { badgeEl.textContent = b; badgeEl.removeAttribute('data-i18n'); }
      if (descEl) { descEl.textContent = d; descEl.removeAttribute('data-i18n'); }
    };

    if (day === 5 && now < todaySunset) {
      const diffMs = todaySunset - now;
      const h = Math.floor(diffMs / 3600000), m = Math.floor((diffMs % 3600000) / 60000);
      const countdown = h > 0 ? `Faltam ${h}h ${m}m para o Pôr do Sol` : `Faltam ${m} minutos para o Pôr do Sol`;
      set(countdown, 'Dia da Preparação',
        `O Santo Sábado se inicia hoje às ${fmt(todaySunset)}. Prepare o coração para o descanso sagrado de Deus.`);
    } else if (day === 5 && now >= todaySunset) {
      const satSunset = getSunset(new Date(now.getTime() + 86400000));
      set('✨ Feliz Sábado! Horas de paz e comunhão', 'Santo Sábado',
        `Descanse na doce presença do Criador. O sábado se encerra amanhã às ${fmt(satSunset)}. Venha adorar na IASD São Mateus!`);
    } else if (day === 6 && now < todaySunset) {
      set(`✨ Feliz Sábado! O sábado se encerra hoje às ${fmt(todaySunset)}`, 'Santo Sábado',
        'Celebre as bênçãos do Santo Sábado em comunhão e louvor na IASD São Mateus (Rua Antônio Previato, 1001).');
    } else if (day === 6 && now >= todaySunset) {
      const nextFri = new Date(now.getTime() + 6 * 86400000), nextSunset = getSunset(nextFri);
      set(`Uma semana abençoada! Próximo Sábado: ${fmt(nextSunset)}`, 'Semana de Comunhão',
        `Caminhe com Deus nesta nova semana. O próximo sábado começará sexta-feira às ${fmt(nextSunset)}.`);
    } else {
      const days = (5 - day + 7) % 7;
      const nextFri = new Date(now.getTime() + days * 86400000), nextSunset = getSunset(nextFri);
      const label = days === 1 ? 'amanhã (sexta-feira)' : `em ${days} dias (sexta-feira)`;
      set(`Próximo Pôr do Sol (Sexta): ${fmt(nextSunset)}`, 'IASD São Mateus',
        `Caminhe sob a paz e proteção de Cristo. O Santo Sábado começará ${label} às ${fmt(nextSunset)}.`);
    }
  }

  update();
  setInterval(update, 60000);
  window.addEventListener('languageChanged', update);

  if (shareBtn) {
    shareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const msg = '✨ *Feliz Sábado!* 🕊️\n\nQue a doce paz e o descanso deste Santo Sábado renovem o seu coração e a sua família!\n\n_"Lembra-te do dia do sábado, para o santificar."_ (Êxodo 20:8)\n\nCom carinho, seus amigos da *IASD São Mateus*\n📍 Rua Antônio Previato, 1001\n🌐 https://iasd-sao-mateus.vercel.app';
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    });
  }
}
