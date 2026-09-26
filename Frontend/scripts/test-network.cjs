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
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const failedRequests = [];
  const status404s = [];

  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure() ? req.failure().errorText : 'failed' });
  });

  page.on('response', resp => {
    if (resp.status() >= 400) {
      status404s.push({ page: page.url(), url: resp.url(), status: resp.status() });
    }
  });

  for (const r of routes) {
    try {
      await page.goto('http://localhost:5173' + r, { waitUntil: 'networkidle', timeout: 7000 });
    } catch (e) {
      // ignore navigation timeout
    }
  }

  await browser.close();

  console.log('=== NETWORK RESOURCE AUDIT ===');
  console.log(`Failed requests count: ${failedRequests.length}`);
  if (failedRequests.length > 0) {
    console.log('Failed requests:', JSON.stringify(failedRequests.slice(0, 20), null, 2));
  }

  console.log(`HTTP >= 400 responses count: ${status404s.length}`);
  if (status404s.length > 0) {
    console.log('4xx/5xx responses:', JSON.stringify(status404s, null, 2));
  }
}

run();
