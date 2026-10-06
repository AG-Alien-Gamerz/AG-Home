import {watchOrganization,memberStatus} from './team-data.js';
import {element,memberPortrait,profileContent} from './team-ui.js';
import {t} from './localization.js';
export function initAboutTeam(){
    const host=document.getElementById('aboutTeamMembers');if(!host)return;
    let organization;const render=()=>{if(!organization)return;host.replaceChildren();for(const member of organization.members.filter(m=>memberStatus(m)==='current')){const article=element('article','team-member'),portrait=element('div','team-portrait');portrait.append(memberPortrait(member));article.append(portrait,profileContent(member,organization.nodes,{profileLink:true}));host.append(article);}if(!host.childElementCount)host.append(element('p','',t('org.none')));};
    watchOrganization(org=>{organization=org;render();});window.addEventListener('languageChanged',render);
}
