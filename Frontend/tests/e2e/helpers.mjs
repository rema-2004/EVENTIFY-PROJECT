import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const PORT = 4179
let server = null
export const BASE = process.env.BASE_URL || `http://localhost:${PORT}`

// Uses BASE_URL when given, otherwise starts its own Vite dev server on a private port.
export async function startApp() {
    if (!process.env.BASE_URL) {
        server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', '--port', String(PORT), '--strictPort'], { stdio: 'ignore' })
        for (let i = 0; i < 60; i++) {
            try { if ((await fetch(BASE)).ok) break } catch { /* not up yet */ }
            await new Promise((r) => setTimeout(r, 500))
        }
    }
    return chromium.launch({ channel: process.env.PW_CHANNEL || 'msedge' })
}

export async function stopApp(browser) {
    await browser?.close()
    server?.kill()
}

export async function newPage(browser) {
    const ctx = await browser.newContext({ acceptDownloads: true })
    const page = await ctx.newPage()
    page.setDefaultTimeout(10000)
    page.setDefaultNavigationTimeout(40000)
    page.errors = []
    page.on('pageerror', (e) => page.errors.push(e.message))
    return page
}

export const bodyText = (page) => page.evaluate(() => document.body.innerText)
