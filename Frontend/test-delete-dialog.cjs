const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/org/report-center', { waitUntil: 'networkidle' });
  const deleteBtn = page.locator('button[title="Delete"]').first();
  await deleteBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: 'C:/Users/abohu/.gemini/antigravity-ide/brain/f77d1880-5fa7-465b-9c5a-81953b473318/current_delete_dialog.png' });
  await browser.close();
  console.log('Screenshot saved!');
})();
