import{c as e}from"./character-Bt8MDF7s.js";import{A as t,C as n,D as r,O as i,S as a,_ as o,a as s,b as c,k as l,l as u,x as d,y as f}from"./localization-D8QcSra_.js";import{M as p,N as m,P as h}from"./team-ui-DFqKFs6n.js";var g=e=>typeof e==`string`&&e.trim()&&!e.includes(`@`)?e.trim():``;function _(e,t={},n=``){return g(t.username)||g(e.senderUsername)||g(t.displayName)||g(e.senderName)||g([t.firstName,t.secondName,t.lastName].filter(Boolean).join(` `))||g((e.senderEmail||e.senderName||t.email||``).split(`@`)[0])||n}function v(e,t){if(!t)return!1;if(e.senderId)return e.senderId===t.uid;let n=e.senderEmail||(e.senderName?.includes(`@`)?e.senderName:``);return!!(n&&t.email&&n.toLowerCase()===t.email.toLowerCase())}var y=l();function b(){x(),S(),M(),C()}function x(){let e=document.getElementById(`addModeratorForm`);e&&e.addEventListener(`submit`,async e=>{e.preventDefault();try{let e=document.getElementById(`moderatorEmail`);if(!e)throw Error(`Moderator email input not found`);let t=e.value.trim().toLowerCase();if(!t||!t.includes(`@`))throw Error(`Please enter a valid email address`);await h.assignRole(u.currentUser,t,m.MODERATOR),e.value=``,window.closeAddModeratorModal?.(),alert(`Moderator added successfully`),await Promise.all([window.loadModerators?.(),window.loadModeratorList?.(),window.loadUsers?.()])}catch(e){console.error(`Error adding moderator:`,e),alert(e.message||`Failed to add moderator`)}})}function S(){let e=document.getElementById(`addSuperAdminForm`);e&&e.addEventListener(`submit`,async e=>{e.preventDefault();try{let e=document.getElementById(`superAdminEmail`);if(!e)throw Error(`Email input not found`);let t=e.value.trim().toLowerCase();if(!t||!t.includes(`@`))throw Error(`Please enter a valid email address`);await h.assignRole(u.currentUser,t,m.SUPER_ADMIN),e.value=``,window.closeAddSuperAdminModal?.(),alert(`Super Admin added successfully`),await Promise.all([window.loadSuperAdmins?.(),window.loadUsers?.()])}catch(e){console.error(`Error adding super admin:`,e),alert(e.message||`Failed to add super admin`)}})}function C(){document.getElementById(`addModeratorModal`)?.addEventListener(`click`,e=>{e.target.id===`addModeratorModal`&&window.closeAddModeratorModal?.()}),document.getElementById(`addSuperAdminModal`)?.addEventListener(`click`,e=>{e.target.id===`addSuperAdminModal`&&window.closeAddSuperAdminModal?.()})}function w(){document.querySelectorAll(`.nav-link`).forEach(e=>{e.addEventListener(`click`,t=>{if(e.getAttribute(`href`)?.startsWith(`#`)){t.preventDefault();let n=e.getAttribute(`data-section`);n&&T(n)}})})}function T(e){document.querySelectorAll(`.content-section`).forEach(e=>{e.classList.remove(`active`),e.classList.add(`hidden`)}),document.querySelectorAll(`.nav-link`).forEach(e=>e.classList.remove(`active`));let t=document.getElementById(`${e}-section`),n=document.querySelector(`[data-section="${e}"]`);t&&(t.classList.remove(`hidden`),t.classList.add(`active`),setTimeout(()=>{switch(e){case`admin-management`:case`admins`:window.loadAdmins?.();break;case`moderator-management`:case`moderators`:window.loadModerators?.();break;case`super-admin`:window.loadSuperAdmins?.();break;case`messages`:window.loadMessages?.();break;case`manage-all-ranks`:E();break;case`chats`:j();break;case`product-management`:window.loadControlPanelProducts?.();break;case`product-reports`:window.loadReports?.();break;case`product-reports`:window.loadReports?.();break}},100)),n&&n.classList.add(`active`);try{history.replaceState(null,``,`#${e}`)}catch{}}async function E(){let e=document.getElementById(`usersList`),t=document.getElementById(`ownersList`),i=document.getElementById(`adminsListAll`),a=document.getElementById(`superAdminsListAll`),o=document.getElementById(`moderatorsListAll`);if(!(!e&&!t&&!i&&!o))try{let[s,l,d]=await Promise.all([c(n(r(y,`users`))),c(n(r(y,`admins`))),c(n(r(y,`moderators`)))]),f=s.docs.map(e=>({id:e.id,...e.data()})),g=l.docs.map(e=>({id:e.id,...e.data()})),_=d.docs.map(e=>({id:e.id,...e.data()}));for(let e of p){let t=String(e).toLowerCase();f.find(e=>String(e.email||``).toLowerCase()===t)||f.push({id:`owner-${t}`,email:t,role:m.OWNER,createdAt:null})}let v=new Set(p.map(e=>String(e).toLowerCase())),b=new Set(g.map(e=>String(e.email||``).toLowerCase())),x=new Set(_.map(e=>String(e.email||``).toLowerCase())),S=[],C=[];for(let e of f){let t=String(e.email||``).toLowerCase();t&&(v.has(t)?S.push(e):b.has(t)||x.has(t)||C.push(e))}t&&(t.innerHTML=``);for(let e of S){let n=e.email;t&&(t.innerHTML+=`
                <div class="owner-item">
                    <div class="Owner-info">
                        <div class="Owner-email">👑 ${N(n)}</div>
                        <div class="Owner-meta">
                            <span class="owner">👑 Owner</span>
                            <span class="Owner-Add">Added by: System</span>
                            <span class="Owner-Add">Joined: From Start</span>
                            <span class="Owner-RN">Name: Muhammad Hamza Sabir</span>
                        </div>
                        <div class="Owner-actions">
                            <span class="protected-label">
                            Protected
                            </span>
                        </div>
                </div>`)}let w=g.filter(e=>e.isSuperAdmin),T=g.filter(e=>!e.isSuperAdmin);a&&(a.innerHTML=``);for(let e of w){let t=e.email,n=e.addedAt||e.createdAt||null,r=(window.formatDate||(e=>`N/A`))(n);a&&(a.innerHTML+=`
                <div class="super-admin-item">
                    <div class="super-admin-info">
                        <div class="super-admin-email">${N(t)}</div>
                        <div class="super-admin-meta">
                        <span class="super-admin-type">
                            Super Admin
                        </span>
                            <span class="admin-date">Added: ${r}</span>
                            <span class="admin-by">by: ${N(e.addedBy||`N/A`)}</span>
                        </div>
                    </div>
                    <div class="super-admin-actions">
                        <button onclick="showRolePicker(${F(e.id)},${F(t)},'SUPER_ADMIN', this)" class="demote-btn">Change Role</button>
                        <button onclick="removeSuperAdmin(${F(e.id)})" class="remove-btn">Remove</button>
                    </div>
                </div>`)}i&&(i.innerHTML=``);for(let e of T){let t=e.email,n=e.addedAt||e.createdAt||null,r=(window.formatDate||(e=>`N/A`))(n);i&&(i.innerHTML+=`
                <div class="admin-item">
                    <div class="admin-info">
                        <div class="admin-email">${N(t)}</div>
                        <div class="admin-meta">
                            <span class="admin-type regular">Admin</span>
                            <span class="admin-date">Added: ${r}</span>
                            <span class="admin-by">by: ${N(e.addedBy||`N/A`)}</span>
                        </div>
                    </div>
                    <div class="admin-actions">
                        <button onclick="showRolePicker(${F(e.id)},${F(t)},'ADMIN', this)" class="role-btn">Change Role</button>
                        <button onclick="removeAdmin(${F(e.id)})" class="remove-btn">Remove</button>
                    </div>
                </div>`)}o&&(o.innerHTML=``);for(let e of _){let t=e.email,n=e.addedAt||e.createdAt||null;o&&(o.innerHTML+=`
                <div class="moderator-item">
                    <div class="moderator-info">
                        <div class="moderator-email">${N(t)}</div>
                        <div class="moderator-meta">
                            <span class="moderator-type">Moderator</span>
                            <span class="moderator-date">Added: ${(window.formatDate||(e=>`N/A`))(n)}</span>
                            <span class="moderator-by">by: ${N(e.addedBy||`N/A`)}
                        </div>
                    </div>
                    <div class="moderator-actions">
                    <button onclick="showRolePicker(${F(e.id||e.email)}, ${F(t)}, 'MODERATOR', this)" class="promote-btn">Change Role</button>
                        <button onclick="removeModerator(${F(e.id||e.email)})" class="remove-btn">Remove</button>
                    </div>
                </div>`)}e&&(e.innerHTML=``);for(let t of C){let n=m.USER,r=`user-item`;switch(n){case m.SUPER_ADMIN:r=`super-admin-item`;break;case m.ADMIN:r=`admin-item`;break;case m.MODERATOR:r=`moderator-item`;break;default:r=`user-item`}let i=await h.checkPermission(u.currentUser,`manage`,n);e&&(e.innerHTML+=`
                <div class="${r}">
                    <div class="user-info">
                        <div class="user-email">${N(t.email)}</div>
                        <div class="user-meta">
                            <span class="user-role ${n.toLowerCase()}">${n}</span>
                            <span class="user-date">Joined: ${(window.formatDate||(e=>`N/A`))(t.createdAt)}</span>
                        </div>
                    </div>
                    ${i?`
                        <div class="user-actions">
                            <button onclick="showRolePicker(${F(t.id)},${F(t.email)},${F(n)}, this)" class="change-role-btn">Change Role</button>
                            <button onclick="deleteUser(${F(t.id)})" class="delete-btn">Delete</button>
                        </div>`:``}
                </div>`)}}catch(n){console.error(`Error loading users:`,n),t&&(t.innerHTML=``),e&&(e.innerHTML=`<p class="error">Error loading users</p>`),i&&(i.innerHTML=`<p class="error">Error loading admins</p>`),o&&(o.innerHTML=`<p class="error">Error loading moderators</p>`)}}var D=null,O=0,k=new Map;function A(e){return!e||typeof e!=`string`||e.includes(`/`)?Promise.resolve({}):(k.has(e)||k.set(e,f(i(y,`users`,e)).then(e=>e.data()||{}).catch(()=>({}))),k.get(e))}async function j(){let e=document.getElementById(`chatsList`);if(e){D&&=(D(),null),++O;try{D=d(n(r(y,`global_chat`),a(`timestamp`,`asc`)),async t=>{let n=++O,r=!e.children.length||e.scrollHeight-e.scrollTop-e.clientHeight<80,i=e.scrollTop,a=t.docs.map(e=>({id:e.id,...e.data()})),o=await Promise.all(a.map(e=>A(e.senderId)));if(n===O){if(e.innerHTML=``,t.empty){e.innerHTML=`<p class="no-messages" data-i18n="admin.noData">${s(`admin.noData`)}</p>`;return}a.forEach((t,n)=>{let r=(window.formatDate||(e=>`N/A`))(t.timestamp),i=_(t,o[n],s(`admin.users`)),a=t.text||``,c=document.createElement(`div`);c.className=`chat-message ${v(t,u.currentUser)?`is-own`:`is-other`}`,c.dataset.messageId=t.id,c.innerHTML=`
                    <div class="chat-meta"><strong class="chat-sender" dir="auto">${N(i)}</strong> <span class="chat-time">${N(r)}</span></div>
                    <div class="chat-text" dir="auto">${N(a)}</div>
                `,e.appendChild(c)}),e.scrollTop=r||v(a.at(-1)||{},u.currentUser)?e.scrollHeight:i}},t=>{console.error(`Error loading chats:`,t),e.innerHTML=`<p class="error" data-i18n="msg.error">${s(`msg.error`)}</p>`})}catch(e){console.error(`Error in loadChats:`,e)}}}function M(){let n=document.getElementById(`chatForm`),a=document.getElementById(`chatInput`);!n||!a||(a.maxLength=5e3,n.addEventListener(`submit`,async c=>{c.preventDefault();let l=a.value.trim();if(l){if(!u.currentUser){alert(`You must be signed in to chat`);return}await e(n.querySelector(`button[type="submit"]`),async()=>{try{let e=(await f(i(y,`users`,u.currentUser.uid))).data()||{};await o(r(y,`global_chat`),{text:l,senderId:u.currentUser.uid,senderName:_({},{...e,displayName:u.currentUser.displayName,email:u.currentUser.email},s(`admin.users`)),timestamp:t()}),a.value=``}catch(e){console.error(`Error sending chat message:`,e),alert(e.message||`Failed to send message`)}})}}))}function N(e){return String(e).replace(/[&<>"'`]/g,e=>({"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`,"`":`&#96;`})[e])}async function P(e,t,n,r){try{document.querySelectorAll(`.role-picker`).forEach(e=>e.remove());let i=document.createElement(`div`);i.className=`role-picker`,i.style.position=`absolute`,i.style.zIndex=1e4,i.style.background=`var(--container-bg, #fff)`,i.style.border=`1px solid var(--border-color, #ddd)`,i.style.padding=`8px`,i.style.borderRadius=`6px`,i.style.boxShadow=`0 4px 12px rgba(0,0,0,0.12)`;let a=document.createElement(`select`);a.setAttribute(`aria-label`,`Change role for ${t}`);let o=[m.OWNER,m.SUPER_ADMIN,m.ADMIN,m.MODERATOR,m.USER],c=await Promise.all(o.map(e=>h.checkPermission(u.currentUser,`manage`,e).then(Boolean).catch(()=>!1))),l=u.currentUser?.email?.toLowerCase(),d=l&&p.map(e=>e.toLowerCase()).includes(l),f=p.map(e=>e.toLowerCase()).includes(String(t||``).toLowerCase());o.forEach((e,t)=>{let r=document.createElement(`option`),i={OWNER:`admin.owner`,SUPER_ADMIN:`admin.super`,ADMIN:`admin.administrators`,MODERATOR:`admin.moderators`,USER:`admin.users`};r.value=e,r.textContent=s(i[e]),r.dataset.i18n=i[e],e===n&&(r.selected=!0);let o=c[t];e===m.OWNER&&!d&&(o=!1),(f||n===m.SUPER_ADMIN)&&!d&&(o=!1),o||(r.disabled=!0),a.appendChild(r)});let g=document.createElement(`button`);g.textContent=s(`btn.submit`),g.dataset.i18n=`btn.submit`,g.className=`confirm-role-btn`,g.style.marginInlineStart=`8px`;let _=document.createElement(`button`);_.textContent=s(`btn.cancel`),_.dataset.i18n=`btn.cancel`,_.className=`cancel-role-btn`,_.style.marginInlineStart=`6px`,i.appendChild(a),i.appendChild(g),i.appendChild(_),document.body.appendChild(i);let v=r.getBoundingClientRect();i.style.top=`${v.bottom+window.scrollY+6}px`,i.style.left=`${Math.max(8,Math.min(v.left,innerWidth-i.offsetWidth-8))+window.scrollX}px`,g.addEventListener(`click`,async()=>{let n=a.value;try{if(!await h.checkPermission(u.currentUser,`manage`,n)&&!d){alert(`You do not have permission to assign this role`);return}if((n===m.OWNER||n===m.SUPER_ADMIN)&&!d){alert(`Only owners can assign Owner or Super Admin roles`);return}await window.setUserRole(e,t,n),i.remove()}catch(e){console.error(`Error changing role via picker:`,e),alert(e.message||`Failed to change role`)}}),_.addEventListener(`click`,()=>i.remove());let y=e=>{!i.contains(e.target)&&e.target!==r&&(i.remove(),document.removeEventListener(`click`,y))};return setTimeout(()=>document.addEventListener(`click`,y)),window._lastRolePicker=i,i}catch(e){console.error(`Error showing role picker:`,e)}}window.showRolePicker=P;function F(e){return N(JSON.stringify(String(e??``)))}export{E as loadUsers,b as setupFormHandlers,w as setupNavigationHandlers,T as showSection};