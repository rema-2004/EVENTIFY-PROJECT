/**
 * Refactoring script for participant page files.
 * Removes duplicated head sections, inline styles, and inline navbars.
 * Replaces them with shared component imports.
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const APP_DIR = join(import.meta.dirname, '..', 'src', 'pages', 'app')

// Helper to read file
function readFile(name) {
    return readFileSync(join(APP_DIR, name), 'utf-8')
}

// Helper to write file
function writeFile(name, content) {
    writeFileSync(join(APP_DIR, name), content, 'utf-8')
}

/**
 * For pages with the standard navbar pattern (index, explore, posts, opportunity, my-applications):
 * 1. Remove all <meta>, <link>, <style dangerouslySetInnerHTML> tags before the <main> or main content
 * 2. Remove the inline <nav> (top navigation)
 * 3. Remove the bottom <nav> (mobile navigation)
 * 4. Add AppPageHead import and component
 * 5. Fix <a href="*.html"> to <Link to="/app/*">
 */

function cleanPage(filename, pageTitle) {
    let content = readFile(filename)
    const origLength = content.length

    // 1. Remove all meta/link/style blocks before main content
    // Pattern: everything from <meta charSet to right before <main or the first semantic content
    
    // Remove individual problematic patterns
    // Remove <meta charSet="utf-8" />
    content = content.replace(/\s*<meta charSet="utf-8" \/>\r?\n?/g, '')
    // Remove <meta content="width=device-width..." />
    content = content.replace(/\s*<meta content="width=device-width[^"]*" name="viewport" \/>\r?\n?/g, '')
    // Remove <title>...</title>
    content = content.replace(/\s*<title>[^<]*<\/title>\r?\n?/g, '')
    // Remove <meta name="description" .../>
    content = content.replace(/\s*<meta\r?\n?\s*name="description"\r?\n?\s*content="[^"]*"\r?\n?\s*\/>\r?\n?/g, '')
    // Remove <meta property="og:title" .../>
    content = content.replace(/\s*<meta property="og:title" content="[^"]*" \/>\r?\n?/g, '')
    // Remove <meta property="og:description" .../>
    content = content.replace(/\s*<meta\r?\n?\s*property="og:description"\r?\n?\s*content="[^"]*"\r?\n?\s*\/>\r?\n?/g, '')
    // Remove <meta property="og:type" .../>
    content = content.replace(/\s*<meta property="og:type" content="[^"]*" \/>\r?\n?/g, '')
    // Remove <meta property="og:image" .../>
    content = content.replace(/\s*<meta property="og:image" content="[^"]*" \/>\r?\n?/g, '')
    // Remove <link rel="icon" .../>
    content = content.replace(/\s*<link rel="icon" href="[^"]*" type="[^"]*" \/>\r?\n?/g, '')
    // Remove <link rel="preconnect" .../>
    content = content.replace(/\s*<link rel="preconnect" href="[^"]*" \/>\r?\n?/g, '')
    content = content.replace(/\s*<link rel="preconnect" href="[^"]*" crossOrigin="" \/>\r?\n?/g, '')
    // Remove Google Fonts link
    content = content.replace(/\s*<link\r?\n?\s*href="https:\/\/fonts\.googleapis\.com\/css2[^"]*"\r?\n?\s*rel="stylesheet"\r?\n?\s*\/>\r?\n?/g, '')
    // Remove CSS link tags (nav.css, app-shell.css, theme.css)
    content = content.replace(/\s*<link rel="stylesheet" href="[^"]*(?:nav\.css|app-shell\.css|theme\.css)" \/>\r?\n?/g, '')
    // Remove {/* Global Theme Handler */} comment
    content = content.replace(/\s*\{\/\* Global Theme Handler \(Prevents FOUC in dark mode\) \*\/\}\r?\n?/g, '')
    // Remove {/* comments */} for Tailwind/Google Fonts/Material Symbols/Theme
    content = content.replace(/\s*\{\/\* (?:Tailwind CSS|Google Fonts|Material Symbols|Theme Configuration) \*\/\}\r?\n?/g, '')
    
    // Remove ALL <style dangerouslySetInnerHTML> blocks
    content = content.replace(/\s*<style\r?\n?\s*dangerouslySetInnerHTML=\{\{[\s\S]*?\}\}\r?\n?\s*\/>\r?\n?/g, '')

    // 2. Add AppPageHead after return ( <>
    if (!content.includes('AppPageHead')) {
        content = content.replace(
            /return \(\r?\n?\s*<>/,
            `return (\n        <>\n            <AppPageHead title="${pageTitle}" />`
        )
    }

    // 3. Add import for AppPageHead if not present
    if (!content.includes("import AppPageHead")) {
        // Add after last import
        const lastImport = content.lastIndexOf('\nimport ')
        if (lastImport !== -1) {
            const endOfImportLine = content.indexOf('\n', lastImport + 1)
            content = content.slice(0, endOfImportLine + 1) +
                "import AppPageHead from '../../components/app/AppPageHead'\n" +
                content.slice(endOfImportLine + 1)
        }
    }

    // 4. Fix data-alt to alt on images
    content = content.replace(/data-alt="/g, 'alt="')

    // 5. Report changes
    const removed = origLength - content.length
    console.log(`${filename}: removed ${removed} bytes (${origLength} -> ${content.length})`)

    writeFile(filename, content)
}

// Process each page
const pages = [
    ['index.jsx', 'EVENTIFY | AI-Powered Opportunity Hub'],
    ['explore.jsx', 'Explore | EVENTIFY'],
    ['posts.jsx', 'Posts | EVENTIFY'],
    ['opportunity.jsx', 'Opportunity | EVENTIFY'],
    ['my-applications.jsx', 'My Event | EVENTIFY'],
    ['saved.jsx', 'Saved | EVENTIFY'],
    ['profile.jsx', 'Profile | EVENTIFY'],
    ['notifications.jsx', 'Notifications | Eventify AI'],
    ['rafeeq.jsx', 'Rafeeq AI | EVENTIFY'],
    ['teams.jsx', 'Eventify - Available Teams'],
    ['team-dashboard.jsx', 'Team Dashboard | EVENTIFY'],
    ['create-team.jsx', 'Create Team | EVENTIFY'],
    ['participation-type.jsx', 'Eventify - Participation Type'],
    ['registration-success.jsx', 'Eventify - Registration Successful'],
]

for (const [file, title] of pages) {
    try {
        cleanPage(file, title)
    } catch (err) {
        console.error(`Error processing ${file}:`, err.message)
    }
}

console.log('\nDone! All pages cleaned.')
