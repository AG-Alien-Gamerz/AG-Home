import {auth,functions,messaging,firebaseConfig} from './firebase-config.js';
import {getToken,deleteToken,onMessage,isSupported} from 'firebase/messaging';
import {httpsCallable} from 'firebase/functions';
import {onAuthStateChanged} from 'firebase/auth';
import {t} from './localization.js';
import {toast} from './ui.js';
let registration,started=false,unsubscribe,operation=Promise.resolve(),epoch=0;
const enabled=()=>localStorage.getItem('ag.push.enabled')==='true';
const stored=()=>{try{return JSON.parse(localStorage.getItem('ag.push.registration')||'null');}catch{return null;}};
function state(message='') {
    const toggle=document.getElementById('notificationsEnabled');if(toggle)toggle.checked=enabled();
    const status=document.getElementById('notificationStatus');if(status)status.textContent=message;
}
async function worker() {
    registration ||= await navigator.serviceWorker.register(`${import.meta.env.BASE_URL}firebase-messaging-sw.js?config=${encodeURIComponent(JSON.stringify(firebaseConfig))}`,{scope:import.meta.env.BASE_URL});
    await navigator.serviceWorker.ready;
    registration.active?.postMessage({type:'PUSH_CONFIG',config:firebaseConfig,enabled:enabled(),uid:auth.currentUser?.uid||null});
    return registration;
}
export async function disconnectNotifications() {
    epoch++;
    const saved=stored();
    registration ||= await navigator.serviceWorker?.getRegistration(import.meta.env.BASE_URL);
    registration?.active?.postMessage({type:'PUSH_CONFIG',config:firebaseConfig,enabled:false,uid:null});
    if(saved && auth.currentUser?.uid===saved.uid) await httpsCallable(functions,'setPushSubscription')({token:saved.token,enabled:false});
    if(saved && messaging)await deleteToken(messaging);
    localStorage.removeItem('ag.push.registration');
    registration?.active?.postMessage({type:'PUSH_CONFIG',config:firebaseConfig,enabled:false,uid:null});
}
async function enable(requestPermission=false) {
    const requestEpoch=epoch;
    if(!auth.currentUser?.emailVerified || !auth.currentUser.email)throw new Error(t('auth.verificationRequired'));
    if(!window.isSecureContext || !await isSupported() || !messaging)throw new Error(t('auth.unavailable'));
    const vapidKey=import.meta.env.VITE_FIREBASE_VAPID_KEY;
    if(!vapidKey || vapidKey==='your_vapid_key')throw new Error(t('auth.unavailable'));
    const permission=requestPermission?await Notification.requestPermission():Notification.permission;
    if(permission!=='granted')throw new Error(t('auth.unavailable'));
    const uid=auth.currentUser.uid, sw=await worker();
    const token=await getToken(messaging,{vapidKey,serviceWorkerRegistration:sw});
    if(auth.currentUser?.uid!==uid || requestEpoch!==epoch) return;
    await httpsCallable(functions,'setPushSubscription')({token,enabled:true});
    if(auth.currentUser?.uid!==uid || requestEpoch!==epoch) return;
    localStorage.setItem('ag.push.registration',JSON.stringify({uid,token}));
    localStorage.setItem('ag.push.enabled','true');sw.active?.postMessage({type:'PUSH_CONFIG',config:firebaseConfig,enabled:true,uid});
    if(!unsubscribe)unsubscribe=onMessage(messaging,payload=>{
        if(enabled() && stored()?.uid===auth.currentUser?.uid && payload.data?.recipientUid===auth.currentUser?.uid)toast(payload.data?.title||'AG Home');
    });
    state(t('msg.success'));
}
export function mountNotificationSettings(container) {
    if(!container || document.getElementById('notificationsEnabled'))return;
    const section=document.createElement('section');section.className='settings-section';
    section.innerHTML=`<h3 data-i18n="notifications.title">${t('notifications.title')}</h3><label class="platform-check"><input type="checkbox" id="notificationsEnabled"><span data-i18n="notifications.enable">${t('notifications.enable')}</span></label><p id="notificationStatus" role="status"></p>`;
    container.insertBefore(section,container.querySelector('#closeSettings'));state();
    section.querySelector('input').onchange=async event=>{
        const input=event.target;input.disabled=true;
        try {if(input.checked)await enable(true);else {await disconnectNotifications();localStorage.setItem('ag.push.enabled','false');state(t('msg.success'));}}
        catch(error){state(error.message);input.checked=enabled();}
        finally{input.disabled=false;}
    };
}
export function initNotifications() {
    if(started)return;started=true;
    onAuthStateChanged(auth,user=>{operation=operation.catch(()=>{}).then(async()=>{
        const saved=stored();if(saved && (saved.uid!==user?.uid || !user?.emailVerified)){
            epoch++;registration ||= await navigator.serviceWorker?.getRegistration(import.meta.env.BASE_URL);
            registration?.active?.postMessage({type:'PUSH_CONFIG',config:firebaseConfig,enabled:false,uid:null});localStorage.removeItem('ag.push.registration');
        }
        if(user?.emailVerified && enabled() && 'Notification' in window && Notification.permission==='granted')try{await enable();}catch(error){state(error.message);}
    });});
    window.addEventListener('storage',event=>{if(event.key==='ag.push.enabled')registration?.active?.postMessage({type:'PUSH_CONFIG',config:firebaseConfig,enabled:enabled(),uid:auth.currentUser?.uid||null});state();});
}
