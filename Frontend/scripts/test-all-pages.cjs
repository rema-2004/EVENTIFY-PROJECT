const { chromium } = require('playwright');

const routes = [
  '/',
  '/about',
  '/contact',
  '/404',
  '/auth/login',
  '/auth/signup',
  '/auth/forgot-password',
  '/auth/organization-verification',
  '/auth/organization-pending',
  '/auth/privacy',
  '/auth/terms',
  '/app',
  '/app/explore',
  '/app/opportunity',
  '/app/participation-type',
  '/app/create-team',
  '/app/teams',
  '/app/team-dashboard',
  '/app/registration-success',
  '/app/my-applications',
  '/app/saved',
  '/app/posts',
  '/app/notifications',
  '/app/profile',
  '/app/rafeeq',
  '/app/rafeeq/voice',
  '/org/dashboard',
  '/org/posts',
  '/org/profile',
  '/org/opportunities',
  '/org/create-event',
  '/org/applicants',
  '/org/report-center',
  '/org/settings',
  '/admin/dashboard',
  '/admin/events',
  '/admin/event-review-details',
  '/admin/users',
  '/admin/verify-organizations',
  '/admin/categories',
  '/admin/reports',
  '/admin/audit-log'
];

async function run() {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch (err) {
    console.log('Chromium launch failed (browser not installed in playwright cache):', err.message);
    return;
  }

  const page = await browser.newPage();
  const errors = [];
  const warnings = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push({ url: page.url(), text: msg.text() });
    }
  });

  page.on('pageerror', err => {
    errors.push({ url: page.url(), text: 'PAGE_ERROR: ' + err.message });
  });

  const results = [];
  for (const r of routes) {
    errors.length = 0;
    try {
      const resp = await page.goto('http://localhost:5173' + r, { waitUntil: 'domcontentloaded', timeout: 5000 });
      // wait a tiny bit for useEffect
      await page.waitForTimeout(300);
      const title = await page.title();
      const currentErrors = [...errors];
      results.push({
        route: r,
        status: resp ? resp.status() : 'no-resp',
        title,
        errors: currentErrors
      });
    } catch (e) {
      results.push({
        route: r,
        status: 'CRASH',
        error: e.message
      });
    }
  }

  await browser.close();

  console.log('=== TEST RESULTS SUMMARY ===');
  let hasErrors = false;
  for (const res of results) {
    if (res.status !== 200 || (res.errors && res.errors.length > 0) || res.error) {
      hasErrors = true;
      console.log(`[FAIL] ${res.route}: status=${res.status}, error=${res.error || ''}, consoleErrors=${JSON.stringify(res.errors)}`);
    } else {
      console.log(`[PASS] ${res.route} ("${res.title}")`);
    }
  }
  if (!hasErrors) {
    console.log('\nAll ' + results.length + ' routes loaded successfully with 0 runtime errors!');
  }
}

run();
