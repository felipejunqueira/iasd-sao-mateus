/**
 * Carregador Assíncrono de Componentes HTML (Filosofia Unix)
 * Carrega partials modulares em paralelo sem inflar o arquivo raiz
 */
export async function loadComponents() {
  const elements = Array.from(document.querySelectorAll('[data-include]'));
  if (elements.length === 0) return;

  await Promise.all(
    elements.map(async (el) => {
      const file = el.getAttribute('data-include');
      try {
        const res = await fetch(`${file}?v=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        el.outerHTML = html;
      } catch (err) {
        console.error(`Erro ao carregar componente ${file}:`, err);
      }
    })
  );
}
