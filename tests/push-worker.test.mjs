import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
const source=await readFile('public/firebase-messaging-sw.js','utf8');
function fixture(){
    let stored,background;const events={},shown=[],opened=[];
    const db={close(){},transaction(){const tx={objectStore(){return {put(value){stored=value;return {result:undefined};},get(){return {result:stored};}};}};queueMicrotask(()=>tx.oncomplete?.());return tx;}};
    const indexedDB={open(){const req={result:db};queueMicrotask(()=>req.onsuccess());return req;}};
    const self={location:{href:'https://example.test/AG-Home/firebase-messaging-sw.js?config='+encodeURIComponent(JSON.stringify({projectId:'demo-test'}))},addEventListener(type,listener){events[type]=listener;},skipWaiting(){},clients:{claim(){},matchAll:async()=>[],openWindow:async url=>opened.push(url)},registration:{showNotification:async(title,options)=>shown.push({title,options})}};
    vm.runInNewContext(source,{self,indexedDB,URL,importScripts(){},firebase:{initializeApp(){},messaging(){return {onBackgroundMessage(fn){background=fn;}};}}});
    const prefs=async(enabled,uid)=>{let pending;events.message({data:{type:'PUSH_CONFIG',enabled,uid},waitUntil(promise){pending=promise;}});await pending;};
    return {prefs,background:(data)=>background({data}),shown,opened,click:async path=>{let pending;events.notificationclick({notification:{data:{path},close(){}},waitUntil(promise){pending=promise;}});await pending;}};
}
test('worker persists opt-out and refuses notifications addressed to another signed-in user',async()=>{
    const f=fixture();await f.prefs(false,'u');await f.background({title:'Hidden',recipientUid:'u'});assert.equal(f.shown.length,0);
    await f.prefs(true,'u');await f.background({title:'Private',recipientUid:'other'});assert.equal(f.shown.length,0);
    await f.background({title:'New product',recipientUid:'u',eventId:'one',path:'products.html'});assert.equal(f.shown.length,1);assert.equal(f.shown[0].options.tag,'one');assert.equal(f.shown[0].options.icon,'https://example.test/AG-Home/logo.png');
    await f.prefs(false,null);await f.background({recipientUid:'u'});assert.equal(f.shown.length,1);
});
test('worker notification links stay within the AG Home base and reject external destinations',async()=>{
    const f=fixture();await f.click('control.html#reports');assert.equal(f.opened[0],'https://example.test/AG-Home/control.html#reports');
    await f.click('https://attacker.test');assert.equal(f.opened[1],'https://example.test/AG-Home/products.html');
    await f.click('products.html#product=ag-nexus');assert.equal(f.opened[2],'https://example.test/AG-Home/products.html#product=ag-nexus');
    await f.click('../products.html#product=ag-nexus');assert.equal(f.opened[3],'https://example.test/AG-Home/products.html');
});
