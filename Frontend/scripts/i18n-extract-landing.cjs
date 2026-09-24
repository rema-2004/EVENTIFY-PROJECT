// One-off: pulls every translatable JSX text child out of Landing.jsx into
// src/i18n/locales/en.json under "landing", replacing it with {t('landing.sN')}.
const fs = require('fs')

const FILE = 'src/pages/visitor/Landing.jsx'
const lines = fs.readFileSync(FILE, 'utf8').split('\n')

const bodyStart = lines.findIndex((l) => l.trim() === '<div ref={rootRef}>') + 1
const bodyEnd = lines.length - 4 // drop trailing "</div>", ")", "}", ""

const isPureSymbolic = (s) => /^[\d.,%+$€\-\s–—]+$/.test(s)
const isJsxText = (raw) => {
    const s = raw.trim()
    if (!s) return false
    if (s === "{' '}") return false
    if (s.startsWith('<')) return false
    if (s.startsWith('{') && s !== "{' '}") return false
    if (s.startsWith('//')) return false
    if (isPureSymbolic(s)) return false
    return true
}

const manifest = {}
let counter = 0
const out = lines.slice()

for (let i = bodyStart; i < bodyEnd; i++) {
    const line = lines[i]
    if (!isJsxText(line)) continue
    const indent = line.match(/^\s*/)[0]
    const text = line.trim()
    counter += 1
    const key = `s${counter}`
    manifest[key] = text
    out[i] = `${indent}{t('landing.${key}')}`
}

fs.writeFileSync(FILE, out.join('\n'))

const enPath = 'src/i18n/locales/en.json'
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'))
en.landing = manifest
fs.writeFileSync(enPath, JSON.stringify(en, null, 4) + '\n')

console.log('extracted', counter, 'strings into landing.* (en.json)')
