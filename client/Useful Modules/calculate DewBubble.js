// // Local Function for Dew Bubble to be added to cloud function checkDewBubble
//         let compoBasis_cloud = data.compoBasis
//         let compoData_cloud = data.compoData
//         let pressure_cloud = data.pressure
//         let compoDataFull_cloud = []
//         let SO2DewValid = data.SO2DewValid
//         let SO3DewValid = data.SO3DewValid
//         let HClDewValid = data.HClDewValid
//         let NO2DewValid = data.NO2DewValid

//         // Reading the component data from the database
//         compoData_cloud.forEach(comp => {

//             const ref = db.collection("appData").doc("compoDataBase").collection("compoData").doc(comp.compoName)

//             ref.get().then((doc)=>{

//                 compoDataFull_cloud.push({
//                 Name:doc.data().compName,
//                 compoValue:comp.compoValue,
//                 mwt:doc.data().mwt,
//                 pc:doc.data().pc,
//                 tc:doc.data().tc,
//                 acentric:doc.data().acentric,

//                 })
//             })
//             .then(()=>{
//                 // console.log(compoDataFull_cloud)
//                 if(compoDataFull_cloud.length == compoData_cloud.length){

//                 // Declaring the variables
//                     let T_n = [0]
//                     let dewSum
//                     let bubbleSum 
//                     let diffDew = []
//                     let diffBubble = []
//                     let Tol 
//                     let Fraction 
//                     let X =[]
//                     let Y = []
//                     let kx = []
//                     let ky = []
//                 // Initializing tolerance, pressure and fraction for Dew Bubble 
//                     Tol = 1e-300
//                     pressure_cloud = (( pressure_cloud / 1.033) + 1 ) * 1.01325 * Math.pow(10,5)

//                     Fraction = compoBasis_cloud

//                 // Evaluating the mole fraction of each compponent
//                     if(Fraction === "Mass % or Mass fraction"){
//                         let compoSum = 0
//                         compoDataFull_cloud.forEach(comp => {
//                             comp.compoValue /= comp.mwt
//                             compoSum += comp.compoValue

//                         })
//                         compoDataFull_cloud.forEach(comp => {
//                             comp.compoValue /= compoSum

//                         })

//                     }
//                     else{
//                         let compoSum = 0
//                         compoDataFull_cloud.forEach(comp => {
//                             compoSum += comp.compoValue

//                         })

//                         compoDataFull_cloud.forEach(comp => {
//                             comp.compoValue /= compoSum


//                         })
//                     }

//                 // Assigning Vapour and Liquid Mole Fraction
//                     compoDataFull_cloud.forEach(comp => {
//                         X.push(comp.compoValue)
//                         Y.push(comp.compoValue)
//                     })
//                     // console.log(X,Y)

//                 // Evaluating Absolute diference of the dewSum and BubbleSum from 0
//                     for (let j = 0; j < 6250; j++) {

//                         bubbleSum = 0
//                         dewSum = 0
//                         kx = []
//                         ky = []

//                         for (let i = 0; i < compoDataFull_cloud.length; i++) {
//                             const comp = compoDataFull_cloud[i]
//                             const kValue = ((comp.pc * Math.pow(10,5))/pressure_cloud) * Math.exp(5.37 * (1 + comp.acentric) * (1 - comp.tc / T_n[j]))

//                             // Evaluating ky
//                             if(kValue < Tol){
//                                 ky.push(0)
//                             }
//                             else{
//                                 ky.push(Y[i]/kValue)
//                             }
//                             // Evaluating kx
//                             if(kValue == 0){
//                                 kx.push(0)
//                             }
//                             else{
//                                 kx.push(X[i] * kValue)
//                             }

//                             bubbleSum = bubbleSum + kx[i]
//                             dewSum = dewSum + ky[i]

//                         }
//                         // Testing...
//                         // if(T_n[j] > 350 && T_n[j] < 355){
//                         //     console.log(bubbleSum,dewSum)

//                         // }
//                         diffDew.push(Math.abs(dewSum - 1))

//                         diffBubble.push(Math.abs(bubbleSum - 1))

//                         T_n[j+1] = T_n[j] + 0.1

//                     }
//                 // Evaluating Dew point and Bubble point

