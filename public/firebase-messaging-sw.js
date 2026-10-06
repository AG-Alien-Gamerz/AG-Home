// Data-only FCM messages avoid duplicate automatic notifications.
const config=JSON.parse(new URL(self.location.href).searchParams.get('config')||'null');
function settingsDB(){return new Promise((resolve,reject)=>{const request=indexedDB.open('ag-push',1);request.onupgradeneeded=()=>request.result.createObjectStore('settings');request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}
async function settings(value){const db=await settingsDB();return new Promise((resolve,reject)=>{const tx=db.transaction('settings',value?'readwrite':'readonly');const req=value?tx.objectStore('settings').put(value,'current'):tx.objectStore('settings').get('current');tx.oncomplete=()=>{db.close();resolve(req.result);};tx.onerror=()=>reject(tx.error);});}
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('message',event=>{if(event.data?.type==='PUSH_CONFIG')event.waitUntil(settings({enabled:event.data.enabled,uid:event.data.uid}));});
self.addEventListener('notificationclick',event=>{
 event.notification.close();const base=new URL('./',self.location.href),path=event.notification.data?.path;
 const allowed=['products.html','control.html#reports','control.html#messages','control.html#chats'].includes(path)||(typeof path==='string'&&/^products\.html#product=[^\s#]{1,1200}$/.test(path));
 const url=new URL(allowed?path:'products.html',base);
 event.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(async clients=>{const client=clients.find(item=>item.url.startsWith(base.href));if(client){await client.navigate(url.href);return client.focus();}return self.clients.openWindow(url.href);}));
});
if(config){
 importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js','https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');
 firebase.initializeApp(config);
 firebase.messaging().onBackgroundMessage(async payload=>{const prefs=await settings(),data=payload.data||{};if(!prefs?.enabled||prefs.uid!==data.recipientUid)return;return self.registration.showNotification(data.title||'AG Home',{body:data.body||'',icon:new URL('logo.png',self.location.href).href,tag:data.eventId,data:{path:data.path}});});
}
