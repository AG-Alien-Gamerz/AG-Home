import {t} from './localization.js';
import {watchOrganization,filterMembers,memberStatus,latestAssignment,ancestors} from './team-data.js';
import {watchCatalogue} from './product-data.js';
import {groupedProducts,findProduct,productHref,productActions,PLATFORMS,DEVELOPMENT_AREAS} from './product-model.js';
import {getTranslated} from './db-translator.js';
import {productDescription} from './product-presentation.js';
import {element,button,dateText,memberPortrait,profileContent,nodeName,roleText,assignmentPath,memberHref} from './team-ui.js';
import {createOrganizationMap} from './organization-map.js';

const timeline=document.getElementById('teamTimeline'),profile=document.getElementById('teamProfile');
let org,source,products=[],catalogueState={source:'loading',error:null},selected,selectedBranch,selectedProduct;
const map=createOrganizationMap(document.getElementById('organizationMap'),id=>showProfile(id),showBranch,product=>showProduct(product));
const labelProfile=()=>{const heading=profile.querySelector('h3');if(heading){heading.id='teamProfileHeading';heading.tabIndex=-1;}return heading;};
const headingFocus=()=>labelProfile()?.focus({preventScroll:true});
function closeProfile(){profile.hidden=true;selected=null;selectedBranch=null;selectedProduct=null;history.replaceState(null,'',location.pathname+location.search);}
function showBranch(node,{focus=true}={}){
    if(!node)return;selected=null;selectedProduct=null;selectedBranch=node.id;profile.classList.remove('product-profile');delete profile.dataset.memberId;delete profile.dataset.productId;
    profile.replaceChildren(element('h3','',nodeName(node)));
    if(node.type==='platform'||node.id==='organization-products'){
        const matching=node.type==='platform'?groupedProducts(products).find(p=>p.id===node.platformId)?.products||[]:products;
        const list=element('ul','member-product-list');for(const product of matching){const li=element('li'),control=element('button','text-button',getTranslated(product,'name'));control.type='button';control.onclick=()=>{showProduct(product);map.locateProduct(product);};li.append(control);list.append(li);}profile.append(list);if(!matching.length)profile.append(element('p','',t('catalogue.noProducts')));
    }else{
        profile.append(element('p','',t(node.type==='root'?'org.organization':node.type==='department'?'org.department':node.type==='group'?'catalogue.teams':'org.team')));
        const members=org.members.filter(m=>memberStatus(m)==='current'&&(node.type==='root'||node.id==='organization-teams'||ancestors(latestAssignment(m)?.nodeId,org.nodes).some(n=>n.id===node.id)));
        for(const member of members){const control=element('button','secondary-btn',member.name);control.type='button';control.onclick=()=>showProfile(member.id);profile.append(control);}if(!members.length)profile.append(element('p','',t('org.none')));
    }
    profile.append(button('btn.close',closeProfile));profile.hidden=false;labelProfile();if(focus){history.replaceState(null,'',location.pathname+location.search);headingFocus();}
}
function showProfile(id,{focus=true,route=true}={}){
    const member=org?.members.find(m=>m.id===id);if(!member)return;
    selected=id;selectedBranch=null;selectedProduct=null;profile.hidden=false;profile.classList.remove('product-profile');profile.dataset.memberId=id;delete profile.dataset.productId;
    profile.replaceChildren();const image=memberPortrait(member);image.className='profile-avatar';
    profile.append(image,profileContent(member,org.nodes,{compact:true,products:catalogueState.source==='loading'?null:products}),button('org.map',()=>map.locate(member)),button('org.history',()=>locateTimeline(member)),button('btn.close',closeProfile));labelProfile();
    if(route)history.replaceState(null,'',memberHref(id));if(focus)headingFocus();
}
function showProduct(product,{focus=true}={}){
    if(!product)return;selected=null;selectedBranch=null;selectedProduct=product.id;profile.hidden=false;profile.classList.add('product-profile');profile.dataset.productId=product.id;delete profile.dataset.memberId;
    profile.replaceChildren(element('h3','',getTranslated(product,'name')),element('p','',productDescription(product)));
    const badges=element('div','platform-badges');for(const platform of PLATFORMS.filter(p=>product.platforms[p.id])){const badge=element('span','platform-badge',`${platform.icon} ${t(platform.label)}`);badge.dataset.platformId=platform.id;badges.append(badge);}profile.append(badges);
    if(product.version)profile.append(element('p','membership-period',`${t('editor.version')} · ${product.version}`));
    if(product.developmentCategories.length){profile.append(element('h4','',t('catalogue.developmentCategories')));const areas=element('div','development-badges');for(const id of product.developmentCategories){const area=DEVELOPMENT_AREAS.find(a=>a.id===id);if(area)areas.append(element('span','development-badge',t(area.label)));}profile.append(areas);}
    const owners=org.members.filter(member=>product.ownerIds.includes(member.id));
    if(owners.length){profile.append(element('h4','',t('catalogue.builtBy')));const ownerActions=element('div','built-by-actions');for(const member of owners){const row=element('div','product-owner'),link=element('a','',member.name);link.href=memberHref(member);link.onclick=event=>{if(event.button||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;event.preventDefault();showProfile(member.id);map.locate(member);};row.append(link,element('small','',roleText(member)),element('small','',assignmentPath(member,org.nodes)));ownerActions.append(row);}profile.append(ownerActions);}
    const actions=element('div','team-actions'),view=element('a','primary-btn',t('catalogue.viewProduct')+' →');view.href=productHref(product);view.dataset.productLink=product.id;actions.append(view);
    for(const action of productActions(product)){const link=element('a','secondary-btn',t(action.action)+' ↗');link.href=action.url;link.target='_blank';link.rel='noopener noreferrer';actions.append(link);}
    actions.append(button('btn.close',closeProfile));profile.append(actions);labelProfile();if(focus){history.replaceState(null,'',location.pathname+location.search);headingFocus();}
}
function locateTimeline(member){for(const id of ['teamStatus','teamDepartment','teamYear','teamSearch'])document.getElementById(id).value=id==='teamStatus'?'all':'';renderTimeline();const card=[...timeline.children].find(n=>n.dataset.memberId===member.id);card?.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});card?.querySelector('h3').focus({preventScroll:true});}
function renderTimeline(){
    timeline.replaceChildren();const status=document.getElementById('teamStatus').value;
    const members=filterMembers(org.members,{status,department:document.getElementById('teamDepartment').value,year:document.getElementById('teamYear').value,search:document.getElementById('teamSearch').value},org.nodes);
    for(const member of members){const card=element('article','timeline-member');card.dataset.memberId=member.id;const heading=element('h3','',member.name);heading.dir='auto';heading.tabIndex=-1;const time=element('p','timeline-dates',`${dateText(member.startDate)} → ${dateText(member.endDate)}`);time.dataset.start=member.startDate;time.dataset.end=member.endDate||'';card.append(time,heading,element('p','',roleText(member)),element('span','team-status',t(memberStatus(member)==='current'?'org.current':'org.former')));const path=ancestors(latestAssignment(member)?.nodeId,org.nodes).filter(n=>n.id!=='ag').map(nodeName).join(' / ');card.append(element('p','team-path',path||t('org.unspecified')));const actions=element('div','team-actions');actions.append(button('org.profile',()=>showProfile(member.id)),button('org.map',()=>{showProfile(member.id);map.locate(member);}));card.append(actions);timeline.append(card);}
    if(!members.length)timeline.append(element('p','',t(status==='former'?'org.noFormer':'org.none')));
}
function refreshSelected(){
    if(selected){if(org.members.some(member=>member.id===selected))showProfile(selected,{focus:false,route:false});else closeProfile();}
    else if(selectedProduct){const product=findProduct(products,selectedProduct);if(product)showProduct(product,{focus:false});else closeProfile();}
    else if(selectedBranch){const node=org.nodes.find(n=>n.id===selectedBranch)||{id:selectedBranch,name:selectedBranch==='organization-products'?t('catalogue.products'):selectedBranch==='organization-teams'?t('catalogue.teams'):t(PLATFORMS.find(p=>'platform:'+p.id===selectedBranch)?.label||'org.unspecified'),type:selectedBranch.startsWith('platform:')?'platform':'group',platformId:selectedBranch.slice(9)};showBranch(node,{focus:false});}
}
function render(){
    if(!org)return;const status=document.getElementById('teamDataStatus');status.textContent=source==='loading'?t('msg.loading'):source==='live'?'':source==='error'?t('auth.network'):t('org.initial');
    renderCatalogueStatus();
    const department=document.getElementById('teamDepartment'),oldDepartment=department.value;department.replaceChildren(new Option(t('feedback.all'),''));for(const node of org.nodes.filter(n=>n.type==='department'))department.append(new Option(nodeName(node),node.id));department.value=oldDepartment;
    const year=document.getElementById('teamYear'),oldYear=year.value;year.replaceChildren(new Option(t('feedback.all'),''));const first=Math.min(new Date().getFullYear(),...org.members.map(m=>Number(m.startDate.slice(0,4))));for(let y=new Date().getFullYear();y>=first;y--)year.append(new Option(new Intl.NumberFormat(document.documentElement.lang,{useGrouping:false}).format(y),String(y)));year.value=oldYear;
    renderTimeline();map.update(org,products);refreshSelected();
}
function renderCatalogueStatus(){document.getElementById('teamCatalogueStatus').textContent=catalogueState.error?t('catalogue.catalogueLoadError'):catalogueState.source==='loading'?t('msg.loading'):'';}
function openLinkedProfile(){if(!org)return;const id=new URLSearchParams(location.hash.slice(1)).get('member');const member=org.members.find(m=>m.id===id);if(member){showProfile(member.id,{route:false});profile.scrollIntoView({block:'start',behavior:'instant'});}}
for(const id of ['teamStatus','teamDepartment','teamYear','teamSearch'])document.getElementById(id).addEventListener(id==='teamSearch'?'input':'change',renderTimeline);
watchOrganization((value,state)=>{org=value;source=state;render();if(!selected&&!selectedBranch&&!selectedProduct)openLinkedProfile();});
watchCatalogue((value,state)=>{products=value;catalogueState=state;renderCatalogueStatus();if(org){map.update(org,products);refreshSelected();}});
window.addEventListener('languageChanged',render);window.addEventListener('hashchange',openLinkedProfile);
