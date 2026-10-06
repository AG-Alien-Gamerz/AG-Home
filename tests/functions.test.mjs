import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(new URL('../functions/package.json', import.meta.url));
process.env.FIREBASE_AUTH_EMULATOR_HOST = '127.0.0.1:9099';
process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore } = require('firebase-admin/firestore');
const project = 'demo-ag-home';
initializeApp({ projectId: project });
const auth = getAuth(), db = getFirestore(), password = 'TestPassword123!';
const tokens = {}, accounts = {};
test('only the first catalogue import event suppresses a product notification',()=>{
    const {isCatalogueImport}=require('../functions/product-events.js'),{Timestamp}=require('firebase-admin/firestore'),first=Timestamp.fromMillis(1000),later=Timestamp.fromMillis(2000);
    const imported={catalogueImportedAt:first,updatedAt:first};
    assert.equal(isCatalogueImport(null,imported),true);assert.equal(isCatalogueImport({name:'Old legacy record'},imported),true);
    assert.equal(isCatalogueImport(imported,{...imported,name:'New name',updatedAt:later}),false);
    assert.equal(isCatalogueImport(imported,{...imported,name:'Update with unchanged clock'}),false);
    assert.equal(isCatalogueImport(null,{name:'Ordinary new product',updatedAt:later}),false);
});
test('Team Management rejects forged/anonymous authority, validates history and detects stale revisions',async()=>{
    const seed=require('../functions/team-seed.json');await db.doc('organization/main').delete();
    const change={kind:'member',member:{...seed.members[0],nodeId:'frontend-team',role:'Lead Developer & Software Engineer'}};
    for(const email of [undefined,'server-unverified@example.test','server-forged@example.test','server-target@example.test','server-moderator@example.test'])assert.ok((await call('manageTeam',{revision:0,change},email)).body.error);
    const saved=await call('manageTeam',{revision:0,change},'server-admin@example.test');assert.equal(saved.status,200,JSON.stringify(saved.body));assert.equal((await db.doc('organization/main').get()).data().members.length,1);
    assert.equal((await call('manageTeam',{revision:0,change},'server-admin@example.test')).body.error.status,'ABORTED');
    assert.ok((await call('manageTeam',{revision:1,change:{kind:'member',member:{...change.member,startDate:'2025-01-01'}}},'server-admin@example.test')).body.error);
    assert.ok((await call('manageTeam',{revision:1,change:{kind:'node',node:{id:'frontend',name:'Frontend',type:'department',parentId:'frontend-team'}}},'server-admin@example.test')).body.error);
    assert.equal((await db.doc('organization/main').get()).data().revision,1);
});
test('push subscriptions require current verified identity and cannot be taken over',async()=>{
    const token='test-push-subscription-123456789';
    assert.ok((await call('setPushSubscription',{token,enabled:true})).body.error);
    assert.ok((await call('setPushSubscription',{token,enabled:true},'server-unverified@example.test')).body.error);
    assert.equal((await call('setPushSubscription',{token,enabled:true},'server-target@example.test')).status,200);
    assert.ok((await call('setPushSubscription',{token,enabled:true},'server-admin@example.test')).body.error);
    assert.equal((await call('setPushSubscription',{token,enabled:false},'server-target@example.test')).status,200);
});
test('safe signed-out phone error reports reach feedback and reject injected data',async()=>{
    assert.ok((await call('reportAuthError',{code:'phone-number +923001234567'})).body.error);
    assert.equal((await call('reportAuthError',{code:'auth/quota-exceeded',password:'must-not-store',phone:'+923001234567'})).status,200);
    const docs=await db.collection('messages').where('source','==','auth-error').get();
    assert.ok(docs.size);const report=docs.docs.at(-1).data();assert.equal(report.status,'unread');assert.ok(report.message.includes('auth/quota-exceeded'));assert.ok(!JSON.stringify(report).includes('must-not-store'));assert.ok(!JSON.stringify(report).includes('+923001234567'));
});
test('push dispatcher routes product events to users, private events to all staff, suppresses sender and duplicates',async()=>{
    const {deliver}=require('../functions/push.js');
    const sent=[];const ranks=new Map();const fixtures=[];
    for(const rank of ['USER','MODERATOR','ADMIN','SUPER_ADMIN','OWNER']){
        const uid='push-'+rank,email=uid.toLowerCase()+'@example.test';
        try{await auth.getUser(uid);}catch{await auth.createUser({uid,email,emailVerified:true});}
        ranks.set(email,rank);const ref=db.doc('pushSubscriptions/test-'+rank);await ref.set({uid,token:uid,enabled:true});fixtures.push(ref);
    }
    const dispatch=(eventId,kind,actorUid='')=>deliver({db,auth,messaging:{send:async message=>sent.push(message)},rank:async email=>ranks.get(email)||'USER',eventId,kind,actorUid,title:'Test',path:'products.html'});
    try{
        const id='push-test-'+Date.now();await dispatch(id,'product');assert.equal(sent.length,5);assert.ok(sent.every(message=>!message.notification && message.data.recipientUid));
        await dispatch(id,'product');assert.equal(sent.length,5);
        for(const kind of ['feedback','report','chat']){sent.length=0;await dispatch(id+kind,kind,'push-ADMIN');assert.equal(sent.length,3);assert.ok(!sent.some(message=>message.token==='push-USER'||message.token==='push-ADMIN'));}
        await fixtures[1].update({enabled:false});sent.length=0;await dispatch(id+'disabled','feedback');assert.equal(sent.length,3);
    }finally{await Promise.all(fixtures.map(ref=>ref.delete()));}
});
before(async () => {
    for (const email of ['ag.aliengamerz@gmail.com','server-admin@example.test','server-target@example.test','server-forged@example.test','server-unverified@example.test','server-moderator@example.test']) {
        let user; try { user = await auth.getUserByEmail(email); } catch { user = await auth.createUser({email,password}); }
        accounts[email] = await auth.updateUser(user.uid,{password,emailVerified:!email.includes('unverified'),disabled:false});
        await db.doc('users/'+user.uid).set({email,rank:email.includes('forged')?'OWNER':'USER',role:'USER'});
        const response = await fetch('http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email,password,returnSecureToken:true})});
        const credentials = await response.json(); assert.ok(credentials.idToken); tokens[email] = credentials.idToken;
    }
    await db.doc('admins/server-admin@example.test').set({email:'server-admin@example.test',userId:accounts['server-admin@example.test'].uid,isSuperAdmin:false});
    await db.doc('moderators/server-moderator@example.test').set({email:'server-moderator@example.test',userId:accounts['server-moderator@example.test'].uid});
});
async function call(name, data, email) {
    const response = await fetch(`http://127.0.0.1:5001/${project}/us-central1/${name}`,{method:'POST',headers:{'Content-Type':'application/json',...(email?{Authorization:'Bearer '+tokens[email]}:{})},body:JSON.stringify({data})});
    return {status:response.status,body:await response.json()};
}
test('callable role changes reject anonymous, unverified and forged profile authority',async()=>{
    for(const email of [undefined,'server-unverified@example.test','server-forged@example.test']) {
        const result=await call('setUserRole',{targetEmail:'server-target@example.test',role:'MODERATOR'},email);
        assert.ok(result.status>=400); assert.ok(result.body.error);
    }
    assert.equal((await db.doc('moderators/server-target@example.test').get()).exists,false);
});
test('server role hierarchy, audit, owner protection and immediate role revocation',async()=>{
    const target='server-target@example.test', administrator='server-admin@example.test', owner='ag.aliengamerz@gmail.com';
    assert.ok((await call('setUserRole',{targetEmail:target,role:'SUPER_ADMIN'},administrator)).body.error);
    assert.ok((await call('setUserRole',{targetEmail:owner,role:'USER'},administrator)).body.error);
    const assigned=await call('setUserRole',{targetEmail:target,role:'MODERATOR'},administrator);assert.equal(assigned.status,200,JSON.stringify(assigned.body));assert.equal(assigned.body.result.success,true);
    assert.equal((await db.doc('users/'+accounts[target].uid).get()).data().rank,'MODERATOR');
    assert.equal((await db.doc('moderators/'+target).get()).exists,true);
    const removed=await call('removeUserRole',{targetEmail:target,role:'MODERATOR'},administrator);assert.equal(removed.body.result.success,true);
    assert.equal((await db.doc('moderators/'+target).get()).exists,false);
    assert.ok((await db.collection('admin_logs').where('targetEmail','==',target).get()).size>=2);
});
test('message updates require staff and reject unauthorized fields',async()=>{
    await db.doc('messages/server-message').set({message:'Test message',userId:accounts['server-target@example.test'].uid,status:'unread'});
    assert.ok((await call('updateMessage',{messageId:'server-message',updates:{status:'read'}},'server-target@example.test')).body.error);
    assert.ok((await call('updateMessage',{messageId:'server-message',updates:{userId:'attacker'}},'server-admin@example.test')).body.error);
    const updated=await call('updateMessage',{messageId:'server-message',updates:{status:'read',adminReply:'Reviewed'}},'server-admin@example.test');assert.equal(updated.status,200,JSON.stringify(updated.body));assert.equal(updated.body.result.success,true);
    assert.equal((await db.doc('messages/server-message').get()).data().status,'read');
});
test('old verified tokens cannot authorize a now-unverified identity',async()=>{
    await auth.updateUser(accounts['server-admin@example.test'].uid,{emailVerified:false});
    assert.ok((await call('setUserRole',{targetEmail:'server-target@example.test',role:'MODERATOR'},'server-admin@example.test')).body.error);
    await auth.updateUser(accounts['server-admin@example.test'].uid,{emailVerified:true});
});
test('HTTP compatibility endpoint rejects missing bearer authentication',async()=>{
    const response=await fetch(`http://127.0.0.1:5001/${project}/us-central1/setUserRoleCors`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({targetEmail:'server-target@example.test',role:'ADMIN'})});
    assert.equal(response.status,401);
});
test('username sign-in verifies Firebase password before disclosing email and follows actual Auth identity',async()=>{
    const email='server-target@example.test', account=accounts[email];
    await db.doc('users/'+account.uid).set({username:'Server.User',usernameKey:'server.user',email:'stale@example.test'}, {merge:true});
    for (const data of [{username:'not.found',password},{username:'Server.User',password:'WrongPassword123!'}]) {
        const result=await call('signInUsername',data);
        assert.equal(result.body.error.status,'UNAUTHENTICATED');assert.ok(!JSON.stringify(result.body).includes(email));
    }
    const valid=await call('signInUsername',{username:'SERVER.USER',password});assert.equal(valid.status,200,JSON.stringify(valid.body));assert.deepEqual(valid.body.result,{email});
    await auth.updateUser(account.uid,{disabled:true});assert.equal((await call('signInUsername',{username:'Server.User',password})).body.error.status,'UNAUTHENTICATED');await auth.updateUser(account.uid,{disabled:false});
    await db.doc('users/duplicate-server-name').set({username:'Server.User',usernameKey:'server.user'});
    assert.equal((await call('signInUsername',{username:'Server.User',password})).body.error.status,'UNAUTHENTICATED');await db.doc('users/duplicate-server-name').delete();
});

