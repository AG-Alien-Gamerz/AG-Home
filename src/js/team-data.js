import {doc,onSnapshot} from 'firebase/firestore';
import {httpsCallable} from 'firebase/functions';
import {db,functions} from './firebase-config.js';
import seed from '../../functions/team-seed.json';
import {validateOrganization} from '../../functions/team-model.mjs';
export {memberStatus,latestAssignment,filterMembers,ancestors,safeTeamURL,validDate} from '../../functions/team-model.mjs';
export const initialOrganization=seed;
export function watchOrganization(render){
    let latest=structuredClone(seed);render(latest,'loading');
    return onSnapshot(doc(db,'organization','main'),snapshot=>{
        try{latest=snapshot.exists()?validateOrganization(snapshot.data()):structuredClone(seed);render(latest,snapshot.exists()?'live':'initial');}
        catch{render(latest,'error');}
    },()=>render(latest,'error'));
}
export async function manageTeam(revision,change){return (await httpsCallable(functions,'manageTeam')({revision,change})).data;}
