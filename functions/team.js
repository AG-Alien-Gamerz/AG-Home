const seed=require('./team-seed.json');
module.exports=({functions,db,authorize,stamp})=>functions.https.onCall(async(data,context)=>{
    const caller=await authorize(context);
    if(!['OWNER','SUPER_ADMIN','ADMIN'].includes(caller.rank))throw new functions.https.HttpsError('permission-denied','Administrators only.');
    const {applyTeamChange}=await import('./team-model.mjs');
    const reference=db.doc('organization/main');
    return db.runTransaction(async tx=>{
        const snapshot=await tx.get(reference),previous=snapshot.exists?snapshot.data():seed;
        if(!Number.isInteger(data?.revision)||data.revision!==previous.revision)throw new functions.https.HttpsError('aborted','org.conflict');
        let org;try{org=applyTeamChange(previous,data.change);}catch(error){throw new functions.https.HttpsError('invalid-argument',error.message);}
        org.revision=previous.revision+1;org.memberIds=org.members.map(member=>member.id);tx.set(reference,org);
        tx.set(db.collection('admin_logs').doc(),{action:'TEAM_CHANGE',performedBy:caller.email,timestamp:stamp(),revision:org.revision,kind:data.change.kind});
        return {success:true,revision:org.revision};
    });
});
