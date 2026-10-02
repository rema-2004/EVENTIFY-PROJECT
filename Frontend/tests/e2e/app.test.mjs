import { test, before, after } from 'node:test'
import assert from 'node:assert/strict'
import { BASE, startApp, stopApp, newPage, bodyText } from './helpers.mjs'

let browser
before(async () => { browser = await startApp() })
after(async () => { await stopApp(browser) })

const ROUTES = [
    '/', '/about', '/contact', '/auth/login', '/auth/signup', '/auth/forgot-password',
    '/auth/organization-verification', '/auth/organization-pending', '/auth/privacy', '/auth/terms',
    '/app', '/app/explore', '/app/opportunity', '/app/teams', '/app/my-applications', '/app/saved', '/app/posts',
    '/app/notifications', '/app/profile', '/app/rafeeq',
    '/org/dashboard', '/org/posts', '/org/profile', '/org/opportunities', '/org/create-event', '/org/applicants',
    '/org/report-center', '/org/settings',
    '/admin/dashboard', '/admin/events', '/admin/users', '/admin/verify-organizations', '/admin/categories',
    '/admin/reports', '/admin/audit-log',
]

for (const route of ROUTES) {
    test(`route ${route} renders without errors`, async () => {
        const page = await newPage(browser)
        await page.goto(BASE + route, { waitUntil: 'networkidle' })
        const text = await bodyText(page)
        assert.ok(text.trim().length > 20, 'page is blank')
        assert.ok(!/page not found|coming soon/i.test(text), 'shows 404 / coming soon')
        assert.deepEqual(page.errors, [])
        await page.context().close()
    })
}

test('language toggle switches to Arabic RTL and back', async () => {
    const page = await newPage(browser)
    await page.goto(BASE + '/org/settings', { waitUntil: 'networkidle' })
    const english = await bodyText(page)
    await page.locator('.lang-toggle:visible').first().click()
    await page.waitForTimeout(600)
    assert.equal(await page.evaluate(() => document.documentElement.dir), 'rtl')
    assert.match(await bodyText(page), /[؀-ۿ]/)
    await page.locator('.lang-toggle:visible').first().click()
    await page.waitForTimeout(600)
    assert.equal(await page.evaluate(() => document.documentElement.dir), 'ltr')
    assert.equal(await bodyText(page), english, 'English text restored exactly')
    await page.context().close()
})

test('report preview downloads each format as its own file type', async () => {
    const page = await newPage(browser)
    await page.goto(BASE + '/org/report-center', { waitUntil: 'networkidle' })
    await page.locator('tbody tr').first().getByRole('button', { name: /^View / }).click()
    const types = []
    for (const label of ['PDF', 'Excel', 'CSV']) {
        const button = page.getByRole('button', { name: new RegExp(`download ${label}`, 'i') }).first()
        if (!(await button.isVisible().catch(() => false))) continue
        const [download] = await Promise.all([page.waitForEvent('download'), button.click()])
        types.push(download.suggestedFilename().split('.').pop())
    }
    assert.deepEqual(types, ['pdf', 'xls', 'csv'])
    await page.context().close()
})
