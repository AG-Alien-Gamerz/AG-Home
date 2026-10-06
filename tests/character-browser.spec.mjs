import {test,expect} from '@playwright/test';
import {CHARACTER_APPEARANCES} from '../src/js/character-state.js';
import {LANGUAGES} from '../src/js/language-data.js';
test.beforeEach(async({context})=>{
    await context.addInitScript(()=>localStorage.setItem('language','en'));
    await context.route('**/*',route=>['127.0.0.1','localhost'].includes(new URL(route.request().url()).hostname)?route.continue():route.abort());
});
for(const width of [1440,390])test(`character appearances retain privacy, movement, reactions and persistence at ${width}`,async({page})=>{
    await page.setViewportSize({width,height:950});await page.goto('index.html');await page.clock.install();
    await page.clock.pauseAt(new Date(await page.evaluate(()=>Date.now()+100)));
    const character=page.locator('#agCharacter');
    for(const appearance of CHARACTER_APPEARANCES){
        await page.locator('#settingsBtn').click();await page.locator('#characterAppearance').selectOption(appearance.id);
        await expect(page.locator('.character-preview .ag-character')).toHaveAttribute('data-appearance',appearance.id);
        if(appearance.id==='robot')await page.locator('#characterGender').selectOption('female');else await expect(page.locator('#characterGender')).toBeHidden();
        await page.locator('#characterTimer').fill('1');await page.locator('#characterTimer').dispatchEvent('change');
        await page.locator('.character-preview').screenshot({path:`test-results/character-${appearance.id}-${width}.png`,animations:'disabled'});
        await page.locator('#closeSettings').click();await page.clock.fastForward(1000);
        await expect(character).toHaveAttribute('data-appearance',appearance.id);await expect(character).toHaveAttribute('data-gender',appearance.gender||'female');
        await page.locator('#loginPassword').fill('PrivateExample!123');await expect(character).toHaveClass(/eyes-closed/);
        for(const eye of await character.locator('.robot-eye').all())await expect(eye).toHaveCSS('height','2px');
        await page.locator('#login .password-torch').click();await expect(page.locator('#loginPassword')).toHaveAttribute('type','text');await expect(character).toHaveClass(/eyes-closed/);
        await page.clock.fastForward(8100);await expect(page.locator('#loginPassword')).toHaveAttribute('type','password');await expect(character).toHaveClass(/eyes-closed/);
        await page.locator('#loginEmail').click();await expect(character).not.toHaveClass(/eyes-closed/);
        await page.evaluate(()=>window.dispatchEvent(new CustomEvent('characterReaction',{detail:{state:'happy'}})));await expect(character).toHaveAttribute('data-state','happy');
        const beforeDrag=await character.boundingBox();
        await page.mouse.move(beforeDrag.x+beforeDrag.width/2,beforeDrag.y+beforeDrag.height/2);await page.mouse.down();await page.mouse.move(width*.65,500,{steps:6});await page.mouse.up();
        await expect(character).not.toHaveClass(/picked-up/);
        const afterDrag=await character.boundingBox();expect(Math.abs(afterDrag.x-beforeDrag.x)+Math.abs(afterDrag.y-beforeDrag.y)).toBeGreaterThan(10);
        await character.focus();await page.keyboard.press('ArrowLeft');expect((await page.evaluate(()=>JSON.parse(localStorage.getItem('ag.character')))).position).toBeTruthy();
        await page.clock.runFor(37000);await expect(character).toHaveAttribute('data-state','idle');
        await page.clock.runFor(10000);await expect(character).toHaveAttribute('data-state','sit');
        await page.clock.runFor(6000);await expect(character).toHaveAttribute('data-state','yawn');
        await page.clock.runFor(5000);await expect(character).toHaveAttribute('data-state','sleepy');
        await page.clock.runFor(4000);await expect(character).toHaveAttribute('data-state','sleep');
        await page.locator('#loginEmail').click();await expect(character).toHaveAttribute('data-state','awake');
        await page.evaluate(()=>document.dispatchEvent(new Event('scroll')));await page.clock.fastForward(21000);await expect(character).toHaveAttribute('data-state','reading');
        const bounds=await character.boundingBox();expect(bounds.left??bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width+1);
    }
    const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('ag.character')));await page.reload();await expect(character).toHaveAttribute('data-appearance','anime-girl');expect((await page.evaluate(()=>JSON.parse(localStorage.getItem('ag.character')))).position).toEqual(saved.position);
    await page.emulateMedia({reducedMotion:'reduce'});await expect(character.locator('.robot-head')).toHaveCSS('animation-name','none');
    await page.locator('#settingsBtn').click();await page.locator('#characterAppearance').selectOption('robot');await expect(page.locator('#characterGender')).toHaveValue('female');
});
test('character appearance labels follow every language and legacy preferences survive',async({page})=>{
    await page.addInitScript(()=>localStorage.setItem('ag.character',JSON.stringify({gender:'female',sleepMinutes:27,glassMode:'fixed',position:{x:.2,y:.4}})));
    await page.goto('index.html');await page.locator('#settingsBtn').click();await expect(page.locator('#characterAppearance')).toHaveValue('robot');await expect(page.locator('#characterGender')).toHaveValue('female');await expect(page.locator('#characterTimer')).toHaveValue('27');
    for(const [language,[,direction]] of Object.entries(LANGUAGES)){
        await page.locator('#languageSelect').selectOption(language);await expect(page.locator('html')).toHaveAttribute('dir',direction);
        const labels=await page.evaluate(async()=>{const {t}=await import('/AG-Home/js/localization.js');return ['character.appearance','character.robot','character.hamza','character.fatima','character.animeBoy','character.animeGirl'].map(key=>t(key));});
        await expect(page.locator('label[for=characterAppearance]')).toHaveText(labels[0]);await expect(page.locator('#characterAppearance option')).toHaveText(labels.slice(1));
        await page.locator('#characterAppearance').selectOption('pakistani-boy');await expect(page.locator('#characterIdentity')).toHaveText(labels[2]);await expect(page.locator('#agCharacter')).toHaveAttribute('aria-label',new RegExp(labels[2].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')));
    }
});
