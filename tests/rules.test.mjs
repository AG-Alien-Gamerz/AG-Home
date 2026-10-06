import test, { before, after } from 'node:test';
import { readFile } from 'node:fs/promises';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import {initialProducts} from '../functions/product-catalogue.mjs';
import { PLATFORMS, normalizeProduct } from '../src/js/product-model.js';
let env;
before(async () => {
    env=await initializeTestEnvironment({projectId:'demo-ag-home',firestore:{host:'127.0.0.1',port:8080,rules:await readFile('firestore.rules','utf8')}});
    await env.withSecurityRulesDisabled(async context=>{
        await setDoc(doc(context.firestore(),'admins','admin@example.test'),{email:'admin@example.test',isSuperAdmin:false,userId:'administrator'});
        await setDoc(doc(context.firestore(),'users','victim'),{email:'victim@example.test',role:'USER',rank:'USER',dateOfBirth:'2000-01-01'});
        await setDoc(doc(context.firestore(),'users','forged'),{email:'forged@example.test',role:'OWNER',rank:'OWNER'});
    });
});
after(async()=>env?.cleanup());
const userDB=(uid,email,verified=true)=>env.authenticatedContext(uid,{email,email_verified:verified}).firestore();
const product=mask=>({...normalizeProduct({platforms:Object.fromEntries(PLATFORMS.map((p,i)=>[p.id,Boolean(mask&(1<<i))])),links:Object.fromEntries(PLATFORMS.map(p=>[p.id,'https://example.com/'+p.id])),downloadSite:{enabled:false,url:''}}),name:'Test',category:'Software',price:0,stock:-1,rating:0,image:null,productLink:mask&1?'https://example.com/website':'',downloadLink:''});
test('public catalogue read and unauthorized writes',async()=>{
    const publicDB=env.unauthenticatedContext().firestore();await assertSucceeds(getDoc(doc(publicDB,'products','test-catalogue')));
    await assertFails(setDoc(doc(publicDB,'products','unauthorized'),product(1)));
    await assertFails(setDoc(doc(userDB('normal','normal@example.test'),'products','unauthorized'),product(1)));
    await assertFails(setDoc(doc(userDB('owner-unverified','ag.aliengamerz@gmail.com',false),'products','unauthorized'),product(1)));
    await assertFails(setDoc(doc(userDB('forged','forged@example.test'),'products','unauthorized'),product(1)));
});
test('organization biographies are public but even administrators cannot bypass the callable',async()=>{
    for(const context of [env.unauthenticatedContext(),env.authenticatedContext('normal',{email:'normal@example.test',email_verified:true}),env.authenticatedContext('owner',{email:'ag.aliengamerz@gmail.com',email_verified:true})]){
        await assertSucceeds(getDoc(doc(context.firestore(),'organization','main')));
        await assertFails(setDoc(doc(context.firestore(),'organization','main'),{members:[]}));
        await assertFails(deleteDoc(doc(context.firestore(),'organization','main')));
        await assertFails(getDoc(doc(context.firestore(),'organization','private')));
    }
});
test('profile creation rejects self-assigned rank, role, foreign UID and spoofed email',async()=>{
    await env.withSecurityRulesDisabled(context=>deleteDoc(doc(context.firestore(),'users','profile-new')));
    const db=userDB('profile-new','profile-new@example.test',false),base={email:'profile-new@example.test',role:'USER',rank:'USER',firstName:'Test'};
    await assertFails(setDoc(doc(db,'users','profile-new'),{...base,rank:'OWNER'}));
    await assertFails(setDoc(doc(db,'users','profile-new'),{...base,role:'ADMIN'}));
    await assertFails(setDoc(doc(db,'users','someone-else'),base));
    await assertFails(setDoc(doc(db,'users','profile-new'),{...base,email:'ag.aliengamerz@gmail.com'}));
    await assertSucceeds(setDoc(doc(db,'users','profile-new'),base));
    await assertFails(updateDoc(doc(db,'users','profile-new'),{role:'ADMIN'}));
    await assertFails(updateDoc(doc(db,'users','profile-new'),{rank:'ADMIN'}));
    await assertSucceeds(updateDoc(doc(db,'users','profile-new'),{firstName:'Changed'}));
});
test('private profiles and server-only role records',async()=>{
    const db=userDB('normal','normal@example.test');await assertFails(getDoc(doc(db,'users','victim')));
    await assertSucceeds(getDoc(doc(userDB('victim','victim@example.test'),'users','victim')));
    await assertFails(setDoc(doc(userDB('owner','ag.aliengamerz@gmail.com'),'admins','normal@example.test'),{email:'normal@example.test',isSuperAdmin:true}));
    await assertFails(setDoc(doc(db,'moderators','normal@example.test'),{email:'normal@example.test'}));
});
test('username normalization and login rate-limit records remain server owned',async()=>{
    const db=userDB('victim','victim@example.test');
    await assertFails(updateDoc(doc(db,'users','victim'),{usernameKey:'other.account'}));
    for (const context of [env.unauthenticatedContext(),env.authenticatedContext('victim',{email:'victim@example.test',email_verified:true})]) {
        await assertFails(getDoc(doc(context.firestore(),'_loginAttempts','test')));
        await assertFails(setDoc(doc(context.firestore(),'_loginAttempts','test'),{count:0}));
        for(const collection of ['pushSubscriptions','_pushEvents','_authReports']) {
            await assertFails(getDoc(doc(context.firestore(),collection,'test')));
            await assertFails(setDoc(doc(context.firestore(),collection,'test'),{uid:'victim',enabled:true}));
        }
    }
});
test('verified administrator can save every platform combination',async()=>{
    const db=userDB('administrator','admin@example.test');
    for(let mask=0;mask<64;mask++)await assertSucceeds(setDoc(doc(db,'products','rules-'+mask),product(mask)));
    await assertSucceeds(setDoc(doc(db,'products','rules-download'),{...product(6),downloadSite:{enabled:true,url:'https://example.com/download'},downloadLink:'https://example.com/download'}));
});
test('rules reject malformed products and inactive links',async()=>{
    const db=userDB('administrator','admin@example.test'),base=product(1),ref=doc(db,'products','invalid-product');
    for(const value of [{...base,links:{...base.links,website:''}},{...base,links:{...base.links,website:'javascript:alert(1)'}},{...base,links:{...base.links,windows:'https://example.com'}},{...base,downloadSite:{enabled:true,url:''}},{...base,price:-1},{...base,rating:6},{...base,stock:-2},{...base,image:'data:image/svg+xml,<svg/>'},{...base,platforms:{...base.platforms,extra:true}}])await assertFails(setDoc(ref,value));
});
test('status cannot be written for another user and reports require verification',async()=>{
    const db=userDB('normal','normal@example.test');await assertFails(setDoc(doc(db,'status','victim'),{online:true,lastSeen:new Date()}));
    await assertSucceeds(setDoc(doc(db,'status','normal'),{online:true,lastSeen:new Date()}));
    await assertFails(setDoc(doc(userDB('unverified','unverified@example.test',false),'reports','unverified-report'),{productId:'test-catalogue',productName:'Test',reason:'other',details:'',reportedBy:'unverified',userEmail:'unverified@example.test',status:'pending',timestamp:new Date()}));
});

