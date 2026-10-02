const fs = require('fs');
const html = fs.readFileSync('c:/Users/abohu/OneDrive/Pulpit/event edit/UI-UX/app/index.html', 'utf8');
const mainMatch = html.match(/<main[\s\S]*?<\/main>/);
const rafeeqMatch = html.match(/<!-- AI Assistant: Rafeeq UI -->[\s\S]*?<\/div>\s*<\/div>/);
let jsx = mainMatch[0] + '\n' + (rafeeqMatch ? rafeeqMatch[0] : '');

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
