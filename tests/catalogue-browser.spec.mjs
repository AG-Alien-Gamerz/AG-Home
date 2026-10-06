import {test,expect} from '@playwright/test';
import {initialProducts} from '../functions/product-catalogue.mjs';
import {LANGUAGES} from '../src/js/language-data.js';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(new URL('../functions/package.json',import.meta.url));
process.env.FIRESTORE_EMULATOR_HOST='127.0.0.1:8080';
const {getApps,getApp,initializeApp}=require('firebase-admin/app');
const {getFirestore}=require('firebase-admin/firestore');
const db=getFirestore(getApps().length?getApp():initializeApp({projectId:'demo-ag-home'}));
let previous;
// Real demo database fixtures, never an application fallback.
test.beforeAll(async()=>{previous=await db.collection('products').get();const batch=db.batch();for(const document of previous.docs)batch.delete(document.ref);for(const {id,...record} of initialProducts)batch.set(db.doc('products/'+id),record);await batch.commit();});
test.afterAll(async()=>{const batch=db.batch();for(const document of (await db.collection('products').get()).docs)batch.delete(document.ref);for(const document of previous.docs)batch.set(document.ref,document.data());await batch.commit();});

const organization=JSON.parse(await readFile(new URL('../functions/team-seed.json',import.meta.url),'utf8'));
const member=organization.members[0],nexus=initialProducts.find(product=>product.name==='AG Nexus');
const webProducts=initialProducts.filter(product=>product.platforms.website);
test.beforeEach(async({context})=>{
    await context.addInitScript(()=>localStorage.setItem('language','en'));
    await context.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
});

test('confirmed catalogue cards and filters use accurate multi-platform metadata',async({page})=>{
    await page.goto('products.html');
    const windows=initialProducts.filter(product=>product.platforms.windows);expect(windows).toHaveLength(21);expect(webProducts).toHaveLength(5);
    await page.locator('#productPlatform').selectOption('windows');
    for(const product of windows){const card=page.locator(`.product-card[data-product-id="${product.id}"]`);await expect(card).toBeVisible();await expect(card.locator('.product-version')).toHaveText('v0.0.1');}
    for(const product of webProducts)await expect(page.locator(`.product-card[data-product-id="${product.id}"]`)).toHaveCount(0);
    await page.locator('#productPlatform').selectOption('android');await expect(page.locator(`.product-card[data-product-id="${nexus.id}"]`)).toBeVisible();
    await expect(page.locator(`.product-card[data-product-id="${nexus.id}"] .platform-badge`)).toHaveCount(2);
    await page.locator('#productSearch').fill('AG Nexus');await expect(page.locator('.product-card')).toHaveCount(1);
    await page.locator('#productPlatform').selectOption('website');await expect(page.locator('.no-products')).toBeVisible();
    await page.locator('#productSearch').fill('');for(const product of webProducts)await expect(page.locator(`.product-card[data-product-id="${product.id}"]`)).toBeVisible();
});