test('catalogue initialization is administrator-only, preserves data and never restores deletions',async()=>{
    const {initialProducts,knownProduct}=await import('../functions/product-catalogue.mjs');
    const marker=db.doc('catalogue/main'),legacy=db.doc('products/function-existing-nexus'),unrelated=db.doc('products/function-unrelated');
    const previousMarker=await marker.get(),previousKnown=(await db.collection('products').get()).docs.filter(document=>knownProduct({...document.data(),id:document.id}));
    const prepare=db.batch();for(const document of previousKnown)prepare.delete(document.ref);await prepare.commit();
    await marker.delete();
    await legacy.set({name:'AG Nexus',name_en:'AG Nexus',description:'Confirmed original description',productLink:'https://example.com/nexus',version:'v0.0.2',custom:'retain',category:'Browser',price:17,stock:3,rating:4,image:null});
    await unrelated.set({name:'Unrelated function fixture',custom:'preserve'});
    try{
        for(const email of [undefined,'server-unverified@example.test','server-forged@example.test','server-target@example.test','server-moderator@example.test'])assert.ok((await call('initializeCatalogue',{},email)).body.error);
        const response=await call('initializeCatalogue',{},'server-admin@example.test');assert.equal(response.status,200,JSON.stringify(response.body));assert.equal(response.body.result.created,25);assert.equal(response.body.result.updated,1);
        const nexus=(await legacy.get()).data();assert.equal(nexus.description,'Confirmed original description');assert.equal(nexus.version,'v0.0.2');assert.equal(nexus.custom,'retain');assert.ok(nexus.platforms.windows&&nexus.platforms.android&&!nexus.platforms.website);assert.equal(nexus.links.website,'');assert.equal(nexus.websiteUrl,'https://example.com/nexus');assert.equal(nexus.productLink,nexus.websiteUrl);assert.equal(nexus.linkStatus.windows,'pending');assert.deepEqual(nexus.ownerIds,['muhammad-hamza-sabir']);
        assert.deepEqual(nexus.downloadSite,{enabled:true,url:'',status:'pending'});
        assert.equal((await unrelated.get()).data().custom,'preserve');const state=(await marker.get()).data();assert.equal(state.initialized,true);assert.equal(state.initializedBy,undefined);assert.ok(nexus.catalogueImportedAt.isEqual(nexus.updatedAt));
        await db.doc('products/ag-capture').delete();await legacy.update({ownerIds:[]});
        const again=await call('initializeCatalogue',{},'server-admin@example.test');assert.equal(again.body.result.alreadyInitialized,true);assert.equal((await db.doc('products/ag-capture').get()).exists,false);assert.deepEqual((await legacy.get()).data().ownerIds,[]);
    }finally{
        const batch=db.batch();for(const product of initialProducts)batch.delete(db.doc('products/'+product.id));batch.delete(legacy);batch.delete(unrelated);batch.delete(marker);await batch.commit();
        const restore=db.batch();for(const document of previousKnown)restore.set(document.ref,document.data());if(previousMarker.exists)restore.set(marker,previousMarker.data());await restore.commit();
    }
});
