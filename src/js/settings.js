import { auth, appConfig } from './firebase-config.js';
import { multiFactor, TotpMultiFactorGenerator, verifyBeforeUpdateEmail, EmailAuthProvider, reauthenticateWithCredential, reauthenticateWithPopup, OAuthProvider, getMultiFactorResolver, RecaptchaVerifier, PhoneAuthProvider, PhoneMultiFactorGenerator, onAuthStateChanged } from 'firebase/auth';
import { LANGUAGES, t, getCurrentLanguage, setCurrentLanguage, applyTranslations } from './localization.js';
import { characterSettings, updateCharacterSettings } from './character.js';
import { CHARACTER_APPEARANCES, characterAppearance } from './character-state.js';
import { characterMarkup } from './character-visuals.js';
import { actionSettings, authError, setAuthLanguage, logout } from './auth-service.js';
import { validEmail } from './auth-validation.js';
import { busy, toast } from './ui.js';
import { showEmailDeliveryTip } from './email-delivery.js';
import { THEMES } from './theme-model.js';
import { setTheme } from './theme.js';
import {initNotifications,mountNotificationSettings} from './notifications.js';

let initialized = false, totpSecret = null, cancelReauthentication = null;
export function initSettings() {
    if (initialized) return; initialized = true;
    const modal = document.getElementById('settingsModal');
    if (!modal) return; // The control panel intentionally has no language/theme controls.
    modal.dataset.returnFocus = 'settingsBtn';
    initNotifications();mountNotificationSettings(modal.querySelector('.settings-form'));
    const themeSelector = modal.querySelector('.theme-selector');
    if (themeSelector) {
        themeSelector.replaceChildren();
        for (const theme of THEMES) {
            const button = document.createElement('button'); button.type = 'button'; button.className = 'theme-btn';
            button.dataset.theme = theme.id; button.dataset.i18n = theme.label; button.textContent = t(theme.label);
            button.addEventListener('click',()=>setTheme(theme.id)); themeSelector.append(button);
        }
        setTheme(document.documentElement.dataset.theme);
    }
    const emailStatus = document.createElement('p'); emailStatus.id = 'settingsEmailStatus'; emailStatus.className = 'email-status hidden'; emailStatus.setAttribute('role', 'status');
    modal.querySelector('.settings-form').prepend(emailStatus);
    const updateEmailStatus = user => {
        emailStatus.classList.toggle('hidden', !user?.email);
        emailStatus.classList.toggle('is-verified', user?.emailVerified === true);
        emailStatus.dataset.i18n = user?.emailVerified ? 'auth.verified' : 'auth.unverified';
        emailStatus.textContent = t(emailStatus.dataset.i18n);
    };
    onAuthStateChanged(auth, updateEmailStatus);
    const logoutButton = document.getElementById('logoutBtn');
    if (logoutButton) { logoutButton.type = 'button'; logoutButton.addEventListener('click', event => { event.preventDefault(); logout().catch(error => toast(authError(error), 'error')); }); }
    const languages = modal.querySelector('.language-selector');
    if (languages) {
        languages.replaceChildren();
        const select = document.createElement('select'); select.id = 'languageSelect'; select.setAttribute('aria-label', t('settings.language'));
        for (const [id, [name]] of Object.entries(LANGUAGES)) select.add(new Option(name, id));
        select.value = getCurrentLanguage(); select.onchange = () => setCurrentLanguage(select.value); languages.append(select);
    }
    const current = characterSettings();
    const section = document.createElement('section'); section.className = 'settings-section';
    section.innerHTML = `<h3 data-i18n="character.title">${t('character.title')}</h3>
        <label for="characterAppearance" data-i18n="character.appearance">${t('character.appearance')}</label><select id="characterAppearance">${CHARACTER_APPEARANCES.map(appearance=>`<option value="${appearance.id}" data-i18n="${appearance.label}">${t(appearance.label)}</option>`).join('')}</select>
        <div class="character-preview"><span class="ag-character" aria-hidden="true"></span><p id="characterIdentity"></p></div>
        <div class="character-gender-row"><label for="characterGender" data-i18n="character.gender">${t('character.gender')}</label><select id="characterGender"><option value="male" data-i18n="character.male">${t('character.male')}</option><option value="female" data-i18n="character.female">${t('character.female')}</option></select></div>
        <label for="characterTimer" data-i18n="character.timer">${t('character.timer')}</label><input id="characterTimer" type="number" min="1" max="120" step="1" value="${current.sleepMinutes}">
        <label for="glassMode" data-i18n="character.position">${t('character.position')}</label><select id="glassMode"><option value="follow" data-i18n="character.follow">${t('character.follow')}</option><option value="fixed" data-i18n="character.fixed">${t('character.fixed')}</option></select>
        <label class="platform-check"><input id="characterVisible" type="checkbox"><span data-i18n="character.show">${t('character.show')}</span></label>
        <button type="button" id="characterReset" class="secondary-btn" data-i18n="character.reset">${t('character.reset')}</button>`;
    modal.querySelector('#closeSettings').before(section);
    const refreshCharacterPreferences = () => {
        const value=characterSettings(), appearance=characterAppearance(value.appearance);
        modal.querySelector('#characterAppearance').value=appearance.id;
        modal.querySelector('#characterGender').value=value.gender;
        modal.querySelector('.character-gender-row').hidden=appearance.id!=='robot';
        modal.querySelector('#glassMode').value=value.glassMode;
        modal.querySelector('#characterVisible').checked=value.visible;
        modal.querySelector('#characterTimer').value=value.sleepMinutes;
        const preview=modal.querySelector('.character-preview .ag-character');
        preview.dataset.appearance=appearance.id;preview.dataset.gender=appearance.gender||value.gender;
        preview.innerHTML=characterMarkup(appearance.id);
        modal.querySelector('#characterIdentity').textContent=t(appearance.label);
    };
    refreshCharacterPreferences();
    window.addEventListener('characterSettingsChanged',refreshCharacterPreferences);
    window.addEventListener('languageChanged',refreshCharacterPreferences);
    for (const [id, key] of [['characterAppearance', 'appearance'], ['characterGender', 'gender'], ['glassMode', 'glassMode'], ['characterVisible', 'visible'], ['characterTimer', 'sleepMinutes']]) {
        const input = modal.querySelector('#' + id);
        input.onchange = () => {
            if (!input.checkValidity() || (key === 'sleepMinutes' && !Number.isInteger(Number(input.value)))) { input.reportValidity(); input.value = characterSettings().sleepMinutes; return; }
            updateCharacterSettings({ [key]: input.type === 'checkbox' ? input.checked : input.value });
        };
    }
    modal.querySelector('#characterReset').onclick = () => updateCharacterSettings({ position: null, glassPosition: null });
    const settingsButton = document.getElementById('settingsBtn');
    settingsButton?.setAttribute('aria-controls', 'settingsModal');
    settingsButton?.setAttribute('aria-haspopup', 'dialog');
    settingsButton?.setAttribute('aria-expanded', 'false');
    settingsButton?.addEventListener('click', () => { modal.classList.remove('hidden'); renderSecurity(); });
    document.getElementById('closeSettings')?.addEventListener('click', () => { modal.classList.add('hidden'); clearSecrets(); });
    document.getElementById('showEmail')?.addEventListener('change', event => {
        localStorage.setItem('showEmail', String(event.target.checked));
        document.getElementById('userDisplay')?.classList.toggle('hidden', !event.target.checked);
    });
    if (document.getElementById('showEmail')) document.getElementById('showEmail').checked = localStorage.getItem('showEmail') !== 'false';
    window.addEventListener('languageChanged', () => { if (modal.querySelector('#languageSelect')) modal.querySelector('#languageSelect').value = getCurrentLanguage(); });
    new MutationObserver(() => {
        const open = !modal.classList.contains('hidden');
        settingsButton?.setAttribute('aria-expanded', String(open));
        if (!open) clearSecrets();
    }).observe(modal, { attributes: true, attributeFilter: ['class'] });
    applyTranslations();
}
function clearSecrets() {
    cancelReauthentication?.(); cancelReauthentication = null;
    totpSecret = null;
    document.getElementById('totpSetup')?.replaceChildren();
    for (const id of ['securityPassword', 'totpCode']) { const field = document.getElementById(id); if (field) field.value = ''; }
}
function renderSecurity() {
    const modal = document.getElementById('settingsModal');
    let section = modal.querySelector('#accountSecurity');
    if (!section) { section = document.createElement('section'); section.id = 'accountSecurity'; section.className = 'settings-section'; modal.querySelector('#closeSettings').before(section); }
    clearSecrets(); section.replaceChildren();
    const user = auth.currentUser;
    modal.querySelector('.user-info-wrapper')?.classList.toggle('hidden', !user);
    if (!user?.emailVerified || !user.email) return;
    section.innerHTML = `<h3 data-i18n="security.title">${t('security.title')}</h3><label for="securityPassword" data-i18n="login.password">${t('login.password')}</label><input id="securityPassword" type="password" autocomplete="current-password">
        <label for="newEmail" data-i18n="security.emailChange">${t('security.emailChange')}</label><input id="newEmail" type="email" autocomplete="email" dir="ltr"><button id="changeEmail" type="button" class="secondary-btn" data-i18n="security.emailChange">${t('security.emailChange')}</button>`;
    section.querySelector('#changeEmail').onclick = event => busy(event.currentTarget, async () => {
        const email = section.querySelector('#newEmail').value.trim();
        if (!validEmail(email)) { toast(t('validation.email'), 'error'); return; }
        try { await reauthenticate(); setAuthLanguage(); await verifyBeforeUpdateEmail(user, email, actionSettings()); toast(t('security.emailSent')); showEmailDeliveryTip('change'); }
        catch (error) { toast(authError(error), 'error'); }
    });
    if (appConfig.mfaEnabled) {
        const block = document.createElement('div');
        block.innerHTML = `<h4 data-i18n="security.mfa">${t('security.mfa')}</h4><div id="mfaFactors"></div><button id="enableTotp" type="button" class="secondary-btn" data-i18n="security.enable">${t('security.enable')}</button><div id="totpSetup"></div>`;
        section.append(block);
        renderFactors();
        block.querySelector('#enableTotp').onclick = event => busy(event.currentTarget, async () => {
            try {
                await reauthenticate(); const session = await multiFactor(user).getSession(); totpSecret = await TotpMultiFactorGenerator.generateSecret(session);
                const setup = document.getElementById('totpSetup');
                setup.innerHTML = `<p data-i18n="security.mfaHint">${t('security.mfaHint')}</p><label data-i18n="security.secret">${t('security.secret')}</label><code id="totpKey" dir="ltr"></code><label for="totpCode" data-i18n="security.code">${t('security.code')}</label><input id="totpCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6"><button id="confirmTotp" type="button" class="primary-btn" data-i18n="btn.submit">${t('btn.submit')}</button>`;
                // This enrollment secret is shown only here, never logged, stored or sent to analytics.
                setup.querySelector('#totpKey').textContent = totpSecret.secretKey;
                setup.querySelector('#confirmTotp').onclick = event => busy(event.currentTarget, async () => {
                    try { await multiFactor(user).enroll(TotpMultiFactorGenerator.assertionForEnrollment(totpSecret, setup.querySelector('#totpCode').value), 'AG Home Authenticator'); clearSecrets(); renderFactors(); toast(t('msg.success')); }
                    catch (error) { toast(authError(error), 'error'); }
                });
            } catch (error) { clearSecrets(); toast(authError(error), 'error'); }
        });
    }
    applyTranslations();
}
async function reauthenticate() {
    const user = auth.currentUser;
    try {
    if (user.providerData.some(p => p.providerId === 'password')) {
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email, document.getElementById('securityPassword').value));
    } else {
        const provider = user.providerData.find(p => ['google.com', 'github.com', 'facebook.com', 'yahoo.com'].includes(p.providerId));
        if (!provider) throw new Error(t('auth.reauthenticate'));
        await reauthenticateWithPopup(user, new OAuthProvider(provider.providerId));
    }
    } catch (error) {
        if (error.code !== 'auth/multi-factor-auth-required') throw error;
        await resolveReauthentication(error);
    }
    document.getElementById('securityPassword').value = '';
}
function resolveReauthentication(error) {
    const resolver = getMultiFactorResolver(auth, error);
    const block = document.createElement('div'); block.className = 'reauth-challenge';
    block.innerHTML = `<label for="reauthFactor" data-i18n="security.mfa">${t('security.mfa')}</label><select id="reauthFactor"></select><div id="reauthRecaptcha"></div><button type="button" id="reauthSend">${t('phone.sendOtp')}</button><label for="reauthCode">${t('security.code')}</label><input id="reauthCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6"><button type="button" id="reauthSubmit" class="primary-btn">${t('btn.submit')}</button><button type="button" id="reauthCancel" class="secondary-btn">${t('btn.cancel')}</button>`;
    document.getElementById('accountSecurity').prepend(block);
    const select = block.querySelector('#reauthFactor'); resolver.hints.forEach((hint,index) => select.add(new Option(hint.displayName || hint.factorId, index)));
    let verificationId, verifier;
    const choose = () => { block.querySelector('#reauthSend').hidden = resolver.hints[Number(select.value)].factorId !== PhoneMultiFactorGenerator.FACTOR_ID; verificationId = null; };
    select.onchange = choose; choose();
    return new Promise((resolve, reject) => {
        const cleanup = () => { verifier?.clear(); block.remove(); cancelReauthentication = null; };
        cancelReauthentication = () => { cleanup(); reject(new Error(t('auth.cancelled'))); };
        block.querySelector('#reauthSend').onclick = event => busy(event.currentTarget, async () => {
            try {
                verifier?.clear(); verifier = new RecaptchaVerifier(auth, 'reauthRecaptcha', { size:'normal' });
                verificationId = await new PhoneAuthProvider(auth).verifyPhoneNumber({multiFactorHint:resolver.hints[Number(select.value)],session:resolver.session},verifier);
            } catch (error) { toast(authError(error),'error'); }
        });
        block.querySelector('#reauthSubmit').onclick = event => busy(event.currentTarget, async () => {
            try {
                const hint = resolver.hints[Number(select.value)], code = block.querySelector('#reauthCode').value;
                if (!/^\d{6}$/.test(code)) { toast(t('auth.invalidCode'), 'error'); return; }
                const assertion = hint.factorId === TotpMultiFactorGenerator.FACTOR_ID ? TotpMultiFactorGenerator.assertionForSignIn(hint.uid,code) : PhoneMultiFactorGenerator.assertion(PhoneAuthProvider.credential(verificationId,code));
                await resolver.resolveSignIn(assertion); cleanup(); resolve();
            } catch (error) { toast(authError(error),'error'); }
        });
        block.querySelector('#reauthCancel').onclick = () => cancelReauthentication?.();
        block.querySelector('#reauthCode').focus();
    });
}
function renderFactors() {
    const container = document.getElementById('mfaFactors'); container.replaceChildren();
    for (const factor of multiFactor(auth.currentUser).enrolledFactors) {
        const row = document.createElement('div'); row.className = 'factor-row';
        const name = document.createElement('span'); name.textContent = factor.displayName || factor.factorId;
        const button = document.createElement('button'); button.type = 'button'; button.textContent = t('security.remove');
        button.onclick = event => busy(event.currentTarget, async () => { try { await reauthenticate(); await multiFactor(auth.currentUser).unenroll(factor); renderFactors(); toast(t('msg.success')); } catch (error) { toast(authError(error), 'error'); } });
        row.append(name, button); container.append(row);
    }
}
