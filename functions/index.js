const functions = require('firebase-functions/v1');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const { getFirestore, FieldValue } = require('firebase-admin/firestore');
const { getMessaging } = require('firebase-admin/messaging');
const express = require('express');
const cors = require('cors');
const { canAssign, canRemove, ownerEmails } = require('./permissions');
const {normalizeUsername, usernameLogin} = require('./username-login');
const {deliver}=require('./push');
const {createHash}=require('node:crypto');
initializeApp();
const db = getFirestore();
const stamp = () => FieldValue.serverTimestamp();
exports.signInUsername = functions.runWith({timeoutSeconds:20,maxInstances:10}).https.onCall((data,context)=>usernameLogin(data,context, {
    db, auth:getAuth(), apiKey:process.env.FIREBASE_WEB_API_KEY,
    emulatorHost:process.env.FUNCTIONS_EMULATOR === 'true' ? process.env.FIREBASE_AUTH_EMULATOR_HOST : undefined
}));
exports.normalizeProfileUsername = functions.firestore.document('users/{uid}').onWrite(async change => {
    if (!change.after.exists) return;
    const profile = change.after.data(), usernameKey = normalizeUsername(profile.username);
    if (profile.usernameKey === usernameKey || (!usernameKey && !profile.usernameKey)) return;
    await change.after.ref.update({usernameKey});
});
async function userRank(email) {
    if (ownerEmails.includes(email)) return 'OWNER';
    const administrator = await db.doc(`admins/${email}`).get();
    if (administrator.exists) return administrator.data().isSuperAdmin ? 'SUPER_ADMIN' : 'ADMIN';
    return (await db.doc(`moderators/${email}`).get()).exists ? 'MODERATOR' : 'USER';
}
async function authorize(context) {
    if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Sign in required.');
    if (!context.auth.token.email_verified || !context.auth.token.email) throw new functions.https.HttpsError('permission-denied', 'Verified email required.');
    const email = context.auth.token.email.toLowerCase();
    const user = await getAuth().getUser(context.auth.uid);
    if (user.disabled || !user.emailVerified || user.email?.toLowerCase() !== email) throw new functions.https.HttpsError('permission-denied', 'Current verified identity required.');
    return { email, rank: await userRank(email) };
}
exports.manageTeam=require('./team')({functions,db,authorize,stamp});
exports.initializeCatalogue=require('./catalogue')({functions,db,authorize,stamp});
async function changeRole(data, context, removing = false) {
    const caller = await authorize(context), targetEmail = String(data?.targetEmail || '').trim().toLowerCase();
    const requested = removing ? 'USER' : data?.role;
    if (!/^[^\s@/]+@[^\s@/]+\.[^\s@/]+$/.test(targetEmail)) throw new functions.https.HttpsError('invalid-argument', 'Valid target email required.');
    const oldRole = await userRank(targetEmail);
    if (targetEmail === caller.email || ownerEmails.includes(targetEmail) || !(removing ? canRemove(caller.rank, oldRole) : canAssign(caller.rank, oldRole, requested))) {
        throw new functions.https.HttpsError('permission-denied', 'This role change is not permitted.');
    }
    let user;
    try { user = await getAuth().getUserByEmail(targetEmail); } catch { throw new functions.https.HttpsError('not-found', 'The user must create an account first.'); }
    const batch = db.batch();
    batch.delete(db.doc(`admins/${targetEmail}`)); batch.delete(db.doc(`moderators/${targetEmail}`));
    if (['ADMIN','SUPER_ADMIN'].includes(requested)) batch.set(db.doc(`admins/${targetEmail}`), { email: targetEmail, userId: user.uid, isSuperAdmin: requested === 'SUPER_ADMIN', addedBy: caller.email, addedAt: stamp() });
    if (requested === 'MODERATOR') batch.set(db.doc(`moderators/${targetEmail}`), { email: targetEmail, userId: user.uid, addedBy: caller.email, addedAt: stamp() });
    batch.set(db.doc(`users/${user.uid}`), { email: targetEmail, role: requested, rank: requested, updatedAt: stamp(), updatedBy: caller.email }, { merge: true });
    batch.set(db.collection('admin_logs').doc(), { action: removing ? 'ROLE_REMOVE' : 'ROLE_CHANGE', targetEmail, oldRole, newRole: requested, performedBy: caller.email, timestamp: stamp() });
    await batch.commit();
    // Rules use server-owned role documents, so revocation takes effect without a token refresh.
    return { success: true };
}
exports.setUserRole = functions.https.onCall((data, context) => changeRole(data, context));
exports.removeUserRole = functions.https.onCall((data, context) => changeRole(data, context, true));
async function updateMessage(data, context) {
    const caller = await authorize(context);
    if (!['OWNER','SUPER_ADMIN','ADMIN','MODERATOR'].includes(caller.rank)) throw new functions.https.HttpsError('permission-denied', 'Staff only.');
    if (!data?.messageId || data.messageId.includes('/') || !data.updates || typeof data.updates !== 'object') throw new functions.https.HttpsError('invalid-argument', 'Invalid message update.');
    const updates = {};
    if ('status' in data.updates) { if (!['read','unread'].includes(data.updates.status)) throw new functions.https.HttpsError('invalid-argument', 'Invalid status.'); updates.status = data.updates.status; }
    if ('archived' in data.updates) { if (typeof data.updates.archived !== 'boolean') throw new functions.https.HttpsError('invalid-argument', 'Invalid archive state.'); updates.archived = data.updates.archived; }
    if ('adminReply' in data.updates) { if (typeof data.updates.adminReply !== 'string' || data.updates.adminReply.length > 10000) throw new functions.https.HttpsError('invalid-argument', 'Invalid reply.'); updates.adminReply = data.updates.adminReply; }
    if (!Object.keys(updates).length) throw new functions.https.HttpsError('invalid-argument', 'No allowed updates.');
    await db.doc(`messages/${data.messageId}`).update({ ...updates, handledBy: caller.email, handledAt: stamp() });
    await db.collection('admin_logs').add({ action: 'MESSAGE_UPDATE', messageId: data.messageId, performedBy: caller.email, timestamp: stamp() });
    return { success: true };
}
exports.updateMessage = functions.https.onCall(updateMessage);
function httpEndpoint(handler) {
    const app = express();
    const origins = (process.env.ALLOWED_ORIGINS || 'https://ag-pixel-creater.github.io,http://localhost:5173,http://127.0.0.1:5173').split(',');
    app.use(cors({ origin: (origin, callback) => callback(null, !origin || origins.includes(origin)), methods: ['POST','OPTIONS'], allowedHeaders: ['Content-Type','Authorization'] }));
    app.use(express.json({ limit: '32kb' }));
    app.post('/', async (req, res) => {
        try {
            const match = /^Bearer (.+)$/.exec(req.get('Authorization') || '');
            if (!match) return res.status(401).json({ error: 'unauthenticated' });
            const token = await getAuth().verifyIdToken(match[1], true);
            const result = await handler(req.body, { auth: { uid: token.uid, token } }); res.json(result);
        } catch (error) { res.status(error.code === 'permission-denied' ? 403 : error.code === 'invalid-argument' ? 400 : 401).json({ error: error.code || 'internal' }); }
    });
    return functions.https.onRequest(app);
}
exports.setUserRoleCors = httpEndpoint(changeRole);
exports.updateMessageCors = httpEndpoint(updateMessage);
async function notify(messageId) {
    const reference = db.doc(`messages/${messageId}`);
    const message = await db.runTransaction(async tx => {
        const snapshot = await tx.get(reference); if (!snapshot.exists || snapshot.data().notificationAttempted) return null;
        tx.update(reference, { notificationAttempted: true }); return snapshot.data();
    });
    if (!message) return { success: true, notificationsSent: 0 };
    return {success:true,...await pushEvent('feedback:'+messageId,'feedback',message.userId,'AG Home · New feedback','control.html#messages')};
}
function pushEvent(eventId,kind,actorUid,title,path) {return deliver({db,auth:getAuth(),messaging:getMessaging(),rank:userRank,eventId,kind,actorUid,title,path});}
exports.setPushSubscription=functions.https.onCall(async(data,context)=>{
    await authorize(context);
    if(typeof data?.token!=='string' || data.token.length<20 || data.token.length>4096 || typeof data.enabled!=='boolean')throw new functions.https.HttpsError('invalid-argument','Invalid subscription.');
    const ref=db.doc('pushSubscriptions/'+createHash('sha256').update(data.token).digest('hex'));
    const old=await ref.get();
    if(old.exists && old.data().uid!==context.auth.uid)throw new functions.https.HttpsError('permission-denied','Subscription belongs to another session.');
    if(data.enabled)await ref.set({uid:context.auth.uid,token:data.token,enabled:true,updatedAt:stamp()});else await ref.delete();
    return {success:true};
});
exports.reportAuthError=functions.https.onCall(async(data,context)=>{
    const code=String(data?.code||'');
    if(!/^auth\/[a-z-]{1,70}$/.test(code))throw new functions.https.HttpsError('invalid-argument','Invalid error code.');
    const bucket=Math.floor(Date.now()/3600000),key=createHash('sha256').update((context.rawRequest?.ip||'unknown')+':'+bucket).digest('hex');
    const ref=db.doc('_authReports/'+key);
    await db.runTransaction(async tx=>{const old=await tx.get(ref);if((old.data()?.count||0)>=3)throw new functions.https.HttpsError('resource-exhausted','Try later.');tx.set(ref,{count:(old.data()?.count||0)+1,expiresAt:new Date(Date.now()+7200000)});});
    await db.collection('messages').add({name:'Phone sign-in error report',email:'',userId:context.auth?.uid||'anonymous',message:'Phone SMS request failed. Firebase error: '+code+'. Firebase SMS requires billing; check provider, SMS regions, authorized domain and reCAPTCHA configuration.',timestamp:stamp(),status:'unread',archived:false,source:'auth-error'});
    return {success:true};
});
exports.onNewReport=functions.firestore.document('reports/{id}').onCreate((snapshot,context)=>pushEvent(context.eventId,'report',snapshot.data().reportedBy,'AG Home · New report','control.html#reports'));
exports.onNewChat=functions.firestore.document('global_chat/{id}').onCreate((snapshot,context)=>pushEvent(context.eventId,'chat',snapshot.data().senderId,'AG Home · New chat message','control.html#chats'));
exports.onProductChanged=functions.firestore.document('products/{id}').onWrite(async(change,context)=>{
    if(!change.after.exists)return null;
    const after=change.after.data(),before=change.before.exists?change.before.data():null;
    if(before && JSON.stringify(before)===JSON.stringify(after))return null;
    // All imported documents share their commit timestamp. Only that first event
    // is quiet; ordinary later edits continue to notify opted-in subscribers.
    if(require('./product-events').isCatalogueImport(before,after))return null;
    const {productHref}=await import('./product-model.mjs');
    return pushEvent(context.eventId,'product','',before?'AG Home · Product updated':'AG Home · New product',productHref(context.params.id));
});
exports.onNewMessage = functions.firestore.document('messages/{messageId}').onCreate((snap, context) => notify(context.params.messageId));
exports.notifyAdmin = functions.https.onCall(async (data, context) => {
    await authorize(context);
    if (!data?.messageId || data.messageId.includes('/')) throw new functions.https.HttpsError('invalid-argument', 'Message required.');
    const message = await db.doc(`messages/${data.messageId}`).get();
    if (!message.exists || message.data().userId !== context.auth.uid) throw new functions.https.HttpsError('permission-denied', 'Own messages only.');
    return notify(data.messageId);
});
exports.deleteUserProfile = functions.https.onCall(async (data, context) => {
    const caller = await authorize(context);
    if (!data?.userId || data.userId.includes('/') || data.userId === context.auth.uid) throw new functions.https.HttpsError('invalid-argument', 'Invalid user.');
    const profile = await db.doc(`users/${data.userId}`).get();
    if (!profile.exists) throw new functions.https.HttpsError('not-found', 'Profile not found.');
    const email = profile.data().email;
    const targetRole = await userRank(email);
    if (ownerEmails.includes(email) || !(caller.rank === 'OWNER' || canRemove(caller.rank, targetRole))) throw new functions.https.HttpsError('permission-denied', 'Protected user.');
    const batch = db.batch();
    batch.delete(profile.ref); batch.delete(db.doc(`admins/${email}`)); batch.delete(db.doc(`moderators/${email}`));
    batch.set(db.collection('admin_logs').doc(), { action: 'PROFILE_DELETE', targetEmail: email, performedBy: caller.email, timestamp: stamp() });
    await batch.commit(); return { success: true };
});
