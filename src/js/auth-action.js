import { auth } from './firebase-config.js';
import { verifyPasswordResetCode, confirmPasswordReset, checkActionCode, applyActionCode } from 'firebase/auth';
import { initTheme } from './theme.js';
import { initLocalization, setCurrentLanguage, LANGUAGES, t } from './localization.js';
import { initCharacter, initPasswordInteractions } from './character.js';
import { busy, initValidation } from './ui.js';
import { checkVerification, saveProfile } from './auth-service.js';
initTheme(); initLocalization(); initCharacter(); initPasswordInteractions(); initValidation();
const params = new URLSearchParams(location.search), mode = params.get('mode'), code = params.get('oobCode');
if (LANGUAGES[params.get('lang')]) setCurrentLanguage(params.get('lang'));
// Remove the one-time code from browser history and referrers; retain only in this closure.
history.replaceState(null, '', location.pathname);
const status = document.getElementById('actionStatus');
function message(key) {
    status.dataset.i18n = key; status.textContent = t(key);
    document.querySelector('.account-action-card').dataset.state = ['msg.success', 'auth.verified'].includes(key) ? 'success' : key === 'auth.reset' ? 'reset' : 'error';
}
async function run() {
    if (!code || !['resetPassword','verifyEmail','recoverEmail','verifyAndChangeEmail'].includes(mode)) { message('auth.invalidLink'); return; }
    try {
        if (mode === 'resetPassword') {
            const email = await verifyPasswordResetCode(auth, code);
            const title = document.getElementById('actionTitle'); title.dataset.i18n = 'auth.reset'; title.textContent = t('auth.reset');
            message('character.strength'); document.querySelector('.account-action-card').dataset.state = 'reset';
            const recipient = document.getElementById('actionEmail'); recipient.textContent = email; recipient.hidden = false;
            document.getElementById('actionReset').hidden = false;
            const password = document.getElementById('actionPassword'), confirm = document.getElementById('actionConfirm');
            const validate = () => {
                const mismatch = confirm.value && password.value !== confirm.value;
                confirm.setCustomValidity(mismatch ? t('validation.mismatch') : '');
                confirm.setAttribute('aria-invalid', String(Boolean(mismatch)));
                document.getElementById('actionMatch').classList.toggle('is-match', Boolean(confirm.value && !mismatch));
                document.getElementById('actionMatch').textContent = confirm.value ? t(mismatch ? 'validation.mismatch' : 'validation.match') : '';
            };
            password.oninput = validate; confirm.oninput = validate;
            document.getElementById('actionReset').onsubmit = event => {
                event.preventDefault();
                if (password.value !== confirm.value) { message('validation.mismatch'); return; }
                busy(event.submitter, async () => {
                    try { await confirmPasswordReset(auth, code, password.value); password.value = ''; confirm.value = ''; document.getElementById('actionReset').hidden = true; message('msg.success'); }
                    catch (error) { message(error.code === 'auth/weak-password' ? 'validation.passwordLength' : 'auth.invalidLink'); }
                });
            };
        } else {
            const info = await checkActionCode(auth, code);
            const expected = { verifyEmail: 'VERIFY_EMAIL', recoverEmail: 'RECOVER_EMAIL', verifyAndChangeEmail: 'VERIFY_AND_CHANGE_EMAIL' }[mode];
            if (info.operation !== expected) { message('auth.invalidLink'); return; }
            await applyActionCode(auth, code);
            if (auth.currentUser) { try { await checkVerification(); await saveProfile(auth.currentUser); } catch { /* The action succeeded independently of profile synchronization. */ } }
            message(mode === 'verifyEmail' ? 'auth.verified' : 'msg.success');
            if (mode === 'recoverEmail') {
                const p = document.createElement('p'); p.dataset.i18n = 'auth.reset'; p.textContent = t('auth.reset'); status.after(p);
            }
        }
    } catch (error) { message(error.code === 'auth/network-request-failed' ? 'auth.network' : 'auth.invalidLink'); }
}
run();
