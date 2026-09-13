/**
 * Carregador Assíncrono de Componentes HTML (Filosofia Unix)
 * Carrega partials modulares em paralelo sem inflar o arquivo raiz
 */
export async function loadComponents(root = document) {
  const elements = Array.from(root.querySelectorAll('[data-include]'));
  if (elements.length === 0) return;

  await Promise.all(
    elements.map(async (el) => {
      const file = el.getAttribute('data-include');
      try {
        const res = await fetch(`${file}?v=${Date.now()}`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const html = await res.text();
        
        // Renderize num conteiner temporario para checar partials aninhados
        const temp = document.createElement('div');
        temp.innerHTML = html;
        await loadComponents(temp); // chamando recursivamente
        
        el.outerHTML = temp.innerHTML;
      } catch (err) {
        console.error(`Erro ao carregar componente ${file}:`, err);
      }
    })
  );
}
