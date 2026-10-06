import {t} from './localization.js';
import {parseOffices,matchesOffice} from './office-model.js';
import {busy} from './ui.js';
let modal,map,L,offices=[],markers=new Map(),userMarker,userAccuracy,selected,opening;
const label=office=>office.type==='headquarters'?`AG · ${t('map.headquarters')}`:office.name;
const setStatus=(element,key)=>{element.dataset.i18n=key; element.textContent=key?t(key):'';};
const coordinates=office=>`${office.latitude.toFixed(6)}, ${office.longitude.toFixed(6)}`;
export function initContactMap() {
    const details=document.querySelector('.contact-details');if(!details)return;
    details.replaceChildren();
    const location=document.createElement('button');location.type='button';location.className='contact-location secondary-btn';location.id='openOfficeMap';
    const locationLabel=document.createElement('span');locationLabel.dataset.i18n='map.open';locationLabel.textContent=t('map.open');
    const locationAddress=document.createElement('small');locationAddress.dir='ltr';locationAddress.textContent='Karachi, Pakistan';
    location.append(locationLabel,locationAddress);details.append(location);
    location.onclick=()=>openMap();
    channel(details,'map.phone','☎',[{text:'+1 202 555 0100',href:'tel:+12025550100'},{text:'+1 202 555 0101',href:'tel:+12025550101'}],true);
    channel(details,'map.email','✉',[{text:'ag.aliengamerz@gmail.com',href:'mailto:ag.aliengamerz@gmail.com'},{text:'ag.aliengamerz@hotmail.com',href:'mailto:ag.aliengamerz@hotmail.com'}]);
    window.addEventListener('languageChanged',()=>{if(map)render();});
}
function channel(parent,key,icon,items,demo=false) {
    const group=document.createElement('div');group.className='contact-channel';
    const button=document.createElement('button');button.type='button';button.className='secondary-btn';button.setAttribute('aria-expanded','false');button.innerHTML=`<span aria-hidden="true">${icon}</span> <span data-i18n="${key}">${t(key)}</span>`;
    const menu=document.createElement('div');menu.className='channel-menu hidden';menu.id=key.replace('.','-')+'-menu';button.setAttribute('aria-controls',menu.id);
    if(demo){const hint=document.createElement('p');hint.dataset.i18n='map.demoPhone';hint.textContent=t('map.demoPhone');menu.append(hint);}
    for(const item of items){const link=document.createElement('a');link.href=item.href;link.textContent=item.text;link.dir='ltr';menu.append(link);}
    const show=value=>{menu.classList.toggle('hidden',!value);button.setAttribute('aria-expanded',String(value));};
    group.append(button,menu);parent.append(group);
    let pressedOpen=false;button.onpointerdown=()=>{pressedOpen=!menu.classList.contains('hidden');};
    button.onclick=event=>show(event.detail?!pressedOpen:menu.classList.contains('hidden'));
    group.onpointerenter=event=>{if(event.pointerType==='mouse')show(true);};group.onpointerleave=()=>{if(!group.contains(document.activeElement))show(false);};
    group.addEventListener('focusin',()=>show(true));group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))show(false);});
    group.onkeydown=event=>{if(event.key==='Escape'){button.focus();show(false);event.stopPropagation();}};
}
function mount() {
    modal=document.createElement('div');modal.id='officeMapModal';modal.className='modal hidden';modal.dataset.returnFocus='openOfficeMap';
    modal.innerHTML=`<div class="modal-content office-map-dialog"><div class="modal-header"><h2 id="officeMapTitle" data-i18n="map.title">${t('map.title')}</h2><button id="closeOfficeMap" type="button" class="close-modal-btn" data-i18n-aria="btn.close" aria-label="${t('btn.close')}">×</button></div><div class="office-map-layout"><aside class="office-sidebar"><label for="officeSearch" data-i18n="map.search">${t('map.search')}</label><input id="officeSearch" type="search" autocomplete="off" data-i18n-placeholder="map.search"><div id="officeList"></div><button id="locateMe" type="button" class="secondary-btn" data-i18n="map.locate">${t('map.locate')}</button><p id="locationStatus" role="status"></p></aside><div class="office-map-content"><div id="officeMap" aria-label="${t('map.title')}"></div><p id="mapStatus" role="status"></p></div></div></div>`;
    document.body.append(modal);
    document.getElementById('closeOfficeMap').onclick=()=>modal.classList.add('hidden');
    document.getElementById('officeSearch').oninput=render;
    document.getElementById('locateMe').onclick=event=>busy(event.currentTarget,locate);
}
async function openMap() {
    if(!modal){mount();await Promise.resolve();}modal.classList.remove('hidden');
    if(map){map.invalidateSize();return;}
    if(opening)return;
    const status=document.getElementById('mapStatus');setStatus(status,'map.loading');
    opening=(async()=>{
        try {
            const [leaflet,response]=await Promise.all([import('leaflet'),fetch(`${import.meta.env.BASE_URL}data/offices.csv`)]);
            if(!response.ok)throw new Error('Office data unavailable');offices=parseOffices(await response.text());if(!offices.length)throw new Error('Empty offices');
            L=leaflet.default;const motion=!matchMedia('(prefers-reduced-motion:reduce)').matches;
            map=L.map('officeMap',{zoomControl:false,zoomAnimation:motion,fadeAnimation:motion,markerZoomAnimation:motion,scrollWheelZoom:false}).setView([offices[0].latitude,offices[0].longitude],14);
            L.control.zoom({zoomInTitle:t('map.zoomIn'),zoomOutTitle:t('map.zoomOut')}).addTo(map);
            map.on('popupopen',()=>{const close=modal.querySelector('.leaflet-popup-close-button');close?.setAttribute('aria-label',t('btn.close'));close?.setAttribute('title',t('btn.close'));});
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a>'}).on('tileerror',()=>{setStatus(status,'map.tilesError');}).addTo(map);
            for(const office of offices){const marker=L.marker([office.latitude,office.longitude],{icon:L.divIcon({className:'office-pin',html:'<span aria-hidden="true">AG</span>',iconSize:[36,36],iconAnchor:[18,36]})}).addTo(map);marker.on('click',()=>select(office));markers.set(office.id,marker);}
            selected=offices[0].id;setStatus(status,'');render();new ResizeObserver(()=>map.invalidateSize()).observe(document.getElementById('officeMap'));
        }catch {setStatus(status,'map.error');const retry=document.createElement('button');retry.type='button';retry.className='secondary-btn';retry.dataset.i18n='map.retry';retry.textContent=t('map.retry');retry.onclick=()=>{retry.remove();openMap();};status.after(retry);}
        finally{opening=null;}
    })();await opening;
}
function render() {
    const list=document.getElementById('officeList');list.replaceChildren();
    const search=document.getElementById('officeSearch').value;
    for(const office of offices){const name=label(office),marker=markers.get(office.id);marker.options.title=name;marker.getElement()?.setAttribute('aria-label',name);const popup=document.createElement('div');const title=document.createElement('strong');title.textContent=name;const address=document.createElement('p');address.textContent=office.address;const coords=document.createElement('p');coords.textContent=coordinates(office);coords.dir='ltr';popup.append(title,address,coords);if(office.demo){const note=document.createElement('p');note.textContent=t('map.demo');popup.append(note);}marker.bindPopup(popup);if(!matchesOffice(office,search,name))continue;
        const button=document.createElement('button');button.type='button';button.className='office-list-item';button.dataset.officeId=office.id;button.setAttribute('aria-pressed',String(selected===office.id));const heading=document.createElement('strong');heading.textContent=name;const text=document.createElement('span');text.textContent=office.address;const coordinate=document.createElement('small');coordinate.dir='ltr';coordinate.textContent=coordinates(office);button.append(heading,text,coordinate);button.onclick=()=>select(office);list.append(button);
    }
    if(!list.childElementCount){const empty=document.createElement('p');empty.textContent=t('map.empty');list.append(empty);}
    for(const [selector,key] of [['.leaflet-control-zoom-in','map.zoomIn'],['.leaflet-control-zoom-out','map.zoomOut']]){const control=modal.querySelector(selector);control?.setAttribute('title',t(key));control?.setAttribute('aria-label',t(key));}
    userMarker?.setTooltipContent(t('map.yourLocation'));document.getElementById('officeMap').setAttribute('aria-label',t('map.title'));
}
function select(office){selected=office.id;map.setView([office.latitude,office.longitude],15,{animate:!matchMedia('(prefers-reduced-motion:reduce)').matches});render();markers.get(office.id).openPopup();}
async function locate() {
    const status=document.getElementById('locationStatus');setStatus(status,'map.locating');
    if(!map || !navigator.geolocation){setStatus(status,'map.geoError');return;}
    await new Promise(resolve=>navigator.geolocation.getCurrentPosition(position=>{
        userMarker?.remove();userAccuracy?.remove();const point=[position.coords.latitude,position.coords.longitude];
        userMarker=L.circleMarker(point,{radius:8,color:'#0878c9',fillOpacity:1}).addTo(map).bindTooltip(t('map.yourLocation'));
        userAccuracy=L.circle(point,{radius:Math.max(1,position.coords.accuracy),color:'#0878c9',fillOpacity:.08,weight:1}).addTo(map);map.fitBounds(L.latLngBounds([point,...offices.map(office=>[office.latitude,office.longitude])]),{padding:[35,35],maxZoom:15,animate:false});setStatus(status,'map.yourLocation');resolve();
    },()=>{setStatus(status,'map.geoError');resolve();},{enableHighAccuracy:false,timeout:10000,maximumAge:60000}));
}

