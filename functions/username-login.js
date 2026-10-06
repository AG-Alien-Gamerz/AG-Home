const {createHash} = require('node:crypto');
const {HttpsError} = require('firebase-functions/v1/https');
const normalizeUsername = value => String(value || '').trim().normalize('NFKC').toLowerCase();
const invalid = () => new HttpsError('unauthenticated', 'Invalid credentials.');

// No public email directory or custom-token shortcut. The SDK still performs the final sign-in/MFA.
async function usernameLogin(data, context, {db, auth, apiKey, emulatorHost}) {
    const raw = typeof data?.username === 'string' ? data.username.trim() : '', key = normalizeUsername(raw);
    if (!/^[\p{L}\p{N}_.-]{3,30}$/u.test(raw) || typeof data?.password !== 'string' || !data.password || data.password.length > 4096) throw invalid();
    const ip = context.rawRequest?.ip || 'unknown';
    const bucket = Math.floor(Date.now() / 600000);
    const attempt = db.doc('_loginAttempts/' + createHash('sha256').update(ip + ':' + bucket).digest('hex'));
    await db.runTransaction(async tx => {
        const snapshot = await tx.get(attempt), count = snapshot.data()?.count || 0;
        if (count >= 30) throw new HttpsError('resource-exhausted', 'Try again later.');
        tx.set(attempt, {count:count + 1, expiresAt:new Date((bucket + 2) * 600000)});
    });
    const matches = await Promise.all([...new Set(['usernameKey:' + key, 'username:' + raw, 'username:' + key])].map(query => {
        const separator = query.indexOf(':'); return db.collection('users').where(query.slice(0,separator),'==',query.slice(separator+1)).limit(2).get();
    }));
    const ids = [...new Set(matches.flatMap(snapshot=>snapshot.docs.map(doc=>doc.id)))];
    if (ids.length !== 1) throw invalid();
    let account; try { account = await auth.getUser(ids[0]); } catch { throw invalid(); }
    if (account.disabled || !account.email || !account.providerData.some(provider=>provider.providerId==='password')) throw invalid();
    if (!apiKey && !emulatorHost) throw new HttpsError('failed-precondition', 'Username sign-in is not configured.');
    const origin = emulatorHost ? `http://${emulatorHost}/identitytoolkit.googleapis.com` : 'https://identitytoolkit.googleapis.com';
    let response, result;
    try {
        response = await fetch(`${origin}/v1/accounts:signInWithPassword?key=${encodeURIComponent(apiKey || 'demo-key')}`, {
            method:'POST', headers:{'Content-Type':'application/json'},
            body:JSON.stringify({email:account.email,password:data.password,returnSecureToken:true}), signal:AbortSignal.timeout(10000)
        });
        result = await response.json();
    } catch { throw new HttpsError('unavailable', 'Sign-in temporarily unavailable.'); }
    if (!response.ok || (!result.idToken && !result.mfaPendingCredential)) throw invalid();
    // Only after Firebase verifies the primary password may the client receive the account email.
    return {email:account.email};
}
module.exports = {normalizeUsername, usernameLogin};
