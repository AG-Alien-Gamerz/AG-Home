// Pure contract shared by the browser, callable and tests. No authentication roles live here.
export function validDate(value) {
    if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<'1900-01-01')return false;
    const date=new Date(value+'T12:00:00Z');return Number.isFinite(+date)&&date.toISOString().slice(0,10)===value;
}
export function memberStatus(member){return member.endDate?'former':'current';}
export function latestAssignment(member){const last=member?.assignments?.at(-1);return last&&(member.endDate||last.endDate===null)?last:null;}
export function filterMembers(members,{status='all',department='',year='',search=''}={},nodes=[]) {
    const needle=search.trim().normalize('NFKC').toLocaleLowerCase();
    return members.filter(member=>{
        const matchesYear=!year||member.startDate.slice(0,4)<=year&&(!member.endDate||member.endDate.slice(0,4)>=year);
        const assignments=status==='current'&&!year?[latestAssignment(member)].filter(Boolean):member.assignments;
        const matchesDepartment=!department||assignments.some(a=>(!year||a.startDate.slice(0,4)<=year&&(!a.endDate||a.endDate.slice(0,4)>=year))&&(a.pathIds?a.pathIds.includes(department):ancestors(a.nodeId,nodes).some(n=>n.id===department)));
        return (status==='all'||memberStatus(member)===status)&&matchesYear&&matchesDepartment&&(!needle||[member.name,member.role,...member.skills].join(' ').normalize('NFKC').toLocaleLowerCase().includes(needle));
    }).sort((a,b)=>a.startDate.localeCompare(b.startDate)||a.name.localeCompare(b.name));
}
export function ancestors(id,nodes){const path=[],seen=new Set();while(id&&!seen.has(id)){seen.add(id);const node=nodes.find(n=>n.id===id);if(!node)break;path.unshift(node);id=node.parentId;}return path;}
export function validateOrganization(org,today=new Date().toISOString().slice(0,10)) {
    const fail=key=>{throw new Error(key);},text=(v,max,required=false)=>typeof v==='string'&&v.length<=max&&(!required||v.trim().length>0);
    const id=v=>typeof v==='string'&&/^[a-zA-Z0-9_-]{1,80}$/.test(v);
    if(!org||org.schemaVersion!==1||!Array.isArray(org.nodes)||!Array.isArray(org.members)||org.nodes.length>100||org.members.length>150)fail('org.invalid');
    if(JSON.stringify(org).length>850000)fail('org.imageError');
    const nodeIds=new Set(),memberIds=new Set();
    for(const n of org.nodes){if(!id(n.id)||nodeIds.has(n.id)||!text(n.name,150,true)||!['root','department','team'].includes(n.type)||!(n.parentId===null||id(n.parentId)))fail('org.invalid');nodeIds.add(n.id);}
    const root=org.nodes.find(n=>n.id==='ag');if(!root||root.type!=='root'||root.parentId!==null||org.nodes.some(n=>n.id!=='ag'&&n.type==='root'))fail('org.invalid');
    for(const n of org.nodes){const path=ancestors(n.id,org.nodes);if(path[0]?.id!=='ag'||path.length>12||n.id!=='ag'&&!nodeIds.has(n.parentId))fail('org.hierarchyError');}
    for(const m of org.members){
        if(!id(m.id)||memberIds.has(m.id)||!text(m.name,150,true)||!text(m.role,200)||!text(m.bio,8000)||!text(m.avatar,160000)||!text(m.portfolio,2048)||!Array.isArray(m.skills)||m.skills.length>20||m.skills.some(s=>!text(s,80,true)))fail('org.invalid');memberIds.add(m.id);
        if(!validDate(m.startDate)||m.startDate>today||m.endDate!==null&&(!validDate(m.endDate)||m.endDate<m.startDate||m.endDate>today))fail('org.dateError');
        if(m.avatar&&!safeTeamURL(m.avatar,true)||m.portfolio&&!safeTeamURL(m.portfolio))fail('validation.url');
        if(!Array.isArray(m.assignments)||m.assignments.length>100)fail('org.invalid');
        for(let i=0;i<m.assignments.length;i++){
            const a=m.assignments[i],previous=m.assignments[i-1];
            if(!nodeIds.has(a.nodeId)||a.nodeId==='ag'||!validDate(a.startDate)||a.startDate<m.startDate||a.startDate>today||!text(a.role,200)||a.endDate!==null&&(!validDate(a.endDate)||a.endDate<a.startDate||a.endDate>today)||m.endDate&&(a.endDate===null||a.endDate>m.endDate)||previous&&(!previous.endDate||previous.endDate>a.startDate)||i<m.assignments.length-1&&a.endDate===null)fail('org.dateError');
            if(a.pathIds&&(!Array.isArray(a.pathIds)||!Array.isArray(a.pathNames)||a.pathIds.length!==a.pathNames.length||a.pathIds.length>12||a.pathIds.some(v=>!id(v))||a.pathNames.some(v=>!text(v,150,true))))fail('org.invalid');
        }
    }
    return org;
}
export function safeTeamURL(value,image=false){
    if(typeof value!=='string')return '';
    if(image&&(/^\/AG-Home\/team\/[a-zA-Z0-9_-]+\.(png|jpg|webp)$/.test(value)||/^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(value)&&value.length<=160000))return value;
    try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password&&url.hostname.includes('.')?url.href:'';}catch{return '';}
}
export function applyTeamChange(previous,change,today) {
    const org=structuredClone(previous),fail=key=>{throw new Error(key);};
    if(change.kind==='node'){
        const input=change.node,existing=org.nodes.find(n=>n.id===input?.id);
        if(input?.id==='ag')fail('org.hierarchyError');
        const node={id:input?.id,name:input?.name,type:input?.type,parentId:input?.parentId};
        if(existing)Object.assign(existing,node);else org.nodes.push(node);
    }else if(change.kind==='member'){
        const input=change.member,existing=org.members.find(m=>m.id===input?.id);
        const member={id:input?.id,name:input?.name,role:input?.role||'',startDate:input?.startDate,endDate:input?.endDate||null,avatar:input?.avatar||'',bio:input?.bio||'',skills:input?.skills||[],portfolio:input?.portfolio||'',assignments:structuredClone(existing?.assignments||[])};
        const previousAssignment=latestAssignment(member),nodeId=input?.nodeId||'';
        if(existing&&existing.endDate&&!member.endDate)fail('org.historyError'); // Rejoining requires a separate membership record.
        if(existing&&member.startDate!==existing.startDate)fail('org.historyError');
        if(previousAssignment?.nodeId!==nodeId){
            if(existing?.endDate)fail('org.historyError');
            const transferDate=existing?input.transferDate:member.startDate;
            if(existing&&(!validDate(transferDate)||transferDate<=previousAssignment?.startDate))fail('org.dateError');
            if(previousAssignment)previousAssignment.endDate=transferDate;
            if(nodeId){const path=ancestors(nodeId,org.nodes);member.assignments.push({nodeId,startDate:transferDate,endDate:member.endDate,role:member.role,pathIds:path.map(n=>n.id),pathNames:path.map(n=>n.name)});}
        }else if(previousAssignment&&(previousAssignment.endDate===null||previousAssignment.endDate===existing?.endDate)){previousAssignment.endDate=member.endDate;}
        // Role changes do not overwrite the historical assignment's original role.
        if(existing)Object.assign(existing,member);else org.members.push(member);
    }else fail('org.invalid');
    return validateOrganization(org,today);
}
