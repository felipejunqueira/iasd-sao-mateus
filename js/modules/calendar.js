/**
 * Módulo de Agenda & Eventos - IASD São Mateus (Filosofia Unix < 90 linhas)
 */
let allEvents = [];

function getGoogleCalUrl(ev) {
  const p = new URLSearchParams({
    action: 'TEMPLATE', text: ev.title, dates: `${ev.startIso}/${ev.endIso}`,
    details: `${ev.description}\n\nLocal: ${ev.location}`, location: ev.location
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

function shareOnWhatsApp(ev) {
  const msg = encodeURIComponent(`📅 *${ev.title}*\n🗓 ${ev.dateFormatted} (${ev.time})\n📍 ${ev.location}\n\n${ev.description}\n\nVenha nos visitar na IASD São Mateus!`);
  window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
}

function renderEvents(filter = 'todos') {
  const container = document.getElementById('events-container');
  if (!container) return;
  const list = filter === 'todos' ? allEvents : allEvents.filter(e => e.category.toLowerCase() === filter.toLowerCase());
  if (!list.length) {
    container.innerHTML = '<p class="events-empty">Nenhum evento agendado para esta categoria.</p>';
    return;
  }
  container.innerHTML = list.map(ev => `
    <article class="event-card event-card-${ev.category}" data-id="${ev.id}">
      <div class="event-date-col">
        <span class="event-day">${ev.day}</span>
        <span class="event-month">${ev.month}</span>
      </div>
      <div class="event-body">
        <div class="event-meta">
          <span class="event-badge badge-${ev.category}">${ev.categoryLabel}</span>
          <span class="event-time">⏰ ${ev.time}</span>
        </div>
        <h3 class="event-title">${ev.title}</h3>
        <p class="event-desc">${ev.description}</p>
        <div class="event-location">📍 ${ev.location}</div>
        <div class="event-actions">
          <a href="${getGoogleCalUrl(ev)}" target="_blank" rel="noopener noreferrer" class="btn-event btn-gcal">+ Google Agenda</a>
          <button type="button" class="btn-event btn-wa" data-wa="${ev.id}">WhatsApp</button>
        </div>
      </div>
    </article>
  `).join('');

  container.querySelectorAll('.btn-wa').forEach(btn => {
    btn.onclick = () => {
      const ev = allEvents.find(e => e.id === btn.dataset.wa);
      if (ev) shareOnWhatsApp(ev);
    };
  });
}

export async function initCalendar() {
  const container = document.getElementById('events-container');
  if (!container) return;
  try {
    const res = await fetch('data/events.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    allEvents = (data.events || []).sort((a, b) => new Date(a.date) - new Date(b.date));
    renderEvents('todos');

    const filterBtns = document.querySelectorAll('.event-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        renderEvents(btn.dataset.filter || 'todos');
      });
    });
  } catch (err) {
    console.error('Erro ao carregar calendário:', err);
    container.innerHTML = '<p class="events-empty">Programação em atualização.</p>';
  }
}