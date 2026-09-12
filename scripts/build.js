/**
 * Compilador de Partials HTML (Filosofia Unix)
 * Concatena os componentes modulares de partials/ gerando index.html
 */
const fs = require('fs');
const path = require('path');

function buildHtml() {
  const partialsDir = path.join(__dirname, '..', 'partials');
  const files = fs.readdirSync(partialsDir)
    .filter((f) => f.endsWith('.html'))
    .sort();

  const content = files
    .map((f) => fs.readFileSync(path.join(partialsDir, f), 'utf8').trim())
    .join('\n\n');

  const targetPath = path.join(__dirname, '..', 'index.html');
  fs.writeFileSync(targetPath, content + '\n');
  console.log(`✔ index.html compilado com sucesso a partir de ${files.length} partials modulares.`);
}

if (require.main === module) {
  buildHtml();
}

module.exports = { buildHtml };
