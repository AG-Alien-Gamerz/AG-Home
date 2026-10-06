import {auth,functions} from './firebase-config.js';
import {httpsCallable} from 'firebase/functions';
import {RecaptchaVerifier, signInWithPhoneNumber} from 'firebase/auth';
import {t} from './localization.js';
import {setAuthLanguage} from './auth-service.js';
import {normalizePhone} from './phone-model.js';
import {busy, toast} from './ui.js';

export function initPhoneAuth({authenticate,handleError}) {
    const byId = id=>document.getElementById(id), modal=byId('phoneLoginModal');
    let confirmation=null, verifier=null, captchaReady=null, generation=0, resendAt=0, timer;
    let lastErrorCode;
    const help=document.createElement('section');help.id='phoneErrorHelp';help.className='phone-error-help hidden';help.setAttribute('role','status');
    const hint=document.createElement('p');hint.dataset.i18n='phone.billing';hint.textContent=t('phone.billing');
    const report=document.createElement('button');report.type='button';report.className='secondary-btn';report.dataset.i18n='phone.report';report.textContent=t('phone.report');help.append(hint,report);byId('phoneForm').after(help);
    report.onclick=()=>busy(report,async()=>{try{await httpsCallable(functions,'reportAuthError')({code:lastErrorCode});toast(t('msg.success'));help.classList.add('hidden');}catch{toast(t('map.reportUnavailable'),'error');}});
    function clearCaptcha() { verifier?.clear(); verifier=null; captchaReady=null; }
    function reset() {
        generation++; confirmation=null; clearCaptcha(); clearInterval(timer); timer=null;
        help.classList.add('hidden');lastErrorCode=null;
        byId('phoneLoginStep1').classList.remove('hidden'); byId('phoneLoginStep2').classList.add('hidden');
        byId('otpCode').value=''; byId('phoneStatus').textContent='';
        updateResend();
        if (resendAt>Date.now() && !modal.classList.contains('hidden')) timer=setInterval(updateResend,1000);
    }
    function captcha() {
        if (!verifier) verifier=new RecaptchaVerifier(auth,'recaptcha-container',{size:'normal'});
        captchaReady ||= verifier.render(); return captchaReady;
    }
    function updateResend() {
        const seconds=Math.max(0,Math.ceil((resendAt-Date.now())/1000));
        byId('resendPhoneOTPBtn').disabled=seconds>0;
        byId('sendPhoneOTPBtn').disabled=seconds>0;
        byId('phoneResendWait').textContent=seconds ? `${t('auth.wait')} (${seconds})` : '';
        if (!seconds) { clearInterval(timer); timer=null; }
    }
    async function send(button) {
        const phone=normalizePhone(byId('phoneNumber').value);
        if (!phone) { toast(t('phone.enterNumber'), 'error'); byId('phoneNumber').focus(); return; }
        if (Date.now()<resendAt) { toast(t('auth.wait'),'error'); return; }
        const requestGeneration=generation;
        await busy(button,async()=>{
            try {
                setAuthLanguage(); await captcha();
                const result=await signInWithPhoneNumber(auth,phone,verifier);
                if (generation!==requestGeneration || modal.classList.contains('hidden')) return;
                confirmation=result; byId('phoneNumber').value=phone;
                byId('phoneLoginStep1').classList.add('hidden'); byId('phoneLoginStep2').classList.remove('hidden');
                byId('phoneStatus').textContent=t('phone.sent'); byId('otpCode').value=''; byId('otpCode').focus();
                resendAt=Date.now()+60000; clearInterval(timer); timer=setInterval(updateResend,1000); updateResend();
                clearCaptcha();
            } catch(error) { clearCaptcha(); if (generation===requestGeneration && !modal.classList.contains('hidden')) {lastErrorCode=/^auth\/[a-z-]{1,70}$/.test(error.code||'')?error.code:'auth/internal-error';help.classList.remove('hidden');await handleError(error);} }
        });
        if (confirmation) updateResend();
    }
    for (const suffix of ['Login','Signup']) byId('phone'+suffix)?.addEventListener('click',()=>{
        reset(); modal.classList.remove('hidden');
        if (resendAt>Date.now()) timer=setInterval(updateResend,1000);
        byId('phoneNumber').focus();
    });
    byId('closePhoneModal').onclick=()=>{modal.classList.add('hidden');reset();};
    modal.addEventListener('modalclose',reset);
    byId('backToPhoneBtn').onclick=()=>{reset();byId('phoneNumber').focus();};
    byId('phoneForm').onsubmit=event=>{event.preventDefault();send(byId('sendPhoneOTPBtn'));};
    byId('resendPhoneOTPBtn').onclick=()=>send(byId('resendPhoneOTPBtn'));
    byId('phoneOTPForm').onsubmit=event=>{
        event.preventDefault();
        const code=byId('otpCode').value.trim();
        if (!confirmation || !/^\d{6}$/.test(code)) {toast(t('phone.enterCode'),'error');return;}
        busy(byId('verifyPhoneOTPBtn'),()=>authenticate(()=>confirmation.confirm(code)));
    };
    window.addEventListener('languageChanged',()=>{if(confirmation) byId('phoneStatus').textContent=t('phone.sent');updateResend();});
}