//                     const dewMin = Math.min(...diffDew)
//                     const bubbleMin = Math.min(...diffBubble)

//                     // console.log(dewMin,bubbleMin)

//                     const dewMinIndex = diffDew.indexOf(dewMin)
//                     const bubbleMinIndex = diffBubble.indexOf(bubbleMin)

//                     // console.log(dewMinIndex,bubbleMinIndex)

//                     const dewPoint = T_n[dewMinIndex]
//                     const bubblePoint = T_n[bubbleMinIndex]

//                 // Evaluating Acid Dew point

//                     var SO2DewPoint
//                     var SO3DewPoint
//                     var HClDewPoint
//                     var NO2DewPoint

//                 //  Checking and Calculating acid dew point

//                 //.....Checking SO2 Dew point
//                     if(SO2DewValid){

//                         const SO2PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'sulfur dioxide')).compoValue * pressure_cloud * 0.00750062
//                         const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

//                         SO2DewPoint = 1000 / (3.9526 - 0.1863 * Math.log(WaterPartialPressure) + 0.000867 * Math.log(SO2PartialPressure) + 0.000913 * Math.log(WaterPartialPressure) * Math.log(SO2PartialPressure)) - 273.15

//                     }
//                     else{
//                         SO2DewPoint = ""
//                     }

//                 //.....Checking SO3 Dew point
//                     if (SO3DewValid || SO2DewValid) {
//                         let SO3PartialPressure
//                         if(SO3DewValid){
//                             SO3PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'sulfur trioxide')).compoValue * pressure_cloud * 0.00750062
//                         }
//                         else{
//                             SO3PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'sulfur dioxide')).compoValue * pressure_cloud * 0.00750062 * 0.05

//                         }

//                         const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

//                         SO3DewPoint = 1000 / (2.276 - 0.02943 * Math.log(WaterPartialPressure) - 0.0858 * Math.log(SO3PartialPressure) + 0.0062 * Math.log(WaterPartialPressure) * Math.log(SO3PartialPressure)) - 273.15

//                     } else {
//                         SO3DewPoint = ""
//                     }
//                 //.....Checking HCl Dew point
//                     if (HClDewValid) {

//                         const HClPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'hydrogen chloride')).compoValue * pressure_cloud * 0.00750062
//                         const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

//                         HClDewPoint = 1000 / (3.7368 - 0.1591 * Math.log(WaterPartialPressure) - 0.0326 * Math.log(HClPartialPressure) + 0.00269 * Math.log(WaterPartialPressure) * Math.log(HClPartialPressure)) - 273.15
//                     } else {
//                         HClDewPoint = ""
//                     }

//                 //.....Checking NO2 Dew point
//                     if (NO2DewValid) {

//                         const NO2PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'nitrogen dioxide')).compoValue * pressure_cloud * 0.00750062
//                         const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

//                         NO2DewPoint = 1000 / (3.664 - 0.1446 * Math.log(WaterPartialPressure) - 0.0827 * Math.log(NO2PartialPressure) + 0.00756 * Math.log(WaterPartialPressure) * Math.log(NO2PartialPressure)) - 273.15
//                     } else {
//                         NO2DewPoint = ""
//                     }


//                     console.log((dewPoint - 273.15).toFixed(2) , (bubblePoint - 273.15).toFixed(2))

//                     this.bubblePoint =  (bubblePoint - 273.15).toFixed(2)
//                     this.dewPoint = (dewPoint - 273.15).toFixed(2)
//                     if(SO2DewPoint){
//                         this.SO2AcidDewPoint = SO2DewPoint.toFixed(2)
//                     }

//                     if(SO3DewPoint){
//                         this.SO3AcidDewPoint = SO3DewPoint.toFixed(2)
//                     }

//                     if(HClDewPoint){
//                         this.HClAcidDewPoint = HClDewPoint.toFixed(2)
//                     }

//                     if(NO2DewPoint){
//                         this.NO2AcidDewPoint = NO2DewPoint.toFixed(2)
//                     }


//                     this.results = true
//                     this.$store.dispatch('setLoading',false)

//                 }   

//             })
//             .catch(function(error) {
//                 console.log("Error getting document:", error)
//             })  

//     })

//     window.scrollTo(this.coOrds.x,this.coOrds.y)

// End of local function   