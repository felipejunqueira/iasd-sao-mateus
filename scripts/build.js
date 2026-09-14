const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function buildBundle() {
  const rootDir = path.join(__dirname, '..');
  const distDir = path.join(rootDir, 'dist');
  
  console.log('Copying static files to dist...');
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  
  const foldersToCopy = ['assets', 'css', 'data', 'js', 'partials'];
  for (const folder of foldersToCopy) {
    const src = path.join(rootDir, folder);
    const dest = path.join(distDir, folder);
    if (fs.existsSync(src)) copyDir(src, dest);
  }
  
  fs.copyFileSync(path.join(rootDir, 'index.html'), path.join(distDir, 'index.html'));
  
  const partialsDir = path.join(rootDir, 'partials');
  const files = fs.readdirSync(partialsDir).filter((f) => f.endsWith('.html')).sort();
  const content = files.map((f) => fs.readFileSync(path.join(partialsDir, f), 'utf8').trim()).join('\n\n');

  fs.writeFileSync(path.join(distDir, 'bundle.html'), content + '\n');
  console.log(`✔ dist/bundle.html gerado a partir de ${files.length} partials.`);
}

if (require.main === module) buildBundle();
module.exports = { buildBundle };
