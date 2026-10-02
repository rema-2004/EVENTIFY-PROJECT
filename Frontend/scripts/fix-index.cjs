const fs = require('fs');
const p = 'c:/Users/abohu/OneDrive/Pulpit/event edit/Frontend/src/pages/app/index.jsx';
let content = fs.readFileSync(p, 'utf8');

// Fix the unclosed tags
content = content.replace(
    /<\/div>\s*<\/>/g,
    '</div></div></div></div></main><AppFooter /></>'
);

// Fix onClick
content = content.replace(
    /onClick="toggleRafeeq\(\)"/g,
    'onClick={toggleRafeeq}'
);

// Add dynamic class for rafeeq
content = content.replace(
    /<div className="mb-4 w-72 [^"]*" id="rafeeq-popup">/,
    '<div className={`mb-4 w-72 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-outline-variant/50 dark:border-white/15 overflow-hidden pointer-events-auto transition-all duration-500 ${isRafeeqOpen ? \\\'opacity-100 translate-y-0\\\' : \\\'opacity-0 translate-y-10\\\'}`} id="rafeeq-popup">'
);

fs.writeFileSync(p, content);
