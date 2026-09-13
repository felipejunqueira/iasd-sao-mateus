document.addEventListener('DOMContentLoaded', () => {
  // Inicializar Lucide Icons
  lucide.createIcons();

  // Observer para animar os cards de projeto ao scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Adiciona um delay cascata baseado no index do card
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 100);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Selecionar todos os cards e observar
  const cards = document.querySelectorAll('.project-card');
  cards.forEach(card => {
    observer.observe(card);
  });
});
