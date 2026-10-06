import {collection,onSnapshot} from 'firebase/firestore';
import {db,functions} from './firebase-config.js';
import {httpsCallable} from 'firebase/functions';
import {subscribeCatalogue} from './catalogue-source.js';
export function watchCatalogue(render) {
    return subscribeCatalogue((next,error)=>onSnapshot(collection(db,'products'),next,error),render);
}
// Explicit administrator action; public subscriptions never invoke this import.
export async function initializeCatalogue() { return (await httpsCallable(functions,'initializeCatalogue')({})).data; }
