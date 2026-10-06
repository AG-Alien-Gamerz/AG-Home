import { test, expect } from '@playwright/test';
import { LANGUAGES } from '../src/js/language-data.js';
import { privacyTranslations } from '../src/js/privacy-translations.js';
import { THEMES } from '../src/js/theme-model.js';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/package.json', import.meta.url));
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
process.env.GCLOUD_PROJECT = 'demo-ag-home';
const { getApps, getApp, initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const app = getApps().length ? getApp() : initializeApp({projectId:'demo-ag-home'});
const db = getFirestore(app), auth = getAuth(app);
const password = 'TestPassword123!';
const organizationSeed=require('../functions/team-seed.json');
for(const width of [1440,768,390])test(`Team history and connected organization controls work at ${width}`,async({page})=>{
    await page.setViewportSize({width,height:1000});await page.goto('team.html');
    await expect(page.locator('.timeline-member')).toHaveCount(1);await expect(page.locator('.timeline-dates')).toContainText('1 May 2024');await expect(page.locator('.timeline-dates')).toContainText('Present');
    await expect(page.locator('#organizationMap [data-node-id=ag]')).toHaveText('AG');await expect(page.locator('.person-node')).toHaveCount(1);
    await page.locator('#teamStatus').selectOption('former');await expect(page.locator('#teamTimeline')).toHaveText('No former members.');await page.locator('#teamStatus').selectOption('current');
    await page.locator('#teamYear').selectOption('2024');await expect(page.locator('.timeline-member')).toHaveCount(1);
    const map=page.locator('#organizationMap');await map.getByRole('button',{name:/^Zoom in$/i}).click();await expect(page.locator('#organizationViewport')).toHaveAttribute('data-zoom','1.15');await map.getByRole('button',{name:/^Zoom out$/i}).click();
    await map.getByRole('button',{name:'Collapse · Frontend',exact:true}).click();await expect(page.locator('.person-node')).toHaveCount(0);
    await expect(map.getByRole('button',{name:'Expand · Frontend',exact:true})).toBeFocused();
    await page.locator('.timeline-member').getByRole('button',{name:'Mind Map',exact:true}).click();await expect(page.locator('.person-node')).toHaveCount(1);await expect(page.locator('.person-node')).toHaveAttribute('aria-pressed','true');
    await expect(page.locator('#teamProfile')).toContainText('Muhammad Hamza Sabir');await page.locator('#teamProfile').getByRole('button',{name:'Team History',exact:true}).click();await expect(page.locator('.timeline-member h3')).toBeFocused();
    await map.getByRole('button',{name:'Reset View',exact:true}).click();await expect(page.locator('#organizationViewport')).toHaveAttribute('data-zoom','1');
    for(let i=0;i<6;i++)await map.getByRole('button',{name:/^Zoom in$/i}).click();const viewport=page.locator('#organizationViewport');await viewport.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>viewport.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
    await viewport.scrollIntoViewIfNeeded();await viewport.evaluate(el=>el.scrollLeft=0);const bounds=await viewport.boundingBox();await page.mouse.move(bounds.x+12,bounds.y+bounds.height-12);await page.mouse.down();await page.mouse.move(bounds.x-78,bounds.y+bounds.height-12);await page.mouse.up();await expect.poll(()=>viewport.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();await page.screenshot({path:`test-results/organization-${width}.png`,fullPage:true,animations:'disabled'});
    await page.evaluate(async()=>{const {setCurrentLanguage}=await import('/AG-Home/js/localization.js');setCurrentLanguage('ur');});await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect(page.locator('.timeline-dates')).toContainText('تاحال');await expect(page.locator('#organizationMap [data-node-id=frontend]')).toHaveText('فرنٹ اینڈ');await page.screenshot({path:`test-results/organization-rtl-${width}.png`,fullPage:true,animations:'disabled'});
});
test('administrator changes propagate to About, timeline and map while preserving membership and transfers',async({page,context})=>{
    await login(page);await page.goto('control.html');await page.locator('#teamManagementLink').click();
    const visitor=await context.newPage();await visitor.goto('team.html');
    await page.locator('.team-admin-list .team-admin-row').getByRole('button',{name:/Edit/}).click();
    await page.locator('#teamMemberForm-role').fill('Lead Developer & Software Engineer');await page.locator('#teamMemberForm-file').setInputFiles('public/team/muhammad-hamza-sabir.png');await expect(page.locator('.team-avatar-preview')).toHaveAttribute('src',/^data:image\/webp/);await page.locator('#teamMemberForm-nodeId').selectOption('backend');await page.locator('#teamMemberForm-transferDate').fill('2025-01-01');await page.locator('#teamMemberForm button[type=submit]').click();await expect(page.locator('.team-editor').first()).not.toHaveAttribute('open','');
    await expect(visitor.locator('.team-path')).toHaveText('Backend');await expect(visitor.locator('.timeline-dates')).toContainText('Present');
    await visitor.locator('.person-node').click();await expect(visitor.locator('.profile-avatar')).toHaveAttribute('src',/^data:image\/webp/);await expect(visitor.locator('.assignment-history')).toContainText('Frontend Team');await expect(visitor.locator('.assignment-history')).toContainText('Backend');
    await page.locator('.team-admin-list .team-admin-row').getByRole('button',{name:/Edit/}).click();await page.locator('#teamMemberForm-status').selectOption('former');await page.locator('#teamMemberForm-endDate').fill('2025-12-31');await page.locator('#teamMemberForm button[type=submit]').click();
    await expect(visitor.locator('.team-status')).toHaveText('Former Team');await expect(visitor.locator('.person-node')).toHaveCount(0);await visitor.locator('#mapMembership').selectOption('all');await expect(visitor.locator('.person-node')).toHaveCount(1);
    await db.doc('organization/main').set(organizationSeed);await visitor.goto('about.html');await expect(visitor.locator('#aboutTeamMembers')).toContainText('Muhammad Hamza Sabir');await expect(visitor.locator('.team-portrait img')).toBeVisible();await visitor.close();
});
test('organization labels and dates adapt to every configured language',async({page})=>{
    await page.goto('team.html');for(const [language,meta] of Object.entries(LANGUAGES)){await page.evaluate(async lang=>{const {setCurrentLanguage}=await import('/AG-Home/js/localization.js');setCurrentLanguage(lang);},language);await expect(page.locator('html')).toHaveAttribute('dir',meta[1]);await expect(page.locator('.timeline-member')).toHaveCount(1);await expect(page.locator('.timeline-dates')).not.toContainText('org.present');await expect(page.locator('.organization-toggle').first()).not.toContainText('org.collapse');}
});
test('Team Management adds a branch and concurrent member without terminating existing membership',async({page,context})=>{
    await login(page);await page.goto('control.html');await page.locator('#teamManagementLink').click();
    try{
        await page.locator('#teamManagement > .team-actions').getByRole('button',{name:'Organization Structure',exact:true}).click();
        await page.locator('#teamNodeForm-name').fill('Browser-only research branch');await page.locator('#teamNodeForm-type').selectOption('department');await page.locator('#teamNodeForm-parentId').selectOption('ag');await page.locator('#teamNodeForm button[type=submit]').click();await expect(page.locator('.team-node-list')).toContainText('Browser-only research branch');
        await page.locator('#teamManagement > .team-actions').getByRole('button',{name:/Add/}).click();await page.locator('#teamMemberForm-name').fill('Browser-only concurrent member');await page.locator('#teamMemberForm-role').fill('Test-only researcher');await page.locator('#teamMemberForm-startDate').fill('2026-10-05');
        const node=(await db.doc('organization/main').get()).data().nodes.find(n=>n.name==='Browser-only research branch');await page.locator('#teamMemberForm-nodeId').selectOption(node.id);await page.locator('#teamMemberForm-bio').fill('This record exists only in the demo test database.');await page.locator('#teamMemberForm button[type=submit]').click();await expect(page.locator('.team-admin-list .team-admin-row')).toHaveCount(2);
        const visitor=await context.newPage();await visitor.goto('team.html');await expect(visitor.locator('.timeline-member')).toHaveCount(2);await expect(visitor.locator('.person-node')).toHaveCount(2);await expect(visitor.locator('.timeline-dates').filter({hasText:'Present'})).toHaveCount(2);await visitor.locator('#teamDepartment').selectOption(node.id);await expect(visitor.locator('.timeline-member')).toHaveCount(1);await expect(visitor.locator('.timeline-member')).toContainText('Browser-only concurrent member');await visitor.close();
    }finally{await db.doc('organization/main').set(organizationSeed);}
});
for(const width of [1440,768,390])test(`CSV contact map, search and location stay on site at ${width}`,async({page,context})=>{
    await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:24.961,longitude:67.133});
    await page.setViewportSize({width,height:900});await page.goto('contact.html');await expect(page.locator('html')).not.toHaveClass(/site-loading/);
    await expect(page.locator('.contact-channel')).toHaveCount(2);
    const email=page.locator('.contact-channel').last();await email.locator('button').focus();await expect(email.locator('a')).toHaveCount(2);await expect(email.locator('a').first()).toBeVisible();await expect(email.locator('a').last()).toHaveAttribute('href','mailto:ag.aliengamerz@hotmail.com');
    await page.keyboard.press('Escape');await expect(email.locator('.channel-menu')).toBeHidden();
    await page.locator('#openOfficeMap').click();await expect(page.locator('#officeMapModal')).toHaveAttribute('role','dialog');await expect(page.locator('.office-list-item')).toHaveCount(1);
    await expect(page.locator('.office-list-item')).toContainText('Headquarters');await expect(page.locator('.office-list-item')).toContainText('24.959269');
    await page.locator('#officeSearch').fill('Head Quater');await expect(page.locator('.office-list-item')).toHaveCount(1);await page.locator('#officeSearch').fill('missing');await expect(page.locator('.office-list-item')).toHaveCount(0);
    await page.locator('#officeSearch').fill('');await page.locator('.office-list-item').click();await expect(page.locator('.leaflet-popup')).toBeVisible();await expect(page.locator('.leaflet-popup')).toContainText('Demonstration');
    await page.locator('#locateMe').click();await expect(page.locator('#locationStatus')).toHaveText('Your location');await expect(page).toHaveURL(/contact.html/);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.screenshot({path:`test-results/contact-map-${width}.png`,animations:'disabled'});
    await page.evaluate(async()=>{const {setCurrentLanguage}=await import('/AG-Home/js/localization.js');setCurrentLanguage('ur');});
    await expect(page.locator('#officeMapTitle')).toHaveText('AG دفاتر');await page.locator('#officeSearch').fill('مرکزی');await expect(page.locator('.office-list-item')).toHaveCount(1);await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await page.screenshot({path:`test-results/contact-map-rtl-${width}.png`,animations:'disabled'});
    await page.keyboard.press('Escape');await expect(page.locator('#officeMapModal')).toBeHidden();await expect(page.locator('#openOfficeMap')).toBeFocused();
});
test('map permissions and CSV failure have usable localized recovery states',async({page})=>{
    await page.addInitScript(()=>{navigator.geolocation.getCurrentPosition=(success,error)=>error({code:1});});
    await page.route('**/data/offices.csv',route=>route.fulfill({status:503,body:'unavailable'}));
    await page.goto('contact.html');await page.locator('#openOfficeMap').click();await expect(page.locator('#mapStatus')).toContainText('Office data');
    await page.unroute('**/data/offices.csv');await page.locator('#mapStatus + button').click();await expect(page.locator('.office-list-item')).toHaveCount(1);
    await page.locator('#locateMe').click();await expect(page.locator('#locationStatus')).toContainText('Allow location access');
});
test('products use one category filter and broken images receive a real fallback',async({page})=>{
    await db.doc('products/test-catalogue').update({image:'https://example.test/missing.png'});
    await page.goto('products.html');await expect(page.locator('#productCategory')).toHaveCount(1);await expect(page.locator('.wheel-disclosure')).toBeHidden();
    const card=page.locator('.product-card[data-product-id="test-catalogue"]');await expect(card.locator('.product-monogram')).toBeVisible();await expect(card.locator('.product-image img')).toHaveCount(0);
    await db.doc('products/test-catalogue').update({image:null});
});
test('brief loader respects reduced motion and disappears after initial rendering',async({page})=>{
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.route('**/js/home.js',async route=>{await new Promise(resolve=>setTimeout(resolve,500));await route.continue();});
    await page.goto('about.html',{waitUntil:'commit'});await expect(page.locator('html')).toHaveClass(/site-loading/);
    expect(await page.evaluate(()=>getComputedStyle(document.documentElement,'::after').animationName)).toBe('none');
    await expect(page.locator('html')).not.toHaveClass(/site-loading/);await expect(page.locator('.brand').first()).toBeVisible();
});
test('phone failure shows billing guidance and sends a safe feedback report on request',async({page})=>{
    await page.goto('index.html');
    await page.route('**/accounts:sendVerificationCode?*',route=>route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:{code:400,message:'BILLING_NOT_ENABLED'}})}));
    await page.locator('#phoneLogin').click();await page.locator('#phoneNumber').fill('+923001234567');await page.locator('#sendPhoneOTPBtn').click();
    await expect(page.locator('#phoneErrorHelp')).toBeVisible();await expect(page.locator('#phoneErrorHelp p')).not.toBeEmpty();
    const previous=(await db.collection('messages').where('source','==','auth-error').get()).size;
    await page.locator('#phoneErrorHelp button').click();await expect(page.locator('#phoneErrorHelp')).toBeHidden();
    await expect.poll(async()=>(await db.collection('messages').where('source','==','auth-error').get()).size).toBe(previous+1);
    const records=await db.collection('messages').where('source','==','auth-error').get();expect(records.docs.every(doc=>!JSON.stringify(doc.data()).includes('+923001234567'))).toBeTruthy();
});
test('unavailable auth reporting never claims a successful feedback submission',async({page})=>{
    await page.goto('index.html');
    await page.route('**/accounts:sendVerificationCode?*',route=>route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({error:{code:400,message:'BILLING_NOT_ENABLED'}})}));
    await page.route('**/reportAuthError',route=>route.fulfill({status:503,contentType:'application/json',body:JSON.stringify({error:{status:'UNAVAILABLE',message:'Unavailable'}})}));
    await page.locator('#phoneLogin').click();await page.locator('#phoneNumber').fill('+923001234567');await page.locator('#sendPhoneOTPBtn').click();
    await expect(page.locator('#phoneErrorHelp')).toBeVisible();
    const previous=(await db.collection('messages').where('source','==','auth-error').get()).size;
    await page.locator('#phoneErrorHelp button').click();
    await expect(page.locator('#phoneErrorHelp')).toBeVisible();
    await expect(page.locator('.toast').last()).toContainText(/unavailable|دستیاب/);
    expect((await db.collection('messages').where('source','==','auth-error').get()).size).toBe(previous);
});
test('notification settings do not request permission automatically and explain missing configuration',async({page})=>{
    await login(page);await page.locator('#settingsBtn').click();await expect(page.locator('#notificationsEnabled')).not.toBeChecked();
    expect(await page.evaluate(()=>Notification.permission)).toBe('default');
    await page.locator('#notificationsEnabled').check();await expect(page.locator('#notificationStatus')).not.toBeEmpty();await expect(page.locator('#notificationsEnabled')).not.toBeChecked();
});
for (const width of [1440,390]) test(`About header and four saved themes work at ${width}`,async({page})=>{
    await page.setViewportSize({width,height:900}); await page.goto('about.html');
    await expect(page.locator('.background-content > header .brand')).toHaveCount(1);
    const headerBox=await page.locator('.background-content > header').boundingBox();
    if (width>700) expect(headerBox.width).toBeGreaterThan(1000);
    const settingsBox=await page.locator('#settingsBtn').boundingBox();
    expect(settingsBox.x).toBeGreaterThanOrEqual(headerBox.x);expect(settingsBox.x+settingsBox.width).toBeLessThanOrEqual(headerBox.x+headerBox.width+1);
    await page.locator('#settingsBtn').click(); await expect(page.locator('.theme-btn')).toHaveCount(4);
    for (const theme of THEMES) {
        await page.locator(`.theme-btn[data-theme="${theme.id}"]`).click();
        await expect(page.locator('body')).toHaveAttribute('data-theme',theme.id);
        await expect(page.locator(`.theme-btn[data-theme="${theme.id}"]`)).toHaveAttribute('aria-pressed','true');
        expect(await page.evaluate(()=>getComputedStyle(document.documentElement).colorScheme)).toBe(theme.scheme);
        if (theme.id==='dark-legacy') {
            await expect(page.locator('body')).toHaveCSS('background-color','rgb(16, 16, 16)');
            await expect(page.locator('#settingsModal .modal-content')).toHaveCSS('background-color','rgb(25, 25, 25)');
        }
        if (theme.id==='light-legacy') await expect(page.locator('body')).toHaveCSS('background-color','rgb(255, 255, 255)');
        await page.locator('#closeSettings').click(); await page.reload();
        await expect(page.locator('html')).toHaveAttribute('data-theme',theme.id);
        await page.screenshot({path:`test-results/about-${theme.id}-${width}.png`,animations:'disabled'});
        await page.locator('#settingsBtn').click();
    }
    await page.locator('#languageSelect').selectOption('ur'); await page.locator('#closeSettings').click();
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
});
test('username login validates credentials privately and preserves email verification gating',async({page})=>{
    const account=await user('username-login@example.test');
    await db.doc('users/'+account.uid).set({email:account.email,username:'AG.Login',usernameKey:'ag.login',role:'USER',rank:'USER'});
    await page.goto('index.html'); await page.locator('#loginEmail').fill('missing.username');await page.locator('#loginPassword').fill(password);await page.locator('#login button[type=submit]').click();
    await expect(page.locator('.toast').last()).toContainText('incorrect');
    await page.locator('#loginEmail').fill('ag.LOGIN');await page.locator('#loginPassword').fill('WrongPassword123!');await page.locator('#login button[type=submit]').click();await expect(page.locator('.toast').last()).toContainText('incorrect');
    await page.locator('#loginPassword').fill(password);await page.locator('#login button[type=submit]').click();await expect(page).toHaveURL(/home.html/);
    await page.locator('#settingsBtn').click();await page.locator('#logoutBtn').click();
    await auth.updateUser(account.uid,{emailVerified:false});
    await page.locator('#loginEmail').fill('AG.Login');await page.locator('#loginPassword').fill(password);await page.locator('#login button[type=submit]').click();
    await expect(page.locator('#verificationNotice')).toBeVisible();await expect(page).toHaveURL(/index.html/);
    expect(await page.evaluate(async()=>(await import('/AG-Home/js/firebase-config.js')).auth.currentUser)).toBeNull();
});
test('phone SMS forms support Enter, invalid-code retry, cooldown and real emulator verification',async({page,request})=>{
    await page.goto('index.html');await page.locator('#phoneLogin').click();
    await page.locator('#phoneNumber').fill('03001234567');await page.locator('#phoneNumber').press('Enter');await expect(page.locator('.toast').last()).toContainText('phone');
    const phone='+1650555'+String(Date.now()).slice(-4);
    await page.locator('#phoneNumber').fill(phone.slice(0,2)+' '+phone.slice(2));await page.locator('#phoneNumber').press('Enter');
    await expect(page.locator('#phoneLoginStep2')).toBeVisible();await expect(page.locator('#phoneStatus')).toContainText('SMS');await expect(page.locator('#resendPhoneOTPBtn')).toBeDisabled();
    const response=await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-ag-home/verificationCodes');
    const verification=(await response.json()).verificationCodes.find(item=>item.phoneNumber===phone);expect(verification).toBeTruthy();
    await page.locator('#otpCode').fill(verification.code==='000000'?'111111':'000000');await page.locator('#otpCode').press('Enter');await expect(page.locator('.toast').last()).toContainText('code');
    await page.locator('#otpCode').fill(verification.code);await page.locator('#otpCode').press('Enter');await expect(page).toHaveURL(/products.html/);
    await expect.poll(()=>page.evaluate(async()=>(await import('/AG-Home/js/firebase-config.js')).auth.currentUser?.phoneNumber)).toBe(phone);
    const current=await page.evaluate(async()=>{const user=(await import('/AG-Home/js/firebase-config.js')).auth.currentUser;return {phone:user.phoneNumber,email:user.email};});expect(current.phone).toBe(phone);expect(current.email).toBeNull();
    await page.goto('home.html');await expect(page).toHaveURL(/products.html/);
});
test('phone dialog Escape clears OTP state and can reopen safely',async({page,request})=>{
    await page.goto('index.html');await page.locator('#phoneLogin').click();await page.locator('#phoneNumber').fill('+16505550199');await page.locator('#sendPhoneOTPBtn').click();await expect(page.locator('#phoneLoginStep2')).toBeVisible();
    await page.locator('#otpCode').fill('123456');await page.keyboard.press('Escape');await expect(page.locator('#phoneLoginModal')).toBeHidden();
    await page.locator('#phoneLogin').click();await expect(page.locator('#phoneLoginStep1')).toBeVisible();await expect(page.locator('#otpCode')).toHaveValue('');await expect(page.locator('#sendPhoneOTPBtn')).toBeDisabled();
    await page.clock.install();await page.clock.fastForward(61000);await expect(page.locator('#sendPhoneOTPBtn')).toBeEnabled();await page.locator('#phoneNumber').press('Enter');await expect(page.locator('#phoneLoginStep2')).toBeVisible();
});
for (const width of [1440,768,390]) test(`privacy navigation and document scroll independently at ${width}`, async ({page}) => {
    await page.setViewportSize({width,height:850}); await page.goto('privacy.html');
    const pane = page.locator('#privacyDocument'), list = page.locator('.privacy-nav ul');
    await expect(page.locator('.privacy-section')).toHaveCount(11);
    await expect(page.locator('.privacy-table tbody tr')).toHaveCount(6);
    await expect(page.locator('.privacy-nav a[aria-current=location]')).toHaveAttribute('href','#introduction');
    await page.screenshot({path:`test-results/privacy-overview-${width}.png`,animations:'disabled'});
    const original = await pane.evaluate(el=>el.scrollTop);
    await list.evaluate(el=>{el.scrollTop=el.scrollHeight;el.scrollLeft=el.scrollWidth;});
    expect(await pane.evaluate(el=>el.scrollTop)).toBe(original);
    await page.locator('.privacy-nav a[href="#data-security"]').click();
    await expect.poll(()=>pane.evaluate(el=>el.scrollTop)).toBeGreaterThan(100);
    await expect(page.locator('.privacy-nav a[href="#data-security"]')).toHaveAttribute('aria-current','location');
    await page.emulateMedia({reducedMotion:'reduce'});
    await pane.evaluate(el=>{el.scrollTop=el.scrollHeight;});
    await expect(page.locator('.privacy-nav a[href="#acknowledgment"]')).toHaveAttribute('aria-current','location');
    expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1 && document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.screenshot({path:`test-results/privacy-${width}.png`,animations:'disabled'});
    await page.evaluate(async()=>{const {setCurrentLanguage}=await import('/AG-Home/js/localization.js');setCurrentLanguage('ur');const {setTheme}=await import('/AG-Home/js/theme.js');setTheme('dark');});
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await expect(page.locator('#privacyDocument')).toHaveAttribute('dir','ltr');
    await expect(page.locator('#privacyQuickLinks')).toHaveText(privacyTranslations.ur['privacy.quickLinks']);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.screenshot({path:`test-results/privacy-rtl-${width}.png`,animations:'disabled'});
});
test('privacy sidebar contains wheel scrolling and keyboard anchors work in a short viewport', async ({page})=>{
    await page.setViewportSize({width:1440,height:500}); await page.goto('privacy.html');
    const list=page.locator('.privacy-nav ul'), pane=page.locator('#privacyDocument');
    await list.hover(); await page.mouse.wheel(0,600);
    await expect.poll(()=>list.evaluate(el=>el.scrollTop)).toBeGreaterThan(0);
    expect(await pane.evaluate(el=>el.scrollTop)).toBe(0);
    await page.mouse.wheel(0,600); expect(await pane.evaluate(el=>el.scrollTop)).toBe(0);
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('.privacy-nav a[href="#cookies"]').focus(); await page.keyboard.press('Enter');
    await expect(page.locator('.privacy-nav a[href="#cookies"]')).toHaveAttribute('aria-current','location');
    await expect(pane).toBeFocused(); await expect(page).toHaveURL(/#cookies$/);
    await page.goBack(); await expect(page.locator('.privacy-nav a[href="#introduction"]')).toHaveAttribute('aria-current','location');
});
test('privacy navigation translates for all configured languages', async ({page})=>{
    await page.goto('privacy.html');
    for (const [code, [,direction]] of Object.entries(LANGUAGES)) {
        await page.evaluate(async language=>{const {setCurrentLanguage}=await import('/AG-Home/js/localization.js');setCurrentLanguage(language);},code);
        await expect(page.locator('html')).toHaveAttribute('dir',direction);
        await expect(page.locator('#privacyQuickLinks')).toHaveText(privacyTranslations[code]['privacy.quickLinks']);
        for (const link of await page.locator('.privacy-nav a').all()) {
            const key = await link.getAttribute('data-i18n'); await expect(link).toHaveText(privacyTranslations[code][key]);
        }
    }
});
test('platform filter combines search/category, includes multi-platform products and follows snapshots', async({page})=>{
    const ids=['filter-multi','filter-linux','filter-legacy'];
    const multi={name:'Filter AG Multi',description:'Filter fixture',category:'Filter fixtures',platforms:{website:true,windows:true,android:true},links:{website:'https://example.com',windows:'https://example.com/windows',android:'https://example.com/android'}};
    try {
        await db.collection('products').doc(ids[0]).set(multi);
        await db.collection('products').doc(ids[1]).set({name:'Filter AG Linux',category:'Other fixtures',platforms:{linux:true},links:{linux:'https://example.com/linux'}});
        await db.collection('products').doc(ids[2]).set({name:'Filter AG Legacy',category:'Filter fixtures',productLink:'https://example.com'});
        await page.goto('products.html');
        await expect(page.locator('#productPlatform option')).toHaveCount(7);
        await page.locator('#productSearch').fill('Filter AG');
        await expect(page.locator('.product-card')).toHaveCount(3);
        for (const platform of ['windows','android']) {
            await page.locator('#productPlatform').selectOption(platform);
            await expect(page.locator('.product-card')).toHaveCount(1);
            await expect(page.locator('.product-name')).toHaveText(multi.name);
            await expect(page.locator('.platform-badge')).toHaveCount(3);
        }
        await page.locator('#productPlatform').selectOption('website'); await expect(page.locator('.product-card')).toHaveCount(2);
        await page.locator('#productPlatform').selectOption('linux'); await expect(page.locator('.product-card')).toHaveCount(1);
        await page.locator('#productCategory').selectOption('Filter fixtures'); await expect(page.locator('.no-products')).toBeVisible();
        await db.collection('products').doc(ids[0]).update({'platforms.linux':true,'links.linux':'https://example.com/linux'});
        await expect(page.locator('.product-card')).toHaveCount(1);
        await expect(page.locator('.platform-badge')).toHaveCount(4);
        await page.evaluate(async()=>{const {setCurrentLanguage}=await import('/AG-Home/js/localization.js');setCurrentLanguage('ur');});
        await expect(page.locator('#productPlatform')).toHaveValue('linux'); await expect(page.locator('#productCategory')).toHaveValue('Filter fixtures');
        await expect(page.locator('#productPlatform option[value=android]')).toHaveText('اینڈرائیڈ ایپلیکیشن');
        await page.locator('#productPlatform').selectOption('ALL'); await expect(page.locator('.product-card')).toHaveCount(2);
        await page.locator('#productSearch').fill('nothing matches'); await expect(page.locator('.no-products')).toBeVisible();
    } finally { for (const id of ids) await db.collection('products').doc(id).delete(); }
});
async function user(email, verified = true) {
    try { const found = await auth.getUserByEmail(email); return await auth.updateUser(found.uid,{password,emailVerified:verified}); }
    catch { return await auth.createUser({email,password,emailVerified:verified}); }
}
async function login(page,email = 'ag.aliengamerz@gmail.com') {
    await page.goto('index.html'); await page.locator('#loginEmail').fill(email); await page.locator('#loginPassword').fill(password);
    await page.locator('#login button[type=submit]').click(); await expect(page).toHaveURL(/home.html/);
}
test.beforeAll(async () => {
    await db.doc('catalogue/main').delete();
    await db.doc('organization/main').set(organizationSeed);
    for (const document of (await db.collection('_authReports').get()).docs) await document.ref.delete();
    for (const document of (await db.collection('products').get()).docs) await document.ref.delete();
    await user('ag.aliengamerz@gmail.com'); await user('member@example.test');
    const platforms = {website:true,windows:true,linux:true,chromeOS:true,android:true,apple:true};
    await db.collection('products').doc('test-catalogue').set({ name:'AG Test Product',name_en:'AG Test Product',name_ur:'اے جی آزمائشی پروڈکٹ',category:'Software',category_en:'Software',category_ur:'سافٹ ویئر',description:'Useful software for your workflow.',description_en:'Useful software for your workflow.',description_ur:'آپ کے کام کے لیے مفید سافٹ ویئر۔',price:0,stock:-1,rating:4,tags:['software'],image:null,schemaVersion:2,platforms,links:Object.fromEntries(Object.keys(platforms).map(key=>[key,'https://example.com/'+key])),downloadSite:{enabled:true,url:'https://example.com/download'},productLink:'https://example.com/website',downloadLink:'https://example.com/download',version:'1.0',status:'available' });
});
test.beforeEach(async ({context}) => {
    await context.addInitScript(() => { if (!localStorage.getItem('language')) localStorage.setItem('language','en'); });
    await context.route('**/*', route => {
        const url = new URL(route.request().url());
        return ['127.0.0.1','localhost'].includes(url.hostname) ? route.continue() : route.abort();
    });
});
for (const width of [1440,768,390]) test(`public pages and signup fit viewport ${width}`, async ({page}) => {
    await page.setViewportSize({width,height:1000}); const errors=[]; page.on('pageerror',error=>errors.push(error.message));
    for (const path of ['index.html','products.html','about.html','contact.html','privacy.html']) {
        await page.goto(path); await expect(page.locator('body')).toBeVisible();
        await expect(page.locator('#agCharacter')).toBeAttached();
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
        if (path === 'products.html') { await expect(page.locator('.product-card').first()).toBeVisible(); await page.screenshot({path:`test-results/products-${width}.png`,fullPage:true,animations:'disabled'}); }
    }
    await page.goto('index.html'); await page.locator('#showSignup').click(); await expect(page.locator('#signup')).toBeVisible();
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBeTruthy();
    await page.screenshot({path:`test-results/signup-${width}.png`,fullPage:true,animations:'disabled'}); expect(errors).toEqual([]);
});
test('every configured language translates forms and uses the correct direction', async ({page}) => {
    await page.goto('index.html'); await page.locator('#settingsBtn').click();
    const rtl=['ur','ar','pa','ps','bal','sd','hnd','skr'];
    for (const lang of ['en','ur','ar','tr','ja','zh','pa','ps','bal','fr','es','de','sd','hnd','skr','hi','ur_roman','bn','ru','it','pt','ko','id']) {
        await page.locator('#languageSelect').selectOption(lang);
        await expect(page.locator('html')).toHaveAttribute('dir',rtl.includes(lang)?'rtl':'ltr');
        const text = await page.locator('[data-i18n="character.timer"]').textContent();
        expect(text.trim()).not.toBe('character.timer'); if(lang !== 'en') expect(text).not.toBe('Character Sleep Timer (minutes)');
    }
    await page.locator('#languageSelect').selectOption('ur'); await page.locator('#closeSettings').click(); await page.screenshot({path:'test-results/index-rtl.png',fullPage:true,animations:'disabled'});
});
test('character privacy, torch, matching, gender and draggable position persist', async ({page}) => {
    await page.goto('index.html');await page.clock.install(); const input=page.locator('#loginPassword'); await input.fill('PrivateExample!123');
    await expect(page.locator('#agCharacter')).toHaveClass(/eyes-closed/);
    await page.locator('#login .password-torch').click(); await expect(input).toHaveAttribute('type','text'); await expect(page.locator('#agCharacter')).toHaveClass(/eyes-closed/);
    await page.clock.fastForward(8100);await expect(input).toHaveAttribute('type','password');await expect(page.locator('#agCharacter')).toHaveClass(/eyes-closed/);
    await page.locator('#login .password-torch').click();await expect(input).toHaveAttribute('type','text');
    await page.locator('#login .password-torch').click(); await expect(input).toHaveAttribute('type','password');
    await page.locator('#showSignup').click(); await page.locator('#signupPassword').fill(password); await page.locator('#signupConfirm').fill('Mismatch!1');
    await expect(page.locator('#passwordMatch')).toHaveText('Passwords do not match.');
    await page.locator('#signupConfirm').fill(password); await expect(page.locator('#passwordMatch')).toHaveText('Passwords match.'); await expect(page.locator('#agCharacter')).toHaveClass(/eyes-closed/);
    await page.locator('#settingsBtn').click(); await page.locator('#characterGender').selectOption('female'); await page.locator('#characterTimer').fill('1'); await page.locator('#characterTimer').dispatchEvent('change'); await page.locator('#glassMode').selectOption('fixed'); await page.locator('#closeSettings').click();
    await expect(page.locator('#agCharacter')).toHaveAttribute('data-gender','female');
    const lens=page.locator('.robot-glass');await expect(lens).toBeVisible();const lensStart=await lens.boundingBox();
    await page.mouse.move(lensStart.x+15,lensStart.y+15);await page.mouse.down();await page.mouse.move(300,200,{steps:8});await page.mouse.up();
    const fixed=await lens.boundingBox();expect((await page.evaluate(()=>JSON.parse(localStorage.getItem('ag.character')))).glassPosition).toBeTruthy();
    const robot=page.locator('#agCharacter'), rect=await robot.boundingBox(); await page.mouse.move(rect.x+45,rect.y+50);await page.mouse.down(); await page.mouse.move(180,300,{steps:8});await page.mouse.up();
    expect((await lens.boundingBox()).x).toBeCloseTo(fixed.x,0);
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ag.character')));expect(saved.position).toBeTruthy();
    await page.reload();await expect(robot).toHaveAttribute('data-gender','female');const after=await robot.boundingBox();expect(after.x).toBeLessThan(250);
    await page.clock.fastForward(61000);await expect(robot).toHaveAttribute('data-state','sleep');
    await page.locator('#loginEmail').click();await expect(robot).toHaveAttribute('data-state','awake');
});
test('signup, verification, reset action and protected access use Firebase emulator', async ({page,request}) => {
    const email='signup-'+Date.now()+'@example.test';
    await page.goto('index.html'); await page.locator('#showSignup').click();
    for(const [id,value] of Object.entries({firstName:'Test',secondName:'Example',username:'test.user',signupEmail:email,dob:'2000-01-01',signupPassword:password,signupConfirm:password})) await page.locator('#'+id).fill(value);
    await page.locator('#signupConfirm').fill('WrongPassword123!');await page.locator('#signup button[type=submit]').click();
    await expect(page).toHaveURL(/index.html/);await expect(page.locator('#passwordMatch')).toHaveText('Passwords do not match.');
    await expect(auth.getUserByEmail(email)).rejects.toThrow();await page.locator('#signupConfirm').fill(password);
    await page.locator('#signup button[type=submit]').click();await expect(page.locator('#verificationNotice')).toBeVisible();await expect(page).toHaveURL(/index.html/);await expect(page.locator('#verificationMessage')).toContainText('Verification email sent');
    expect(await page.evaluate(async()=> (await import('/AG-Home/js/firebase-config.js')).auth.currentUser)).toBeNull();
    await expect(page.locator('#verificationNotice .email-delivery-tip')).toContainText('Spam or Junk');
    const account=await auth.getUserByEmail(email);expect((await db.collection('users').doc(account.uid).get()).data().secondName).toBe('Example');
    await page.goto('control.html');await expect(page).toHaveURL(/index.html/);
    await page.locator('#loginPassword').fill(password);await page.locator('#login button[type=submit]').click();await expect(page.locator('#verificationMessage')).toHaveText('Email not verified');
    await expect.poll(()=>page.evaluate(async()=> (await import('/AG-Home/js/firebase-config.js')).auth.currentUser===null)).toBeTruthy();
    await page.evaluate(uid=>sessionStorage.removeItem('ag.verifySent.'+uid),account.uid);
    await page.locator('#loginPassword').fill(password);await page.locator('#resendVerification').click();await expect(page.locator('#verificationMessage')).toContainText('Verification email sent');
    await expect(page.locator('#verificationNotice .email-delivery-tip')).toContainText('Spam or Junk');
    await expect.poll(()=>page.evaluate(async()=> (await import('/AG-Home/js/firebase-config.js')).auth.currentUser===null)).toBeTruthy();
    const codes=await (await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-ag-home/oobCodes')).json();
    const verification=codes.oobCodes.filter(c=>c.email===email&&c.requestType==='VERIFY_EMAIL').at(-1);expect(verification).toBeTruthy();
    await page.goto('auth-action.html?mode=verifyEmail&oobCode='+encodeURIComponent(verification.oobCode));await expect(page.locator('#actionStatus')).toHaveText('Email verified');
    await login(page,email);await expect(page.locator('#verificationBanner')).toHaveCount(0);await page.locator('#settingsBtn').click();await expect(page.locator('#settingsEmailStatus')).toHaveText('Email verified');await expect(page.locator('#settingsEmailStatus')).toHaveCSS('font-size','12.8px');await page.locator('#logoutBtn').click();await expect(page).toHaveURL(/index.html/);
    await page.locator('#showReset').click();await page.locator('#resetEmail').fill(email);await page.locator('#resetForm button[type=submit]').click();await expect(page.locator('.toast')).toContainText('instructions have been sent');
    await expect(page.locator('#resetPanel .email-delivery-tip')).toContainText('Spam or Junk');
    const resets=await (await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-ag-home/oobCodes')).json();const reset=resets.oobCodes.find(c=>c.email===email&&c.requestType==='PASSWORD_RESET');expect(reset).toBeTruthy();
    await page.goto('auth-action.html?mode=resetPassword&oobCode='+encodeURIComponent(reset.oobCode));await expect(page.locator('#actionReset')).toBeVisible();await page.locator('#actionPassword').fill('NewTestPassword456!');await page.locator('#actionConfirm').fill('NewTestPassword456!');await page.locator('#actionReset button[type=submit]').click();await expect(page.locator('#actionStatus')).toHaveText('Success');
    await page.goto('auth-action.html?mode=resetPassword&oobCode='+encodeURIComponent(reset.oobCode));await expect(page.locator('#actionStatus')).toContainText('invalid');
    await page.goto('auth-action.html?mode=resetPassword&oobCode=malformed');await expect(page.locator('#actionStatus')).toContainText('invalid');
});
test('authenticated entry redirect and selective logout preserve preferences', async ({page}) => {
    await login(page,'member@example.test');await page.goto('index.html');await expect(page).toHaveURL(/home.html/);
    await page.evaluate(()=>{localStorage.setItem('theme','dark');localStorage.setItem('unrelated','keep');sessionStorage.setItem('ag.session','test');document.cookie='ag_session=test;path=/';document.cookie='unrelated_cookie=keep;path=/';});
    await page.locator('#settingsBtn').click();await page.locator('#logoutBtn').click();await expect(page).toHaveURL(/index.html/);
    const state=await page.evaluate(()=>({theme:localStorage.getItem('theme'),unrelated:localStorage.getItem('unrelated'),session:sessionStorage.getItem('ag.session'),cookies:document.cookie}));
    expect(state.theme).toBe('dark');expect(state.unrelated).toBe('keep');expect(state.session).toBeNull();expect(state.cookies).not.toContain('ag_session');expect(state.cookies).toContain('unrelated_cookie');
    await page.goto('control.html');await expect(page).toHaveURL(/index.html/);
});
test('product editor supports all platforms, clears disabled links and catalogue updates live', async ({page,context}) => {
    await login(page); await page.goto('control.html#product-management');await expect(page.locator('html')).not.toHaveClass(/auth-pending/);
    const catalogue=await context.newPage();await catalogue.goto('products.html');await expect(catalogue.locator('.product-card').first()).toBeVisible();
    await page.evaluate(()=>window.openAddProductModal());const form=page.locator('#addProductForm');await expect(form.locator('[data-platform]')).toHaveCount(6);
    for(const [id,value] of Object.entries({productNameEn:'Live Test '+Date.now(),productNameUr:'آزمائشی سافٹ ویئر',productCategoryEn:'Software',productCategoryUr:'سافٹ ویئر',productPrice:'0'}))await page.locator('#'+id).fill(value);
    const name=await page.locator('#productNameEn').inputValue();
    for(const id of ['website','windows','linux','chromeOS','android','apple']){await page.locator('#product-'+id).check();await page.locator('#product-'+id+'-url').fill('https://example.com/'+id);}
    await page.locator('#product-downloadSite').check();await page.locator('#product-downloadSite-url').fill('https://example.com/download');
    await page.locator('#product-linux').uncheck();await expect(page.locator('#product-linux-url')).toHaveValue('');await expect(page.locator('#product-linux-url')).toBeHidden();
    await page.locator('#product-linux').check();await page.locator('#product-linux-url').fill('https://example.com/linux');
    page.on('dialog',dialog=>dialog.accept());await form.locator('button[type=submit]').click();await expect(page.locator('#addProductModal')).toBeHidden();
    const card=catalogue.locator('.product-card').filter({hasText:name});await expect(card).toBeVisible();await expect(card.locator('.platform-badge')).toHaveCount(6);await expect(card.locator('a.primary-btn')).toHaveAttribute('href','https://example.com/download');
    const snapshot=await db.collection('products').where('name','==',name).get();const reference=snapshot.docs[0].ref;
    await reference.update({name_en:'Updated '+name,links:{website:'https://example.com/new',windows:'https://example.com/windows',linux:'https://example.com/linux',chromeOS:'https://example.com/chromeOS',android:'https://example.com/android',apple:'https://example.com/apple'}});
    await expect(catalogue.locator('.product-card').filter({hasText:'Updated '+name})).toBeVisible();
    await page.evaluate(id=>window.editProduct(id),reference.id);await expect(page.locator('#editProductModal')).toBeVisible();
    await expect(page.locator('#editProductPrice')).toHaveValue('0');
    await page.locator('#editProduct-windows').uncheck();await expect(page.locator('#editProduct-windows-url')).toHaveValue('');
    await page.locator('#editProduct-downloadSite').uncheck();await expect(page.locator('#editProduct-downloadSite-url')).toHaveValue('');
    await page.locator('#editProductForm button[type=submit]').click();await expect(page.locator('#editProductModal')).toBeHidden();
    const edited=catalogue.locator('.product-card').filter({hasText:'Updated '+name});await expect(edited.locator('.platform-badge')).toHaveCount(5);await expect(edited.locator('a.primary-btn')).toHaveCount(0);
    await page.screenshot({path:'test-results/control-desktop.png',fullPage:true,animations:'disabled'});await catalogue.close();
});

import { createHmac } from 'node:crypto';
function totp(key) {
    const alphabet='ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'; let bits='';
    for(const char of key.replace(/=|\s/g,'').toUpperCase()) bits+=alphabet.indexOf(char).toString(2).padStart(5,'0');
    const bytes=[]; for(let i=0;i+8<=bits.length;i+=8)bytes.push(parseInt(bits.slice(i,i+8),2));
    const counter=Buffer.alloc(8);counter.writeBigUInt64BE(BigInt(Math.floor(Date.now()/30000)));
    const digest=createHmac('sha1',Buffer.from(bytes)).update(counter).digest();const offset=digest.at(-1)&15;
    return String((digest.readUInt32BE(offset)&0x7fffffff)%1000000).padStart(6,'0');
}
test('email change requires reauthentication and confirms through a Firebase action',async({page,request})=>{
    const email='change-'+Date.now()+'@example.test',next='changed-'+Date.now()+'@example.test';await user(email);
    await login(page,email);await page.locator('#settingsBtn').click();await expect(page.locator('#accountSecurity')).toBeVisible();
    await page.locator('#securityPassword').fill(password);await page.locator('#newEmail').fill(next);await page.locator('#changeEmail').click();await expect(page.locator('.toast')).toContainText('confirm the change');
    await expect(page.locator('#accountSecurity .email-delivery-tip')).toContainText('Promotions, Updates or Other');
    const codes=await(await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-ag-home/oobCodes')).json();
    const code=codes.oobCodes.find(c=>c.requestType==='VERIFY_AND_CHANGE_EMAIL'&&(c.newEmail===next||c.email===next||c.email===email));expect(code).toBeTruthy();
    await page.goto('auth-action.html?mode=verifyAndChangeEmail&oobCode='+encodeURIComponent(code.oobCode));await expect(page.locator('#actionStatus')).toHaveText('Success');
    const updatedAccount=await auth.getUserByEmail(next);expect(updatedAccount.emailVerified).toBe(true);
    expect((await db.collection('users').doc(updatedAccount.uid).get()).data().email).toBe(next);
});

for (const width of [1440, 768, 390]) test(`custom reset card fits ${width} with safe recipient and confirmation`, async ({page, request}) => {
    const email = `reset-card-${width}-${Date.now()}@example.test`; await user(email);
    await page.setViewportSize({width, height: 1000});
    await page.goto('index.html'); await expect(page.locator('a[href="products.html"]')).toHaveCount(0);
    await page.locator('#showReset').click(); await page.locator('#resetEmail').fill(email);
    await expect(page.locator('.email-delivery-tip')).toHaveCount(0);
    await page.locator('#resetForm button[type=submit]').click();
    const tip = page.locator('#resetPanel .email-delivery-tip'); await expect(tip).toContainText('Spam or Junk');
    await tip.getByRole('button', {name:'Close', exact:true}).click(); await expect(tip).toHaveCount(0);
    const codes = await (await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-ag-home/oobCodes')).json();
    const code = codes.oobCodes.filter(c => c.email === email && c.requestType === 'PASSWORD_RESET').at(-1);
    if (width === 390) await page.evaluate(() => { localStorage.setItem('language','ur'); localStorage.setItem('theme','dark'); });
    await page.goto('auth-action.html?mode=resetPassword&oobCode='+encodeURIComponent(code.oobCode));
    await expect(page.locator('#actionReset')).toBeVisible(); await expect(page.locator('#actionEmail')).toHaveText(email);
    await expect(page).not.toHaveURL(/oobCode/);
    await page.locator('#actionPassword').fill('NewStrongPassword456!'); await page.locator('#actionConfirm').fill('DifferentPassword456!');
    await expect(page.locator('#actionConfirm')).toHaveAttribute('aria-invalid','true');
    await expect(page.locator('#agCharacter')).toHaveAttribute('data-state','privacy');
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBeTruthy();
    if (width === 390) await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await page.screenshot({path:`test-results/reset-card-${width}.png`,fullPage:true,animations:'disabled'});
    await page.locator('#actionConfirm').fill('NewStrongPassword456!'); await expect(page.locator('#actionConfirm')).toHaveAttribute('aria-invalid','false');
    await page.locator('#actionReset button[type=submit]').click(); await expect(page.locator('.account-action-card')).toHaveAttribute('data-state','success');
    await expect(page.locator('#actionReset')).toBeHidden();
});

test('mailbox guidance is localized and reset requests remain account-neutral', async ({page}) => {
    await page.goto('index.html'); await page.locator('#showReset').click();
    await page.locator('#resetEmail').fill(`unknown-${Date.now()}@example.test`); await page.locator('#resetForm button[type=submit]').click();
    await expect(page.locator('.toast')).toContainText('If an account can receive a reset email');
    await expect(page.locator('.email-delivery-tip')).toContainText('Spam or Junk');
    await page.evaluate(async () => {
        const {LANGUAGES, setCurrentLanguage, t} = await import('/AG-Home/js/localization.js');
        for (const language of Object.keys(LANGUAGES)) {
            setCurrentLanguage(language);
            if (language !== 'en' && t('email.tipBody').startsWith('Email may arrive')) throw new Error('Missing mailbox translation: '+language);
            if (document.querySelector('.email-delivery-tip p').textContent !== t('email.tipBody')) throw new Error('Stale mailbox translation: '+language);
        }
    });
});
test('TOTP enrollment, challenge and removal use SDK contract fixtures (emulator lacks TOTP)',async({page})=>{
    // Only this test mocks the unsupported TOTP API. Password authentication still uses the demo emulator.
    const key='JBSWY3DPEHPK3PXP'; let enrolled=false, credentials, calls=[];
    const factors=()=>[{mfaEnrollmentId:'fixture-totp',displayName:'AG Home Authenticator',enrolledAt:new Date().toISOString(),totpInfo:{}}];
    await page.route('**/identitytoolkit.googleapis.com/**',async route=>{
        const url=route.request().url(), data=route.request().postDataJSON();
        if(url.includes('mfaEnrollment:start')){
            expect(data.totpEnrollmentInfo).toEqual({}); calls.push('start');
            return route.fulfill({json:{totpSessionInfo:{sharedSecretKey:key,hashingAlgorithm:'SHA1',verificationCodeLength:6,periodSec:30,sessionInfo:'fixture-session',finalizeEnrollmentTime:new Date(Date.now()+300000).toISOString()}}});
        }
        if(url.includes('mfaEnrollment:finalize')){
            expect(data.totpVerificationInfo).toEqual({sessionInfo:'fixture-session',verificationCode:totp(key)});enrolled=true;calls.push('enroll');
            return route.fulfill({json:credentials});
        }
        if(url.includes('mfaSignIn:finalize')){
            expect(data.mfaEnrollmentId).toBe('fixture-totp');expect(data.totpVerificationInfo.verificationCode).toBe(totp(key));calls.push('challenge');
            return route.fulfill({json:credentials});
        }
        if(url.includes('mfaEnrollment:withdraw')){expect(data.mfaEnrollmentId).toBe('fixture-totp');enrolled=false;calls.push('remove');return route.fulfill({json:credentials});}
        if(url.includes('accounts:signInWithPassword')){
            const response=await route.fetch(), json=await response.json();credentials=json;
            return route.fulfill({response,json:enrolled?{mfaPendingCredential:'fixture-pending',mfaInfo:factors()}:json});
        }
        if(url.includes('accounts:lookup')){const response=await route.fetch(),json=await response.json();if(enrolled)json.users[0].mfaInfo=factors();return route.fulfill({response,json});}
        return route.fallback();
    });
    const email='mfa-'+Date.now()+'@example.test';const mfaAccount=await user(email);
    await login(page,email);await page.locator('#settingsBtn').click();await page.locator('#securityPassword').fill(password);await page.locator('#enableTotp').click();
    await expect(page.locator('#totpKey')).toHaveText(key);
    await page.locator('#totpCode').fill(totp(key));await page.locator('#confirmTotp').click();await expect(page.locator('#mfaFactors')).toContainText('AG Home Authenticator');
    const mfaUsername='mfa.'+Date.now();
    await db.doc('users/'+mfaAccount.uid).set({username:mfaUsername,usernameKey:mfaUsername},{merge:true});
    await page.locator('#logoutBtn').click();await expect(page).toHaveURL(/index.html/);await page.locator('#loginEmail').fill(mfaUsername);await page.locator('#loginPassword').fill(password);await page.locator('#login button[type=submit]').click();
    await expect(page.locator('#mfaPanel')).toBeVisible();await page.locator('#mfaCode').fill(totp(key));await page.locator('#mfaForm button[type=submit]').click();await expect(page).toHaveURL(/home.html/);
    await page.locator('#settingsBtn').click();await page.locator('#securityPassword').fill(password);await page.locator('#mfaFactors button').click();
    await expect(page.locator('#reauthCode')).toBeVisible();await page.locator('#reauthCode').fill(totp(key));await page.locator('#reauthSubmit').click();await expect(page.locator('#mfaFactors')).toBeEmpty();
    expect(calls).toEqual(['start','enroll','challenge','challenge','remove']);
    expect(await page.evaluate(()=>JSON.stringify({...localStorage,...sessionStorage}))).not.toContain(key);
});
for(const width of [768,390])test(`editor responsive RTL and platform combinations at ${width}`,async({page})=>{
    await page.setViewportSize({width,height:900});await login(page);await page.goto('control.html#product-management');
    await expect(page.locator('html')).not.toHaveClass(/auth-pending/);
    await page.evaluate(async()=>{const i18n=await import('/AG-Home/js/localization.js');i18n.setCurrentLanguage('ur');window.openAddProductModal();});
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    const combinations=[['website'],['windows'],['linux'],['chromeOS'],['android'],['apple'],['windows','website'],['windows','android'],['windows','apple'],['windows','linux'],['website','android','apple'],['website','windows','linux','chromeOS','android','apple']];
    for(const selection of combinations){
        for(const id of ['website','windows','linux','chromeOS','android','apple']){
            await page.locator('#product-'+id).setChecked(selection.includes(id));
            if(selection.includes(id)){await expect(page.locator('#product-'+id+'-url')).toBeVisible();await page.locator('#product-'+id+'-url').fill('https://example.com/'+id);}
            else await expect(page.locator('#product-'+id+'-url')).toBeHidden();
        }
    }
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.screenshot({path:`test-results/editor-rtl-${width}.png`,fullPage:true,animations:'disabled'});
});
test('reading state and reduced motion remain functional',async({page})=>{
    await page.goto('products.html');await page.clock.install();await page.clock.fastForward(21000);await expect(page.locator('#agCharacter')).toHaveAttribute('data-state','reading');
    await page.emulateMedia({reducedMotion:'reduce'});await expect.poll(()=>page.locator('#agCharacter .robot-head').evaluate(e=>getComputedStyle(e).animationName)).toBe('none');
});
test('verified contact and product reporting preserve their Firestore workflows',async({page})=>{
    await login(page,'member@example.test');await page.goto('products.html');
    await page.locator('.product-card').filter({hasText:'AG Test Product'}).locator('.details-button').click();
    await expect(page.locator('#productDetailsModal')).toBeVisible();await expect(page.locator('#detailsPlatforms .platform-badge')).toHaveCount(6);
    await page.locator('#productDetailsModal button[onclick="openReportModal()"]').click();await expect(page.locator('#productDetailsModal')).toBeHidden();await expect(page.locator('#reportModal')).toBeVisible();
    await page.locator('#reportReason').selectOption('broken_link');await page.locator('#reportDetails').fill('Test report '+Date.now());await page.locator('#reportForm button[type=submit]').click();await expect(page.locator('#reportModal')).toBeHidden();
    const account=await auth.getUserByEmail('member@example.test');expect((await db.collection('reports').where('reportedBy','==',account.uid).get()).size).toBeGreaterThan(0);
    await page.goto('contact.html');const message='Contact workflow '+Date.now();await page.locator('#name').fill('Test Member');await page.locator('#email').fill('member@example.test');await page.locator('#message').fill(message);await page.locator('#contactForm button[type=submit]').click();await expect(page.locator('.toast')).toContainText('Success');
    expect((await db.collection('messages').where('message','==',message).get()).size).toBe(1);
});

test('themes keep consistent colours, pressed state and persistence on mobile and desktop',async({page})=>{
    for(const width of [1440,390]) {
        await page.setViewportSize({width,height:1000});await page.goto('index.html');await page.locator('#settingsBtn').click();
        for(const [theme,background] of [['dark','rgb(19, 25, 30)'],['light','rgb(246, 248, 250)']]) {
            await page.locator('.theme-btn[data-theme='+theme+']').click();await expect(page.locator('body')).toHaveAttribute('data-theme',theme);
            await expect(page.locator('body')).toHaveCSS('background-color',background);
            await expect(page.locator('.theme-btn[data-theme='+theme+']')).toHaveAttribute('aria-pressed','true');
            await expect(page.locator('#loginEmail')).toHaveCSS('background-color',theme==='dark'?'rgb(27, 36, 43)':'rgb(255, 255, 255)');
        }
        await page.locator('.theme-btn[data-theme=dark]').click();await page.locator('#languageSelect').selectOption('ur');await page.locator('#closeSettings').click();
        await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await expect(page.locator('body')).toHaveCSS('background-color','rgb(19, 25, 30)');
        await expect(page.locator('html')).toHaveAttribute('dir','rtl');
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
        await page.screenshot({path:`test-results/theme-dark-rtl-${width}.png`,fullPage:true,animations:'disabled'});
        await page.emulateMedia({reducedMotion:'reduce'});await page.locator('#showSignup').click();
        await expect(page.locator('#signupForm .auth-layout')).toHaveCSS('animation-name','none');await page.emulateMedia({reducedMotion:'no-preference'});
    }
});

for(const provider of ['google','github','yahoo']) test(`${provider} social popup signs in through the real Firebase Auth emulator`,async({page,context})=>{
    // Firebase's popup transport loads Google's gapi library, even for GitHub/Yahoo.
    // Only this static SDK host is allowed; all identity operations remain on demo-ag-home.
    await context.route('https://apis.google.com/**',route=>route.request().method()==='GET'?route.continue():route.abort());
    await page.goto('index.html');const waiting=page.waitForEvent('popup');await page.locator('#'+provider+'Login').click();const popup=await waiting;
    expect(new URL(popup.url()).port).toBe('9099');await popup.getByText('Add new account',{exact:false}).click();
    await popup.locator('#email-input').fill(provider+'-browser-'+Date.now()+'@example.test');await popup.locator('#display-name-input').fill('Social Test');await popup.locator('#sign-in').click();
    await expect(page).toHaveURL(/home.html/);await expect(page.locator('html')).not.toHaveClass(/auth-pending/);
    const state=await page.evaluate(async()=>{const {auth}=await import('/AG-Home/js/firebase-config.js');return {verified:auth.currentUser.emailVerified,provider:auth.currentUser.providerData[0].providerId};});
    expect(state).toEqual({verified:true,provider:provider+'.com'});await page.locator('#settingsBtn').click();await expect(page.locator('#settingsEmailStatus')).toHaveText('Email verified');
});

test('restored unverified email session cannot access Home and is signed out',async({page})=>{
    const email='unverified-restored-'+Date.now()+'@example.test';await user(email,false);
    // Simulate a session saved by the previous release, before application guards mount.
    await page.goto('/AG-Home/logo.png');await page.evaluate(async credentials=>{
        const {auth,signInWithEmailAndPassword}=await import('/AG-Home/js/firebase.js');
        await signInWithEmailAndPassword(auth,credentials.email,credentials.password);
    },{email,password});
    await page.goto('home.html');await expect(page).toHaveURL(/index.html/);await expect(page.locator('#verificationNotice')).toBeVisible();
    await expect.poll(()=>page.evaluate(async()=> (await import('/AG-Home/js/firebase-config.js')).auth.currentUser===null)).toBeTruthy();
});

test('social account with an unverified Firebase email is signed out and sent verification',async({page,context,request})=>{
    await context.route('https://apis.google.com/**',route=>route.request().method()==='GET'?route.continue():route.abort());
    const email='social-unverified-'+Date.now()+'@example.test';
    await page.route('**/*accounts:signInWithIdp*',async route=>{
        const response=await route.fetch(),json=await response.json();
        // Make this emulator account unverified to exercise the application's gate;
        // the real Firebase reload and verification APIs still run against the emulator.
        await auth.updateUser(json.localId,{emailVerified:false});
        await route.fulfill({response,json:{...json,emailVerified:false}});
    });
    await page.goto('index.html');const waiting=page.waitForEvent('popup');await page.locator('#googleLogin').click();const popup=await waiting;
    await popup.getByText('Add new account',{exact:false}).click();await popup.locator('#email-input').fill(email);await popup.locator('#sign-in').click();
    await expect(page.locator('#verificationNotice')).toBeVisible();await expect(page.locator('#verificationMessage')).toContainText('Verification email sent');await expect(page).toHaveURL(/index.html/);
    await expect.poll(()=>page.evaluate(async()=> (await import('/AG-Home/js/firebase-config.js')).auth.currentUser===null)).toBeTruthy();
    const codes=await(await request.get('http://127.0.0.1:9099/emulator/v1/projects/demo-ag-home/oobCodes')).json();expect(codes.oobCodes.some(c=>c.email===email&&c.requestType==='VERIFY_EMAIL')).toBeTruthy();
});

test('guest browsing cannot bypass verified-email access to authenticated Home',async({page})=>{
    await page.goto('index.html');await page.locator('#guestLogin').click();await expect(page).toHaveURL(/products.html/);
    await page.goto('home.html');await expect(page).toHaveURL(/products.html/);await page.goto('index.html');await expect(page.locator('#login')).toBeVisible();
});

test('feedback filters show live totals and move messages after a real server status update', async ({page}) => {
    for (const message of (await db.collection('messages').get()).docs) await message.ref.delete();
    for (const [id,status] of [['ui-new','unread'],['ui-read','read'],['ui-legacy',null]]) {
        await db.collection('messages').doc(id).set({name:id,email:'feedback@example.test',message:'Feedback for AG',timestamp:new Date(),...(status ? {status}: {})});
    }
    await login(page); await page.goto('control.html#messages');
    const filters = page.locator('#messageFilters');
    await expect(filters.locator('[data-message-filter=all] .filter-count')).toHaveText('3');
    await expect(page.locator('.message-card')).toHaveCount(3);
    await filters.locator('[data-message-filter=unread]').click();
    await expect(page.locator('.message-card')).toHaveCount(2);
    await page.locator('#ui-new .mark-read-btn').click();
    await expect(page.locator('#ui-new')).toHaveCount(0);
    await expect(filters.locator('[data-message-filter=unread] .filter-count')).toHaveText('1');
    expect((await db.collection('messages').doc('ui-new').get()).data().status).toBe('read');
    await filters.locator('[data-message-filter=read]').click();
    await expect(page.locator('.message-card')).toHaveCount(2);
    await page.locator('#ui-new .mark-read-btn').click();
    await expect(page.locator('#ui-new')).toHaveCount(0);
    await filters.locator('[data-message-filter=all]').click();
    await expect(page.locator('.message-card')).toHaveCount(3);
    await page.screenshot({path:'test-results/feedback-filters.png',fullPage:true,animations:'disabled'});
    await db.collection('messages').doc('ui-read').update({status:'unread'});
    await filters.locator('[data-message-filter=read]').click();
    await expect(page.locator('.inbox-empty')).toBeVisible();
    await expect(page.locator('.filter-count').last()).toHaveText('0');
});

for (const width of [1440,768,390]) {
    test(`AG Home content and live product previews fit ${width} in both directions`, async ({page}) => {
        await page.setViewportSize({width,height:950}); await login(page);
        await expect(page.locator('.home-welcome h2')).toHaveText('Everything AG, in one place.');
        await expect(page.locator('.home-destination')).toHaveCount(3);
        await expect(page.locator('.home-product-preview').first()).toBeVisible();
        await expect(page.locator('.ag-home')).not.toContainText('Choose any combination');
        const reference = db.collection('products').doc('test-catalogue');
        await reference.update({name_en:'AG Home Preview '+width});
        await expect(page.locator('.home-product-preview').filter({hasText:'AG Home Preview '+width})).toBeVisible();
        if (width===390) expect(await page.locator('.background-content > nav').evaluate(element=>element.getBoundingClientRect().height)).toBeLessThan(150);
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBeTruthy();
        await page.screenshot({path:`test-results/ag-home-${width}.png`,fullPage:true,animations:'disabled'});
        await page.locator('#settingsBtn').click();
        await expect(page.locator('#settingsBtn')).toBeHidden();
        await expect(page.locator('#settingsBtn')).toHaveAttribute('aria-expanded','true');
        await page.locator('#languageSelect').selectOption('ur');
        await page.locator('.theme-btn[data-theme=dark]').click();await page.locator('#closeSettings').click();
        await expect(page.locator('#settingsBtn')).toBeVisible();
        if(width===1440){
            await page.locator('#settingsBtn').click();await page.keyboard.press('Escape');
            await expect(page.locator('#settingsBtn')).toBeVisible();await expect(page.locator('#settingsBtn')).toBeFocused();
            await page.keyboard.press('Enter');await expect(page.locator('#settingsModal')).toBeVisible();
            await page.mouse.click(5,5);await expect(page.locator('#settingsBtn')).toBeVisible();
        }
        await expect(page.locator('html')).toHaveAttribute('dir','rtl');
        await expect(page.locator('.home-welcome h2')).toHaveText('AG کی دنیا، ایک ہی جگہ۔');
        await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBeTruthy();
        await page.screenshot({path:`test-results/ag-home-rtl-dark-${width}.png`,fullPage:true,animations:'disabled'});
    });

    test(`Add and Edit have scrollable sections and reachable actions at ${width}`, async ({page}) => {
        await page.setViewportSize({width,height:850}); await login(page);
        await page.goto('control.html#product-management');
        await expect(page.locator('html')).not.toHaveClass(/auth-pending/);
        await expect(page.locator('#productsList .product-control-card').first()).toBeVisible();
        for (const prefix of ['product','editProduct']) {
            if(prefix==='product')await page.evaluate(()=>window.openAddProductModal());
            else await page.evaluate(()=>window.editProduct('test-catalogue'));
            const modal = page.locator(prefix==='product'?'#addProductModal':'#editProductModal');
            const form = modal.locator('form');await expect(modal).toBeVisible();
            await expect(form.locator('.editor-step').first()).toHaveAttribute('aria-current','step');
            await page.evaluate(async () => {
                const {localizeAdmin} = await import('/AG-Home/js/admin-localization.js');
                for(let pass=0;pass<20;pass++) localizeAdmin();
            });
            for (const field of ['NameEn','NameUr','DescriptionEn','DescriptionUr']) {
                const label = form.locator(`label[for="${prefix}${field}"]`);
                await expect(label.locator('span[data-i18n]')).toHaveCount(1);
                await expect(label.locator('small[data-i18n]')).toHaveCount(1);
            }
            expect(await form.locator('.editor-sections').evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBeTruthy();
            await page.screenshot({path:`test-results/${prefix}-basics-${width}.png`,animations:'disabled'});
            await expect(form.locator('.modal-actions .compatibility-editor')).toHaveCount(0);
            await expect(form.locator('.editor-sections .compatibility-editor')).toHaveCount(1);
            await expect(form.locator('.editor-step')).toHaveCount(7);
            await form.locator('.editor-step').nth(2).click();
            await expect(form.locator('.editor-step').nth(2)).toHaveAttribute('aria-current','step');
            await page.locator('#'+prefix+'-website').check();
            await page.locator('#'+prefix+'-website-url').fill('https://example.com');
            const bounds = await form.locator('.modal-actions').boundingBox();
            expect(bounds.y+bounds.height).toBeLessThanOrEqual(850);
            await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBeTruthy();
            await page.screenshot({path:`test-results/${prefix}-editor-${width}.png`,animations:'disabled'});
            if (width===1440 && prefix==='product') {
                const body=await form.locator('.editor-sections').boundingBox();
                await page.mouse.move(body.x+body.width-20,body.y+30);await page.mouse.down();
                await page.mouse.move(5,5);await page.mouse.up();await expect(modal).toBeVisible();
                await page.mouse.click(5,5);await expect(modal).toBeHidden();
                await page.evaluate(()=>window.openAddProductModal());await expect(modal).toBeVisible();
            }
            await page.keyboard.press('Escape'); await expect(modal).toBeHidden();
        }
    });
}

test('social buttons use the reference stack, brand colours, RTL and reduced motion', async ({page}) => {
    await page.goto('index.html');
    const buttons=page.locator('#loginForm .social-btn');await expect(buttons).toHaveCount(5);
    const colours=await buttons.evaluateAll(elements=>elements.map(element=>getComputedStyle(element).backgroundColor));
    expect(colours).toEqual(['rgb(48, 48, 48)','rgb(36, 41, 46)','rgb(131, 0, 169)','rgb(45, 133, 52)','rgb(255, 159, 8)']);
    const ratios=await buttons.evaluateAll(elements=>{
        const luminance=colour=>colour.match(/\d+/g).slice(0,3).map(Number).map(value=>{const channel=value/255;return channel<=.04045?channel/12.92:((channel+.055)/1.055)**2.4;}).reduce((sum,value,index)=>sum+value*[.2126,.7152,.0722][index],0);
        return elements.map(element=>{const style=getComputedStyle(element),text=luminance(style.color),background=luminance(style.backgroundColor);return (Math.max(text,background)+.05)/(Math.min(text,background)+.05);});
    });
    expect(ratios.every(ratio=>ratio>=4.5)).toBeTruthy();
    await expect(page.locator('#googleLogin .provider-mark svg path')).toHaveCount(4);
    let previous=0;for(const button of await buttons.all()){const box=await button.boundingBox();expect(box.y).toBeGreaterThanOrEqual(previous);previous=box.y+box.height;}
    await page.locator('#settingsBtn').click();await page.locator('#languageSelect').selectOption('ur');await page.locator('.theme-btn[data-theme=dark]').click();await page.locator('#closeSettings').click();
    await page.screenshot({path:'test-results/social-reference-rtl.png',fullPage:true,animations:'disabled'});
    await page.emulateMedia({reducedMotion:'reduce'});
    const duration=await page.locator('#googleLogin').evaluate(element=>getComputedStyle(element).transitionDuration);
    expect(duration.split(',').every(value=>parseFloat(value)<.001)).toBeTruthy();
});

for(const width of [1440,768,390]) test(`About footer and animated navigation fit ${width}`,async({page})=>{
    await page.setViewportSize({width,height:950});await page.goto('about.html');
    const footer=page.locator('body > footer');await expect(footer.locator('.brand')).toHaveText('AG Home');
    await expect(page.locator('.background-content > footer')).toHaveCount(0);
    await expect(footer).toHaveCSS('display','grid');
    const bounds=await footer.boundingBox();expect(bounds.y+bounds.height).toBeGreaterThanOrEqual(949);
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    const contact=page.locator('.background-content > nav a[href="contact.html"]');await contact.hover();
    await expect.poll(()=>contact.evaluate(element=>parseFloat(getComputedStyle(element,'::after').width))).toBeGreaterThan(0);
    await expect(page.locator('.background-content > nav')).toHaveCSS('border-radius','12px');
    await page.screenshot({path:`test-results/about-footer-${width}.png`,fullPage:true,animations:'disabled'});
    await page.locator('#settingsBtn').click();await page.locator('#languageSelect').selectOption('ur');
    await page.locator('.theme-btn[data-theme=dark]').click();await page.locator('#closeSettings').click();
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await expect.poll(()=>page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.screenshot({path:`test-results/about-footer-rtl-${width}.png`,fullPage:true,animations:'disabled'});
});

for (const width of [1440,768,390]) test(`chat usernames, own bubbles and independent sidebar scroll at ${width}`, async ({page}) => {
    const owner = await user('ag.aliengamerz@gmail.com');
    const other = await user(`chat-other-${width}@example.test`);
    await db.collection('users').doc(owner.uid).set({email:owner.email, username:'AGOwner',role:'USER',rank:'USER'}, {merge:true});
    await db.collection('users').doc(other.uid).set({email:other.email,username:'ChatColleague',role:'USER',rank:'USER'});
    const ownId=`chat-own-${width}`, otherId=`chat-other-${width}`;
    await db.collection('global_chat').doc(ownId).set({senderId:owner.uid,senderName:owner.email,text:'My earlier message',timestamp:new Date()});
    await db.collection('global_chat').doc(otherId).set({senderId:other.uid,senderName:other.email,text:'A colleague’s message',timestamp:new Date()});
    await page.setViewportSize({width,height:850}); await login(page); await page.goto('control.html#chats');
    await expect.poll(()=>page.locator('.admin-layout').evaluate(el=>el.getBoundingClientRect().width)).toBeGreaterThan(width-32);
    const header=page.locator('.admin-content > header');
    const headerBox=await header.boundingBox(), accountBox=await page.locator('#userDisplay').boundingBox();
    expect(accountBox.x).toBeGreaterThanOrEqual(headerBox.x); expect(accountBox.x+accountBox.width).toBeLessThanOrEqual(headerBox.x+headerBox.width+1);
    expect(await page.locator('#chatForm button').evaluate(el=>el.getBoundingClientRect().width)).toBeLessThan(width/2);
    const own=page.locator(`[data-message-id="${ownId}"]`), received=page.locator(`[data-message-id="${otherId}"]`);
    await expect(own.locator('.chat-sender')).toHaveText('AGOwner'); await expect(received.locator('.chat-sender')).toHaveText('ChatColleague');
    await expect(own).toHaveClass(/is-own/); await expect(received).toHaveClass(/is-other/);
    const ltrOwn=await own.boundingBox(), ltrOther=await received.boundingBox(); expect(ltrOwn.x).toBeLessThan(ltrOther.x);
    const content=page.locator('.admin-content'), sidebar=page.locator('.admin-nav');
    const original=await content.evaluate(el=>el.scrollTop);
    await sidebar.evaluate(el=>{el.scrollTop=el.scrollHeight;});
    expect(await content.evaluate(el=>el.scrollTop)).toBe(original);
    expect(await page.evaluate(()=>document.documentElement.scrollHeight<=innerHeight+1)).toBeTruthy();
    await page.locator('#chatInput').fill(`New username message ${width}`); await page.locator('#chatForm button').click();
    await expect(page.locator('#chatInput')).toHaveValue('');
    const sent=await db.collection('global_chat').where('text','==',`New username message ${width}`).get();
    expect(sent.docs[0].data().senderName).toBe('AGOwner'); expect(sent.docs[0].data().senderId).toBe(owner.uid);
    await page.evaluate(async()=>{const {setCurrentLanguage}=await import('/AG-Home/js/localization.js');setCurrentLanguage('ur');});
    const rtlOwn=await own.boundingBox(), rtlOther=await received.boundingBox(); expect(rtlOwn.x+rtlOwn.width).toBeGreaterThan(rtlOther.x+rtlOther.width);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();
    await page.screenshot({path:`test-results/chat-rtl-${width}.png`,animations:'disabled'});
});

test('product hover lifts cards, highlights actions and respects reduced motion',async({page})=>{
    await page.goto('products.html'); const card=page.locator('.product-card').first(); await expect(card).toBeVisible();
    await card.hover(); await expect(card).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, -5)');
    await expect(card.locator('.product-links a').first()).toHaveCSS('border-top-color','rgb(8, 125, 116)');
    await page.emulateMedia({reducedMotion:'reduce'}); await expect(card).toHaveCSS('transform','none');
});

test('social hover colours and loading spinner follow the supplied animation style',async({page})=>{
    await page.goto('index.html');const github=page.locator('#githubLogin'),google=page.locator('#googleLogin');
    await github.hover();await expect(github).toHaveCSS('background-color','rgb(44, 51, 56)');
    await expect(github).toHaveCSS('transform','matrix(1, 0, 0, 1, 0, -2)');
    await google.hover();await expect(google).toHaveCSS('background-color','rgb(241, 241, 241)');
    await expect(google).toHaveCSS('color','rgb(68, 68, 68)');
    await page.evaluate(async()=>{
        const {busy}=await import('/AG-Home/js/ui.js');
        window.socialLoading=busy(document.getElementById('githubLogin'),()=>new Promise(resolve=>window.finishSocialLoading=resolve));
    });
    await expect(github).toBeDisabled();await expect(github).toHaveAttribute('aria-busy','true');
    expect(await github.evaluate(element=>getComputedStyle(element,'::after').animationName)).toBe('ag-spin');
    await page.emulateMedia({reducedMotion:'reduce'});
    expect(await github.evaluate(element=>getComputedStyle(element,'::after').animationName)).toBe('none');
    await page.evaluate(async()=>{window.finishSocialLoading();await window.socialLoading;});
    await expect(github).toBeEnabled();await expect(github).not.toHaveAttribute('aria-busy','true');
});

test('database-only products propagate without a marker or hardcoded fallback',async({page})=>{
    const previous=await db.collection('products').get(),reference=db.doc('products/db-only-product');
    try{
        const clear=db.batch();for(const document of previous.docs)clear.delete(document.ref);await clear.commit();
        await page.goto('products.html');await expect(page.locator('#loadingMsg')).toBeHidden();await expect(page.locator('.product-card')).toHaveCount(0);await expect(page.locator('.no-products')).toBeVisible();
        await page.goto('team.html#member='+organizationSeed.members[0].id);await expect(page.locator('#teamCatalogueStatus')).toHaveText('');await expect(page.locator('#organizationMap [data-product-id]')).toHaveCount(0);await expect(page.locator('#teamProfile a[data-product-id]')).toHaveCount(0);
        const record={name:'Database supplied product',description:'An actual emulator record',category:'Software',price:0,image:null,platforms:{windows:true,android:true},links:{windows:'https://example.test/windows',android:'https://example.test/android'},ownerIds:[organizationSeed.members[0].id],version:'v9.2'};
        await reference.set(record);await page.locator('#organizationSearch').fill(record.name);await expect(page.locator('#organizationMap [data-product-id=db-only-product]')).toHaveCount(2);await expect(page.locator('#teamProfile a[data-product-id=db-only-product]')).toHaveCount(2);
        await page.goto('products.html#product=db-only-product');await expect(page.locator('#detailsProductName')).toHaveText(record.name);await expect(page.locator('.product-card')).toHaveCount(1);await expect(page.locator('#detailsPlatforms .platform-badge')).toHaveCount(2);
        await reference.update({name:'Renamed in database'});await expect(page.locator('#detailsProductName')).toHaveText('Renamed in database');
        await reference.delete();await expect(page.locator('#productDetailsModal')).toBeHidden();await expect(page.locator('.product-card')).toHaveCount(0);await expect(page.locator('.no-products')).toBeVisible();
        await login(page);await expect(page.locator('#homeProducts .home-catalogue-empty')).toHaveText(/No products/);
        await reference.set(record);await expect(page.locator('#homeProducts .home-product-preview')).toHaveCount(1);await expect(page.locator('#homeProducts h3')).toHaveText(record.name);await reference.delete();await expect(page.locator('#homeProducts .home-product-preview')).toHaveCount(0);
    }finally{const restore=db.batch();for(const document of (await db.collection('products').get()).docs)restore.delete(document.ref);for(const document of previous.docs)restore.set(document.ref,document.data());await restore.commit();}
});

test('administrator imports and edits real ownership, pending links and unknown prices across public views', async ({page}) => {
    const previous = await db.collection('products').get(), marker = await db.doc('catalogue/main').get();
    const organization = await db.doc('organization/main').get();
    const memberId = organizationSeed.members[0].id;
    try {
        await login(page); await page.goto('control.html#product-management');
        await expect(page.locator('#initializeCatalogue')).toBeVisible(); await page.locator('#initializeCatalogue').click();
        await expect(page.locator('.catalogue-import')).toBeHidden();
        expect((await db.doc('catalogue/main').get()).data().initialized).toBe(true);
        const reference=db.doc('products/ag-capture');
        expect((await reference.get()).data().price).toBeNull();
        // Reuse one tab for this longer workflow on memory-limited machines.
        // Other catalogue scenarios independently exercise live snapshots.
        const visitor=page;
        await visitor.goto('products.html#product=ag-capture'); await expect(visitor.locator('#detailsProductName')).toHaveText('AG Capture');
        await expect(visitor.locator('#detailsPlatforms .product-owner')).toHaveAttribute('href',new RegExp('#member='+memberId+'$'));
        await expect(visitor.locator('#detailsPlatforms .product-links a')).toHaveCount(0);
        await visitor.goto('team.html#member='+memberId); await expect(visitor.locator('#teamProfile .team-products a[data-product-id=ag-capture]')).toHaveCount(1);
        await visitor.goto('products.html#product=ag-capture'); await expect(visitor.locator('#detailsProductName')).toHaveText('AG Capture');
        await page.goto('control.html#product-management');
        await page.evaluate(()=>window.editProduct('ag-capture')); await expect(page.locator('#editProductModal')).toBeVisible();
        await expect(page.locator('#editProductPrice')).toHaveValue(''); await expect(page.locator('#editProductStatus')).toHaveValue('');
        const form=page.locator('#editProductForm');
        await expect(form.locator('[data-platform-pending="windows"]')).toBeChecked(); await expect(page.locator('#editProduct-windows-url')).toBeDisabled();
        await expect(form.locator('[data-download-site-pending]')).toBeChecked();await expect(page.locator('#editProduct-downloadSite-url')).toBeDisabled();
        await page.locator('#editProductNameUr').fill('اے جی کیپچر'); await page.locator('#editProductCategoryUr').fill('سافٹ ویئر');
        await form.locator('input[name=ownerIds]').uncheck();
        for (const checkbox of await form.locator('input[name=developmentCategories]').all()) await checkbox.uncheck();
        await form.locator('input[name=developmentCategories][value=software]').check();
        await form.locator('.editor-step').nth(2).click();
        await form.locator('[data-platform-pending="windows"]').uncheck(); await page.locator('#editProduct-windows-url').fill('https://example.test/capture/windows');
        await form.locator('[data-download-site-pending]').uncheck();await page.locator('#editProduct-downloadSite-url').fill('https://example.test/capture/download');
        page.on('dialog',dialog=>dialog.accept()); await form.locator('button[type=submit]').click(); await expect(page.locator('#editProductModal')).toBeHidden();
        const saved=(await reference.get()).data(); expect(saved.price).toBeNull(); expect(saved.status).toBe(''); expect(saved.ownerIds).toEqual([]); expect(saved.developmentCategories).toEqual(['software']);
        await visitor.goto('products.html#product=ag-capture'); await expect(visitor.locator('#detailsProductName')).toHaveText('AG Capture');
        await expect(visitor.locator('#detailsPlatforms .product-owner')).toHaveCount(0);
        await expect(visitor.locator('#detailsPlatforms .product-links a[href="https://example.test/capture/windows"]')).toHaveCount(1);
        await expect(visitor.locator('#detailsPlatforms .product-links a[href="https://example.test/capture/download"]')).toHaveText('↗ Download Website');
        await visitor.goto('team.html#member='+memberId); await expect(visitor.locator('#teamProfile .team-products')).toBeVisible();
        await expect(visitor.locator('#teamProfile .team-products a[data-product-id=ag-capture]')).toHaveCount(0);
        await visitor.goto('products.html#product=ag-capture'); await expect(visitor.locator('#detailsPlatforms .product-owner')).toHaveCount(0);
        await page.goto('control.html#product-management');
        await page.evaluate(()=>window.editProduct('ag-capture')); await form.locator('input[name=ownerIds]').check();
        await form.locator('[data-download-site]').uncheck();await expect(page.locator('#editProduct-downloadSite-url')).toHaveValue('');
        await form.locator('button[type=submit]').click(); await expect(page.locator('#editProductModal')).toBeHidden();
        await visitor.goto('products.html#product=ag-capture'); await expect(visitor.locator('#detailsPlatforms .product-owner')).toHaveCount(1);
        await expect(visitor.locator('#detailsPlatforms .product-links a')).toHaveCount(1);
        await visitor.goto('team.html#member='+memberId); await expect(visitor.locator('#teamProfile .team-products a[data-product-id=ag-capture]')).toHaveCount(1);
    } finally {
        const restore=db.batch(); for (const document of (await db.collection('products').get()).docs) restore.delete(document.ref);
        for (const document of previous.docs) restore.set(document.ref,document.data());
        if(marker.exists)restore.set(marker.ref,marker.data());else restore.delete(db.doc('catalogue/main'));
        restore.set(organization.ref,organization.data()); await restore.commit();
    }
});

test('legacy product information website survives without claiming Website compatibility', async ({page}) => {
    const reference=db.doc('products/nexus-legacy-browser');
    try {
        await reference.set({name:'AG Nexus',category:'Browser',description:'Preserved product information',version:'v0.0.1',schemaVersion:3,platforms:{windows:true,android:true},links:{windows:'',android:''},linkStatus:{windows:'pending',android:'pending'},websiteUrl:'https://example.test/nexus',productLink:'https://example.test/nexus'});
        await page.goto('products.html#product=nexus-legacy-browser');
        await expect(page.locator('#detailsProductName')).toHaveText('AG Nexus');
        await expect(page.locator('#detailsPlatforms .platform-badge')).toHaveCount(2);
        await expect(page.locator('#detailsPlatforms .platform-badge')).not.toContainText(['Website']);
        await expect(page.locator('#detailsPlatforms .product-links a')).toHaveAttribute('href','https://example.test/nexus');
        await page.locator('#productDetailsModal .modal-actions button').click();
        await page.locator('#productSearch').fill('AG Nexus');await page.locator('#productPlatform').selectOption('website');await expect(page.locator('.no-products')).toBeVisible();
        await page.locator('#productPlatform').selectOption('android');await expect(page.locator('.product-card')).toHaveCount(1);
        await expect(page.locator('.product-card')).toHaveAttribute('data-product-id','nexus-legacy-browser');
    } finally { await reference.delete(); }
});
