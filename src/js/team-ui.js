import {t} from './localization.js';
import {ancestors,latestAssignment,safeTeamURL,initialOrganization} from './team-data.js';
import {pageURL} from './auth-service.js';
import {groupedProducts,productsByOwner,productHref} from './product-model.js';
import {getTranslated} from './db-translator.js';
export function element(tag,className='',text=''){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
export function button(key,action,className='secondary-btn'){const node=element('button',className,t(key));node.dataset.i18n=key;node.type='button';node.onclick=action;return node;}
export function dateText(value){if(!value)return t('org.present');const locale=document.documentElement.lang==='en'?'en-GB':document.documentElement.lang;return new Intl.DateTimeFormat(locale,{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(value+'T12:00:00Z'));}
export function nodeName(node){const keys={'Frontend':'org.frontend','Backend':'org.backend','Design':'org.design','Frontend Team':'org.frontendTeam'};return keys[node?.name]?t(keys[node.name]):node?.name||t('org.unspecified');}
export function assignmentPath(member,nodes){return ancestors(latestAssignment(member)?.nodeId,nodes).filter(n=>n.id!=='ag').map(nodeName).join(' / ')||t('org.unspecified');}
export function roleText(member){return member.role==='Lead Developer & Software Engineer'?t('team.role'):member.role||t('org.unspecified');}
export function memberHref(member){return pageURL('team.html')+'#member='+encodeURIComponent(typeof member==='string'?member:member.id);}
const responsibilityKeys={'Software Development':'softwareDevelopment','Research & Innovation':'researchInnovation','Frontend & Backend':'frontendBackend','UI/UX':'uiux','Security & Integrations':'securityIntegrations','Testing & Deployment':'testingDeployment'};
export function responsibilityText(value){return responsibilityKeys[value]?t('responsibility.'+responsibilityKeys[value]):value;}
export function biographyText(member){return member.bio===initialOrganization.members[0].bio?`${t('team.bioParagraph1')}\n\n${t('team.bioParagraph2')}`:member.bio;}
export function memberProducts(member,products){
    const host=element('section','team-products');host.append(element('h4','',t('catalogue.developedProducts')));
    const groups=groupedProducts(productsByOwner(products,member.id));
    if(!groups.length){host.append(element('p','',t('catalogue.noProducts')));return host;}
    for(const group of groups){const section=element('details','member-products-platform'),summary=element('summary','',`${t(group.label)} · ${group.products.length}`),list=element('ul','member-product-list');
        section.dataset.platformId=group.id;
        for(const product of group.products){const row=element('li'),link=element('a','',getTranslated(product,'name'));link.href=productHref(product);link.dataset.productId=product.id;link.dir='auto';row.append(link);if(product.version)row.append(element('small','',product.version));list.append(row);}
        section.append(summary,list);host.append(section);
    }
    return host;
}
export function memberPortrait(member){const image=element('img');image.alt=member.name;image.width=720;image.height=720;image.loading='lazy';image.decoding='async';image.src=safeTeamURL(member.avatar,true)||`${import.meta.env.BASE_URL}logo.png`;image.onerror=()=>{image.onerror=null;image.src=`${import.meta.env.BASE_URL}logo.png`;};return image;}
export function profileContent(member,nodes,{compact=false,products=null,profileLink=false}={}){
    const content=element('div','team-member-content');const name=element('h3','',member.name);name.dir='auto';content.append(name);
    const role=element('p','team-role',roleText(member));role.dir='auto';content.append(role);
    content.append(element('p','membership-period',`${dateText(member.startDate)} → ${dateText(member.endDate)}`));
    const dl=element('dl','team-profile-meta');
    const department=ancestors(latestAssignment(member)?.nodeId,nodes).find(n=>n.type==='department');
    for(const [key,value] of [['org.department',nodeName(department)],['org.team',assignmentPath(member,nodes)],['org.role',role.textContent],['org.joined',dateText(member.startDate)],['org.left',dateText(member.endDate)],['org.history',t(member.endDate?'org.former':'org.current')]]){dl.append(element('dt','',t(key)),element('dd','',value));}
    content.append(dl);
    if(member.skills.length){content.append(element('h4','',t('catalogue.responsibilities')));const skills=element('ul','team-expertise');for(const skill of member.skills){const li=element('li','',responsibilityText(skill));li.dir='auto';skills.append(li);}content.append(skills);}
    const biography=biographyText(member),bio=element('div','team-biography');bio.dir='auto';for(const paragraph of biography.split(/\n\s*\n/).filter(Boolean))bio.append(element('p','',paragraph));
    if(compact&&biography){const preview=element('p','',biography.length>220?biography.slice(0,220).replace(/\s+\S*$/,'')+'…':biography);preview.dir='auto';const details=element('details','profile-biography');details.append(element('summary','',t('details.description')),bio);content.append(preview,details);}else content.append(bio);
    if(safeTeamURL(member.portfolio)){const link=element('a','primary-btn team-portfolio',t('team.portfolio')+' ↗');link.href=safeTeamURL(member.portfolio);link.target='_blank';link.rel='noopener noreferrer';content.append(link);}
    if(profileLink){const link=element('a','secondary-btn team-history-link',t('org.profile'));link.href=memberHref(member);content.append(link);}
    if(member.assignments.length){const history=element('div','assignment-history');history.append(element('h4','',t('org.history')));for(const assignment of member.assignments){const path=assignment.pathNames?assignment.pathNames.slice(1).map(name=>nodeName({name})).join(' / '):ancestors(assignment.nodeId,nodes).filter(n=>n.id!=='ag').map(nodeName).join(' / ');history.append(element('p','',`${path} · ${dateText(assignment.startDate)} → ${dateText(assignment.endDate)}${assignment.role?' · '+roleText(assignment):''}`));}content.append(history);}
    if(products)content.append(memberProducts(member,products));
    return content;
}
