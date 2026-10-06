module.exports=({functions,db,authorize,stamp})=>functions.https.onCall(async(data,context)=>{
    const caller=await authorize(context);
    if(!['OWNER','SUPER_ADMIN','ADMIN'].includes(caller.rank))throw new functions.https.HttpsError('permission-denied','Administrators only.');
    const {initialProducts,knownProduct,withKnownDefaults}=await import('./product-catalogue.mjs');
    const {validateProductRecord}=await import('./product-model.mjs');
    const seed=require('./team-seed.json'),marker=db.doc('catalogue/main'),organization=db.doc('organization/main');
    return db.runTransaction(async tx=>{
        const state=await tx.get(marker);
        if(state.data()?.initialized===true)return {success:true,created:0,updated:0,alreadyInitialized:true};
        const snapshot=await tx.get(db.collection('products')),org=await tx.get(organization),members=(org.exists?org.data():seed).members.map(member=>member.id);
        const existing=snapshot.docs.map(document=>({...document.data(),id:document.id})),changes=[];
        let created=0,updated=0;
        for(const known of initialProducts){
            const matches=existing.filter(product=>knownProduct(product)?.id===known.id);
            if(matches.length>1)throw new functions.https.HttpsError('failed-precondition','catalogue.duplicateError');
            const previous=matches[0],product=previous?withKnownDefaults(previous,known):structuredClone(known);
            try{validateProductRecord(product,members);}
            catch(error){throw new functions.https.HttpsError('invalid-argument',error.message);}
            const {id,...record}=product;
            changes.push({reference:db.doc('products/'+id),record:{...record,catalogueImportedAt:stamp(),updatedAt:stamp(),updatedBy:caller.email,...(!previous?{createdAt:stamp(),createdBy:caller.email}:{})}});
            previous?updated++:created++;
        }
        for(const change of changes)tx.set(change.reference,change.record,{merge:true});
        if(org.exists)tx.set(organization,{memberIds:members},{merge:true});
        tx.set(marker,{schemaVersion:1,initialized:true,initializedAt:stamp()});
        tx.set(db.collection('admin_logs').doc(),{action:'CATALOGUE_INITIALIZE',performedBy:caller.email,timestamp:stamp(),created,updated});
        return {success:true,created,updated,alreadyInitialized:false};
    });
});
