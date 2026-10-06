import { auth, db, functions } from './firebase-config.js';
import { signOut, sendEmailVerification, sendPasswordResetEmail, reload, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { getCurrentLanguage, t } from './localization.js';
import { validEmail, SESSION_KEYS } from './auth-validation.js';
import { showEmailDeliveryTip } from './email-delivery.js';

export const pageURL = page => new URL(`${import.meta.env.BASE_URL}${page}`, location.origin).href;
export async function signInWithIdentifier(identifier, password) {
    identifier = identifier.trim();
    if (identifier.includes('@')) return signInWithEmailAndPassword(auth, identifier, password);
    const result = await httpsCallable(functions, 'signInUsername')({username:identifier,password});
    return signInWithEmailAndPassword(auth, result.data.email, password);
}
export function actionSettings() { return { url: pageURL('home.html'), handleCodeInApp: false }; }
export function setAuthLanguage() {
    const language = getCurrentLanguage();
    auth.languageCode = ({ ur_roman: 'ur', pa: 'pa', hnd: 'ur', skr: 'ur', bal: 'ur', sd: 'ur', ps: 'ur' })[language] || language;
}
export async function saveProfile(user, values = {}) {
    const reference = doc(db, 'users', user.uid);
    const snapshot = await getDoc(reference);
    // Preserve existing roles and profiles; new profiles can only have the USER role.
    if (!snapshot.exists()) await setDoc(reference, {
        email: user.email || '', firstName: values.firstName?.trim() || '', secondName: values.secondName?.trim() || '',
        lastName: values.lastName?.trim() || '', username: values.username?.trim() || '', dateOfBirth: values.dob || '',
        role: 'USER', rank: 'USER', createdAt: serverTimestamp()
    });
    if (snapshot.exists() && snapshot.data().email !== (user.email || '')) await updateDoc(reference, {email:user.email || '',updatedAt:serverTimestamp()});
    if (values.firstName) await updateProfile(user, { displayName: [values.firstName, values.secondName, values.lastName].filter(Boolean).join(' ').trim() });
}
export async function sendVerification(user = auth.currentUser) {
    if (!user?.email || user.emailVerified) return;
    const key = `ag.verifySent.${user.uid}`;
    const previous = Number(sessionStorage.getItem(key) || 0);
    if (Date.now() - previous < 60000) throw new Error(t('auth.wait'));
    setAuthLanguage();
    await sendEmailVerification(user, actionSettings());
    sessionStorage.setItem(key, String(Date.now()));
    showEmailDeliveryTip('verification');
}
export async function checkVerification() {
    if (!auth.currentUser) return false;
    await reload(auth.currentUser);
    await auth.currentUser.getIdToken(true);
    return auth.currentUser.emailVerified;
}
// Firebase must authenticate credentials to read verification state. Never retain an
// unverified email session or allow it into authenticated pages.
export async function rejectUnverifiedSession(user, { sendEmail = false, sent = false } = {}) {
    let mailError;
    try {
        if (sendEmail) { await sendVerification(user); sent = true; }
    } catch (error) { mailError = error; }
    finally {
        sessionStorage.setItem('ag.pendingVerification', JSON.stringify({ email: user.email || '', sent }));
        await signOut(auth);
    }
    if (mailError) throw mailError;
}
export async function requestReset(email) {
    if (!validEmail(email)) throw new Error(t('validation.email'));
    setAuthLanguage();
    try { await sendPasswordResetEmail(auth, email.trim(), actionSettings()); }
    catch (error) { if (!['auth/user-not-found', 'auth/invalid-email'].includes(error.code)) throw error; }
    showEmailDeliveryTip('reset');
}
export function clearSessionState() {
    for (const storage of [localStorage, sessionStorage]) {
        for (const key of Object.keys(storage)) if (SESSION_KEYS.includes(key) || key.startsWith('ag.verifySent.')) storage.removeItem(key);
    }
    // Only this application's session cookies; Firebase persistence is cleared by signOut.
    for (const part of document.cookie.split(';')) {
        const name = part.split('=')[0].trim();
        if (!['ag_session', 'ag_auth', 'ag_user'].includes(name)) continue;
        for (const path of ['/', import.meta.env.BASE_URL]) document.cookie = `${name}=; Max-Age=0; path=${path}; SameSite=Lax`;
    }
}
export async function logout() {
    try {await (await import('./notifications.js')).disconnectNotifications();} catch { /* Local worker is disabled even if offline deregistration fails. */ }
    await signOut(auth);
    clearSessionState();
    location.replace(pageURL('index.html'));
}
export function authError(error) {
    const keys = {
        'auth/invalid-credential': 'auth.invalidCredentials', 'auth/wrong-password': 'auth.invalidCredentials', 'auth/user-not-found': 'auth.invalidCredentials',
        'auth/email-already-in-use': 'auth.accountError', 'auth/weak-password': 'validation.passwordLength', 'auth/invalid-email': 'validation.email',
        'auth/too-many-requests': 'auth.wait', 'auth/network-request-failed': 'auth.network', 'auth/popup-blocked': 'auth.popup',
        'auth/popup-closed-by-user': 'auth.cancelled', 'auth/requires-recent-login': 'auth.reauthenticate',
        'auth/invalid-action-code': 'auth.invalidLink', 'auth/expired-action-code': 'auth.invalidLink',
        'auth/invalid-verification-code': 'auth.invalidCode', 'auth/invalid-phone-number': 'phone.enterNumber',
        'auth/operation-not-allowed': 'auth.unavailable', 'auth/unauthorized-domain': 'auth.domain',
        'auth/account-exists-with-different-credential': 'auth.providerConflict',
        'auth/cancelled-popup-request': 'auth.cancelled', 'auth/operation-not-supported-in-this-environment': 'auth.popup',
        'auth/internal-error': 'auth.network',
        'functions/unauthenticated':'auth.invalidCredentials', 'functions/resource-exhausted':'auth.wait',
        'functions/unavailable':'auth.network', 'functions/failed-precondition':'auth.unavailable',
        'auth/code-expired':'phone.expired', 'auth/session-expired':'phone.expired',
        'auth/captcha-check-failed':'phone.captcha', 'auth/missing-app-credential':'phone.captcha',
        'auth/invalid-app-credential':'phone.captcha', 'auth/quota-exceeded':'auth.wait', 'auth/billing-not-enabled':'auth.unavailable'
    };
    return keys[error?.code] ? t(keys[error.code]) : error?.code ? t('msg.error') : error?.message || t('msg.error');
}