test('mind map product details navigate to exact product and its responsible profile',async({page})=>{
    await page.goto('team.html');await expect(page.locator('.timeline-member')).toHaveCount(1);
    await expect(page.locator('#organizationMap [data-node-id=ag]')).toHaveText('AG');
    const windows=page.locator('#organizationMap [data-platform-id=windows]');await expect(windows).toHaveAttribute('aria-expanded','false');await windows.click();await expect(windows).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('#organizationMap [data-product-id]').filter({hasText:'AG Nexus'})).toHaveCount(1);
    await page.locator('#organizationSearch').fill('AG Nexus');await expect(page.locator('#organizationMap [data-product-id]')).toHaveCount(2);
    await page.locator(`#organizationMap [data-product-preview="${nexus.id}"]`).first().click();await expect(page.locator('#teamProfile')).toContainText('v0.0.1');await expect(page.locator('#teamProfile .platform-badge')).toHaveCount(2);
    await expect(page.locator('#teamProfile')).toContainText(member.name);await expect(page.locator('#teamProfile .team-actions a[href^="http"]')).toHaveCount(0);
    await page.locator(`#teamProfile [data-product-link="${nexus.id}"]`).click();await expect(page).toHaveURL(new RegExp('products.html#product='+nexus.id+'$'));
    await expect(page.locator('#productDetailsModal')).toBeVisible();await expect(page.locator('#detailsProductName')).toHaveText(nexus.name);
    await page.locator('#productDetailsModal .product-owner').click();await expect(page).toHaveURL(new RegExp('team.html#member='+member.id+'$'));
    await expect(page.locator('#teamProfile')).toBeVisible();await expect(page.locator('#teamProfile')).toHaveAttribute('data-member-id',member.id);
    await expect(page.locator('#teamProfile .membership-period').first()).toContainText('1 May 2024');await expect(page.locator('#teamProfile .membership-period').first()).toContainText('Present');
    await expect(page.locator('#teamProfile .team-portfolio')).toHaveAttribute('href',member.portfolio);
    const ownedWindows=page.locator('#teamProfile .member-products-platform[data-platform-id=windows]');await expect(ownedWindows.locator('a[data-product-id]')).toHaveCount(21);
    await expect(page.locator('#teamProfile .member-products-platform[data-platform-id=website] a[data-product-id]')).toHaveCount(5);
    await expect(page.locator('#teamProfile .member-products-platform[data-platform-id=android] a[data-product-id]')).toHaveCount(1);
    await ownedWindows.locator('summary').click();await ownedWindows.locator(`a[data-product-id="${nexus.id}"]`).click();await expect(page.locator('#detailsProductName')).toHaveText(nexus.name);
    await page.screenshot({path:'test-results/nexus-product-details-desktop.png',animations:'disabled'});
});

test('primary product node is a native link to the exact Products details',async({page})=>{
    await page.goto('team.html');await page.locator('#organizationSearch').fill('AG Nexus');
    const node=page.locator(`#organizationMap a[data-product-id="${nexus.id}"]`).first();
    await expect(node).toHaveAttribute('href','products.html#product='+nexus.id);await node.click();
    await expect(page).toHaveURL(new RegExp('products.html#product='+nexus.id+'$'));await expect(page.locator('#productDetailsModal')).toBeVisible();await expect(page.locator('#detailsProductName')).toHaveText(nexus.name);await expect(page.locator('#detailsPlatforms .platform-badge')).toHaveCount(2);
});

for(const width of [1440,768,390])test(`organization search, profile and RTL remain usable at ${width}`,async({page})=>{
    await page.setViewportSize({width,height:900});const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('team.html');
    await page.locator('#organizationSearch').fill('Android');await expect(page.locator(`#organizationMap [data-product-id="${nexus.id}"]`)).toHaveCount(2);await expect(page.locator(`#organizationMap .product-node.node-match[data-product-id="${nexus.id}"]`)).toHaveCount(2);
    await page.locator('#organizationSearch').fill('Muhammad Hamza Sabir');await expect(page.locator('#organizationMap [data-member-id]')).toHaveCount(1);
    await page.locator('#organizationSearch').fill('does not match any AG record');await expect(page.locator('#organizationSearchStatus')).toHaveText('No matching results.');
    await page.locator('#organizationMap').getByRole('button',{name:'Reset View',exact:true}).click();await expect(page.locator('#organizationSearch')).toHaveValue('');await expect(page.locator('#organizationMap [data-platform-id=windows]')).toHaveAttribute('aria-expanded','false');await expect(page.locator('#organizationMap [data-platform-id=android]')).toHaveAttribute('aria-expanded','false');
    await page.locator('.timeline-member').getByRole('button',{name:'View Profile',exact:true}).click();
    await page.evaluate(async()=>{(await import('/AG-Home/js/localization.js')).setCurrentLanguage('ur');});await expect(page.locator('html')).toHaveAttribute('dir','rtl');
    await expect(page.locator('#teamProfile .team-expertise')).toContainText('تحقیق اور جدت');await expect(page.locator('#teamProfile .team-biography')).not.toContainText('Muhammad Hamza Sabir is a software developer');
    await page.locator('#organizationSearch').fill('AG Nexus');await expect(page.locator('#organizationMap [data-product-id]')).toHaveCount(2);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBeTruthy();expect(errors).toEqual([]);
    await page.screenshot({path:`test-results/organization-products-rtl-${width}.png`,fullPage:true,animations:'disabled'});
});

