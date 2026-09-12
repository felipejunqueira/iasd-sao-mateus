/**
 * Construtor Opcional de Bundle Estático (Filosofia Unix)
 * Gera dist/bundle.html sem modificar o index.html modular raiz
 */
const fs = require('fs');
const path = require('path');

function buildBundle() {
  const partialsDir = path.join(__dirname, '..', 'partials');
  const distDir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

  const files = fs.readdirSync(partialsDir).filter((f) => f.endsWith('.html')).sort();
  const content = files.map((f) => fs.readFileSync(path.join(partialsDir, f), 'utf8').trim()).join('\n\n');

  fs.writeFileSync(path.join(distDir, 'bundle.html'), content + '\n');
  console.log(`✔ dist/bundle.html gerado a partir de ${files.length} partials.`);
}

if (require.main === module) buildBundle();
module.exports = { buildBundle };
