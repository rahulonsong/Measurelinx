 uploadCompoDataBase() {

     const ref = db.collection("appData").doc("compoDataBase").collection("compoData")

    //  Uploading individual component Data 
     this.components.forEach(comp => {

         ref.doc(comp.compName).set({
         compName:comp.compName,
         mwt: comp.mwt,
         tc: comp.tc,
         pc: comp.pc,
         acentric: comp.acentric
         },{ merge: true })
         .then(() => {
         // console.("Document successfully written!")
         })
         .catch( (error)=> {
         console.error("Error writing document: ", error)
         })

     })     

     //Uploading grossCompoData 
     // ref.doc("grossCompoData").set({
     // grossCompoData:this.cumulativeCompoData
     // })
     // .then(() => {
     // console.log("Document successfully written!")
     // })
     // .catch( (error)=> {
     // console.error("Error writing document: ", error)
     // })
     // Uploading gross components list
     // ref.doc("grossComponentList").set({
     // grossComponentList:this.components
     // })
     // .then(() => {
     // console.log("Document successfully written!")
     // })
     // .catch( (error)=> {
     // console.error("Error writing document: ", error)
     // })


 }

 uploadProbeMaterialData(){
    const ref = db.collection("appData").doc("compoDataBase").collection("compoData")

    //  Uploading individual probe material data
     this.probeMaterialData.forEach(mat => {

         ref.doc(mat.material).set({
         material:mat.material,
         density: mat.density,
         yieldStrength: mat.yieldStrength,
         modulusOfElasticity: mat.modulusOfElasticity,
         },{ merge: true })
         .then(() => {
            console.log("Document successfully written!")
         })
         .catch( (error)=> {
         console.error("Error writing document: ", error)
         })

     })  
 }
  