#!/usr/bin/env node
// One-off tool: converts a static EVENTIFY HTML page's <body> into a JSX fragment string.
// Usage: node scripts/html-to-jsx.js <path-to-html> [--out <file>]
// It does NOT try to be a general HTML->JSX compiler; it targets the known quirks of
// this specific codebase (Tailwind classes, Material Symbols spans, data-* attrs, FA icons).

const fs = require('fs')
const path = require('path')
const parse5 = require('parse5')
const ROUTES = require('./routes-map.cjs')

const VOID_ELEMENTS = new Set([
    'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
    'link', 'meta', 'param', 'source', 'track', 'wbr',
])

const ATTR_RENAME = {
    class: 'className',
    for: 'htmlFor',
    tabindex: 'tabIndex',
    readonly: 'readOnly',
    maxlength: 'maxLength',
    minlength: 'minLength',
    autocomplete: 'autoComplete',
    autofocus: 'autoFocus',
    autoplay: 'autoPlay',
    contenteditable: 'contentEditable',
    crossorigin: 'crossOrigin',
    srcset: 'srcSet',
    enctype: 'encType',
    spellcheck: 'spellCheck',
    novalidate: 'noValidate',
    frameborder: 'frameBorder',
    allowfullscreen: 'allowFullScreen',
    colspan: 'colSpan',
    rowspan: 'rowSpan',
    usemap: 'useMap',
    cellpadding: 'cellPadding',
    cellspacing: 'cellSpacing',
    accesskey: 'accessKey',
    charset: 'charSet',
    datetime: 'dateTime',
    formnovalidate: 'formNoValidate',
}

function jsxAttrName(name) {
    if (name.startsWith('data-') || name.startsWith('aria-')) return name
    if (name === 'xmlns') return name
    return ATTR_RENAME[name] || name
}

function escapeText(text) {
    return text.replace(/[{}]/g, (c) => `{'${c}'}`)
}

function styleStringToObject(styleStr) {
    const decls = styleStr.split(';').map((s) => s.trim()).filter(Boolean)
    const props = decls.map((decl) => {
        const idx = decl.indexOf(':')
        if (idx === -1) return null
        let prop = decl.slice(0, idx).trim()
        const value = decl.slice(idx + 1).trim()
        prop = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
        if (prop.startsWith('Webkit') || prop.startsWith('Moz') || prop.startsWith('Ms') || prop.startsWith('O')) {
            prop = prop[0].toLowerCase() + prop.slice(1)
        }
        const jsValue = /^-?\d+(\.\d+)?$/.test(value) ? value : JSON.stringify(value)
        return `${JSON.stringify(prop)}: ${jsValue}`
    }).filter(Boolean)
    return `{{${props.join(', ')}}}`
}

let usedLink = false

function resolveAssetPath(value) {
    return value.replace(/^(\.\.\/)+assets\//, '/assets/').replace(/^assets\//, '/assets/')
}

// Returns { jsxTag, hrefAttr } — jsxTag is 'Link'+attr 'to', or null to keep <a href>.
function resolveHref(href) {
    if (!href) return null
    if (/^(#|mailto:|tel:|https?:\/\/|\/\/)/.test(href)) return null
    const [pathPart, hash] = href.split('#')
    const clean = pathPart.replace(/^(\.\.\/)+/, '').replace(/\/$/, '')
    const segments = clean.split('/').filter(Boolean)
    const filename = segments[segments.length - 1] || ''
    const dir = segments.length > 1 ? segments[segments.length - 2] : null
    const base = filename.replace(/\.html$/, '')

    if (base === 'index' && dir === 'app') return '/app' + (hash ? `#${hash}` : '')
    if (ROUTES[base]) return ROUTES[base] + (hash ? `#${hash}` : '')
    return null
}

function serializeAttrs(attrs, tag) {
    return attrs.map((attr) => {
        let attrName = attr.name
        let value = attr.value
        const name = jsxAttrName(attrName)
        if (name === 'style') {
            return ` style={${styleStringToObject(value).slice(1, -1)}}`
        }
        if ((tag === 'img' || tag === 'source') && (name === 'src' || name === 'srcSet')) {
            value = resolveAssetPath(value)
        }
        if (tag === 'a' && name === 'href') {
            const resolved = resolveHref(value)
            if (resolved !== null) {
                usedLink = true
                return ` __LINK_TO__=${JSON.stringify(resolved)}`
            }
        }
        const BOOLEAN_ATTRS = new Set([
            'disabled', 'checked', 'readOnly', 'required', 'selected', 'multiple',
            'autoFocus', 'autoPlay', 'controls', 'loop', 'muted', 'noValidate', 'hidden',
        ])
        if (value === '' && BOOLEAN_ATTRS.has(name)) return ` ${name}`
        return ` ${name}=${JSON.stringify(value)}`
    }).join('')
}

function nodeToJsx(node, indent) {
    const pad = '  '.repeat(indent)
    if (node.nodeName === '#text') {
        const text = node.value
        if (!text.trim()) return ''
        // JSX only auto-inserts a space within one contiguous string literal; text and an
        // adjacent inline element are separate children, so a source-significant space at
        // the boundary (e.g. "Right <span>Opportunity</span> for") must be kept explicitly
        // or the words run together in the rendered output.
        const leading = /^\s/.test(text) ? `${pad}{' '}\n` : ''
        const trailing = /\s$/.test(text) ? `${pad}{' '}\n` : ''
        return leading + pad + escapeText(text.trim()) + '\n' + trailing
    }
    if (node.nodeName === '#comment') {
        return pad + `{/* ${node.data.trim()} */}\n`
    }
    let tag = node.tagName
    if (!tag) return ''
    let attrs = serializeAttrs(node.attrs || [], tag)
    if (tag === 'a' && attrs.includes('__LINK_TO__=')) {
        tag = 'Link'
        attrs = attrs.replace('__LINK_TO__=', 'to=')
    }
    const children = (node.childNodes || [])
    const childHtml = children.map((c) => nodeToJsx(c, indent + 1)).join('')

    if (VOID_ELEMENTS.has(tag)) {
        return `${pad}<${tag}${attrs} />\n`
    }
    if (!childHtml.trim()) {
        return `${pad}<${tag}${attrs}></${tag}>\n`
    }
    return `${pad}<${tag}${attrs}>\n${childHtml}${pad}</${tag}>\n`
}

function main() {
    const file = process.argv[2]
    if (!file) {
        console.error('usage: node html-to-jsx.js <file.html> [--out out.jsx] [--body-only]')
        process.exit(1)
    }
    const html = fs.readFileSync(file, 'utf8')
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/)
    let fragmentHtml = bodyMatch ? bodyMatch[1] : html
    // <script>/<style> blocks are ported by hand (JS -> hooks, CSS -> its own file);
    // leaving them in would get mangled by the JSX serializer.
    fragmentHtml = fragmentHtml
        .replace(/<script[^>]*>[\s\S]*?<\/script>/g, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/g, '')
    const fragment = parse5.parseFragment(fragmentHtml)
    const jsx = fragment.childNodes.map((n) => nodeToJsx(n, 0)).join('')

    const outIdx = process.argv.indexOf('--out')
    if (outIdx !== -1) {
        fs.writeFileSync(process.argv[outIdx + 1], jsx)
        console.error('wrote', process.argv[outIdx + 1], usedLink ? '(uses <Link>, add the react-router-dom import)' : '')
    } else {
        process.stdout.write(jsx)
    }
}

main()
