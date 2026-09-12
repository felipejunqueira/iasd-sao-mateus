/**
 * Cálculo inteligente do próximo culto da IASD São Mateus
 */

export function initNextService() {
  const titleEl = document.getElementById('next-service-title');
  const descEl = document.getElementById('next-service-desc');
  if (!titleEl || !descEl) return;

  const now = new Date();
  const day = now.getDay();
  const hours = now.getHours();

  let title = "Próximo Encontro";
  let desc = "Venha adorar conosco presencialmente na Rua Antônio Previato, 1001.";

  if (day === 6) { // Sábado
    if (hours < 9) {
      title = "Hoje às 09:00 • Escola Sabatina";
      desc = "Estudo interativo da Bíblia e lição em classes para todas as idades.";
    } else if (hours < 12) {
      title = "Hoje às 10:15 • Culto Divino";
      desc = "Celebração solene, louvor e mensagem inspiradora da Palavra de Deus.";
    } else if (hours < 18) {
      title = "Hoje às 17:00 • Culto Jovem (JA)";
      desc = "Encontro dinâmico dos jovens, música contemporânea e comunhão.";
    } else {
      title = "Domingo às 19:00 • Culto da Família";
      desc = "Uma palavra de esperança e bênção para o seu lar.";
    }
  } else if (day === 0) { // Domingo
    if (hours < 19) {
      title = "Hoje às 19:00 • Culto da Família";
      desc = "Mensagem prática da Bíblia para começar bem a sua semana.";
    } else {
      title = "Quarta-feira às 20:00 • Culto de Oração";
      desc = "Momento de intercessão e fortalecimento espiritual.";
    }
  } else if (day === 3) { // Quarta
    if (hours < 20) {
      title = "Hoje às 20:00 • Culto de Oração & Bíblia";
      desc = "Pausa semanal para orar e estudar os ensinamentos de Cristo.";
    } else {
      title = "Sábado às 09:00 • Escola Sabatina";
      desc = "O sábado do Senhor se aproxima! Esperamos por você.";
    }
  } else if (day === 4 || day === 5) {
    title = "Sábado às 09:00 • Escola Sabatina & Culto";
    desc = "Prepare seu coração para um dia sagrado de paz e adoração.";
  } else {
    title = "Quarta-feira às 20:00 • Culto de Oração";
    desc = "Estudo bíblico e oração comunitária.";
  }

  titleEl.innerText = title;
  descEl.innerText = desc;
}
