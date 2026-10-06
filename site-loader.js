// A brief first-render loader, independent of network/auth success and with a bounded fallback.
(()=>{
    const root=document.documentElement,theme=root.dataset.theme||'light';
    const labels={en:'Loading',ur:'لوڈ ہو رہا ہے',ar:'جارٍ التحميل',tr:'Yükleniyor',ja:'読み込み中',zh:'加载中',pa:'لوڈ ہو رہیا اے',ps:'پورته کېږي',bal:'لوڈ بیت',fr:'Chargement',es:'Cargando',de:'Wird geladen',sd:'لوڊ ٿي رهيو آهي',hnd:'لوڈ ہو رہیا اے',skr:'لوڈ تھیندا پیا ہے',hi:'लोड हो रहा है',ur_roman:'Load ho raha hai',bn:'লোড হচ্ছে',ru:'Загрузка',it:'Caricamento',pt:'Carregando',ko:'로딩 중',id:'Memuat'};
    let language='en';try{language=localStorage.getItem('language')||'ur';}catch{}
    root.dataset.loadingLabel='AG Home · '+(labels[language]||labels.en);root.classList.add('site-loading');
    const dark=theme.startsWith('dark'),bg=theme==='dark-legacy'?'#101010':dark?'#13191e':theme==='light-legacy'?'#fff':'#f5f7fa',ink=dark?'#f0f0f0':'#172e3b';
    const logo=new URL('logo.png',document.currentScript.src).href,style=document.createElement('style');style.id='site-loader-style';
    style.textContent=`html.site-loading::before{content:attr(data-loading-label);position:fixed;inset:0;z-index:100000;background:${bg} url("${logo}") no-repeat center calc(50% - 36px)/56px;display:grid;place-content:center;padding-top:75px;color:${ink};font:600 16px system-ui,sans-serif;pointer-events:all}html.site-loading::after{content:''!important;position:fixed;z-index:100001;top:calc(50% + 72px);left:calc(50% - 70px);width:140px;height:3px;border:0!important;border-radius:3px;background:linear-gradient(90deg,transparent,#38a89c,transparent);animation:ag-boot 1s ease-in-out infinite;transform:none!important}@keyframes ag-boot{50%{opacity:.35}}@media(prefers-reduced-motion:reduce){html.site-loading::after{animation:none}}`;
    document.head.append(style);
    let finished=false;const finish=()=>{if(finished)return;finished=true;root.classList.remove('site-loading');style.remove();delete root.dataset.loadingLabel;};
    const rendered=()=>requestAnimationFrame(()=>requestAnimationFrame(finish));
    document.addEventListener('DOMContentLoaded',rendered,{once:true});window.addEventListener('load',finish,{once:true});setTimeout(finish,5000);
})();
