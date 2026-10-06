// Dry-run by default. Uses trusted Admin credentials; never reads or outputs passwords/emails.
const {createRequire} = require('node:module');
const path = require('node:path');
const dependencies = createRequire(path.join(__dirname,'../functions/package.json'));
const {initializeApp} = dependencies('firebase-admin/app');
const {getFirestore} = dependencies('firebase-admin/firestore');
const {normalizeUsername} = require('../functions/username-login');
const index = process.argv.indexOf('--project'), projectId = process.argv[index+1];
if (index<0 || !projectId || projectId.startsWith('--')) throw new Error('Specify --project <Firebase-project-ID>; add --write only after reviewing the dry-run.');
initializeApp({projectId});
(async()=>{
    const db=getFirestore(), profiles=await db.collection('users').get(), updates=[], groups=new Map();
    for (const profile of profiles.docs) {
        const data=profile.data(), key=normalizeUsername(data.username); if(!key)continue;
        groups.set(key,(groups.get(key)||0)+1);
        if(data.usernameKey!==key) updates.push({ref:profile.ref,key});
    }
    console.log({projectId,profiles:profiles.size,updates:updates.length,ambiguousNames:[...groups.values()].filter(count=>count>1).length,write:process.argv.includes('--write')});
    if(!process.argv.includes('--write')) return;
    for(let offset=0;offset<updates.length;offset+=400) {
        const batch=db.batch(); for(const update of updates.slice(offset,offset+400))batch.update(update.ref,{usernameKey:update.key});await batch.commit();
    }
})().catch(error=>{console.error(error.message);process.exitCode=1;});
