import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context }) => {
  // Production bundle checks use no live database writes or authentication requests.
  await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
  await context.addInitScript(() => localStorage.setItem('language', 'en'));
});

for (const width of [1440, 390]) test(`login, navigation and Settings remain usable at ${width}`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('index.html');
  await expect(page.locator('html')).not.toHaveClass(/auth-pending/);
  await expect(page.locator('#login')).toBeVisible();
  await page.locator('#showSignup').click(); await expect(page.locator('#signup')).toBeVisible();
  await page.locator('#showLogin').click(); await expect(page.locator('#googleLogin')).toBeVisible();
  for (const name of ['about.html', 'products.html', 'contact.html', 'team.html']) {
    await page.goto(name);
    const header = page.locator('.background-content > header');
    // Simulate an interrupted legacy entrance animation; the static state stays visible.
    await header.evaluate(el => { for (const animation of el.getAnimations()) animation.cancel(); });
    expect(await header.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    await expect(page.locator('#settingsBtn')).toBeVisible();
    await expect(page.locator('.account-entry')).toHaveAttribute('href', /index.html$/);
    await page.locator('#settingsBtn').click(); await expect(page.locator('#settingsBtn')).toBeHidden();
    await page.keyboard.press('Escape'); await expect(page.locator('#settingsBtn')).toBeVisible();
    for (const theme of ['dark-legacy', 'light-legacy', 'dark', 'light']) {
      await page.locator('#settingsBtn').click();
      await page.locator(`.theme-btn[data-theme="${theme}"]`).click();
      await page.keyboard.press('Escape'); await expect(page.locator('#settingsBtn')).toBeVisible();
      expect(await header.evaluate(el => getComputedStyle(el).opacity)).toBe('1');
    }
    await page.screenshot({ path: `test-results/entry/${width}-${name}.png` });
  }
});

test('failed login bundle exposes a recovery screen and blocks native credential submission', async ({ page }) => {
  await page.route('**/assets/index-*.js', route => route.abort());
  await page.goto('index.html');
  await expect(page.locator('#authLoadError')).toBeVisible({ timeout: 12000 });
  await expect(page.locator('#login')).toBeVisible();
  await page.locator('#loginEmail').fill('test@example.test');
  await page.locator('#loginPassword').fill('never-send-this');
  await page.locator('#login button[type="submit"]').click();
  await expect(page).toHaveURL(/\/index.html$/);
  await expect(page.locator('#retryAuthLoad')).toBeVisible();
});

test('late auth initialization recovers after the bounded loading fallback', async ({ page }) => {
  let release; const gate = new Promise(resolve => { release = resolve; });
  await page.route('**/assets/index-*.js', async route => { await gate; await route.continue(); });
  await page.goto('index.html', { waitUntil: 'commit' });
  await expect(page.locator('#authLoadError')).toBeVisible({ timeout: 12000 });
  release();
  await expect(page.locator('#authLoadError')).toBeHidden();
  await page.locator('#showSignup').click(); await expect(page.locator('#signup')).toBeVisible();
});

test('reduced motion and RTL preserve header controls after navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.addInitScript(() => localStorage.setItem('language', 'ur'));
  await page.goto('products.html'); await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.locator('.account-entry').click(); await expect(page.locator('#login')).toBeVisible();
  await page.locator('.site-header a[href="about.html"]').click();
  await expect(page.locator('#settingsBtn')).toBeVisible();
  expect(await page.locator('.background-content > header').evaluate(el => getComputedStyle(el).opacity)).toBe('1');
});
