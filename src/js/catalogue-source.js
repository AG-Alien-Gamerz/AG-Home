import {normalizeProduct} from './product-model.js';

// Only Firestore snapshots supply products. Empty/error states never seed data.
export function subscribeCatalogue(subscribe,render) {
    let active=true;
    render([],{source:'loading',error:null,persistedIds:[]});
    const stop=subscribe(snapshot=>{
        if(!active)return;
        const records=snapshot.docs.map(document=>normalizeProduct({...document.data(),id:document.id}));
        render(records,{source:'live',error:null,persistedIds:records.map(product=>product.id)});
    },error=>{
        if(active)render([],{source:'error',error,persistedIds:[]});
    });
    return ()=>{active=false;stop();};
}
