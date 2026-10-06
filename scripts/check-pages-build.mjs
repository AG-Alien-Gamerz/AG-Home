import {readFile,access,readdir} from 'node:fs/promises';
import {resolve,relative,sep} from 'node:path';

const directory=resolve('dist'),base='/AG-Home/';
const required=['index.html','home.html','about.html','team.html','contact.html','control.html','privacy.html','products.html','auth-action.html','404.html','.nojekyll','manifest.json','firebase-messaging-sw.js','theme-init.js','site-loader.js','logo.png','data/offices.csv','team/muhammad-hamza-sabir.png'];
const failures=[];
async function checkLink(value,source) {
    if(!value || value.startsWith('#') || /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(value))return;
    const pathname=value.split(/[?#]/)[0];
    if(!pathname)return;
    if(pathname.startsWith('/')&&!pathname.startsWith(base)){failures.push(`${source}: unexpected root link ${value}`);return;}
    const local=pathname.startsWith(base)?pathname.slice(base.length):pathname;
    const target=resolve(directory,local || 'index.html');
    if(relative(directory,target).startsWith('..'+sep)){failures.push(`${source}: link escapes the build ${value}`);return;}
    try{await access(target);}catch{failures.push(`${source}: missing ${value}`);}
}
for(const name of required){try{await access(resolve(directory,name));}catch{failures.push(`Missing required build file: ${name}`);}}
for(const name of await readdir(directory)){
    if(!name.endsWith('.html'))continue;
    const html=(await readFile(resolve(directory,name),'utf8')).replace(/<!--[\s\S]*?-->/g,'');
    for(const [,value] of html.matchAll(/(?:src|href)\s*=\s*"([^"]*)"/g))await checkLink(value,name);
}
const manifest=JSON.parse(await readFile(resolve(directory,'manifest.json'),'utf8'));
for(const value of [manifest.start_url,manifest.scope,...manifest.icons.map(icon=>icon.src)])await checkLink(value,'manifest.json');
if(failures.length)throw new Error('Pages build verification failed:\n'+failures.join('\n'));
console.log(`Pages build verified: nine application pages, static assets, manifest and ${base} links.`);