test('pending catalogue links and indexed owner references are validated on the server',async()=>{
    const admin=userDB('administrator','admin@example.test'),publicDB=env.unauthenticatedContext().firestore(),base=structuredClone(initialProducts[0]),ref=doc(admin,'products','rules-pending');
    let previous;
    await env.withSecurityRulesDisabled(async context=>{const org=doc(context.firestore(),'organization','main'),snapshot=await getDoc(org);previous=snapshot.exists()?snapshot.data():null;await setDoc(org,{memberIds:['muhammad-hamza-sabir','rules-member']},{merge:true});});
    try{
        await assertSucceeds(getDoc(doc(publicDB,'catalogue','main')));await assertFails(setDoc(doc(admin,'catalogue','main'),{initialized:true}));
        await assertSucceeds(setDoc(ref,base));await assertSucceeds(setDoc(ref,{...base,ownerIds:['rules-member']}));await assertSucceeds(setDoc(ref,{...base,ownerIds:[]}));
        await assertSucceeds(setDoc(ref,{...base,websiteUrl:'https://example.com/info',productLink:'https://example.com/info'}));
        await assertSucceeds(setDoc(ref,{...base,downloadSite:{enabled:true,url:'https://example.com/download',status:'ready'},downloadLink:'https://example.com/download'}));
        for(const site of [{enabled:true,url:'',status:'ready'},{enabled:true,url:'https://example.com/download',status:'pending'},{enabled:false,url:'',status:'pending'},{enabled:true,url:'javascript:alert(1)',status:'ready'}])await assertFails(setDoc(ref,{...base,downloadSite:site,downloadLink:site.url}));
        await assertFails(setDoc(ref,{...base,websiteUrl:'javascript:alert(1)',productLink:'javascript:alert(1)'}));
        await assertFails(setDoc(ref,{...base,websiteUrl:'https://example.com/info',productLink:''}));
        for(const bad of [{...base,ownerIds:['fake-member']},{...base,ownerIds:['muhammad-hamza-sabir','muhammad-hamza-sabir']},{...base,developmentCategories:['invented']},{...base,schemaVersion:2},{...base,links:{...base.links,windows:'https://example.com'}},{...base,linkStatus:{...base.linkStatus,windows:'disabled'}},{...base,linkStatus:{...base.linkStatus,website:'pending'}},{...base,catalogueImportedAt:new Date()}])await assertFails(setDoc(ref,bad));
        await env.withSecurityRulesDisabled(context=>setDoc(doc(context.firestore(),'products','rules-pending'),{...base,catalogueImportedAt:new Date()}));
        await assertSucceeds(updateDoc(ref,{version:'v0.0.2'}));await assertFails(updateDoc(ref,{catalogueImportedAt:new Date()}));await assertFails(updateDoc(ref,{catalogueImportedAt:null}));
        await assertFails(setDoc(doc(userDB('normal','normal@example.test'),'products','rules-pending'),base));
    }finally{await env.withSecurityRulesDisabled(async context=>{const org=doc(context.firestore(),'organization','main');previous?await setDoc(org,previous):await deleteDoc(org);});}
});
