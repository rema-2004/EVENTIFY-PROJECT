/**
 * Phase 2: Remove inline navbars and bottom navs from pages
 * that now use the shared AppNavbar/AppBottomNav from AppLayout.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(import.meta.dirname, '..', 'src', 'pages', 'app')

function readFile(name) {
    return readFileSync(join(APP_DIR, name), 'utf-8')
}

function writeFile(name, content) {
    writeFileSync(join(APP_DIR, name), content, 'utf-8')
}

/**
 * Remove inline top navbar from pages that use the standard pattern.
 * The pattern is: {/* Top Navigation Bar * /} followed by <nav ...> ... </nav>
 */
function removeInlineNav(filename) {
    let content = readFile(filename)
    const origLength = content.length

    // Fix the broken return (\n  <AppPageHead... pattern (missing <> wrapper)
    // We need: return (\n        <>\n            <AppPageHead...
    content = content.replace(
        /return \(\r?\n\s*<AppPageHead/,
        'return (\n        <>\n            <AppPageHead'
    )

    // Remove {/* Top Navigation Bar */} comment + inline <nav> block
    // The nav block starts with <nav className="fixed top-0... and ends with </nav>
    const navStartPatterns = [
        /\s*\{\/\* Top Navigation Bar \*\/\}\r?\n/,
        /\s*\{\/\* Top Navigation Anchor \*\/\}\r?\n/,
    ]
    
    for (const pattern of navStartPatterns) {
        content = content.replace(pattern, '\n')
    }

    // Remove the full <nav className="fixed top-0 ... </nav> block for standard navbar pages
    // This is the 6-page standard navbar with glass-nav
    const navRegex = /\s*<nav className="fixed top-0 w-full z-50 (?:glass-nav|bg-surface\/80)[^"]*"[^>]*>\r?\n[\s\S]*?<\/nav>\r?\n/
    if (navRegex.test(content)) {
        content = content.replace(navRegex, '\n')
    }

    // Remove mobile bottom navigation blocks
    // Pattern: {/* Mobile Navigation ... */} <nav className="fixed bottom-0 ...> ... </nav>
    const bottomNavCommentPatterns = [
        /\s*\{\/\* Mobile Navigation[^*]*\*\/\}\r?\n/g,
    ]
    for (const pattern of bottomNavCommentPatterns) {
        content = content.replace(pattern, '\n')
    }
    
    // Remove the bottom nav element
    const bottomNavRegex = /\s*<nav className="fixed bottom-0 w-full rounded-t-xl[^"]*"[^>]*>\r?\n[\s\S]*?<\/nav>\r?\n/
    if (bottomNavRegex.test(content)) {
        content = content.replace(bottomNavRegex, '\n')
    }

    const removed = origLength - content.length
    console.log(`${filename}: removed ${removed} bytes of inline nav (${origLength} -> ${content.length})`)
    writeFile(filename, content)
}

// Pages with standard inline navbar to remove
const pagesWithNavbar = [
    'index.jsx',
    'explore.jsx',
    'posts.jsx',
    'opportunity.jsx',
    'my-applications.jsx',
]

for (const file of pagesWithNavbar) {
    try {
        removeInlineNav(file)
    } catch (err) {
        console.error(`Error processing ${file}:`, err.message)
    }
}

console.log('\nDone! Inline navbars removed.')
