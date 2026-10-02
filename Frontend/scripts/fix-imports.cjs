const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/abohu/OneDrive/Pulpit/event edit/Frontend/src/pages/app';
for (const file of fs.readdirSync(dir)) {
    if (file.endsWith('.jsx') && file !== 'AppLayout.jsx') {
        const p = path.join(dir, file);
        let content = fs.readFileSync(p, 'utf8');
        if (content.includes('<AppPageHead') && !content.includes('import AppPageHead')) {
            content = "import AppPageHead from '../../components/app/AppPageHead';\n" + content;
            fs.writeFileSync(p, content);
            console.log('Fixed import in', file);
        }
        
        // Also fix the HTML comments in index.jsx that break JSX
        if (file === 'index.jsx') {
            let idxContent = fs.readFileSync(p, 'utf8');
            idxContent = idxContent.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');
            fs.writeFileSync(p, idxContent);
        }
    }
}
