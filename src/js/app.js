import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithPopup, signInAnonymously,
    RecaptchaVerifier, onAuthStateChanged, getMultiFactorResolver,
    TotpMultiFactorGenerator, PhoneAuthProvider, PhoneMultiFactorGenerator, reload, signOut } from 'firebase/auth';
import { googleProvider, githubProvider, facebookProvider, yahooProvider } from './firebase.js';
import { initTheme } from './theme.js';
import { initLocalization, t } from './localization.js';
import { validateSignup, requiresEmailVerification } from './auth-validation.js';
import { saveProfile, requestReset, authError, pageURL, rejectUnverifiedSession, setAuthLanguage, signInWithIdentifier } from './auth-service.js';
import { initPhoneAuth } from './phone-auth.js';
import { busy, toast, initModals, initValidation } from './ui.js';
import { initSettings } from './settings.js';
import { initCharacter, initPasswordInteractions } from './character.js';

initTheme(); initLocalization(); initSettings(); initModals(); initCharacter(); initPasswordInteractions();
initValidation();
let authenticating = false, mfaResolver = null, mfaVerificationId = null;
const byId = id => document.getElementById(id);
function panel(id) {
    document.querySelector('.auth-container-wrapper').classList.toggle('hidden', ['resetPanel', 'mfaPanel'].includes(id));
    for (const name of ['loginForm', 'signupForm', 'resetPanel', 'mfaPanel']) byId(name)?.classList.toggle('hidden', name !== id);
    const visible = byId(id); visible?.classList.remove('panel-enter'); void visible?.offsetWidth; visible?.classList.add('panel-enter');
    byId(id)?.querySelector('input, button')?.focus();
}
byId('showSignup').onclick = () => panel('signupForm');
byId('showLogin').onclick = () => panel('loginForm');
byId('showReset').onclick = () => panel('resetPanel');
byId('resetBack').onclick = () => panel('loginForm');
byId('mfaBack').onclick = () => { mfaResolver = null; panel('loginForm'); };
function goHome() { sessionStorage.removeItem('ag.pendingVerification'); location.replace(pageURL('home.html')); }
function showVerification() {
    let pending;
    try { pending = JSON.parse(sessionStorage.getItem('ag.pendingVerification') || 'null'); } catch {}
    if (!pending?.email) return;
    panel('loginForm'); byId('loginEmail').value = pending.email;
    byId('verificationNotice').classList.remove('hidden');
    const message = byId('verificationMessage'); message.dataset.i18n = pending.sent ? 'auth.verificationSent' : 'auth.unverified'; message.textContent = t(message.dataset.i18n);
}
onAuthStateChanged(auth, async user => {
    if (authenticating) return;
    if (user?.email && user.emailVerified) { goHome(); return; }
    if (requiresEmailVerification(user)) {
        authenticating = true;
        try { await rejectUnverifiedSession(user); } catch (error) { toast(authError(error), 'error'); }
        finally { authenticating = false; }
    }
    showVerification(); document.documentElement.classList.remove('auth-pending');
});
async function finishSignIn(user, resend = false) {
    await reload(user);
    if (requiresEmailVerification(user)) {
        try { await rejectUnverifiedSession(user, { sendEmail: resend }); }
        finally { byId('loginPassword').value = ''; showVerification(); document.documentElement.classList.remove('auth-pending'); }
        return;
    }
    // Social accounts require an email. Guest/phone sessions retain public browsing,
    // but can never bypass verified-email access to the authenticated Home.
    if (!user.email && user.providerData.some(p => ['google.com', 'github.com', 'facebook.com', 'yahoo.com'].includes(p.providerId))) {
        await signOut(auth); toast(t('auth.emailUnavailable'), 'error'); return;
    }
    if (!user.email) { location.replace(pageURL('products.html')); return; }
    await user.getIdToken(true); goHome();
}
async function authenticate(task, { resend = false } = {}) {
    if (authenticating) return;
    authenticating = true; setAuthLanguage();
    try { const result = await task(); await finishSignIn(result.user, resend); }
    catch (error) {
        if (requiresEmailVerification(auth.currentUser)) {
            try { await rejectUnverifiedSession(auth.currentUser); } catch { /* Keep the original localized sign-in error. */ }
            showVerification();
        }
        await handleError(error);
    }
    finally { authenticating = false; }
}
async function handleError(error) {
    if (error.code === 'auth/multi-factor-auth-required') {
        mfaResolver = getMultiFactorResolver(auth, error);
        const select = byId('mfaFactor'); select.replaceChildren();
        mfaResolver.hints.forEach((hint, index) => select.add(new Option(hint.displayName || hint.factorId, String(index))));
        panel('mfaPanel');
        byId('mfaSend').hidden = mfaResolver.hints[0]?.factorId !== PhoneMultiFactorGenerator.FACTOR_ID;
    } else toast(authError(error), 'error');
}
byId('login').onsubmit = event => {
    event.preventDefault();
    busy(event.submitter, async () => {
        await authenticate(() => signInWithIdentifier(byId('loginEmail').value, byId('loginPassword').value));
    });
};
byId('dob').max = new Date().toLocaleDateString('en-CA');
byId('signup').onsubmit = event => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.target));
    const error = validateSignup(data);
    if (error) { toast(t(error), 'error'); return; }
    busy(event.submitter, async () => {
        if (authenticating) return;
        authenticating = true;
        try {
            const { user } = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
            // Save the profile before signing out; verification is required before entering Home.
            try { await saveProfile(user, data); } catch { toast(t('msg.error'), 'error'); }
            try { await rejectUnverifiedSession(user, {sendEmail:true}); } catch (error) { toast(authError(error), 'error'); }
            byId('signupPassword').value = ''; byId('signupConfirm').value = '';
            window.dispatchEvent(new CustomEvent('characterReaction', { detail: { state: 'celebrate' } }));
            showVerification();
        } catch (error) { await handleError(error); }
        finally { authenticating = false; }
    });
};
for (const [name, provider] of Object.entries({ google: googleProvider, github: githubProvider, facebook: facebookProvider, yahoo: yahooProvider })) {
    for (const suffix of ['Login', 'Signup']) byId(name + suffix)?.addEventListener('click', event => busy(event.currentTarget, async () => {
        await authenticate(() => signInWithPopup(auth, provider), {resend:true});
    }));
}
for (const suffix of ['Login', 'Signup']) {
    byId('guest' + suffix)?.addEventListener('click', event => busy(event.currentTarget, async () => {
        await authenticate(() => signInAnonymously(auth));
    }));
}
initPhoneAuth({authenticate, handleError});
byId('resendVerification').onclick = event => {
    if (!byId('login').reportValidity()) return;
    busy(event.currentTarget, () => authenticate(() => signInWithIdentifier(byId('loginEmail').value, byId('loginPassword').value), {resend:true}));
};
byId('resetForm').onsubmit = event => {
    event.preventDefault();
    busy(event.submitter, async () => {
        try { await requestReset(byId('resetEmail').value); toast(t('auth.resetSent')); byId('resetEmail').value = ''; }
        catch (error) { toast(authError(error), 'error'); }
    });
};
byId('mfaFactor').onchange = () => { mfaVerificationId = null; byId('mfaSend').hidden = mfaResolver?.hints[Number(byId('mfaFactor').value)]?.factorId !== PhoneMultiFactorGenerator.FACTOR_ID; };
byId('mfaSend').onclick = event => busy(event.currentTarget, async () => {
    try {
        if (!mfaResolver) return;
        const verifier = new RecaptchaVerifier(auth, 'mfaRecaptcha', { size: 'normal' });
        try { mfaVerificationId = await new PhoneAuthProvider(auth).verifyPhoneNumber({ multiFactorHint: mfaResolver.hints[Number(byId('mfaFactor').value)], session: mfaResolver.session }, verifier); }
        finally { verifier.clear(); }
        toast(t('msg.success'));
    } catch (error) { await handleError(error); }
});
byId('mfaForm').onsubmit = event => {
    event.preventDefault(); busy(event.submitter, async () => {
        try {
            const hint = mfaResolver.hints[Number(byId('mfaFactor').value)], code = byId('mfaCode').value;
            if (!/^\d{6}$/.test(code)) { toast(t('auth.invalidCode'), 'error'); return; }
            const assertion = hint.factorId === TotpMultiFactorGenerator.FACTOR_ID
                ? TotpMultiFactorGenerator.assertionForSignIn(hint.uid, code)
                : PhoneMultiFactorGenerator.assertion(PhoneAuthProvider.credential(mfaVerificationId, code));
            await authenticate(() => mfaResolver.resolveSignIn(assertion)); byId('mfaCode').value = '';
        } catch (error) { await handleError(error); }
    });
};
