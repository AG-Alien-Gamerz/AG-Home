import {t} from './localization.js';
import {memberStatus,latestAssignment,ancestors} from './team-data.js';
import {element,button,nodeName,roleText,responsibilityText} from './team-ui.js';
import {groupedProducts,DEVELOPMENT_AREAS,productHref} from './product-model.js';
import {getTranslated} from './db-translator.js';

// Product occurrences reference one catalogue record even when several platforms apply.
export function createOrganizationMap(host,selectPerson,selectBranch,selectProduct=()=>{}){
    let org,products=[],scale=1,selected='',filter='current',query='';
    const collapsed=new Set(),seenPlatforms=new Set();
    const toolbar=element('div','organization-toolbar'),status=element('select');
    status.id='mapMembership';
    const searchLabel=element('label','organization-search'),searchCaption=element('span'),search=element('input');
    search.id='organizationSearch';search.type='search';search.autocomplete='off';searchLabel.append(searchCaption,search);
    const searchStatus=element('p','organization-search-status');searchStatus.id='organizationSearchStatus';searchStatus.setAttribute('role','status');
    const viewport=element('div','organization-viewport');viewport.id='organizationViewport';viewport.tabIndex=0;
    const space=element('div','organization-space'),stage=element('div','organization-stage');space.append(stage);viewport.append(space);
    const controls=[button('map.zoomIn',()=>zoom(scale+.15)),button('map.zoomOut',()=>zoom(scale-.15)),button('org.reset',()=>{scale=1;query='';search.value='';collapsed.clear();for(const id of seenPlatforms)collapsed.add(id);render();viewport.scrollTo({left:0,top:0});})];
    toolbar.append(searchLabel,status,...controls);host.append(toolbar,searchStatus,viewport);
    status.onchange=()=>{filter=status.value;render();};
    search.oninput=()=>{query=search.value.trim().toLocaleLowerCase();render();};
    const size=()=>{const width=stage.scrollWidth*scale;space.style.width=width+'px';space.style.height=stage.scrollHeight*scale+'px';stage.style.left=Math.max(0,(viewport.clientWidth-width)/2)+'px';stage.style.transform=`scale(${scale})`;};
    const observer=new ResizeObserver(size);observer.observe(stage);observer.observe(viewport);
    function zoom(value){const old=scale;scale=Math.min(1.8,Math.max(.5,value));size();viewport.scrollLeft=(viewport.scrollLeft+viewport.clientWidth/2)*scale/old-viewport.clientWidth/2;viewport.scrollTop=(viewport.scrollTop+viewport.clientHeight/2)*scale/old-viewport.clientHeight/2;viewport.dataset.zoom=String(scale);}
    let drag;
    viewport.addEventListener('pointerdown',event=>{if(event.pointerType==='touch'||event.target.closest('button,select,input,a,label'))return;drag={x:event.clientX,y:event.clientY,left:viewport.scrollLeft,top:viewport.scrollTop};viewport.setPointerCapture(event.pointerId);viewport.classList.add('panning');});
    viewport.addEventListener('pointermove',event=>{if(!drag)return;viewport.scrollLeft=drag.left+drag.x-event.clientX;viewport.scrollTop=drag.top+drag.y-event.clientY;});
    for(const key of ['pointerup','pointercancel'])viewport.addEventListener(key,()=>{drag=null;viewport.classList.remove('panning');});
    viewport.addEventListener('keydown',event=>{if(event.target!==viewport)return;const direction={ArrowLeft:[-70,0],ArrowRight:[70,0],ArrowUp:[0,-70],ArrowDown:[0,70]}[event.key];if(direction){event.preventDefault();viewport.scrollBy(...direction);}if(event.key==='+'||event.key==='=')zoom(scale+.15);if(event.key==='-')zoom(scale-.15);});
    function memberNode(member){return {id:'member:'+member.id,kind:'member',label:member.name,member,children:[],searchText:[member.name,roleText(member),...member.skills.map(responsibilityText),...ancestors(latestAssignment(member)?.nodeId,org.nodes).map(nodeName)].join(' ')};}
    function organizationNode(node){
        const children=org.nodes.filter(n=>n.parentId===node.id).map(organizationNode);
        for(const member of org.members.filter(m=>latestAssignment(m)?.nodeId===node.id&&(filter==='all'||memberStatus(m)===filter))){
            children.push(memberNode(member));
        }
        return {id:node.id,kind:node.type,label:nodeName(node),node,children};
    }
    function tree(){
        const root=organizationNode(org.nodes.find(n=>n.id==='ag'));
        const platformNodes=groupedProducts(products).map(group=>({id:'platform:'+group.id,kind:'platform',label:t(group.label),platform:group,children:group.products.map(product=>({
            id:'product:'+group.id+':'+product.id,kind:'product',label:getTranslated(product,'name'),product,children:[],
            searchText:[getTranslated(product,'name'),getTranslated(product,'description'),t(group.label),...groupedProducts([product]).map(p=>t(p.label)),...product.developmentCategories.map(id=>t(DEVELOPMENT_AREAS.find(a=>a.id===id)?.label||'org.unspecified')),...org.members.filter(m=>product.ownerIds.includes(m.id)).map(m=>m.name)].join(' ')
        }))}));
        for(const node of platformNodes)if(!seenPlatforms.has(node.id)){seenPlatforms.add(node.id);collapsed.add(node.id);}
        const unassigned=org.members.filter(member=>!latestAssignment(member)&&(filter==='all'||memberStatus(member)===filter)).map(memberNode);
        root.children=[{id:'organization-teams',kind:'group',label:t('catalogue.teams'),children:[...root.children,...unassigned]},{id:'organization-products',kind:'group',label:t('catalogue.products'),children:platformNodes}];
        return root;
    }
    function matching(node,inherited=false){
        const direct=Boolean(query)&&(node.searchText||node.label).toLocaleLowerCase().includes(query);
        const children=node.children.map(child=>matching(child,inherited||direct)).filter(Boolean);
        return !query||direct||inherited||children.length?{...node,match:direct,children}:null;
    }
    function activate(node,focusId=node.id){
        selected=node.id;
        if(node.kind==='member')selectPerson(node.member.id);
        else if(node.kind==='product')selectProduct(node.product);
        else {
            if(node.kind==='platform')toggleBranch(node.id);
            selectBranch(node.node||{id:node.id,type:node.kind,name:node.label,platformId:node.platform?.id});
        }
        render();focusNode(focusId);
    }
    function toggleBranch(id){
        // Search temporarily reveals matching paths. An explicit collapse still works.
        if(query){query='';search.value='';collapsed.add(id);}
        else collapsed.has(id)?collapsed.delete(id):collapsed.add(id);
    }
    function focusNode(id){[...stage.querySelectorAll('[data-map-id]')].find(control=>control.dataset.mapId===id)?.focus({preventScroll:true});}
    function branch(node){
        const li=element('li','organization-branch organization-'+node.kind),row=element('div','organization-node-row');
        const control=element(node.product?'a':'button','organization-node '+node.kind+'-node'+(node.kind==='member'?' person-node':'')+(node.match?' node-match':''));control.dataset.mapId=node.id;control.dir='auto';
        if(node.product){control.href=productHref(node.product);control.dataset.selected=String(selected===node.id);}else{control.type='button';control.setAttribute('aria-pressed',String(selected===node.id));control.onclick=()=>activate(node);}
        if(node.node)control.dataset.nodeId=node.node.id;
        if(node.member){control.dataset.memberId=node.member.id;control.append(element('strong','',node.label),element('small','',roleText(node.member)),element('small','',t(memberStatus(node.member)==='current'?'org.current':'org.former')));}
        else if(node.product){control.dataset.productId=node.product.id;control.append(element('strong','',node.label));if(node.product.version)control.append(element('small','',node.product.version));}
        else {control.append(element('span','',node.label));if(node.platform){control.dataset.platformId=node.platform.id;control.setAttribute('aria-expanded',String(Boolean(query)||!collapsed.has(node.id)));control.append(element('small','organization-node-kind',String(node.children.length)));}}
        row.append(control);
        if(node.product){const preview=element('button','organization-toggle product-preview-control');preview.type='button';preview.dataset.productPreview=node.product.id;preview.dataset.mapId=node.id+':preview';preview.setAttribute('aria-label',`${t('product.viewDetails')} · ${node.label}`);preview.title=`${t('product.viewDetails')} · ${node.label}`;preview.setAttribute('aria-pressed',String(selected===node.id));const icon=element('span','','ⓘ');icon.setAttribute('aria-hidden','true');preview.append(icon);preview.onclick=()=>activate(node,node.id+':preview');row.append(preview);}
        if(node.children.length){const isClosed=collapsed.has(node.id)&&!query,toggle=button(isClosed?'org.expand':'org.collapse',()=>{toggleBranch(node.id);render();[...stage.querySelectorAll('[data-branch-toggle]')].find(c=>c.dataset.branchToggle===node.id)?.focus({preventScroll:true});},'organization-toggle');toggle.dataset.branchToggle=node.id;toggle.setAttribute('aria-expanded',String(!isClosed));toggle.setAttribute('aria-label',`${t(isClosed?'org.expand':'org.collapse')} · ${node.label}`);row.append(toggle);}
        li.append(row);
        if(node.children.length&&(!collapsed.has(node.id)||query)){const ul=element('ul',node.kind==='platform'?'organization-products-list':'');for(const child of node.children)ul.append(branch(child));li.append(ul);}return li;
    }
    function render(){
        if(!org)return;
        status.replaceChildren();for(const [value,key] of [['current','org.current'],['former','org.former'],['all','org.history']]){const option=element('option','',t(key));option.value=value;status.append(option);}status.value=filter;status.setAttribute('aria-label',t('org.history'));
        searchCaption.textContent=t('catalogue.searchMap');search.setAttribute('aria-label',t('catalogue.searchMap'));
        for(const [index,key] of ['map.zoomIn','map.zoomOut','org.reset'].entries())controls[index].textContent=t(key);
        viewport.setAttribute('aria-label',t('org.map'));stage.replaceChildren();const filtered=matching(tree());
        if(filtered){const ul=element('ul','organization-tree');ul.append(branch(filtered));stage.append(ul);searchStatus.textContent='';}else {searchStatus.textContent=t('catalogue.noMatches');stage.append(element('p','organization-map-empty',t('catalogue.noMatches')));}
        size();viewport.dataset.zoom=String(scale);
    }
    function reveal(control){control?.scrollIntoView({block:'nearest',inline:'center',behavior:'instant'});control?.focus({preventScroll:true});}
    return {
        update(value,catalogue=products){org=value;products=catalogue;render();},
        locate(member){selected='member:'+member.id;query='';search.value='';collapsed.delete('ag');collapsed.delete('organization-teams');if(memberStatus(member)==='former')filter='all';for(const node of ancestors(latestAssignment(member)?.nodeId,org.nodes))collapsed.delete(node.id);render();reveal([...stage.querySelectorAll('[data-member-id]')].find(n=>n.dataset.memberId===member.id));},
        locateProduct(product){query='';search.value='';collapsed.delete('ag');collapsed.delete('organization-products');const platform=groupedProducts([product])[0];if(platform){collapsed.delete('platform:'+platform.id);selected='product:'+platform.id+':'+product.id;}render();reveal([...stage.querySelectorAll('[data-product-id]')].find(n=>n.dataset.productId===product.id));},
        render
    };
}
