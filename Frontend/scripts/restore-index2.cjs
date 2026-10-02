const fs = require('fs');
const html = fs.readFileSync('c:/Users/abohu/OneDrive/Pulpit/event edit/UI-UX/app/index.html', 'utf8');

// Get main content
const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
let mainContent = mainMatch[0];

// Get rafeeq UI (from comment to the end of its root div)
// We know it's a fixed div at the bottom right.
// It ends with </div></div> before the </body>.
// Let's just use regex to match it.
const rafeeqStart = html.indexOf('<!-- AI Assistant: Rafeeq UI -->');
const bodyEnd = html.indexOf('</body>');
let rafeeqContent = html.substring(rafeeqStart, bodyEnd);
// Trim any trailing script tags or empty space
rafeeqContent = rafeeqContent.replace(/<script[\s\S]*?<\/script>/g, '').trim();

let jsx = mainContent + '\n<AppFooter />\n' + rafeeqContent;

jsx = jsx.replace(/class=/g, 'className=');
jsx = jsx.replace(/for=/g, 'htmlFor=');
jsx = jsx.replace(/<img([^>]*[^/])>/g, '<img$1 />');
jsx = jsx.replace(/<input([^>]*[^/])>/g, '<input$1 />');
jsx = jsx.replace(/<hr([^>]*[^/])>/g, '<hr$1 />');
jsx = jsx.replace(/<br([^>]*[^/])>/g, '<br$1 />');
jsx = jsx.replace(/onclick=/g, 'onClick=');

// Fix style
jsx = jsx.replace(/style="([^"]*)"/g, (match, p1) => {
    if (p1.includes('font-variation-settings')) {
        return 'style={{ fontVariationSettings: \'"FILL" 1\' }}'
    }
    return match;
});

// Convert HTML comments to JSX comments
jsx = jsx.replace(/<!--([\s\S]*?)-->/g, '{/*$1*/}');

// Fix rafeeq dynamic class and onclick
jsx = jsx.replace(
    /onClick="toggleRafeeq\(\)"/g,
    'onClick={toggleRafeeq}'
);
jsx = jsx.replace(
    /<div className="mb-4 w-72 [^"]*" id="rafeeq-popup">/,
    '<div className={`mb-4 w-72 bg-white dark:bg-slate-900/95 backdrop-blur-md rounded-xl shadow-2xl border border-outline-variant/50 dark:border-white/15 overflow-hidden pointer-events-auto transition-all duration-500 ${isRafeeqOpen ? \\\'opacity-100 translate-y-0\\\' : \\\'opacity-0 translate-y-10\\\'}`} id="rafeeq-popup">'
);

const out = `import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppPageHead from '../../components/app/AppPageHead'
import AppFooter from '../../components/app/AppFooter'

export default function AppHome() {
    const navigate = useNavigate()
    const openOpportunity = () => navigate('/app/opportunity')
    const [isRafeeqOpen, setIsRafeeqOpen] = useState(false)
    const [eventFilter, setEventFilter] = useState('all')
    const toggleRafeeq = () => setIsRafeeqOpen((isOpen) => !isOpen)
    const eventFilterButtonClass = (filter) =>
        \`pb-4 font-label-md transition-colors \${eventFilter === filter ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant dark:text-[#c3c6d7] hover:text-primary'}\`

    return (
        <>
            <AppPageHead title="EVENTIFY | AI-Powered Opportunity Hub" />
            ${jsx}
        </>
    )
}`;

fs.writeFileSync('c:/Users/abohu/OneDrive/Pulpit/event edit/Frontend/src/pages/app/index.jsx', out);
