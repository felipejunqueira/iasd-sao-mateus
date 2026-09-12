/**
 * Carregador do Widget Oficial VLibras (Língua Brasileira de Sinais)
 */

export function initVLibras() {
  try {
    const div = document.createElement('div');
    div.setAttribute('vw', '');
    div.className = 'enabled';
    div.innerHTML = `
      <div vw-access-button class="active" aria-label="Libras" role="button" tabindex="0"></div>
      <div vw-plugin-wrapper><div class="vw-plugin-top-wrapper"></div></div>
    `;
    document.body.appendChild(div);

    const script = document.createElement('script');
    script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
    script.async = true;
    script.onload = () => {
      if (window.VLibras) {
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };
    document.body.appendChild(script);
  } catch {}
}
