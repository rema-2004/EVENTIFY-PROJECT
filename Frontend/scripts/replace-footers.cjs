const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/abohu/OneDrive/Pulpit/event edit/Frontend/src/pages/app';

const pagesWithFooter = [
    'explore.jsx',
    'posts.jsx',
    'opportunity.jsx',
    'my-applications.jsx'
];

for (const file of pagesWithFooter) {
    const p = path.join(dir, file);
    let content = fs.readFileSync(p, 'utf8');
    
    // Replace the entire <footer className="footer">...</footer> block with <AppFooter />
    // It's usually near the end of the file, right after </main> or before </div>
    const footerRegex = /<footer className="footer">[\s\S]*?<\/footer>/;
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, '<AppFooter />');
        
        // ensure import is present
        if (!content.includes("import AppFooter")) {
            content = "import AppFooter from '../../components/app/AppFooter';\n" + content;
        }
        
        fs.writeFileSync(p, content);
        console.log('Replaced footer in', file);
    }
}
