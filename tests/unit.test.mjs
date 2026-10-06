import test from 'node:test';
import {validateOrganization,applyTeamChange,validDate,memberStatus,filterMembers,latestAssignment,ancestors} from '../functions/team-model.mjs';
import {organizationTranslations,ORGANIZATION_KEYS} from '../src/js/organization-translations.js';
const teamSeed=JSON.parse(await readFile('functions/team-seed.json','utf8'));
test('published organization has exactly one supplied member with an open membership',()=>{
    assert.equal(latestAssignment(null),null);
    validateOrganization(teamSeed);assert.equal(teamSeed.members.length,1);const member=teamSeed.members[0];assert.equal(member.name,'Muhammad Hamza Sabir');assert.equal(member.startDate,'2024-05-01');assert.equal(member.endDate,null);assert.equal(memberStatus(member),'current');assert.equal(ancestors(latestAssignment(member).nodeId,teamSeed.nodes)[0].id,'ag');
});
test('concurrent memberships never implicitly close each other and explicit departures preserve history',()=>{
    const input={...teamSeed.members[0],id:'unit-only-membership',name:'Unit-only concurrent member',startDate:'2025-01-01',nodeId:'backend'};
    let org=applyTeamChange(teamSeed,{kind:'member',member:input});assert.equal(org.members.length,2);assert.ok(org.members.every(m=>m.endDate===null));
    org=applyTeamChange(org,{kind:'member',member:{...input,endDate:'2025-12-31'}});assert.equal(org.members.length,2);assert.equal(org.members[0].endDate,null);assert.equal(filterMembers(org.members,{status:'former'})[0].id,input.id);assert.equal(filterMembers(org.members,{year:'2024'}).length,1);assert.equal(filterMembers(org.members,{year:'2025'}).length,2);
    assert.throws(()=>applyTeamChange(org,{kind:'member',member:{...input,endDate:null}}),/historyError/);
});
test('team transfers preserve assignments without ending membership, and unassignment is explicit',()=>{
    const member={...teamSeed.members[0],nodeId:'backend',transferDate:'2025-02-01'};
    const org=applyTeamChange(teamSeed,{kind:'member',member});assert.equal(org.members[0].endDate,null);assert.equal(org.members[0].assignments.length,2);assert.equal(org.members[0].assignments[0].endDate,'2025-02-01');assert.equal(org.members[0].assignments[1].endDate,null);assert.equal(latestAssignment(org.members[0]).nodeId,'backend');
    assert.equal(filterMembers(org.members,{department:'frontend'},org.nodes).length,1);
    assert.equal(filterMembers(org.members,{department:'backend',year:'2024'},org.nodes).length,0);assert.equal(filterMembers(org.members,{department:'frontend',status:'current'},org.nodes).length,0);
    const unassigned=applyTeamChange(org,{kind:'member',member:{...member,nodeId:'',transferDate:'2025-03-01'}});assert.equal(latestAssignment(unassigned.members[0]),null);assert.equal(unassigned.members[0].assignments.length,2);
    const renamed=applyTeamChange(org,{kind:'node',node:{id:'frontend',name:'Renamed unit branch',parentId:'ag',type:'department'}});assert.equal(renamed.members[0].assignments[0].pathNames[1],'Frontend');
});
test('organization rejects invalid dates, reversed periods, missing references, cycles, unsafe images and changed join dates',()=>{
    for(const date of ['2025-02-29','2024-04-31','Present','2024-5-1'])assert.equal(validDate(date),false);assert.ok(validDate('2024-02-29'));
    const member={...teamSeed.members[0],nodeId:'frontend-team'};
    for(const change of [{...member,startDate:'2024-05-02'},{...member,endDate:'2023-01-01'},{...member,nodeId:'missing',transferDate:'2025-01-01'},{...member,nodeId:'backend',transferDate:''},{...member,avatar:'javascript:alert(1)'},{...member,portfolio:'https://user:password@example.com'}])assert.throws(()=>applyTeamChange(teamSeed,{kind:'member',member:change}));
    assert.throws(()=>applyTeamChange(teamSeed,{kind:'node',node:{id:'frontend',name:'Frontend',type:'department',parentId:'frontend-team'}}),/hierarchyError/);
    assert.throws(()=>applyTeamChange(teamSeed,{kind:'node',node:{id:'ag',name:'Fake root',type:'root',parentId:null}}));
});
test('organization interface and history guidance cover all existing languages',()=>{
    for(const language of Object.keys(LANGUAGES))for(const key of [...ORGANIZATION_KEYS,'org.frontend','org.backend','org.design','org.frontendTeam','org.historyNote'])assert.ok(organizationTranslations[language]?.[key],language+' '+key);
});
import {parseOffices,matchesOffice} from '../src/js/office-model.js';
import {mapTranslations} from '../src/js/map-translations.js';
test('CSV offices preserve quoted data, validate coordinates and support aliases/localized search',async()=>{
    const [office]=parseOffices(await readFile('public/data/offices.csv','utf8'));
    assert.equal(office.latitude,24.959269);assert.equal(office.longitude,67.131587);assert.equal(office.demo,true);
    for(const search of ['Head Quater','HEAD OFFICE','karachi','مرکزی'])assert.ok(matchesOffice(office,search,'مرکزی دفتر'));
    assert.equal(matchesOffice(office,'unknown'),false);
    const [quoted]=parseOffices('id,type,name,latitude,longitude\r\n1,branch,"A, ""B""",0,0\r\n');assert.equal(quoted.name,'A, "B"');
    for(const bad of ['missing,columns\n1,2','id,type,name,latitude,longitude\n1,hq,A,91,0','id,type,name,latitude,longitude\n1,hq,A,,0','id,type,name,latitude,longitude\n1,hq,"A,0,0'])assert.throws(()=>parseOffices(bad));
});
test('every map control and error/report state is translated for all configured languages',()=>{
    for(const language of Object.keys(LANGUAGES)){assert.equal(Object.keys(mapTranslations[language]||{}).length,20);for(const value of Object.values(mapTranslations[language]))assert.ok(value);}
});
import {notificationTranslations} from '../src/js/notification-translations.js';
test('notification controls and billing/report guidance cover every configured language',()=>{
    for(const language of Object.keys(LANGUAGES))for(const key of ['notifications.title','notifications.enable','phone.billing','phone.report'])assert.ok(notificationTranslations[language]?.[key]);
});
import { INTERFACE_KEYS, interfaceTranslations } from '../src/js/interface-translations.js';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import {initialProducts,mergeCatalogue} from '../functions/product-catalogue.mjs';
import {subscribeCatalogue} from '../src/js/catalogue-source.js';
import { PLATFORMS, normalizeProduct, validateCompatibility, productActions, safeURL, escapeHTML, productHref, productsByOwner, groupedProducts, findProduct, validateProductMetadata } from '../src/js/product-model.js';
import { validateSignup, passwordCriteria, canUseSensitiveFeatures, entryDestination, requiresEmailVerification, SESSION_KEYS } from '../src/js/auth-validation.js';
import { normalizeSettings, clampPosition, inactivityState, CHARACTER_APPEARANCES, characterAppearance } from '../src/js/character-state.js';
import { LANGUAGES, EXTRA_KEYS, extraTranslations } from '../src/js/language-data.js';
import { translations } from '../src/js/localization.js';
import { filterMessages, messageCounts } from '../src/js/feedback-model.js';
import { chatSenderName, isOwnChatMessage } from '../src/js/chat-model.js';
import { matchesCatalogue } from '../src/js/catalogue-filter.js';
import { PRIVACY_KEYS, privacyTranslations } from '../src/js/privacy-translations.js';
import { THEMES, normalizeTheme, themeScheme } from '../src/js/theme-model.js';
import { normalizePhone } from '../src/js/phone-model.js';
import { LOGIN_KEYS, loginTranslations } from '../src/js/login-translations.js';
test('four themes preserve valid choices and migrate retired blue to modern dark',()=>{
    assert.equal(THEMES.length,4);
    for (const theme of THEMES) { assert.equal(normalizeTheme(theme.id),theme.id); assert.equal(themeScheme(theme.id),theme.scheme); }
    assert.equal(normalizeTheme('blue'),'dark'); assert.equal(normalizeTheme('unknown'),'light');
});
test('phone numbers normalize display separators without guessing country codes',()=>{
    assert.equal(normalizePhone('+92 (300) 123-4567'),'+923001234567');
    for (const value of ['03001234567','+0123456789','+92300abc4567','+1','+1234567890123456']) assert.equal(normalizePhone(value),'');
});
test('identifier and phone guidance are translated in every configured language',()=>{
    for (const code of Object.keys(LANGUAGES)) {
        for (const key of LOGIN_KEYS) assert.equal(translations[code][key],loginTranslations[code][key]);
        for (const theme of THEMES) assert.ok(translations[code][theme.label]);
    }
});
test('platform filtering intersects category and translated search for all platform combinations', () => {
    for (let mask = 0; mask < 64; mask++) {
        const platforms = Object.fromEntries(PLATFORMS.map((platform, index) => [platform.id, !!(mask & (1 << index))]));
        const product = {category:'Software', platforms};
        assert.equal(matchesCatalogue(product), true);
        for (const platform of PLATFORMS) {
            assert.equal(matchesCatalogue(product, {platform:platform.id, category:'Software', search:' AG '}, 'AG Example'), platforms[platform.id]);
            assert.equal(matchesCatalogue(product, {platform:platform.id, category:'Other'}, 'AG Example'), false);
            assert.equal(matchesCatalogue(product, {platform:platform.id, search:'missing'}, 'AG Example'), false);
        }
    }
    assert.equal(matchesCatalogue({productLink:'https://example.com'}, {platform:'website'}), true);
    assert.equal(matchesCatalogue({downloadLink:'https://example.com'}, {platform:'windows'}), false);
    assert.equal(matchesCatalogue({platforms:{windows:false}, links:{windows:'https://example.com'}}, {platform:'windows'}), false);
    assert.equal(matchesCatalogue({}, {platform:'unknown'}), false);
});
test('privacy navigation copy covers every configured language', () => {
    for (const code of Object.keys(LANGUAGES)) for (const key of PRIVACY_KEYS) {
        assert.ok(privacyTranslations[code]['privacy.' + key]);
        assert.equal(translations[code]['privacy.' + key], privacyTranslations[code]['privacy.' + key]);
    }
});
const { canAssign, canRemove } = createRequire(import.meta.url)('../functions/permissions.js');
test('chat names prefer usernames and ownership uses UID before legacy email', () => {
    assert.equal(chatSenderName({senderName:'owner@example.test'}, {username:'ag-owner'}), 'ag-owner');
    assert.equal(chatSenderName({senderName:'owner@example.test'}), 'owner');
    assert.equal(chatSenderName({senderName:'Old Name'}, {username:'new-name'}), 'new-name');
    assert.equal(chatSenderName({}, {}, 'User'), 'User');
    const current = {uid:'owner', email:'owner@example.test'};
    assert.equal(isOwnChatMessage({senderId:'owner'}, current), true);
    assert.equal(isOwnChatMessage({senderId:'other',senderName:current.email}, current), false);
    assert.equal(isOwnChatMessage({senderName:'OWNER@example.test'}, current), true);
    assert.equal(isOwnChatMessage({senderId:'owner'}, null), false);
});
test('inbox filters keep legacy messages new and totals update after a status change', () => {
    const messages = [{id:'old'}, {id:'new',status:'unread'}, {id:'seen',status:'read'}, {id:'archived',status:'read',archived:true}];
    assert.deepEqual(messageCounts(messages), {all:4,read:2,unread:2});
    assert.deepEqual(filterMessages(messages,'unread').map(message=>message.id), ['old','new']);
    assert.equal(filterMessages(messages,'all').length,4);
    messages[0].status = 'read';
    assert.deepEqual(messageCounts(messages), {all:4,read:3,unread:1});
    assert.equal(filterMessages(messages,'unread')[0].id,'new');
});
for (let mask = 0; mask < 64; mask++) for (const download of [false, true]) {
    test(`platform combination ${mask.toString(2).padStart(6,'0')}, download site ${download}`, () => {
        const product = normalizeProduct({ platforms: Object.fromEntries(PLATFORMS.map((p,i) => [p.id, Boolean(mask & (1 << i))])), links: Object.fromEntries(PLATFORMS.map(p => [p.id, 'https://example.com/' + p.id])), downloadSite: { enabled: download, url: 'https://example.com/download' } });
        assert.deepEqual(validateCompatibility(product), {});
        assert.equal(productActions(product).length, PLATFORMS.filter((_,i) => mask & (1 << i)).length + Number(download));
        PLATFORMS.forEach(p => { if (!product.platforms[p.id]) assert.equal(product.links[p.id], ''); });
        if (!download) assert.equal(product.downloadSite.url, '');
    });
}
test('legacy product normalization preserves generic download without inventing an OS', () => {
    const data = normalizeProduct({ productLink:'https://example.com', downloadLink:'https://example.com/download', tags:['old'], price:0 });
    assert.equal(data.platforms.website, true); assert.equal(data.platforms.windows, false); assert.equal(data.tags[0],'old');
    assert.equal(data.downloadSite.enabled,true); assert.equal(data.price,0);
    assert.deepEqual(normalizeProduct(data),data);
});
test('modern disabled values cannot reactivate legacy links', () => {
    const data = normalizeProduct({ platforms:{ website:false }, productLink:'https://example.com', downloadSite:{ enabled:false,url:'https://example.com' }, downloadLink:'https://example.com' });
    assert.equal(productActions(data).length,0);
});
test('URL and HTML injection validation', () => {
    for (const url of ['javascript:alert(1)','data:text/html,x','https://user:password@example.com','ftp://example.com','https://', '', 'http://localhost']) assert.equal(safeURL(url),'');
    assert.equal(safeURL('https://example.com/a?x=1'),'https://example.com/a?x=1');
    assert.equal(safeURL('http://example.com'),'http://example.com/');
    assert.equal(safeURL('data:image/svg+xml,<svg/>',{image:true}),'');
    assert.equal(escapeHTML('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
    assert.ok(validateCompatibility({ platforms:{website:true},links:{website:''},downloadSite:{enabled:true,url:'javascript:x'} }).website);
});
const signup = { firstName:'Test',secondName:'Example',lastName:'',username:'test.user',email:'test@example.com',password:'ValidPassword12!',confirmPassword:'ValidPassword12!',dob:'2000-01-01' };

test('public catalogue uses only database snapshots, including empty collections and deletions',()=>{
    let next,fail,stopped=false;const emissions=[];
    const stop=subscribeCatalogue((onNext,onError)=>{next=onNext;fail=onError;return()=>{stopped=true;};},(items,state)=>emissions.push({items,state}));
    assert.deepEqual(emissions[0].items,[]);assert.equal(emissions[0].state.source,'loading');
    next({docs:[]});assert.deepEqual(emissions.at(-1).items,[]);assert.equal(emissions.at(-1).state.source,'live');
    const data={id:'spoofed',name:'AG Nexus',version:'v7',ownerIds:[],platforms:{linux:true},links:{linux:'https://example.com/linux'}};
    next({docs:[{id:'actual-document',data:()=>data}]});
    const {items,state}=emissions.at(-1);assert.equal(items.length,1);assert.equal(items[0].id,'actual-document');assert.equal(items[0].version,'v7');assert.deepEqual(items[0].ownerIds,[]);assert.equal(items[0].platforms.windows,false);assert.equal(items[0].platforms.android,false);assert.equal(items[0].platforms.linux,true);assert.deepEqual(state.persistedIds,['actual-document']);
    next({docs:[]});assert.deepEqual(emissions.at(-1).items,[]);
    const error=new Error('permission-denied');fail(error);assert.deepEqual(emissions.at(-1).items,[]);assert.equal(emissions.at(-1).state.error,error);assert.equal(emissions.at(-1).state.source,'error');
    stop();assert.equal(stopped,true);const count=emissions.length;next({docs:[]});fail(error);assert.equal(emissions.length,count);
});

test('initial database failure cannot publish fallback products',()=>{
    const emissions=[],error=new Error('unavailable');
    subscribeCatalogue((next,fail)=>{fail(error);return()=>{};},(items,state)=>emissions.push({items,state}));
    assert.equal(emissions.length,2);assert.deepEqual(emissions[1].items,[]);assert.equal(emissions[1].state.source,'error');
});

test('one supplied registry has 21 Windows products, five web projects and one cross-platform Nexus',()=>{
    assert.equal(initialProducts.length,26);assert.equal(new Set(initialProducts.map(product=>product.id)).size,26);
    const windows=initialProducts.filter(product=>product.platforms.windows),web=initialProducts.filter(product=>product.platforms.website);
    assert.equal(windows.length,21);assert.equal(web.length,5);assert.ok(windows.every(product=>product.version==='v0.0.1'));
    assert.deepEqual(web.map(product=>product.name),['AG Horizons','AG Password Manager','AG Islam','AG Atmos','AG Home']);
    assert.ok(web.every(product=>!product.platforms.windows&&!product.version&&!product.developmentCategories.includes('backend')));
    const nexus=findProduct(initialProducts,'ag-nexus');assert.ok(nexus.platforms.windows&&nexus.platforms.android);assert.equal(groupedProducts(initialProducts).find(group=>group.id==='android').products[0].id,nexus.id);
    for(const product of initialProducts){assert.deepEqual(product.ownerIds,['muhammad-hamza-sabir']);assert.equal(product.price,null);assert.equal(product.status,'');assert.equal(productActions(product).length,0);assert.deepEqual(validateCompatibility(product),{});}
});

test('catalogue identity preserves live content, confirmed versions and unrelated legacy data',()=>{
    const live=[{id:'legacy-nexus-id',name:'AG Nexus',category:'Browser',description:'Existing confirmed text',productLink:'https://example.com/nexus',version:'v0.0.2',custom:'keep'},
        {id:'legacy-side-id',name:'AG Network Diagnostics',productLink:'https://example.com/network'}];
    const products=mergeCatalogue(live),nexus=findProduct(products,'legacy-nexus-id');assert.equal(products.length,27);assert.equal(products.filter(product=>product.name==='AG Nexus').length,1);
    assert.equal(nexus.description,live[0].description);assert.equal(nexus.version,'v0.0.2');assert.equal(nexus.custom,'keep');assert.ok(!nexus.platforms.website&&nexus.platforms.windows&&nexus.platforms.android);
    assert.equal(nexus.translationKeys.category,undefined);assert.equal(findProduct(initialProducts,'ag-capture').translationKeys.category,'development.software');assert.equal(findProduct(initialProducts,'ag-atmos').translationKeys.category,'platform.website');
    assert.equal(productActions(nexus)[0].url,'https://example.com/nexus');assert.equal(nexus.linkStatus.android,'pending');assert.equal(productHref(nexus),'products.html#product=legacy-nexus-id');
    assert.equal(nexus.websiteUrl,'https://example.com/nexus');assert.equal(nexus.productLink,nexus.websiteUrl);assert.equal(nexus.links.website,'');assert.equal(groupedProducts(products).find(group=>group.id==='website').products.some(product=>product.id===nexus.id),false);
    assert.deepEqual(findProduct(products,'legacy-side-id').ownerIds,[]);assert.equal(productsByOwner(products,'muhammad-hamza-sabir').length,26);
    assert.equal(productHref({id:'record /#?'}),'products.html#product=record%20%2F%23%3F');
    const explicitWeb=mergeCatalogue([{id:'explicit-web',name:'AG Atmos',platforms:{windows:true},links:{windows:'https://example.com/windows'}}]);assert.equal(findProduct(explicitWeb,'explicit-web').platforms.website,false);
    assert.equal(findProduct(mergeCatalogue([{id:'missing-platforms',name:'AG Atmos',platforms:{}}]),'missing-platforms').platforms.website,true);
});

test('marketing websites stay separate from application platforms and explicit Website compatibility remains',()=>{
    const explicit=findProduct(mergeCatalogue([{id:'explicit-nexus',name:'AG Nexus',platforms:{website:true,windows:true,android:true},links:{website:'https://example.com/app'}}]),'explicit-nexus');
    assert.equal(explicit.platforms.website,true);assert.equal(explicit.links.website,'https://example.com/app');assert.equal(productActions(explicit).filter(action=>action.id==='website').length,1);
    const marketing={...structuredClone(initialProducts[0]),websiteUrl:'https://example.com/info',productLink:'https://example.com/info'};
    assert.deepEqual(validateCompatibility(marketing),{});assert.equal(productActions(marketing)[0].id,'websiteUrl');assert.equal(marketing.platforms.website,false);
    assert.ok(validateCompatibility({...marketing,schemaVersion:2}).websiteUrl);assert.ok(validateCompatibility({...marketing,websiteUrl:'javascript:alert(1)'}).websiteUrl);
    assert.deepEqual(validateCompatibility({...marketing,websiteUrl:'',productLink:''}),{});assert.equal(productActions({...marketing,websiteUrl:''}).length,0);
});

test('authoritative catalogue never resurrects deleted records or overrides cleared ownership',()=>{
    const products=mergeCatalogue([{...initialProducts[0],ownerIds:[],developmentCategories:[],platforms:{website:true},links:{website:'https://example.com'},linkStatus:{website:'ready'}}],{initialized:true});
    assert.equal(products.length,1);assert.deepEqual(products[0].ownerIds,[]);assert.deepEqual(products[0].developmentCategories,[]);assert.equal(products[0].platforms.windows,false);
    assert.deepEqual(mergeCatalogue([],{initialized:true}),[]);
    const draft=mergeCatalogue([{id:'ag-capture',name:'AG Capture',ownerIds:[]}]);assert.deepEqual(findProduct(draft,'ag-capture').ownerIds,[]);
});

test('pending links are explicit, cannot retain hidden URLs and do not loosen version 2 validation',()=>{
    const product=structuredClone(initialProducts[0]);assert.deepEqual(validateCompatibility(product),{});
    assert.ok(validateCompatibility({...product,schemaVersion:2}).windows);
    assert.ok(validateCompatibility({...product,links:{...product.links,windows:'https://example.com'},linkStatus:{...product.linkStatus,windows:'pending'}}).windows);
    assert.ok(validateCompatibility({...product,linkStatus:{...product.linkStatus,windows:'disabled'}}).windows);
    assert.ok(validateCompatibility({...product,linkStatus:{...product.linkStatus,website:'pending'}}).website);
    product.links.windows='https://example.com/download';product.linkStatus.windows='ready';assert.deepEqual(validateCompatibility(product),{});assert.equal(productActions(product).length,1);
    validateProductMetadata(product,['muhammad-hamza-sabir']);
    for(const bad of [{...product,ownerIds:['missing']},{...product,ownerIds:['muhammad-hamza-sabir','muhammad-hamza-sabir']},{...product,developmentCategories:['invented-area']}])assert.throws(()=>validateProductMetadata(bad,['muhammad-hamza-sabir']));
});

test('software download websites are separate, unpublished URLs are explicit and configured links survive',()=>{
    for(const product of initialProducts.filter(product=>product.platforms.windows||product.platforms.android))assert.deepEqual(product.downloadSite,{enabled:true,url:'',status:'pending'});
    const pending=structuredClone(initialProducts[0]);assert.deepEqual(validateCompatibility(pending),{});assert.equal(productActions(pending).length,0);assert.equal(pending.platforms.website,false);
    for(const site of [{enabled:true,url:'',status:'ready'},{enabled:true,url:'https://example.com/download',status:'pending'},{enabled:false,url:'',status:'pending'},{enabled:true,url:'javascript:alert(1)',status:'ready'}])assert.ok(validateCompatibility({...pending,downloadSite:site}).downloadSite);
    assert.ok(validateCompatibility({...pending,schemaVersion:2}).downloadSite);
    const ready={enabled:true,url:'https://example.com/download'};
    const migrated=findProduct(mergeCatalogue([{id:'legacy-download',name:'AG Capture',downloadLink:ready.url}]),'legacy-download');
    assert.equal(migrated.downloadSite.url,ready.url);assert.equal(productActions(migrated).filter(action=>action.id==='downloadSite').length,1);assert.equal(migrated.platforms.website,false);
    assert.deepEqual(findProduct(mergeCatalogue([{id:'disabled-download',name:'AG Capture',downloadSite:{enabled:false,url:''}}]),'disabled-download').downloadSite,{enabled:false,url:'',status:'disabled'});
});
test('signup validation blocks mismatch, invalid DOB, short password and missing names', () => {
    assert.equal(validateSignup(signup),'');
    assert.equal(validateSignup({...signup,confirmPassword:'other'}),'validation.mismatch');
    assert.equal(validateSignup({...signup,secondName:''}),'validation.required');
    assert.equal(validateSignup({...signup,dob:'2100-01-01'}),'validation.dob');
    assert.equal(validateSignup({...signup,password:'short',confirmPassword:'short'}),'validation.passwordLength');
    assert.equal(validateSignup({...signup,username:'bad name'}),'validation.username');
    assert.ok(Object.values(passwordCriteria(signup.password)).every(Boolean));
});
test('authentication routing and verification are independent of stored client flags', () => {
    assert.equal(entryDestination(null),null); assert.equal(entryDestination({uid:'test'}),null);
    assert.equal(entryDestination({isAnonymous:true}),'products.html');
    assert.equal(entryDestination({phoneNumber:'+15551234567',email:null}),'products.html');
    assert.equal(entryDestination({email:'user@example.com',emailVerified:false}),null);
    assert.equal(entryDestination({email:'user@example.com',emailVerified:true}),'home.html');
    assert.equal(requiresEmailVerification({email:'user@example.com',emailVerified:false,providerData:[{providerId:'google.com'}]}),true);
    assert.equal(requiresEmailVerification({isAnonymous:true,email:null}),false);
    assert.equal(canUseSensitiveFeatures({emailVerified:false}),false); assert.equal(canUseSensitiveFeatures({emailVerified:true}),true);
    assert.ok(!SESSION_KEYS.includes('language') && !SESSION_KEYS.includes('theme') && !SESSION_KEYS.includes('ag.character'));
    assert.ok(SESSION_KEYS.includes('ag.pendingVerification'));
});
test('23 phrase packs are complete with correct direction and script', () => {
    assert.equal(Object.keys(LANGUAGES).length,23);
    for (const [lang, [name, direction]] of Object.entries(LANGUAGES)) {
        assert.ok(name); assert.ok(['rtl','ltr'].includes(direction));
        for (const key of EXTRA_KEYS) assert.ok(extraTranslations[lang][key]?.trim(), `${lang}/${key}`);
        for (const key of INTERFACE_KEYS) assert.ok(interfaceTranslations[lang][key]?.trim(), `${lang}/${key}`);
        for (const key of Object.keys(translations.en)) assert.ok(translations[lang][key]?.trim(), `${lang}/${key}`);
    }
    for (const lang of ['ur','ar','pa','ps','bal','sd','hnd','skr']) assert.equal(LANGUAGES[lang][1],'rtl');
    assert.equal(LANGUAGES.ur_roman[1],'ltr'); assert.equal(LANGUAGES.pa[2],'pa-Arab');
    assert.notEqual(extraTranslations.fr['auth.invalidLink'],extraTranslations.en['auth.invalidLink']);
});
test('character boundaries, configuration, idle stages and fixed position', () => {
    assert.equal(normalizeSettings({}).gender,'male'); assert.equal(normalizeSettings({gender:'female'}).gender,'female');
    assert.equal(normalizeSettings({sleepMinutes:999}).sleepMinutes,120); assert.equal(normalizeSettings({sleepMinutes:0}).sleepMinutes,1);
    assert.equal(normalizeSettings({sleepMinutes:'invalid'}).sleepMinutes,15);
    assert.deepEqual(clampPosition(-100,1000,92,134,390,844),{x:8,y:702});
    assert.equal(inactivityState(0,15),'awake'); assert.equal(inactivityState(600000,15),'idle'); assert.equal(inactivityState(700000,15),'sit');
    assert.equal(inactivityState(800000,15),'yawn'); assert.equal(inactivityState(860000,15),'sleepy'); assert.equal(inactivityState(900000,15),'sleep');
    assert.deepEqual(normalizeSettings({glassMode:'fixed',glassPosition:{x:.2,y:.6}}).glassPosition,{x:.2,y:.6});
});

test('character appearances migrate saved robot preferences and preserve independent settings',()=>{
    const legacy={gender:'female',sleepMinutes:31,glassMode:'fixed',visible:false,position:{x:.2,y:.3},glassPosition:{x:.4,y:.5}};
    assert.deepEqual(normalizeSettings(legacy),{appearance:'robot',...legacy});
    assert.equal(normalizeSettings(null).appearance,'robot');assert.equal(normalizeSettings({appearance:'unknown'}).appearance,'robot');
    for(const appearance of CHARACTER_APPEARANCES){const saved=normalizeSettings({...legacy,appearance:appearance.id});assert.equal(saved.appearance,appearance.id);assert.equal(saved.gender,'female');assert.deepEqual(saved.position,legacy.position);assert.equal(saved.sleepMinutes,31);assert.equal(characterAppearance(saved.appearance).label,appearance.label);}
    for(const language of Object.keys(LANGUAGES))for(const key of ['character.appearance','character.gender',...CHARACTER_APPEARANCES.map(appearance=>appearance.label)])assert.ok(translations[language][key],language+'/'+key);
});
test('role hierarchy rejects privilege escalation and owner modification', () => {
    assert.equal(canAssign('USER','USER','MODERATOR'),false); assert.equal(canAssign('ADMIN','USER','ADMIN'),false);
    assert.equal(canAssign('SUPER_ADMIN','ADMIN','SUPER_ADMIN'),false); assert.equal(canAssign('OWNER','OWNER','USER'),false);
    assert.equal(canAssign('OWNER','USER','SUPER_ADMIN'),true); assert.equal(canAssign('ADMIN','USER','MODERATOR'),true);
    assert.equal(canRemove('MODERATOR','USER'),false); assert.equal(canRemove('SUPER_ADMIN','ADMIN'),true);
});
test('four separate email templates retain real Firebase placeholders', async () => {
    for (const [file, variables] of Object.entries({ Verification_Email:['%APP_NAME%','%DISPLAY_NAME%','%EMAIL%','%LINK%'], Password_Reset_Email:['%APP_NAME%','%EMAIL%','%LINK%'], Email_Change_Email:['%DISPLAY_NAME%','%NEW_EMAIL%','%LINK%'], MFA_Email:['%DISPLAY_NAME%','%SECOND_FACTOR%'] })) {
        const text = await readFile(`Emails/${file}.txt`,'utf8'); variables.forEach(value => assert.ok(text.includes(value)));
        assert.ok(text.includes('noreply@ag-home-3db3f.firebaseapp.com')); assert.ok(!text.includes('oobCode='));
        if (file === 'MFA_Email') assert.ok(!text.includes('%LINK%'));
    }
});
