// Getting individual component Data - not preferred
    // const ref = db.collection("appData").doc("compoDataBase").collection("compoData")  
    // ref.get().then((querySnapshot) =>{
    // querySnapshot.forEach((doc) => {
    // // doc.data() is never undefined for query doc snapshots
    //     this.components.push(doc.data().compName)
    //     // console.(doc.data().compName)
    //     })
// })

// Getting one gross component Data
    //   const ref = db.collection("appData").doc("compoDataBase").collection("compoData").doc("grossCompoData")  
    // ref.get().then((doc)=>{
    //     this.cumulativeCompoData = doc.data().grossCompoData
    //     // console.log(this.cumulativeCompoData.length)
    // })
    // .then(()=>{
    //     this.cumulativeCompoData.forEach(compo => {
    //         this.components.push(compo.compName)
    //     });
    //     this.$store.dispatch('setLoading',false)
    // })
    // .catch(function(error) {
    //     console.log("Error getting document:", error)
// })


//  downloadCompoData() {
     // Originally uploaded compo data
     // const ref = db.collection("appData").doc("compoDataBase").collection("compoData").doc("grossCompoData")  
     // ref.get().then((querySnapshot) =>{
     // querySnapshot.forEach((doc) => {
     // // doc.data() is never undefined for query doc snapshots
     //     this.cumulativeCompoData.push(doc.data())
     //     // console.(doc.data().compName)
     //     })
     // })
     // Uploading as one gross compo Data object
     //  const ref = db.collection("appData").doc("compoDataBase").collection("compoData").doc("grossCompoData")  
     // ref.get().then((doc)=>{
     //     this.cumulativeCompoData = doc.data().grossCompoData
     //     // console.log(this.cumulativeCompoData.length)
     // })
     // .catch(function(error) {
     //     console.log("Error getting document:", error)
     // })

 },