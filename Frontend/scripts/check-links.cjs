const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../src');

function scanDir(dir) {
  let matches = [];
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      matches = matches.concat(scanDir(full));
    } else if (f.endsWith('.jsx') || f.endsWith('.js')) {
      const content = fs.readFileSync(full, 'utf8');
      const found = content.match(/href=["'][^"']*\.html[^"']*["']/g) || [];
      if (found.length > 0) {
        matches.push({ file: path.relative(srcDir, full), links: [...new Set(found)] });
      }
    }
  }
  return matches;
}

const allMatches = scanDir(srcDir);
console.log('Files with .html hrefs across all Frontend/src:');
for (const m of allMatches) {
  console.log(`- ${m.file} (${m.links.length} unique links): ${JSON.stringify(m.links)}`);
}
