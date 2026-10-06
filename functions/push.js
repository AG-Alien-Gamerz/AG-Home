const {createHash}=require('node:crypto');
const STAFF=new Set(['OWNER','SUPER_ADMIN','ADMIN','MODERATOR']);
function eligible(kind,rank,actorUid,uid) { return actorUid!==uid && (kind==='product' || STAFF.has(rank)); }
async function deliver({db,auth,messaging,rank,eventId,kind,actorUid='',title,body='',path}) {
    const receipts=db.collection('_pushEvents'), receipt=receipts.doc(createHash('sha256').update(eventId).digest('hex'));
    const fresh=await db.runTransaction(async tx=>{if((await tx.get(receipt)).exists)return false;tx.create(receipt,{createdAt:new Date(),expiresAt:new Date(Date.now()+7*86400000)});return true;});
    if(!fresh)return {notificationsSent:0};
    const subscriptions=await db.collection('pushSubscriptions').where('enabled','==',true).get();let sent=0;
    for(const doc of subscriptions.docs) {
        const record=doc.data();let user;
        try {user=await auth.getUser(record.uid);} catch {await doc.ref.delete();continue;}
        if(user.disabled || !user.emailVerified || !user.email || !eligible(kind,await rank(user.email.toLowerCase()),actorUid,user.uid))continue;
        try {await messaging.send({token:record.token,data:{title,body,kind,path,eventId,recipientUid:user.uid},webpush:{headers:{TTL:'300'}}});sent++;}
        catch(error) {if(['messaging/registration-token-not-registered','messaging/invalid-registration-token'].includes(error.code))await doc.ref.delete();else console.error('Push delivery failed',error.code);}
    }
    return {notificationsSent:sent};
}
module.exports={eligible,deliver};