for(const width of [1440,768,390])test(`product details remain readable with absent, valid and broken media at ${width}`,async({page})=>{
    await page.setViewportSize({width,height:900});await page.goto('products.html#product='+nexus.id);
    const modal=page.locator('#productDetailsModal'),content=modal.locator('.product-details-content'),info=modal.locator('.details-info-section');
    await expect(modal).toBeVisible();await expect(modal.locator('.details-image-section')).toBeHidden();
    await expect.poll(async()=>{const a=await info.boundingBox(),b=await content.boundingBox();return a.width/b.width;}).toBeGreaterThan(.98);
    const contrast=()=>modal.evaluate(element=>{
        const rgb=value=>value.match(/[\d.]+/g).slice(0,3).map(Number);
        const luminance=value=>rgb(value).map(number=>{const c=number/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;}).reduce((sum,c,index)=>sum+c*[.2126,.7152,.0722][index],0);
        const a=luminance(getComputedStyle(element.querySelector('.details-label')).color),b=luminance(getComputedStyle(element.querySelector('.modal-content')).backgroundColor);
        return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
    });
    await expect.poll(contrast).toBeGreaterThanOrEqual(4.5);
    await page.screenshot({path:`test-results/product-details-light-${width}.png`,animations:'disabled'});
    await page.evaluate(()=>window.showProductDetails(window.currentProductId,{...window.currentProduct,image:new URL('/AG-Home/logo.png',location.origin).href}));
    await expect(modal.locator('.details-image-section')).toBeVisible();await expect.poll(()=>page.locator('#detailsProductImage').evaluate(image=>image.naturalWidth)).toBeGreaterThan(0);
    await page.evaluate(async()=>{(await import('/AG-Home/js/theme.js')).setTheme('dark');(await import('/AG-Home/js/localization.js')).setCurrentLanguage('ur');});
    await expect(page.locator('html')).toHaveAttribute('dir','rtl');await expect.poll(contrast).toBeGreaterThanOrEqual(4.5);
    expect(await modal.locator('.modal-content').evaluate(element=>{const box=element.getBoundingClientRect();return box.left>=0&&box.right<=innerWidth;})).toBeTruthy();
    await page.screenshot({path:`test-results/product-details-rtl-${width}.png`,animations:'disabled'});
    await page.evaluate(()=>window.showProductDetails(window.currentProductId,{...window.currentProduct,image:new URL('/AG-Home/missing-test-product-image.png',location.origin).href}));
    await expect(modal.locator('.details-image-section')).toBeHidden();await expect.poll(async()=>{const a=await info.boundingBox(),b=await content.boundingBox();return a.width/b.width;}).toBeGreaterThan(.98);
});

test('catalogue relationship labels and supplied biography translate in every configured language',async({page})=>{
    await page.goto('team.html#member='+member.id);await expect(page.locator('#teamProfile .team-products')).toBeVisible();await page.locator('#organizationSearch').fill('AG Nexus');
    for(const [language,[,direction]] of Object.entries(LANGUAGES)){
        await page.evaluate(async value=>(await import('/AG-Home/js/localization.js')).setCurrentLanguage(value),language);
        await expect(page.locator('html')).toHaveAttribute('dir',direction);
        const labels=await page.evaluate(async()=>{const {t}=await import('/AG-Home/js/localization.js');return {search:t('catalogue.searchMap'),developed:t('catalogue.developedProducts'),bio:t('team.bioParagraph1'),preview:t('product.viewDetails')};});
        await expect(page.locator('#organizationSearch')).toHaveAttribute('aria-label',labels.search);
        await expect(page.locator('#teamProfile .team-products h4')).toHaveText(labels.developed);await expect(page.locator('#teamProfile .team-biography p').first()).toHaveText(labels.bio);
        await expect(page.locator(`#organizationMap [data-product-preview="${nexus.id}"]`).first()).toHaveAttribute('aria-label',labels.preview+' · '+nexus.name);
    }
});
