// Application details
// Area Class and Cert
// Ambient and Analyzer
// Sample Properties
// Probe Details
// Distance & Flow
// Transportation

// let testing = false

// if (!testing) {
//     // Evaluating Absolute diference of the dewSum and BubbleSum from 0
//     for (let j = 0; j < 6250; j++) {

//         bubbleSum = 0
//         dewSum = 0

//         K = []
//         unorderedK = []
//         z = []
//         x = []
//         y = []
//         kx = []
//         ky = []
//         Tr = []
//         Pr = []
//         Ap = []
//         Bp = []
//         phiRange = []
//         RRSum = []
//         m = [] // Function of Tr in the solution of Soave-Redlich Kwang quation
//         alpha = []
//         fugCoeffVapor = []
//         fugCoeffLiquid = []
//         compoDataFull_cloud.forEach(element => {
//             const kValue = ((element.pc * Math.pow(10, 5)) / pressure_cloud) * Math.exp(5.37 * (1 + element.acentric) * (1 - element.tc / T_n[j]))
//             K.push(kValue)
//         })




//         if (compoDataFull_cloud.length > 1) {

//             // Checking if every k value is zero. If all values are zero, go to next temperature
//             if (isKValid(K)) {
//                 // Correcting k value using solution of Soave-Redlich Kwang quation
//                 K.forEach(element => {
//                     unorderedK.push(element)
//                 })

//                 let CompoCorrectionIndexes = []
//                 K.sort(function (a, b) {
//                     return b - a
//                 })
//                 K.forEach(el => {
//                     CompoCorrectionIndexes.push(unorderedK.indexOf(el))
//                 })

//                 compoDataFull_cloud_Ordered = [] // For ordering the elements in the descending order ofK

//                 for (let i = 0; i < compoDataFull_cloud.length; i++) {
//                     let comp = compoDataFull_cloud[i]
//                     compoDataFull_cloud_Ordered[CompoCorrectionIndexes[i]] = comp
//                 }
//                 z = [] // Destroying the array of z
//                 for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//                     let comp = compoDataFull_cloud_Ordered[i]
//                     acentric.push(comp.acentric)
//                     z.push(comp.compoValue)
//                     Tr.push(T_n[j] / comp.tc)
//                     Pr.push(pressure_cloud / (comp.pc * Math.pow(10, 5)))
//                 }

//                 // BiSection Method
//                 rrsum = 0

//                 let a = (-1) * (1 / (K[0] - 1)) // Lower Limit for Bisection Method
//                 let b = 1 / (1 - K[K.length - 1]) // Upper Limit for Bisection Method
//                 const a0 = a
//                 const b0 = b
//                 epsilon = 0.00001 // Tolerance for Bisection method

//                 while ((b - a) > epsilon) {
//                     rrsum = 0
//                     let midPhi = (a + b) / 2

//                     for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//                         // Rachford–Rice equation  to determine Vapor fraction phi
//                         rrsum += (z[i] * (K[i] - 1)) / (1 + (midPhi * (K[i] - 1)))
//                     }
//                     const rrsumMid = rrsum * (midPhi - a0) * (b0 - midPhi)

//                     rrsum = 0

//                     for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//                         // Rachford–Rice equation  to determine Vapor fraction phi
//                         rrsum += (z[i] * (K[i] - 1)) / (1 + (a * (K[i] - 1)))
//                     }

//                     const rrsumLeft = rrsum * (a - a0) * (b0 - a)

//                     if (rrsumMid > 0 && rrsumLeft < 0 || rrsumMid > 0 && rrsumLeft < 0) {
//                         // f(a) and f(m) have different signs: move b
//                         b = midPhi
//                     } else {
//                         // f(a) and f(m) have same signs: move a
//                         a = midPhi
//                     }

//                     // phiSelect = 0

//                 }
//             } else {
//                 compoDataFull_cloud_Ordered = compoDataFull_cloud
//                 for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//                     let comp = compoDataFull_cloud_Ordered[i]
//                     acentric.push(comp.acentric)
//                     z.push(comp.compoValue)
//                     Tr.push(T_n[j] / comp.tc)
//                     Pr.push(pressure_cloud / (comp.pc * Math.pow(10, 5)))
//                 }
//                 phiSelect = 0
//             }

//             if (phiSelect < 0) {
//                 phiSelect = 0
//             }
//             // else if(phiSelect>1){
//             //     phiSelect = 1
//             // }

//         }
//         // Single component system evaluation , crude method of evaluating vapor fraction  
//         else {
//             compoDataFull_cloud_Ordered = compoDataFull_cloud
//             for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//                 let comp = compoDataFull_cloud_Ordered[i]
//                 acentric.push(comp.acentric)
//                 z.push(comp.compoValue)
//                 Tr.push(T_n[j] / comp.tc)
//                 Pr.push(pressure_cloud / (comp.pc * Math.pow(10, 5)))
//             }
//             rrsum // individual sum for each iteration


//             //  // Determining phi by linear Iteration
//             phi = 0
//             phiRange = []
//             for (phi = 0; phi <= 1; phi += 0.001) {

//                 rrsum = 0
//                 for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//                     // Rachford–Rice equation  to determine Vapor fraction phi
//                     rrsum += (z[i] * (K[i] - 1)) / (1 + (phi * (K[i] - 1)))
//                 }

//                 phiRange.push(phi)
//                 RRSum.push(Math.abs(rrsum))
//                 // phi += 0.001
//             }

//             const RRSumMin = Math.min(...RRSum)
//             const RRSumMinIndex = RRSum.indexOf(RRSumMin)
//             phiSelect = phiRange[RRSumMinIndex]
//         }

//         // phiSelect = 1
//         // console.log("old " + K, T_n[j] ,phiSelect)

//         // Evaluating x, y, m,alpha, A, B factors of SRK EOS

//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//             // Evaluating x and y for liquid and vapor from z based on vapor fraction
//             let xValue = z[i] / (1 + phiSelect * (K[i] - 1))
//             if (xValue == Infinity) {
//                 xValue = 1
//             }
//             x.push(xValue)
//             y.push(x[i] * K[i])
//             m.push(0.48 + 1.574 * acentric[i] - 0.176 * Math.pow(acentric[i], 2))
//             alpha.push(Math.pow((1 + m[i] * (1 - Math.sqrt(Tr[i]))), 2))
//             Ap.push(0.42747 * alpha[i] * Pr[i] / (Math.pow(Tr[i], 2)))
//             Bp.push(0.08664 * Pr[i] / Tr[i])
//         }

//         let AbSumVapor = 0
//         let BbSumVapor = 0
//         let AbSumLiquid = 0
//         let BbSumLiquid = 0

//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {

//             for (let l = 0; l < compoDataFull_cloud_Ordered.length; l++) {
//                 AbSumVapor += Math.sqrt(Ap[i] * Ap[l] * y[i] * y[l])
//                 AbSumLiquid += Math.sqrt(Ap[i] * Ap[l] * x[i] * x[l])
//             }

//             BbSumVapor += y[i] * Bp[i]
//             BbSumLiquid += x[i] * Bp[i]
//         }

//         Av = AbSumVapor
//         Bv = BbSumVapor
//         Al = AbSumLiquid
//         Bl = BbSumLiquid


//         // Solving cubic equation for compressibility factor - vapor
//         let ZvRoots = cubicSolve(1, -1, (Av - Bv - Math.pow(Bv, 2)), -1 * (Av * Bv))
//         let ZlRoots = cubicSolve(1, -1, (Al - Bl - Math.pow(Bl, 2)), -1 * (Al * Bl))

//         let ZvrootsRefined = []
//         let ZlrootsRefined = []

//         // Eliminating Complex roots of the cubic equation for Vapor
//         ZvRoots.forEach(el => {

//             if (!isNaN(el)) {
//                 if (el > 0) {
//                     ZvrootsRefined.push(el)
//                 }
//             }
//         })
//         // Eliminating Complex roots of the cubic equation for Liquid
//         ZlRoots.forEach(el => {

//             if (!isNaN(el)) {
//                 if (el > 0) {
//                     ZlrootsRefined.push(el)
//                 }
//             }
//         })
//         // Selecting the maximum real root for compressibilty factor of Vapor
//         if (ZvrootsRefined) {
//             Zv = Math.max(...ZvrootsRefined)
//         }
//         // Selecting the minimum real root for compressibilty factor of Liquid
//         if (ZlrootsRefined) {
//             Zl = Math.min(...ZlrootsRefined)
//         }

//         //  testing start

//         if (Zl == Infinity) {
//             console.log("Check from here")
//         }

//         // testing over

//         // Evaluating fugacity coefficient for individual components in the fluid mixture
//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//             // Evaluating fugacity coefficients and the corrected K values
//             const fVapor = Math.exp((Zv - 1) * (Bp[i] / Bv) - Math.log(Zv - Bv) - (Av / Bv) * (2 * Math.sqrt(Ap[i] / Av) - (Bp[i] / Bv)) * Math.log((Zv + Bv) / Zv))
//             const fLiquid = Math.exp((Zl - 1) * (Bp[i] / Bl) - Math.log(Zl - Bl) - (Al / Bl) * (2 * Math.sqrt(Ap[i] / Al) - (Bp[i] / Bl)) * Math.log((Zl + Bl) / Zl))

//             if (isNaN(fVapor)) {
//                 fugCoeffVapor.push(1)
//             } else {
//                 fugCoeffVapor.push(fVapor)
//             }

//             if (isNaN(fLiquid)) {
//                 fugCoeffLiquid.push(1)
//             } else {
//                 fugCoeffLiquid.push(fLiquid)
//             }
//             // Evaluating corrected equilibrium constant K = øl/øv
//             K[i] = fugCoeffLiquid[i] / fugCoeffVapor[i]

//             // Evaluating ky term for determining dew point
//             if (K[i] < Tol) {
//                 ky.push(1 / Tol) // To ignore k values less than the tolerance limit
//             } else {
//                 ky.push(z[i] / K[i])
//             }
//             // Evaluating kx term for determining bubble point
//             if (K[i] == 0) {
//                 kx.push(0)
//             } else {
//                 kx.push(z[i] * K[i])
//             }
//             // Adding kx and ky values for indivual commp to get the final sum
//             bubbleSum += kx[i]
//             dewSum += ky[i]

//         }




    // function zeroK(currentValue) {
    //     return currentValue == 0;
    // }
    // function isKValid(K) {
    //     let zeroValueFound = false
    //     for (let i = 0; i < K.length; i++) {
    //         const element = K[i]
    //         if(element == 0){
    //             zeroValueFound = true
    //         }
    //     }

    //     return !zeroValueFound
    // }

    //  function crudeEvalPhi(K, z) {
    //      let phi = 0
    //      let phiRange = [] // spans the values of phi from 0 to 1
    //      let phiSelect // Calculated Vapor Fraction
    //      let rrsum = 0 // Sum of the individuall Rachford–Rice equation terms for each iteration of phi
    //      let RRSum = []
    //      for (phi = 0; phi <= 1; phi += 0.001) {

    //          rrsum = 0
    //          for (let i = 0; i < z.length; i++) {
    //              // Rachford–Rice equation  to determine Vapor fraction phi
    //              rrsum += (z[i] * (K[i] - 1)) / (1 + (phi * (K[i] - 1)))
    //          }

    //          phiRange.push(phi)
    //          RRSum.push(Math.abs(rrsum))
    //          // phi += 0.001
    //      }

    //      const RRSumMin = Math.min(...RRSum)
    //      const RRSumMinIndex = RRSum.indexOf(RRSumMin)
    //      phiSelect = phiRange[RRSumMinIndex]

    //      return phiSelect
    //  }


      // function isFugRatioInvalid(F) {
      //     let epsilon = 1e-8
      //     let invalidFugRatio = false
      //     for (let i = 0; i < F.length; i++) {
      //         const element = F[i]
      //         if ((Math.pow(element - 1),2) > epsilon) {
      //             invalidFugRatio = true
      //             return invalidFugRatio
      //         }
      //     }

      // }


      // a = (-1) * (1 / (K[0] - 1)) // Lower Limit for Bisection Method
      // b = 1 / (1 - K[K.length - 1]) // Upper Limit for Bisection Method
      // let count  = 1

      // do {

      // phiSelect = crudeEvalPhi(K,z)
      // if(count>1){
      //     if ((phiSum(0, K, z) < 0 && phiSum(1, K, z)) > 0) {
      //         phiSelect = brentsPhi(K, z, 0, 1, max_iter, tolerance)
      //         // phiSelect = NichitaLeibovici(K,z)

      //     }
      //     else if(phiSum(0, K, z) < 0){
      //         phiSelect = 0
      //     }
      //     // else if(phiSum(1, K, z) >0){
      //     //     phiSelect = 1
      //     // }
      //     else {
      //         phiSelect = 1
      //     }
      // }
      // else{


//     count++

// } while (isFugRatioInvalid(F) && count <=1)

// Correcting the dew point and bubble point
// const dewValue = brentsDewBubble(dbSumCorrect, bubbleEstimate-25, dewEstimate+25 , max_iter, epsilon,compoDataFull_cloud, pressure_cloud, "dew")
// const bubbleValue = brentsDewBubble(dbSumCorrect, bubbleEstimate-25, dewEstimate+25 , max_iter, epsilon,compoDataFull_cloud, pressure_cloud, "bubble")

// if(isNaN(dewValue)){
//     dewPoint = dewEstimate
// }
// else{
//     dewPoint = dewValue
// }
// if(isNaN(bubbleValue)){
//     bubblePoint = bubbleEstimate
// }
// else{
//     bubblePoint = bubbleValue
// }


// function evalCompFactorPR(compoDataFull_cloud_Ordered,i) {
//     let acentric
//     let Z
//     let z = 1
//     let Pr 
//     let Tr
//     let alpha
//     let Ap
//     let Bp
//     let A
//     let B
//     let m
//     let AbSum = 0
//     let BbSum = 0
//     let ZRoots = []
//     let ZrootsRefined = []

//     let comp = compoDataFull_cloud_Ordered[i]
//     acentric = comp.acentric
//     Tr = 1
//     Pr = 1

//     // Evaluating x and y for liquid and vapor from z based on vapor fraction
//     if(acentric <= 0.491){
//         m = 0.37464 + 1.54226 * acentric - 0.26992 * Math.pow(acentric,2)
//     }
//     else{
//         m = 0.379642 + 1.48503 * acentric - 0.164423 * Math.pow(acentric,2) + 0.016666 * Math.pow(acentric,3)
//     }

//     alpha = Math.pow((1 + m * (1 - Math.sqrt(Tr))), 2)
//     Ap = 0.45724 * alpha * Pr / (Math.pow(Tr, 2))
//     Bp = 0.07780 * Pr / Tr

//     AbSum += Math.sqrt(Ap * Ap) * z * z
//     BbSum += z * Bp
//     A = AbSum
//     B = BbSum



    //     ZRoots = cubicSolve(1, -1 * (1-B), (A - 3 * Math.pow(B,2) - 2*B), -1 * ((A * B) -Math.pow(B,2)-Math.pow(B,3)))
    //     ZrootsRefined = []
    //     ZRoots.forEach(el => {

    //         if (!isNaN(el)) {
    //             if (el > 0) {
    //                 ZrootsRefined.push(el)
    //             }
    //         }
    //     })
    //     if (ZrootsRefined) {
    //         Z = Math.max(...ZrootsRefined)
    //     }
    //     return Z 

    // }



     // probePipeOuterDiaCustom:{
            //     get () {
            //         return this.$store.getters.probePipeOuterDiaCustom
            //     },
            //     set (value) {
            //         this.$store.dispatch('setProbePipeOuterDiaCustom',{data:value})
            //     }
            // },
            // probePipeThicknessCustom:{
            //     get () {
            //         return this.$store.getters.probePipeThicknessCustom
            //     },
            //     set (value) {
            //         this.$store.dispatch('setProbePipeThicknessCustom',{data:value})
            //     }
            // },
            // probeTubeThicknessCustom:{
            //     get () {
            //         return this.$store.getters.probeTubeThicknessCustom
            //     },
            //     set (value) {
            //         this.$store.dispatch('setProbeTubeThicknessCustom',{data:value})
            //     }
            // },
            // probeTubeOuterDiaCustom:{
            //     get () {
            //         return this.$store.getters.probeTubeOuterDiaCustom
            //     },
            //     set (value) {
            //         this.$store.dispatch('setProbeTubeOuterDiaCustom',{data:value})
            //     }
            // },


            
            // async function evalProbeVibration(
            //   probeMaterial,
            //   probeID,
            //   probeOD,
            //   extentOfInsertion,
            //   nozzleLength,
            //   valveLength,
            //   processLineSize,
            //   processLineSizeType,
            //   processLineThickness,
            //   sampleDensity,
            //   velocity,
            //   samplePhase
            // ) {
            //   let probeDensity;
            //   let yieldStrength;
            //   let modulusOfElasticity;
            //   let shieldLength;
            //   let insertionLength;
            //   let unsupportedLength;
            //   let actualProbeLength;
            //   let strouhalNumber;
            //   let fluidMassFactor;
            //   let maxAllowedProbeLength;
            //   let bendingStressFromFlow;
            //   let bendingStressFromWeight;
            //   let zFactor;
            //   let wFactor;
            //   let wFFactor;
            //   let zFFactor;
            //   let totalStress;
            //   let isProbeDesignOkay;
            //   const probeMaterialRef = db
            //     .collection("appData")
            //     .doc("probeMaterialDataBase")
            //     .collection("ProbeMaterialData")
            //     .doc(probeMaterial);
            //   probeMaterialRef
            //     .get()
            //     .then(doc => {
            //       probeDensity = doc.data().density;
            //       yieldStrength = doc.data().yieldStrength;
            //       modulusOfElasticity = doc.data().modulusOfElasticity;
            //     }) // Starting the main calculation of probe vibration
            //     .then(() => {
            //       // Converting length to inch units
            //       probeID = (probeID * 1000) / 25.4;
            //       probeOD = (probeOD * 1000) / 25.4;
            //       nozzleLength = (nozzleLength * 1000) / 25.4;
            //       valveLength = (valveLength * 1000) / 25.4;
            //       // Converting velocity to ft/s unit
            //       velocity = velocity * 3.28;
            //       // Converting density to lb/ft3
            //       sampleDensity = sampleDensity * 0.062428;
            //       // Calculating the Insertion Lnegth of probe Pipe/Tube into the Process Line
            //       // Inner Dia of Process Line Specified
            //       if (
            //         processLineSizeType == "Process Line size, Inner Diameter"
            //       ) {
            //         if (extentOfInsertion == "One Third Insertion,(1/3)") {
            //           insertionLength =
            //             (((processLineSize + 2 * processLineThickness) / 3) *
            //               1000) /
            //             25.4;
            //         } else {
            //           insertionLength =
            //             (((processLineSize + 2 * processLineThickness) / 2) *
            //               1000) /
            //             25.4;
            //         }
            //       }
            //       // Outer Dia of Process Line Specified
            //       else {
            //         if (extentOfInsertion == "One Third Insertion,(1/3)") {
            //           insertionLength = ((processLineSize / 3) * 1000) / 25.4;
            //         } else {
            //           insertionLength = ((processLineSize / 2) * 1000) / 25.4;
            //         }
            //       }
            //       shieldLength = nozzleLength + valveLength;
            //       unsupportedLength = shieldLength + insertionLength;
            //       actualProbeLength = unsupportedLength;
            //       if (samplePhase == "Vapor") {
            //         fluidMassFactor = 0.9;
            //       } else {
            //         fluidMassFactor = 1.0;
            //       }
            //       //S = Strouhal number, constant, S = 0.4 Worst case, S = 0.2 best case
            //       strouhalNumber = 0.2;
            //       maxAllowedProbeLength = Math.sqrt(
            //         0.9 *
            //           0.23 *
            //           ((fluidMassFactor * probeOD) /
            //             (strouhalNumber * velocity)) *
            //           Math.sqrt(
            //             (modulusOfElasticity / probeDensity) *
            //               (Math.pow(probeOD, 2) + Math.pow(probeID, 2))
            //           )
            //       );
            //       // Calculating bendingStressFromWeight
            //       zFactor =
            //         (0.78 *
            //           (Math.pow(probeOD / 2, 4) - Math.pow(probeID / 2, 4))) /
            //         (probeOD / 2);
            //       wFactor =
            //         (0.785 *
            //           (Math.pow(probeOD, 2) - Math.pow(probeID, 2)) *
            //           unsupportedLength *
            //           probeDensity *
            //           32.174049) /
            //         unsupportedLength;
            //       bendingStressFromWeight =
            //         (wFactor * unsupportedLength) ^ (2 / (2 * zFactor));
            //       wFFactor =
            //         (0.785 *
            //           (probeID ^ 2) *
            //           insertionLength *
            //           sampleDensity *
            //           32.174049) /
            //         insertionLength;
            //       zFFactor = 0.78 * Math.pow(probeID, 3);
            //       bendingStressFromFlow =
            //         (wFFactor * Math.pow(insertionLength, 2)) / (2 * zFFactor);
            //       totalStress = bendingStressFromWeight + bendingStressFromFlow;
            //       // Checking the length and stress conditions for the probe design
            //       if (
            //         actualProbeLength < maxAllowedProbeLength &&
            //         totalStress < yieldStrength
            //       ) {
            //         isProbeDesignOkay = true;
            //       } else {
            //         isProbeDesignOkay = false;
            //       }
            //       return {
            //         probeDensity: probeDensity,
            //         yieldStrength: yieldStrength,
            //         modulusOfElasticity: modulusOfElasticity,
            //         shieldLength: shieldLength,
            //         insertionLength: insertionLength,
            //         unsupportedLength: unsupportedLength,
            //         actualProbeLength: actualProbeLength,
            //         strouhalNumber: strouhalNumber,
            //         fluidMassFactor: fluidMassFactor,
            //         maxAllowedProbeLength: maxAllowedProbeLength,
            //         bendingStressFromFlow: bendingStressFromFlow,
            //         bendingStressFromWeight: bendingStressFromWeight,
            //         isProbeDesignOkay: isProbeDesignOkay
            //       };
            //     });
            //   // p.then((result)=>{
            //   //     return result
            //   // })
            //   // // Reporting an error
            //   // .catch(function(error) {
            //   //     console.log("Error getting document:", error)
            //   // })
            // } 


            // // Evaluating Pressure Drop and Lag Time
            // // Evaluating part 1 - Tapping point to Probe Isolation Flange
            //     // Determining Pressure
            //         pressureLTPDPart1 = tappingPressure
            //     // Determining Temperature
            //         temperatureLTPDPart1 = tappingTemperature
            //     // Determining Distance 
            //         distanceLTPDPart1 = 0.6
            //     // Determining the tube dia
            //         channelIDLTPDPart1 = probeChannelInnerDia
            //     // Determining density 
            //         densityLTPDPart1 = densityCalcAzTapping
            //     // Determining Flowrate
            //         flowRateLTPDPart1 = (flowRateLTPDPart2 * densityLTPDPart2)/densityLTPDPart1
            //     // Determining Viscosity
            //         viscosityLTPDPart1 = viscosityAzTapping 
            //     // Evaluating Pressure Drop, velocity, Reynolds no and fanning friction factor
            //         pdResult = evalPressureDrop(
            //             flowRateLTPDPart1,
            //             channelIDLTPDPart1, 
            //             densityLTPDPart1, 
            //             viscosityLTPDPart1, 
            //             distanceLTPDPart1,
            //             roughnessParameter
            //         )
            //         velocityLTPDPart1 = pdResult.velocity
            //         reynoldsNoLTPDPart1 = pdResult.reynoldsNo
            //         fanningFrictionFactorLTPDPart1 = pdResult.fanningFrictionFactor
            //         pressureDropLTPDPart1 = pdResult.pressureDrop
            //     // Evaluating Lag Time
            //         lagTimeLTPDPart1 = distanceLTPDPart1/velocityLTPDPart1
                
            // // Evaluating part 2 - Probe Isolation Flange to PSHS/Secondary SHS Cabinet
            //     // Determining Pressure
            //         pressureLTPDPart2 = pressureLTPDPart1 - pressureDropLTPDPart1
            //     // Determining Temperature
            //         if(sampleTransportationPhaseSelect == "Vapor"){
            //             if(isPSHS){
            //                 if(isTappingToPrimaryHT){
            //                     temperatureLTPDPart2 = tappingToPrimaryHTSetTemp
            //                 }
            //                 else{
            //                     temperatureLTPDPart2 = avgAmbientTemp
            //                 }
            //             }
            //             else{
            //                 if(isPrimaryOrTappingToSecondaryHT){
            //                     temperatureLTPDPart2 = primaryOrTappingToSecondaryHTSetTemp
            //                 }
            //                 else{
            //                     temperatureLTPDPart2 = avgAmbientTemp
            //                 }
            //             }
                            
            //         }
            //         else{
            //             if(isPSHS){
            //                 if(isTappingToPrimaryCooler){
            //                     temperatureLTPDPart2 = tappingToPrimaryCoolerSetTemp
            //                 }
            //                 else{
            //                     temperatureLTPDPart2 = tappingTemperature
            //                 }
            //             }
            //             else{
            //                 if(isPrimaryOrTappingToSecondaryCooler){
            //                     temperatureLTPDPart2 = primaryOrTappingToSecondaryCoolerSetTemp
            //                 }
            //                 else{
            //                     temperatureLTPDPart2 = tappingTemperature
            //                 }
            //             }
            //         }
            //     // Determining the tube dia
            //         if(isPSHS){
            //             channelIDLTPDPart2 = primaryTransportTubeInnerDia
            //         }
            //         else{
            //             channelIDLTPDPart2 = secondaryTransportTubeInnerDia
            //         }
            //     // Determining Distance 
            //         if(isPSHS){
            //             distanceLTPDPart2 = primaryTransportDistance
            //         }
            //         else{
            //             distanceLTPDPart2 = secondaryTransportDistance
            //             // Commercial Steel,e = 0.05 mm,
            //             // Ball valve, full bore,  L/D = 2.6
            //             // Tee, straight through, L/D = 20
            //             // 90° elbow, r/d=1, threaded,  L/D = 30
            //             // 90° elbow, sharp bend, welded, L/D = 55
            //             // Consider 3 nos. of full bore ball valves and 1 no. of Tee, 2 nos. of90° elbow
            //             equivalentLengthPart2 = (3 * 2.6 + 1 * 20 + 2 * 30) * channelIDLTPDPart2
            //             distanceLTPDPart2 += equivalentLengthPart2
            //         }
                
            //     // Determining density 
            //         if(sampleTransportationPhaseSelect == "Liquid"){
            //             densityLTPDPart2 = densityCalcAzTapping
            //         }
            //         else{
            //             densityLTPDPart3 = evalDensity(
            //                 pressureLTPDPart2,
            //                 temperatureLTPDPart2,
            //                 thermoDynamicModelSelect,
            //                 compoDataFull_cloud,
            //                 mWeight
            //             )
            //         }
            //     // Determining Flowrate
            //         if(isPSHS){
            //             flowRateLTPDPart2 = (flowRateLTPDPart3 * densityLTPDPart3)/densityLTPDPart2
            //         }
            //         else{
            //             flowRateLTPDPart2 = (flowRateLTPDPart4 * densityLTPDPart4 + flowRateLTPDPart5 * densityLTPDPart5)/densityLTPDPart2
            //         }
            //     // Determining Viscosity 
            //         if(sampleTappingPhaseSelect == "Liquid" && sampleTransportationPhaseSelect == "Liquid"){
            //             viscosityLTPDPart2 = viscosityAzTapping
            //         }
            //         else{
            //             viscosityLTPDPart2 = evalViscosity(compoDataFull_cloud, temperatureLTPDPart2, sampleTransportationPhaseSelect)
            //         }
            //     // Evaluating Pressure Drop, velocity, Reynolds no and fanning friction factor
            //         pdResult = evalPressureDrop(
            //             flowRateLTPDPart2,
            //             channelIDLTPDPart2, 
            //             densityLTPDPart2, 
            //             viscosityLTPDPart2, 
            //             distanceLTPDPart2,
            //             roughnessParameter
            //         )
            //         velocityLTPDPart2 = pdResult.velocity
            //         reynoldsNoLTPDPart2 = pdResult.reynoldsNo
            //         fanningFrictionFactorLTPDPart2 = pdResult.fanningFrictionFactor
            //         pressureDropLTPDPart2 = pdResult.pressureDrop
            //     // Evaluating Lag Time
            //         lagTimeLTPDPart2 = distanceLTPDPart2/velocityLTPDPart2
            // // Evaluating part 3 - PSHS to Secondary SHS
            //     if(isPSHS){
            //         // Determining Pressure
            //             if(isPrimaryPR){
            //                 pressureLTPDPart3 = primaryPRSetPressure
            //             }
            //             else{
            //                 pressureLTPDPart3 = pressureLTPDPart2 - pressureDropLTPDPart2
            //             }
            //         // Determining Temperature
            //             if(sampleTransportationPhaseSelect == "Vapor"){
            //                 if(isPrimaryOrTappingToSecondaryHT){
            //                     temperatureLTPDPart3 = primaryOrTappingToSecondaryHTSetTemp
            //                 }
            //                 else{
            //                     temperatureLTPDPart3 = avgAmbientTemp
            //                 } 
            //             }
            //             else{
            //                 if(isPrimaryOrTappingToSecondaryCooler){
            //                     temperatureLTPDPart3 = primaryOrTappingToSecondaryCoolerSetTemp
            //                 }
            //                 else{
            //                     temperatureLTPDPart3 = tappingTemperature
            //                 }
            //             }
            //         // Determining Distance 
            //             distanceLTPDPart3 = secondaryTransportDistance
            //             // Commercial Steel,e = 0.05 mm,
            //             // Ball valve, full bore,  L/D = 2.6
            //             // Tee, straight through, L/D = 20
            //             // 90° elbow, r/d=1, threaded,  L/D = 30
            //             // 90° elbow, sharp bend, welded, L/D = 55
            //             // Consider 3 nos. of full bore ball valves and 1 no. of Tee, 2 nos. of90° elbow
            //             equivalentLengthPart3 = (3 * 2.6 + 1 * 20 + 2 * 30) * channelIDLTPDPart3
            //             distanceLTPDPart3 += equivalentLengthPart3
            //         // Determining the tube dia
            //             channelIDLTPDPart3 = secondaryTransportTubeInnerDia
            //         // Determining density 
            //             if(sampleTransportationPhaseSelect == "Liquid"){
            //                 densityLTPDPart3 = densityCalcAzTapping
            //             }
            //             else{
            //                 densityLTPDPart3 = evalDensity(
            //                     pressureLTPDPart3,
            //                     temperatureLTPDPart3,
            //                     thermoDynamicModelSelect,
            //                     compoDataFull_cloud,
            //                     mWeight
            //                 )
            //             }
            //         // Determining Flowrate
            //             flowRateLTPDPart3 = (flowRateLTPDPart4 * densityLTPDPart4 + flowRateLTPDPart5 * densityLTPDPart5)/densityLTPDPart3
            //         // Determining Viscosity 
            //             if(sampleTappingPhaseSelect == "Liquid" && sampleTransportationPhaseSelect == "Liquid"){
            //                 viscosityLTPDPart3 = viscosityAzTapping
            //             }
            //             else{
            //                 viscosityLTPDPart3 = evalViscosity(compoDataFull_cloud, temperatureLTPDPart3, sampleTransportationPhaseSelect)
            //             }
            //         // Evaluating Pressure Drop, velocity, Reynolds no and fanning friction factor
            //             pdResult = evalPressureDrop(
            //                 flowRateLTPDPart3,
            //                 channelIDLTPDPart3, 
            //                 densityLTPDPart3, 
            //                 viscosityLTPDPart3, 
            //                 distanceLTPDPart3,
            //                 roughnessParameter
            //             )
            //             velocityLTPDPart3 = pdResult.velocity
            //             reynoldsNoLTPDPart3 = pdResult.reynoldsNo
            //             fanningFrictionFactorLTPDPart3 = pdResult.fanningFrictionFactor
            //             pressureDropLTPDPart3 = pdResult.pressureDrop
            //         // Evaluating Lag Time
            //             lagTimeLTPDPart3 = distanceLTPDPart3/velocityLTPDPart3
            //     }
            // // Evaluating part 4 - Bypass Tee to Analyzer
            //     // Determining Flowrate
            //         flowRateLTPDPart4 = analyzerFlowRate
            //     // Determining Pressure
            //         if(isSecondaryPR){
            //             pressureLTPDPart4 = secondaryPRSetPressure
            //         }
            //         else{
            //             pressureLTPDPart4 = pressureLTPDPart3 - pressureDropLTPDPart3
            //         }
            //     // Determining Temperature
            //         if(sampleTransportationPhaseSelect == "Vapor"){
            //             if(isSSHSCabinetHeater){
            //                 temperatureLTPDPart4 = SSHSCabinetHeaterSetTemp
            //             }
            //             else{
            //                 temperatureLTPDPart4 = avgAmbientTemp
            //             } 
            //         }
            //         else{
            //             if(isSSHSCabinetCooler){
            //                 temperatureLTPDPart4 = SSHSCabinetCoolerSetTemp
            //             }
            //             else{
            //                 temperatureLTPDPart4 = tappingTemperature
            //             }
            //         }
            //     // Determining the tube dia
            //         channelIDLTPDPart4 = tertiaryTransportTubeInnerDia
            //     // Determining Distance 
            //         distanceLTPDPart4 = tertiaryTransportDistance
            //         // Commercial Steel,e = 0.05 mm,
            //         // Ball valve, full bore,  L/D = 2.6
            //         // Tee, straight through, L/D = 20
            //         // 90° elbow, r/d=1, threaded,  L/D = 30
            //         // 90° elbow, sharp bend, welded, L/D = 55
            //         // Consider 3 nos. of full bore ball valves and 1 no. of Tee, 2 nos. of 90° elbow
            //         equivalentLengthPart4 = (3 * 2.6 + 1 * 20 + 2 * 30) * channelIDLTPDPart4
            //         distanceLTPDPart4 += equivalentLengthPart4
            //     // Determining density 
            //         if(sampleTransportationPhaseSelect == "Liquid"){
            //             densityLTPDPart4 = densityCalcAzTapping
            //         }
            //         else{
            //             densityLTPDPart4 = evalDensity(
            //                 pressureLTPDPart4,
            //                 temperatureLTPDPart4,
            //                 thermoDynamicModelSelect,
            //                 compoDataFull_cloud,
            //                 mWeight
            //             )
            //         }
            //     // Determining Viscosity 
            //         if(sampleTappingPhaseSelect == "Liquid" && sampleTransportationPhaseSelect == "Liquid"){
            //             viscosityLTPDPart4 = viscosityAzTapping
            //         }
            //         else{
            //             viscosityLTPDPart4 = evalViscosity(compoDataFull_cloud, temperatureLTPDPart4, sampleTransportationPhaseSelect)
            //         }
            //     // Evaluating Pressure Drop, velocity, Reynolds no and fanning friction factor
            //         pdResult = evalPressureDrop(
            //             flowRateLTPDPart4,
            //             channelIDLTPDPart4, 
            //             densityLTPDPart4, 
            //             viscosityLTPDPart4, 
            //             distanceLTPDPart4,
            //             roughnessParameter
            //         )
            //         velocityLTPDPart4 = pdResult.velocity
            //         reynoldsNoLTPDPart4 = pdResult.reynoldsNo
            //         fanningFrictionFactorLTPDPart4 = pdResult.fanningFrictionFactor
            //         pressureDropLTPDPart4 = pdResult.pressureDrop
            //     // Evaluating Lag Time
            //         lagTimeLTPDPart4 = distanceLTPDPart4/velocityLTPDPart4
            // // Evaluating part 5 - Bypass Tee to Return
            //     // Determining Flow rate
            //         flowRateLTPDPart5 = bypassFlowMain
            //     // Determining Pressure
            //         pressureLTPDPart5 = pressureLTPDPart3 - pressureDropLTPDPart3
            //     // Determining Temperature
            //         if(sampleTransportationPhaseSelect == "Vapor"){
            //             temperatureLTPDPart5 = avgAmbientTemp
            //         }
            //         else{
            //             if(isPrimaryOrTappingToSecondaryCooler){
            //                 temperatureLTPDPart5 = primaryOrTappingToSecondaryCoolerSetTemp
            //             }
            //             temperatureLTPDPart5 = tappingTemperature
            //         }
            //     // Determining Distance 
            //         distanceLTPDPart5 = sampleReturnLineDistance
            //     // Determining density 
            //         if(sampleTransportationPhaseSelect == "Liquid"){
            //             densityLTPDPart5 = densityCalcAzTapping
            //         }
            //         else{
            //             densityLTPDPart5 = evalDensity(
            //                 pressureLTPDPart5,
            //                 temperatureLTPDPart5,
            //                 thermoDynamicModelSelect,
            //                 compoDataFull_cloud,
            //                 mWeight
            //             )
            //         }
            //     // Determining Viscosity 
            //         if(sampleTappingPhaseSelect == "Liquid" && sampleTransportationPhaseSelect == "Liquid"){
            //             viscosityLTPDPart5 = viscosityAzTapping
            //         }
            //         else{
            //             viscosityLTPDPart5 = evalViscosity(compoDataFull_cloud, temperatureLTPDPart5, sampleTransportationPhaseSelect)
            //         }
            //     // Determining the tube dia
            //         channelIDLTPDPart5 = sampleReturnTubeInnerDia
            //     // Evaluating Pressure Drop, velocity, Reynolds no and fanning friction factor
            //         pdResult = evalPressureDrop(
            //             flowRateLTPDPart5,
            //             channelIDLTPDPart5, 
            //             densityLTPDPart5, 
            //             viscosityLTPDPart5, 
            //             distanceLTPDPart5,
            //             roughnessParameter
            //         )
            //         velocityLTPDPart5 = pdResult.velocity
            //         reynoldsNoLTPDPart5 = pdResult.reynoldsNo
            //         fanningFrictionFactorLTPDPart5 = pdResult.fanningFrictionFactor
            //         pressureDropLTPDPart5 = pdResult.pressureDrop
            //     // Evaluating Lag Time
            //         lagTimeLTPDPart5 = distanceLTPDPart5/velocityLTPDPart5
            // // Calculating Total pressure Drop
            //     if(isSampleReturned){
            //             if(isPSHS){
            //                 totalPressureDropAz = pressureDropLTPDPart1 + pressureDropLTPDPart2 + pressureDropLTPDPart3 + pressureDropLTPDPart4 + pressureDropLTPDPart5
            //             }
            //             else{
            //                 totalPressureDropAz = pressureDropLTPDPart1 + pressureDropLTPDPart2 + pressureDropLTPDPart4 + pressureDropLTPDPart5
            //             }
            //     }
            //     else{
            //         if(isPSHS){
            //                 totalPressureDropAz = pressureDropLTPDPart1 + pressureDropLTPDPart2 + pressureDropLTPDPart3 + pressureDropLTPDPart4
            //             }
            //             else{
            //                 totalPressureDropAz = pressureDropLTPDPart1 + pressureDropLTPDPart2 + pressureDropLTPDPart4
            //             }
            //     }
            // // Calculating Total Lag Time
            //     if(isPSHS){
            //         totalLagTimeAz = lagTimeLTPDPart1 + lagTimeLTPDPart2 + lagTimeLTPDPart3 + lagTimeLTPDPart4
            //     }
            //     else{
            //         totalLagTimeAz = lagTimeLTPDPart1 + lagTimeLTPDPart2 + lagTimeLTPDPart4
            //     }

            // function phiSumDerivative(x, K, z) {
            //   let rrSum = 0;
            //   for (let i = 0; i < z.length; i++) {
            //     // Rachford–Rice equation  to determine Vapor fraction phi
            //     rrSum +=
            //       (z[i] * Math.pow(K[i] - 1, 2)) /
            //       Math.pow(1 + x * (K[i] - 1), 2);
            //   }
            //   return rrSum * -1;
            // }

            // function newtonRaphsonPhi(K, z, x, max_iter, tolerance) {
            //   let xn = x;
            //   let xnPlusOne;
            //   let err;
            //   let f;
            //   let fDash;
            //   let iter = 0;
            //   // Evaluating PhiSum function
            //   f = phiSum(xn, K, z);
            //   // Evaluating PhiSum function derivative
            //   fDash = phiSumDerivative(xn, K, z);
            //   xnPlusOne = xn - f / fDash;
            //   err = Math.abs((xnPlusOne - xn) / xnPlusOne);
            //   // Checking the tolerance condition
            //   while (err > tolerance) {
            //     // Updating the new Phi Value
            //     xn = xnPlusOne;
            //     f = phiSum(xn, K, z);
            //     fDash = phiSumDerivative(xn, K, z);
            //     xnPlusOne = xn - f / fDash;
            //     // Determining the error
            //     err = (xnPlusOne - xn) / xnPlusOne;
            //     if (iter > max_iter) {
            //       break;
            //     }
            //     iter++;
            //   }
            //   console.log(iter);

            //   return xnPlusOne;
            // }

            // if(isKValid(K)){
                    // // Generating unordered array of K for storing
                    // let unorderedK = [] // to compare the old unsorted K value
                    // let compoCorrectionIndexes = []
                    // K.forEach(element => {
                    //     unorderedK.push(element)
                    // })
                    // // Ordering K in the descending order
                    // K.sort(function (a, b) {
                    //     return b - a
                    // })
                    // // Generating indexes of array of unordered K
                    // K.forEach(el => {
                    //     compoCorrectionIndexes.push(unorderedK.indexOf(el))
                    // })
                    // // Generating ordered Compo data with K values in the descending order
                    // for (let i = 0; i < compoDataFull_cloud.length; i++) {
                    //     let comp = compoDataFull_cloud[i]
                    //     compoDataFull_cloud_Ordered[compoCorrectionIndexes[i]] = comp
                    // }
                // }
                // else{
                    // compoDataFull_cloud_Ordered = compoDataFull_cloud
                // }

                // function isFugRatioCheckValid(F) {
                //   let sum = 0;
                //   for (let i = 0; i < F.length; i++) {
                //     const el = F[i];
                //     sum += Math.pow(el - 1, 2);
                //   }
                //   return sum <= 1e-8;
                // }


                // function dbSumCorrect(
                //   T,
                //   compoDataFull_cloud,
                //   pressure_cloud,
                //   context,
                //   solver
                // ) {
                //   // Declaring variables
                //   let K = [];
                //   // let F = [] //Fugacity Ratio
                //   let acentric = [];
                //   let Zv; // Vapor Comp.Factor
                //   let Zl; // Liquid Comp.Factor
                //   let x = [];
                //   let y = [];
                //   let z = [];
                //   let Pr = [];
                //   let Tr = [];
                //   let max_iter = 50;
                //   let tolerance = 1e-5;
                //   let fugCoeffVapor = [];
                //   let fugCoeffLiquid = [];
                //   let Ap = []; // Indiviudal term for each component - as array
                //   let Bp = []; // Indiviudal term for each component - as array
                //   let Av; // Final value for a mixture - vapor
                //   let Bv; // Final value for a mixture - vapor
                //   let Al; // Final value for a mixture - liquid
                //   let Bl; // Final value for a mixture - liquid

                //   // Specific terms used for Peng Robinson equation
                //   let AprSumVapor;
                //   let AprSumLiquid;
                //   let AprV = [];
                //   let AprL = [];
                //   let phiSelect; // Calculated Vapor Fraction
                //   let m = []; // Factor which is a function of acentric factor, m = 0.48 +1.574ω – 0.176ω2
                //   let alpha = []; // Factor which is a function of m
                //   let compoDataFull_cloud_Ordered = []; //stores the compo data in the descending order of K

                //   // let a
                //   // let b
                //   let xValue;
                //   let AbSumVapor = 0;
                //   let BbSumVapor = 0;
                //   let AbSumLiquid = 0;
                //   let BbSumLiquid = 0;
                //   let ZvRoots = [];
                //   let ZlRoots = [];
                //   let ZvrootsRefined = [];
                //   let ZlrootsRefined = [];
                //   let dewSum = 0;
                //   let bubbleSum = 0;
                //   // Eliminiating component with zero compoValue
                //   compoDataFull_cloud = compoDataFull_cloud.filter(el => {
                //     return el.compoValue > 0;
                //   });
                //   // Estimating intial estimates for equilibrium constants
                //   compoDataFull_cloud.forEach(element => {
                //     const kValue =
                //       ((element.pc * 1.01325 * Math.pow(10, 5)) /
                //         pressure_cloud) *
                //       Math.exp(
                //         5.37 * (1 + element.acentric) * (1 - element.tc / T)
                //       );
                //     K.push(kValue);
                //   });
                //   // if(isKValid(K)){
                //   // // Generating unordered array of K for storing
                //   // let unorderedK = [] // to compare the old unsorted K value
                //   // let compoCorrectionIndexes = []
                //   // K.forEach(element => {
                //   //     unorderedK.push(element)
                //   // })
                //   // // Ordering K in the descending order
                //   // K.sort(function (a, b) {
                //   //     return b - a
                //   // })
                //   // // Generating indexes of array of unordered K
                //   // K.forEach(el => {
                //   //     compoCorrectionIndexes.push(unorderedK.indexOf(el))
                //   // })
                //   // // Generating ordered Compo data with K values in the descending order
                //   // for (let i = 0; i < compoDataFull_cloud.length; i++) {
                //   //     let comp = compoDataFull_cloud[i]
                //   //     compoDataFull_cloud_Ordered[compoCorrectionIndexes[i]] = comp
                //   // }
                //   // }
                //   // else{
                //   compoDataFull_cloud_Ordered = compoDataFull_cloud;
                //   // }
                //   // Populating arrays of z, acentric factor, Reduced Temperature(Tr), Redued Pressure(Pr)
                //   for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
                //     let comp = compoDataFull_cloud_Ordered[i];
                //     acentric[i] = comp.acentric;
                //     z[i] = comp.compoValue;
                //     Tr[i] = T / comp.tc;
                //     Pr[i] =
                //       pressure_cloud / (comp.pc * 1.01325 * Math.pow(10, 5));
                //   }
                //   if ((phiSum(0, K, z) > 0 && phiSum(1, K, z)) < 0) {
                //     phiSelect = brentsPhi(K, z, 0, 1, max_iter, tolerance);
                //   } else if (phiSum(0, K, z) < 0) {
                //     phiSelect = 0;
                //   } else if (phiSum(1, K, z) > 0) {
                //     phiSelect = 1;
                //   }
                //   // else {
                //   //     phiSelect = 0.5
                //   // }
                //   // Evaluating SRK Equation Parameters
                //   if (solver == "SRK") {
                //     for (
                //       let i = 0;
                //       i < compoDataFull_cloud_Ordered.length;
                //       i++
                //     ) {
                //       // Evaluating x and y for liquid and vapor from z based on vapor fraction
                //       xValue = z[i] / (1 + phiSelect * (K[i] - 1));
                //       x[i] = xValue;
                //       y[i] = x[i] * K[i];
                //       m[i] =
                //         0.48 +
                //         1.574 * acentric[i] -
                //         0.176 * Math.pow(acentric[i], 2);
                //       alpha[i] = Math.pow(1 + m[i] * (1 - Math.sqrt(Tr[i])), 2);
                //       Ap[i] = (0.42747 * alpha[i] * Pr[i]) / Math.pow(Tr[i], 2);
                //       Bp[i] = (0.08664 * Pr[i]) / Tr[i];
                //     }
                //     for (
                //       let i = 0;
                //       i < compoDataFull_cloud_Ordered.length;
                //       i++
                //     ) {
                //       for (
                //         let l = 0;
                //         l < compoDataFull_cloud_Ordered.length;
                //         l++
                //       ) {
                //         AbSumVapor += Math.sqrt(Ap[i] * Ap[l]) * y[i] * y[l];
                //         AbSumLiquid += Math.sqrt(Ap[i] * Ap[l]) * x[i] * x[l];
                //       }
                //       BbSumVapor += y[i] * Bp[i];
                //       BbSumLiquid += x[i] * Bp[i];
                //     }
                //   }
                //   // Evaluating Peng Robinson Equation Parameters
                //   else {
                //     for (
                //       let i = 0;
                //       i < compoDataFull_cloud_Ordered.length;
                //       i++
                //     ) {
                //       // Evaluating x and y for liquid and vapor from z based on vapor fraction
                //       xValue = z[i] / (1 + phiSelect * (K[i] - 1));
                //       x[i] = xValue;
                //       y[i] = x[i] * K[i];
                //       if (acentric[i] <= 0.491) {
                //         m[i] =
                //           0.37464 +
                //           1.54226 * acentric[i] -
                //           0.26992 * Math.pow(acentric[i], 2);
                //       } else {
                //         m[i] =
                //           0.379642 +
                //           1.48503 * acentric[i] -
                //           0.164423 * Math.pow(acentric[i], 2) +
                //           0.016666 * Math.pow(acentric[i], 3);
                //       }
                //       alpha[i] = Math.pow(1 + m[i] * (1 - Math.sqrt(Tr[i])), 2);
                //       Ap[i] = (0.45724 * alpha[i] * Pr[i]) / Math.pow(Tr[i], 2);
                //       Bp[i] = (0.0778 * Pr[i]) / Tr[i];
                //     }
                //     for (
                //       let i = 0;
                //       i < compoDataFull_cloud_Ordered.length;
                //       i++
                //     ) {
                //       for (
                //         let j = 0;
                //         j < compoDataFull_cloud_Ordered.length;
                //         j++
                //       ) {
                //         AbSumVapor += Math.sqrt(Ap[i] * Ap[j]) * y[i] * y[j];
                //         AbSumLiquid += Math.sqrt(Ap[i] * Ap[j]) * x[i] * x[j];
                //       }
                //       BbSumVapor += y[i] * Bp[i];
                //       BbSumLiquid += x[i] * Bp[i];
                //     }
                //   }
                //   Av = AbSumVapor;
                //   Bv = BbSumVapor;
                //   Al = AbSumLiquid;
                //   Bl = BbSumLiquid;
                //   // Solving cubic equation for compressibility factor - vapor  - SRK
                //   if (solver == "SRK") {
                //     ZvRoots = cubicSolve(
                //       1,
                //       -1,
                //       Av - Bv - Math.pow(Bv, 2),
                //       -1 * (Av * Bv)
                //     );
                //     ZlRoots = cubicSolve(
                //       1,
                //       -1,
                //       Al - Bl - Math.pow(Bl, 2),
                //       -1 * (Al * Bl)
                //     );
                //   }
                //   // Solving cubic equation for compressibility factor - vapor  - Peng Robinson
                //   else {
                //     ZvRoots = cubicSolve(
                //       1,
                //       -1 * (1 - Bv),
                //       Av - 3 * Math.pow(Bv, 2) - 2 * Bv,
                //       -1 * (Av * Bv - Math.pow(Bv, 2) - Math.pow(Bv, 3))
                //     );
                //     ZlRoots = cubicSolve(
                //       1,
                //       -1 * (1 - Bl),
                //       Al - 3 * Math.pow(Bl, 2) - 2 * Bl,
                //       -1 * (Al * Bl - Math.pow(Bl, 2) - Math.pow(Bl, 3))
                //     );
                //   }
                //   ZvrootsRefined = [];
                //   ZlrootsRefined = [];
                //   // Eliminating Complex roots of the cubic equation for Vapor
                //   ZvRoots.forEach(el => {
                //     if (!isNaN(el)) {
                //       if (el > 0) {
                //         ZvrootsRefined.push(el);
                //       }
                //     }
                //   });
                //   // Eliminating Complex roots of the cubic equation for Liquid
                //   ZlRoots.forEach(el => {
                //     if (!isNaN(el)) {
                //       if (el > 0) {
                //         ZlrootsRefined.push(el);
                //       }
                //     }
                //   });
                //   // Selecting the maximum real root for compressibilty factor of Vapor
                //   if (ZvrootsRefined) {
                //     Zv = Math.max(...ZvrootsRefined);
                //   }
                //   // Selecting the minimum real root for compressibilty factor of Liquid
                //   if (ZlrootsRefined) {
                //     Zl = Math.min(...ZlrootsRefined);
                //   }
                //   // Correcting K by phi-phi method SRK
                //   if (solver == "SRK") {
                //     for (let i = 0; i < z.length; i++) {
                //       const fVapor = Math.exp(
                //         (Zv - 1) * (Bp[i] / Bv) -
                //           Math.log(Zv - Bv) -
                //           (Av / Bv) *
                //             (2 * Math.sqrt(Ap[i] / Av) - Bp[i] / Bv) *
                //             Math.log((Zv + Bv) / Zv)
                //       );
                //       const fLiquid = Math.exp(
                //         (Zl - 1) * (Bp[i] / Bl) -
                //           Math.log(Zl - Bl) -
                //           (Al / Bl) *
                //             (2 * Math.sqrt(Ap[i] / Al) - Bp[i] / Bl) *
                //             Math.log((Zl + Bl) / Zl)
                //       );

                //       if (isNaN(fVapor)) {
                //         fugCoeffVapor[i] = 1;
                //       } else {
                //         fugCoeffVapor[i] = fVapor;
                //       }

                //       if (isNaN(fLiquid)) {
                //         fugCoeffLiquid[i] = 1;
                //       } else {
                //         fugCoeffLiquid[i] = fLiquid;
                //       }

                //       // Evaluating corrected equilibrium constant K = øl/øv
                //       K[i] = fugCoeffLiquid[i] / fugCoeffVapor[i];
                //       // F[i] = ((fugCoeffLiquid[i] / fugCoeffVapor[i]))
                //     }
                //   }
                //   // Correcting K by phi-phi method Peng Robinson
                //   else {
                //     for (let i = 0; i < z.length; i++) {
                //       AprSumVapor = 0;
                //       AprSumLiquid = 0;
                //       for (let j = 0; j < z.length; j++) {
                //         AprSumVapor += Math.sqrt(Ap[i] * Ap[j]) * y[j];
                //         AprSumLiquid += Math.sqrt(Ap[i] * Ap[j]) * x[j];
                //       }

                //       AprV[i] = AprSumVapor;
                //       AprL[i] = AprSumLiquid;

                //       const fVapor = Math.exp(
                //         (Zv - 1) * (Bp[i] / Bv) -
                //           Math.log(Zv - Bv) -
                //           (Av / (2 * (Math.sqrt(2) * Bv))) *
                //             ((2 * AprV[i]) / Av - Bp[i] / Bv) *
                //             Math.log(
                //               (Zv + (1 + Math.sqrt(2)) * Bv) /
                //                 (Zv + (1 - Math.sqrt(2)) * Bv)
                //             )
                //       );
                //       const fLiquid = Math.exp(
                //         (Zl - 1) * (Bp[i] / Bl) -
                //           Math.log(Zl - Bl) -
                //           (Al / (2 * (Math.sqrt(2) * Bl))) *
                //             ((2 * AprL[i]) / Al - Bp[i] / Bl) *
                //             Math.log(
                //               (Zl + (1 + Math.sqrt(2)) * Bl) /
                //                 (Zl + (1 - Math.sqrt(2)) * Bl)
                //             )
                //       );

                //       // const fVapor = Math.exp(((Bv/(Zv - Bv)) - ((Av * Zv)/(Math.pow(Zv,2)+(2*Bv*Zv)-Math.pow(Bv,2)))) * (Bp[i] / Bv) - Math.log(Zv - Bv) - (Av / (2 * (Math.sqrt(2)*Bv))) * ((2*AprV[i] / Av) - (Bp[i] / Bv)) * Math.log((Zv +(1+Math.sqrt(2))* Bv) / (Zv +(1-Math.sqrt(2))* Bv)))
                //       // const fLiquid = Math.exp(((Bl/(Zl - Bl)) - ((Al * Zl)/(Math.pow(Zl,2)+(2*Bl*Zl)-Math.pow(Bl,2)))) * (Bp[i] / Bl) - Math.log(Zl - Bl) - (Al / (2 * (Math.sqrt(2)*Bl))) * ((2*AprL[i] / Al) - (Bp[i] / Bl)) * Math.log((Zl +(1+Math.sqrt(2))* Bl) / (Zl +(1-Math.sqrt(2))* Bl)))

                //       if (isNaN(fVapor)) {
                //         fugCoeffVapor[i] = 1;
                //       } else {
                //         fugCoeffVapor[i] = fVapor;
                //       }

                //       if (isNaN(fLiquid)) {
                //         fugCoeffLiquid[i] = 1;
                //       } else {
                //         fugCoeffLiquid[i] = fLiquid;
                //       }
                //       // Evaluating corrected equilibrium constant K = øl/øv
                //       K[i] = fugCoeffLiquid[i] / fugCoeffVapor[i];
                //       // F[i] = ((fugCoeffLiquid[i] / fugCoeffVapor[i]))
                //     }
                //   }
                //   // Calculating dewSum and BubbleSum after correcting K
                //   for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
                //     // let comp = compoDataFull_cloud_Ordered[i]
                //     if (context == "dew") {
                //       dewSum += z[i] / K[i];
                //     } else {
                //       bubbleSum += z[i] * K[i];
                //     }
                //   }
                //   // Returning the result based on context
                //   if (context == "dew") {
                //     dewSum -= 1;
                //     return dewSum;
                //   } else {
                //     bubbleSum -= 1;
                //     return bubbleSum;
                //   }
                // }

// // Flashing the Sample
// function flashTheSample(T, compoDataFull_cloud, pressure_cloud, solver) {
//     // Declaring variables
//     let K = []
//     let compoK = [] // Array with Equilibrium constants of components
//     let compoX = [] // Array with flshing Liquid compo
//     let compoY = [] // Array with the flashing vapor compo
//     // let F = [] //Fugacity Ratio
//     let acentric = []
//     let Zv // Vapor Comp.Factor
//     let Zl // Liquid Comp.Factor
//     let x = []
//     let y = []
//     let z = []
//     let Pr = []
//     let Tr = []
//     let max_iter = 50
//     let tolerance = 1e-5
//     let fugCoeffVapor = []
//     let fugCoeffLiquid = []
//     let Ap = [] // Indiviudal term for each component - as array
//     let Bp = [] // Indiviudal term for each component - as array
//     let Av // Final value for a mixture - vapor
//     let Bv // Final value for a mixture - vapor
//     let Al // Final value for a mixture - liquid
//     let Bl // Final value for a mixture - liquid

//     // Specific terms used for Peng Robinson equation
//     let AprSumVapor
//     let AprSumLiquid
//     let AprV = []
//     let AprL = []
//     let phiSelect // Calculated Vapor Fraction
//     let m = [] // Factor which is a function of acentric factor, m = 0.48 +1.574ω – 0.176ω2
//     let alpha = [] // Factor which is a function of m
//     let compoDataFull_cloud_Ordered = [] //stores the compo data in the descending order of K

//     // let a
//     // let b 
//     let xValue
//     let AbSumVapor = 0
//     let BbSumVapor = 0
//     let AbSumLiquid = 0
//     let BbSumLiquid = 0
//     let ZvRoots = []
//     let ZlRoots = []
//     let ZvrootsRefined = []
//     let ZlrootsRefined = []
//     // Eliminiating component with zero compoValue
//     compoDataFull_cloud = compoDataFull_cloud.filter((el) => {
//         return el.compoValue > 0
//     })
//     // Estimating intial estimates for equilibrium constants
//     compoDataFull_cloud.forEach(element => {
//         const kValue = ((element.pc * 1.01325 * Math.pow(10, 5)) / pressure_cloud) * Math.exp(5.37 * (1 + element.acentric) * (1 - element.tc / T))
//         K.push(kValue)
//     })
//     console.log(K);
//     compoDataFull_cloud_Ordered = compoDataFull_cloud
//     // Populating arrays of z, acentric factor, Reduced Temperature(Tr), Redued Pressure(Pr)
//     for (let j = 0; j < compoDataFull_cloud_Ordered.length; j++) {
//         let comp = compoDataFull_cloud_Ordered[j]
//         acentric[j] = comp.acentric
//         z[j] = comp.compoValue
//         Tr[j] = T / comp.tc
//         Pr[j] = pressure_cloud / (comp.pc * 1.01325 * Math.pow(10, 5))
//     }
//     // phiSelect = NichitaLeibovici(K,z)
//     // Evaluating phi - Vapor fraction
//     // A Robust Algorithm for Determining Hydrocarbon PV Properties Using a Generalized EOS 
//     // A.C. Reynolds, U. of Tulsa; F.M. Guehria, U. of Tulsa; L.G. Thompson, U. of Tulsa
//     if ((((phiSum(0, K, z) > 0) && (phiSum(1, K, z)) < 0)) || (((phiSum(0, K, z) < 0) && (phiSum(1, K, z)) > 0))) {
//         phiSelect = brentsPhi(K, z, 0, 1, max_iter, tolerance)
//     }
//     // Single Phase Liquid
//     else if (phiSum(0, K, z) < 0) {
//         phiSelect = 0
//     }
//     // Single Phase Vapour
//     else if (phiSum(1, K, z) > 0) {
//         phiSelect = 1
//     }
//     // Evaluating Vapor-Liquid Fractions
//     for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//         // Evaluating x and y for liquid and vapor from z based on vapor fraction
//         xValue = z[i] / (1 + phiSelect * (K[i] - 1))
//         x[i] = xValue
//         y[i] = x[i] * K[i]
//     }
//     // Evaluating SRK Equation Parameters 
//     if (solver == "SRK") {
//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//             m[i] = 0.48 + 1.574 * acentric[i] - 0.176 * Math.pow(acentric[i], 2)
//             alpha[i] = Math.pow((1 + m[i] * (1 - Math.sqrt(Tr[i]))), 2)
//             Ap[i] = 0.42747 * alpha[i] * Pr[i] / (Math.pow(Tr[i], 2))
//             Bp[i] = 0.08664 * Pr[i] / Tr[i]
//         }
//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//             for (let l = 0; l < compoDataFull_cloud_Ordered.length; l++) {
//                 AbSumVapor += Math.sqrt(Ap[i] * Ap[l]) * y[i] * y[l]
//                 AbSumLiquid += Math.sqrt(Ap[i] * Ap[l]) * x[i] * x[l]
//             }
//             BbSumVapor += y[i] * Bp[i]
//             BbSumLiquid += x[i] * Bp[i]
//         }
//     }
//     // Evaluating Peng Robinson Equation Parameters
//     else {
//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//             if (acentric[i] <= 0.491) {
//                 m[i] = 0.37464 + 1.54226 * acentric[i] - 0.26992 * Math.pow(acentric[i], 2)
//             }
//             else {
//                 m[i] = 0.379642 + 1.48503 * acentric[i] - 0.164423 * Math.pow(acentric[i], 2) + 0.016666 * Math.pow(acentric[i], 3)
//             }
//             // m[i] = 0.48 + 1.574 * acentric[i] - 0.176 * Math.pow(acentric[i], 2)

//             alpha[i] = Math.pow((1 + m[i] * (1 - Math.sqrt(Tr[i]))), 2)
//             Ap[i] = 0.45724 * alpha[i] * Pr[i] / (Math.pow(Tr[i], 2))
//             Bp[i] = 0.07780 * Pr[i] / Tr[i]
//         }
//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//             for (let j = 0; j < compoDataFull_cloud_Ordered.length; j++) {
//                 AbSumVapor += Math.sqrt(Ap[i] * Ap[j]) * y[i] * y[j]
//                 AbSumLiquid += Math.sqrt(Ap[i] * Ap[j]) * x[i] * x[j]
//             }
//             BbSumVapor += y[i] * Bp[i]
//             BbSumLiquid += x[i] * Bp[i]
//         }
//     }
//     // Assigning the terms for Cubic Equation
//     Av = AbSumVapor
//     Bv = BbSumVapor
//     Al = AbSumLiquid
//     Bl = BbSumLiquid
//     // Solving cubic equation for compressibility factor - vapor  - SRK
//     if (solver == "SRK") {

//         ZvRoots = cubicSolve(1, -1, (Av - Bv - Math.pow(Bv, 2)), -1 * (Av * Bv))
//         ZlRoots = cubicSolve(1, -1, (Al - Bl - Math.pow(Bl, 2)), -1 * (Al * Bl))
//     }
//     // Solving cubic equation for compressibility factor - vapor  - Peng Robinson
//     else {
//         ZvRoots = cubicSolve(1, -1 * (1 - Bv), (Av - 3 * Math.pow(Bv, 2) - 2 * Bv), -1 * ((Av * Bv) - Math.pow(Bv, 2) - Math.pow(Bv, 3)))
//         ZlRoots = cubicSolve(1, -1 * (1 - Bl), (Al - 3 * Math.pow(Bl, 2) - 2 * Bl), -1 * ((Al * Bl) - Math.pow(Bl, 2) - Math.pow(Bl, 3)))
//     }
//     // Eliminating Complex roots of the cubic equation for Vapor
//     ZvrootsRefined = []
//     ZlrootsRefined = []
//     ZvRoots.forEach(el => {
//         if (!isNaN(el)) {
//             if (el > 0) {
//                 ZvrootsRefined.push(el)
//             }
//         }
//     })
//     // Eliminating Complex roots of the cubic equation for Liquid
//     ZlRoots.forEach(el => {

//         if (!isNaN(el)) {
//             if (el > 0) {
//                 ZlrootsRefined.push(el)
//             }
//         }
//     })
//     // Selecting the maximum real root for compressibilty factor of Vapor
//     if (ZvrootsRefined) {
//         Zv = Math.max(...ZvrootsRefined)
//     }
//     // Selecting the minimum real root for compressibilty factor of Liquid
//     if (ZlrootsRefined) {
//         Zl = Math.min(...ZlrootsRefined)
//     }
//     // Correcting K by phi-phi method SRK
//     if (solver == "SRK") {
//         for (let i = 0; i < z.length; i++) {
//             const fVapor = Math.exp((Zv - 1) * (Bp[i] / Bv) - Math.log(Zv - Bv) - (Av / Bv) * (2 * Math.sqrt(Ap[i] / Av) - (Bp[i] / Bv)) * Math.log((Zv + Bv) / Zv))
//             const fLiquid = Math.exp((Zl - 1) * (Bp[i] / Bl) - Math.log(Zl - Bl) - (Al / Bl) * (2 * Math.sqrt(Ap[i] / Al) - (Bp[i] / Bl)) * Math.log((Zl + Bl) / Zl))

//             if (isNaN(fVapor)) {
//                 fugCoeffVapor[i] = 1
//             } else {
//                 fugCoeffVapor[i] = fVapor
//             }

//             if (isNaN(fLiquid)) {
//                 fugCoeffLiquid[i] = 1
//             } else {
//                 fugCoeffLiquid[i] = fLiquid
//             }
//             // Evaluating corrected equilibrium constant K = øl/øv
//             K[i] = ((fugCoeffLiquid[i] / fugCoeffVapor[i]))
//             // K[i] = F[i] * y[i]/x[i]
//         }
//     }
//     // Correcting K by phi-phi method Peng Robinson
//     else {
//         for (let i = 0; i < z.length; i++) {
//             AprSumVapor = 0
//             AprSumLiquid = 0
//             for (let j = 0; j < z.length; j++) {
//                 AprSumVapor += Math.sqrt(Ap[i] * Ap[j]) * y[j]
//                 AprSumLiquid += Math.sqrt(Ap[i] * Ap[j]) * x[j]
//             }
//             AprV[i] = AprSumVapor
//             AprL[i] = AprSumLiquid

//             const fVapor = Math.exp((Zv - 1) * (Bp[i] / Bv) - Math.log(Zv - Bv) - (Av / (2 * (Math.sqrt(2) * Bv))) * ((2 * AprV[i] / Av) - (Bp[i] / Bv)) * Math.log((Zv + (1 + Math.sqrt(2)) * Bv) / (Zv + (1 - Math.sqrt(2)) * Bv)))
//             const fLiquid = Math.exp((Zl - 1) * (Bp[i] / Bl) - Math.log(Zl - Bl) - (Al / (2 * (Math.sqrt(2) * Bl))) * ((2 * AprL[i] / Al) - (Bp[i] / Bl)) * Math.log((Zl + (1 + Math.sqrt(2)) * Bl) / (Zl + (1 - Math.sqrt(2)) * Bl)))

//             if (isNaN(fVapor)) {
//                 fugCoeffVapor[i] = 1
//             } else {
//                 fugCoeffVapor[i] = fVapor
//             }
//             if (isNaN(fLiquid)) {
//                 fugCoeffLiquid[i] = 1
//             } else {
//                 fugCoeffLiquid[i] = fLiquid
//             }
//             // Evaluating corrected equilibrium constant K = øl/øv
//             K[i] = ((fugCoeffLiquid[i] / fugCoeffVapor[i]))
//             // K[i] = F[i] * y[i]/x[i]
//         }
//     }
//     // Re-evaluating the phi(Vapor Fraction)
//     if ((((phiSum(0, K, z) > 0) && (phiSum(1, K, z)) < 0)) || (((phiSum(0, K, z) < 0) && (phiSum(1, K, z)) > 0))) {
//         phiSelect = brentsPhi(K, z, 0, 1, max_iter, tolerance)
//     }
//     // Single Phase Liquid
//     else if (phiSum(0, K, z) < 0) {
//         phiSelect = 0
//     }
//     // Single Phase Vapour
//     else if (phiSum(1, K, z) > 0) {
//         phiSelect = 1
//     }
//     // Re-Evaluating Vapor-Liquid composition
//     for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//         const comp = compoDataFull_cloud_Ordered[i]
//         // Evaluating x and y for liquid and vapor from z based on vapor fraction
//         xValue = z[i] / (1 + phiSelect * (K[i] - 1))
//         x[i] = xValue
//         y[i] = x[i] * K[i]
//         // Listing Equilibrium constantss
//         compoK[i] = {
//             component: comp.Name,
//             equilibriumConstant: K[i]
//         }
//         // Listing Liquid Fractions
//         compoX[i] = {
//             component: comp.Name,
//             liquidFraction: x[i]
//         }
//         // Listing Vapor Fractions
//         compoY[i] = {
//             component: comp.Name,
//             vaporFraction: y[i]
//         }
//     }
//     // Returning equilibriumConstants, liquidFractions, vaporFractions
//     return {
//         equilibriumConstants: compoK,
//         liquidFractions: compoX,
//         vaporFractions: compoY,
//         phi: phiSelect
//     }
// }


// // Flashing the Sample to Determine phase, vapor-liquid composition
// flashOutput = flashTheSample(tappingTemperature, compoDataFull_cloud, tappingPressure, thermoDynamicModelSelect)


// data object from Anadez Main
// // Miscellaneous
        //     el:0,
        //     loader:null,
        // // Common Variables
        //     results:false,
        //     isDialog:false,
        //     dialogHeading:"",
        //     dialogText:"",
        //     dialogText2:"" ,
        //     dialogBtn1:"",
        //     dialogBtn2:"",
        //     isDialogTips:false,
        //     dialogTipsHeading:"",
        //     dialogTipsText:"",
        //     dialogTipsText2:"" ,
        //     dialogTipsBtn1:"",
        //     dialogTipsBtn2:"",
        //     dialogTableOn:false,
        //     dialogResult:"",
        //     activeIndex:"",
        //     dialogContext:"",
        //     resultsToggle:false,
        //     shown:false,
        // // Results
        //     dewPointAzTapping:"",
        //     bubblePointAzTapping:"",
        //     tempAzUnitSelect:"deg C",
        //     isPumpAz:false,
        //     densityCalcAzTapping:"",
        //     densityAzUnitSelect:"kg/m³",
        //     viscosityCalcAzTapping:"",
        //     viscosityAzUnitSelect:"cP",
        //     sampleMwtCalcAz:"",
        //     isPrimaryPRRecommended:false,
        //     primaryPRAzRecommended:"",
        //     pressureAzUnitSelect:"kg/cm² g",
        //     isTappingToPrimaryHT:false,
        //     isPrimaryOrTappingToSecondaryHT:false,
        //     isPSHSCabinetHeater:false,
        //     isSHSCabinetHeater:false,
        //     isAnalyzerCabinetCooler:false,
        //     isSampleCooler:false,
        //     isProbeDesignOkay:false,
        //     totalPressureDropAz:"",
        //     pressureDiffAzUnitSelect:"kg/cm²",
        //     totalLagTimeAz:"",
        //     timeAzUnitSelect:"s",
        // // To be stored
        //     probeMaterialData:[
        //         {material:'SS-316',density:0.29, yieldStrength:42100, modulusOfElasticity:28000000},
        //         {material:'Inconel',density:0.305, yieldStrength:66700, modulusOfElasticity:29600000},
        //         {material:'Hastelloy C276',density:0.321, yieldStrength:76000, modulusOfElasticity:29800000},
        //         {material:'SS-310',density:0.29, yieldStrength:45000, modulusOfElasticity:30000000},
        //         {material:'Hastelloy X',density:0.297, yieldStrength:52000, modulusOfElasticity:28500000},
        //         {material:'Ceramic',density:0.11, yieldStrength:25000, modulusOfElasticity:70000000},
        //     ]


// // Units Corrected Variables
// // part-1
// pressureLTPDPart1Corrected() {
//     return (this.pressureCorrected(this.pressureLTPDPart1, this.pressureLTPDUnitSelect)).toFixed(3)
// },
// temperatureLTPDPart1Corrected() {
//     return (this.temperatureCorrected(this.temperatureLTPDPart1, this.temperatureLTPDUnitSelect)).toFixed(3)
// },
// distanceLTPDPart1Corrected() {
//     return (this.lengthCorrected(this.distanceLTPDPart1, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// flowRateLTPDPart1Corrected() {
//     return (this.flowRateCorrected(this.flowRateLTPDPart1, this.flowRateLTPDUnitSelect)).toFixed(3)
// },
// velocityLTPDPart1Corrected() {
//     return (this.velocityCorrected(this.velocityLTPDPart1, this.velocityLTPDUnitSelect)).toFixed(3)
// },
// densityLTPDPart1Corrected() {
//     return (this.densityCorrected(this.densityLTPDPart1, this.densityLTPDUnitSelect)).toFixed(3)
// },
// viscosityLTPDPart1Corrected() {
//     return (this.viscosityCorrected(this.viscosityLTPDPart1, this.viscosityLTPDUnitSelect)).toFixed(3)
// },
// channelIDLTPDPart1Corrected() {
//     return (this.lengthCorrected(this.channelIDLTPDPart1, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// pressureDropLTPDPart1Corrected() {
//     return (this.pressureDiffCorrected(this.pressureDropLTPDPart1, this.pressureDiffLTPDUnitSelect)).toFixed(3)
// },
// lagTimeLTPDPart1Corrected() {
//     return (this.timeCorrected(this.lagTimeLTPDPart1, this.timeLTPDUnitSelect)).toFixed(3)
// },
// // part-2
// pressureLTPDPart2Corrected() {
//     return (this.pressureCorrected(this.pressureLTPDPart2, this.pressureLTPDUnitSelect)).toFixed(3)
// },
// temperatureLTPDPart2Corrected() {
//     return (this.temperatureCorrected(this.temperatureLTPDPart2, this.temperatureLTPDUnitSelect)).toFixed(3)
// },
// distanceLTPDPart2Corrected() {
//     return (this.lengthCorrected(this.distanceLTPDPart2, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// flowRateLTPDPart2Corrected() {
//     return (this.flowRateCorrected(this.flowRateLTPDPart2, this.flowRateLTPDUnitSelect)).toFixed(3)
// },
// velocityLTPDPart2Corrected() {
//     return (this.velocityCorrected(this.velocityLTPDPart2, this.velocityLTPDUnitSelect)).toFixed(3)
// },
// densityLTPDPart2Corrected() {
//     return (this.densityCorrected(this.densityLTPDPart2, this.densityLTPDUnitSelect)).toFixed(3)
// },
// viscosityLTPDPart2Corrected() {
//     return (this.viscosityCorrected(this.viscosityLTPDPart2, this.viscosityLTPDUnitSelect)).toFixed(3)
// },
// channelIDLTPDPart2Corrected() {
//     return (this.lengthCorrected(this.channelIDLTPDPart2, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// pressureDropLTPDPart2Corrected() {
//     return (this.pressureDiffCorrected(this.pressureDropLTPDPart2, this.pressureDiffLTPDUnitSelect)).toFixed(3)
// },
// lagTimeLTPDPart2Corrected() {
//     return (this.timeCorrected(this.lagTimeLTPDPart2, this.timeLTPDUnitSelect)).toFixed(3)
// },
// // part-3
// pressureLTPDPart3Corrected() {
//     return (this.pressureCorrected(this.pressureLTPDPart3, this.pressureLTPDUnitSelect)).toFixed(3)
// },
// temperatureLTPDPart3Corrected() {
//     return (this.temperatureCorrected(this.temperatureLTPDPart3, this.temperatureLTPDUnitSelect)).toFixed(3)
// },
// distanceLTPDPart3Corrected() {
//     return (this.lengthCorrected(this.distanceLTPDPart3, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// flowRateLTPDPart3Corrected() {
//     return (this.flowRateCorrected(this.flowRateLTPDPart3, this.flowRateLTPDUnitSelect)).toFixed(3)
// },
// velocityLTPDPart3Corrected() {
//     return (this.velocityCorrected(this.velocityLTPDPart3, this.velocityLTPDUnitSelect)).toFixed(3)
// },
// densityLTPDPart3Corrected() {
//     return (this.densityCorrected(this.densityLTPDPart3, this.densityLTPDUnitSelect)).toFixed(3)
// },
// viscosityLTPDPart3Corrected() {
//     return (this.viscosityCorrected(this.viscosityLTPDPart3, this.viscosityLTPDUnitSelect)).toFixed(3)
// },
// channelIDLTPDPart3Corrected() {
//     return (this.lengthCorrected(this.channelIDLTPDPart3, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// pressureDropLTPDPart3Corrected() {
//     return (this.pressureDiffCorrected(this.pressureDropLTPDPart3, this.pressureDiffLTPDUnitSelect)).toFixed(3)
// },
// lagTimeLTPDPart3Corrected() {
//     return (this.timeCorrected(this.lagTimeLTPDPart3, this.timeLTPDUnitSelect)).toFixed(3)
// },
// // part-4
// pressureLTPDPart4Corrected() {
//     return (this.pressureCorrected(this.pressureLTPDPart4, this.pressureLTPDUnitSelect)).toFixed(3)
// },
// temperatureLTPDPart4Corrected() {
//     return (this.temperatureCorrected(this.temperatureLTPDPart4, this.temperatureLTPDUnitSelect)).toFixed(3)
// },
// distanceLTPDPart4Corrected() {
//     return (this.lengthCorrected(this.distanceLTPDPart4, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// flowRateLTPDPart4Corrected() {
//     return (this.flowRateCorrected(this.flowRateLTPDPart4, this.flowRateLTPDUnitSelect)).toFixed(3)
// },
// velocityLTPDPart4Corrected() {
//     return (this.velocityCorrected(this.velocityLTPDPart4, this.velocityLTPDUnitSelect)).toFixed(3)
// },
// densityLTPDPart4Corrected() {
//     return (this.densityCorrected(this.densityLTPDPart4, this.densityLTPDUnitSelect)).toFixed(3)
// },
// viscosityLTPDPart4Corrected() {
//     return (this.viscosityCorrected(this.viscosityLTPDPart4, this.viscosityLTPDUnitSelect)).toFixed(3)
// },
// channelIDLTPDPart4Corrected() {
//     return (this.lengthCorrected(this.channelIDLTPDPart4, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// pressureDropLTPDPart4Corrected() {
//     return (this.pressureDiffCorrected(this.pressureDropLTPDPart4, this.pressureDiffLTPDUnitSelect)).toFixed(3)
// },
// lagTimeLTPDPart4Corrected() {
//     return (this.timeCorrected(this.lagTimeLTPDPart4, this.timeLTPDUnitSelect)).toFixed(3)
// },
// // part-5
// pressureLTPDPart5Corrected() {
//     return (this.pressureCorrected(this.pressureLTPDPart5, this.pressureLTPDUnitSelect)).toFixed(3)
// },
// temperatureLTPDPart5Corrected() {
//     return (this.temperatureCorrected(this.temperatureLTPDPart5, this.temperatureLTPDUnitSelect)).toFixed(3)
// },
// distanceLTPDPart5Corrected() {
//     return (this.lengthCorrected(this.distanceLTPDPart5, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// flowRateLTPDPart5Corrected() {
//     return (this.flowRateCorrected(this.flowRateLTPDPart5, this.flowRateLTPDUnitSelect)).toFixed(3)
// },
// velocityLTPDPart5Corrected() {
//     return (this.velocityCorrected(this.velocityLTPDPart5, this.velocityLTPDUnitSelect)).toFixed(3)
// },
// densityLTPDPart5Corrected() {
//     return (this.densityCorrected(this.densityLTPDPart5, this.densityLTPDUnitSelect)).toFixed(3)
// },
// viscosityLTPDPart5Corrected() {
//     return (this.viscosityCorrected(this.viscosityLTPDPart5, this.viscosityLTPDUnitSelect)).toFixed(3)
// },
// channelIDLTPDPart5Corrected() {
//     return (this.lengthCorrected(this.channelIDLTPDPart5, this.lengthLTPDUnitSelect)).toFixed(3)
// },
// pressureDropLTPDPart5Corrected() {
//     return (this.pressureDiffCorrected(this.pressureDropLTPDPart5, this.pressureDiffLTPDUnitSelect)).toFixed(3)
// },
// lagTimeLTPDPart5Corrected() {
//     return (this.timeCorrected(this.lagTimeLTPDPart5, this.timeLTPDUnitSelect)).toFixed(3)
// },

// #myBtn {
//     display: none; /* Hidden by default */
//     position: fixed; /* Fixed/sticky position */
//     bottom: 20px; /* Place the button at the bottom of the page */
//     right: 30px; /* Place the button 30px from the right */
//     z - index: 99; /* Make sure it does not overlap */
//     border: none; /* Remove borders */
//     outline: none; /* Remove outline */
//     color: white; /* Text color */
//     cursor: pointer; /* Add a mouse pointer on hover */
//     padding: 0px; /* No padding */
//     margin: 0px; /* No margin */
//     border - radius: 15px; /* Rounded corners */
//     text - transform: none;
//     font - size: 16px; /* Increase font size */
// }

// <!-- <radial-menu
//       class="radialMenuStyle lighten-4"
//       :itemSize="50"
//       :radius="80"
//       :angle-restriction="180">
//         <radial-menu-item 
//           v-for="(item, index) in items" 
//           class="radialMenuItemStyle"
//           :key="index" 
//           style="background-color: white" 
//           @click="() => handleClick(item)">
//           <span>{{item}}</span>
//         </radial-menu-item>
//       </radial-menu> -->
//       <!-- Up Arrow button navigation -->
//  // Handling Radial menu
//       handleClick (item) {
//       this.lastClicked = item;
//     },

//  .radialMenuStyle {
//     position: fixed;
//     margin: auto; 
//     margin-top: 0px; 
//     background-color: crimson;
//     color: antiquewhite;  /* Text color */
//     top: 200px; /* Place the button at the bottom of the page */
//     left: 90px; /* Place the button 30px from the right */
//     z-index: 99; /* Make sure it does not overlap */
//     cursor: pointer; /* Add a mouse pointer on hover */
//   }

//radial menu items
        // items: ['foo', 'bar', 'hello', 'world'],
        // lastClicked: 'click on something!',

        // import { RadialMenu,  RadialMenuItem } from 'vue-radial-menu'
        // RadialMenu,
        // RadialMenuItem,
//   .radialMenuItemStyle {
//     background-color: lightpink;
//     color: black;  /* Text color */
//     z-index: 99; /* Make sure it does not overlap */
//   }

// {
                //     data:{
                //         projectName: this.activeProject,
                //         endUser: this.endUserProject,
                //         designConsultant: this.designConsultantProject,
                //         notes: this.notesProject,
                //     },
                //     user:this.user,
                //     activeProject:this.activeProject
                // }
            // this.loading = true
            // this.progressing = true
            // this.projectInfo.projectName = this.activeProject
            // this.projectInfo.endUser = this.endUserProject
            // this.projectInfo.designConsultant = this.designConsultantProject
            // this.projectInfo.notes = this.notesProject
            // // Getting the reference for the project on firestore
            // const projectRef = db.collection("users").doc(this.user.id).collection("projects").doc(this.activeProject)
            // // Writing/Updating the project info
            // projectRef.set(
            //     this.projectInfo, 
            //     { merge: true }
            // )
            // .then(()=>{
            //     this.loading = false
            //     this.progressing = false
            //     this.saveProjectSuccess = true
            // })


            // if(context === "deleteCompo"){
                //     this.dialogContext = "deleteCompo"
                // }
                // else if(context === "deleteAnalyte"){
                //     this.dialogContext = "deleteAnalyte"
                // }
                // else if(context === "resetAll"){
                //     this.dialogContext = "resetAll"
                // }
                // else if(context === "clearAllCompo"){
                //     this.dialogContext = "clearAllCompo"
                // }
                // else if(context === "clearAllAnalytes"){
                //     this.dialogContext = "clearAllAnalytes"
                // }
                // else if(context === 'invalidPressure'){
                //     this.dialogContext = 'invalidPressure'
                // }
                // else if(context === 'invalidComposition'){
                //     this.dialogContext = 'invalidComposition'
                // }
                // else if(context === 'invalidAnalyte'){
                //     this.dialogContext = 'invalidAnalyte'
                // }
                // else if(context === 'invalidSchedule'){
                //     this.dialogContext = 'invalidSchedule'
                // }
                // else if(context === "roughness"){
                //     this.dialogContext = "roughness"
                // }
                // else if(context === "fluidPackage"){
                //     this.dialogContext = "fluidPackage"
                // }
                // else if(context === "incompleteApplicationDetails"){
                //     this.dialogContext = "incompleteApplicationDetails"
                // }
                // else if(context === "incompleteAreaClassAndCert"){
                //     this.dialogContext = "incompleteAreaClassAndCert"
                // }
                // else if(context === "incompleteAmbientAndAnalyzer"){
                //     this.dialogContext = "incompleteAmbientAndAnalyzer"
                // }
                // else if(context === "incompleteSampleProperties"){
                //     this.dialogContext = "incompleteSampleProperties"
                // }
                // else if(context === "incompleteProbeDetails"){
                //     this.dialogContext = "incompleteProbeDetails"
                // }
                // else if(context === "incompleteDistanceAndFlow"){
                //     this.dialogContext = "incompleteDistanceAndFlow"
                // }
                // else if(context === "incompleteTransportationDetails"){
                //     this.dialogContext = "incompleteTransportationDetails"
                // }
                

                // if(this.dialogContext === "invalidSchedule"){
                //     this.dialogHeading = "Invalid Schedule for this Pipe size"
                //     this.dialogText = "Please select a valid pipe Schedule for this size"
                //     this.dialogBtn1 = ""
                //     this.dialogBtn2 = "OK"
                //     this.isDialog = true
                
                // }
                // else if(this.dialogContext === "deleteCompo"){
                //     if(compo){
                //         this.activeIndex = this.compoDataAz.indexOf(compo)
                //     }
                //     if(this.compoDataAz[this.activeIndex].compoName == "" && this.compoDataAz[this.activeIndex].compoValue == ""){
                //         this.deleteCompo()
                //         return
                //     }
                    
                //     this.dialogHeading = "Confirm Removal of a component"
                //     this.dialogText = "Do you really want to remove the component " + compo.compoName + " ?"
                //     this.dialogBtn1 = "Cancel"
                //     this.dialogBtn2 = "Yes"
                //     this.isDialog = true
                    
                // }
                // else if(this.dialogContext === "deleteAnalyte"){
                //     if(compo){
                //         this.activeIndex = this.analyteData.indexOf(compo)
                //     }
                    
                //     this.dialogHeading = "Confirm Removal of Analyte"
                //     this.dialogText = "Do you really want to remove the analyte " + compo.analyteName + " ?"
                //     this.dialogBtn1 = "Cancel"
                //     this.dialogBtn2 = "Yes"
                //     this.isDialog = true
                    
                // }
                // else if(this.dialogContext === "resetAll"){
                //     this.dialogHeading = "Resetting all input fields"
                //     this.dialogText = "Do you really want to reset the page?"
                //     this.dialogBtn1 = "Cancel"
                //     this.dialogBtn2 = "Yes"
                //     this.isDialog = true
                //     if(compo){
                //         this.activeIndex = this.compoDataAz.indexOf(compo)
                //     }
                
                // }
                // else if(this.dialogContext === "clearAllCompo"){
                //     this.dialogHeading = "Clearing all component data"
                //     this.dialogText = "Do you really want to clear all the component data?<br/>This will clear the components except the pressure and composition basis!"
                //     this.dialogBtn1 = "Cancel"
                //     this.dialogBtn2 = "Yes"
                //     this.isDialog = true
                //     if(compo){
                //         this.activeIndex = this.compoDataAz.indexOf(compo)
                //     }
                
                // }
                // else if(this.dialogContext === "clearAllAnalytes"){
                //     this.dialogHeading = "Clearing all Analyte data"
                //     this.dialogText = "Do you really want to clear all the Analytes data?<br/>This will clear the Analytes and all measurement details!"
                //     this.dialogBtn1 = "Cancel"
                //     this.dialogBtn2 = "Yes"
                //     this.isDialog = true
                //     if(compo){
                //         this.activeIndex = this.analyteData.indexOf(compo)
                //     }
                
                // }
                // else if(this.dialogContext === "invalidPressure"){
                //     this.dialogHeading = "Invalid Pressure!"
                //     this.dialogText = "Please specify a valid pressure!"
                //     this.dialogBtn1 = ""
                //     this.dialogBtn2 = "OK"
                //     this.isDialog = true
                //     if(compo){
                //         this.activeIndex = this.compoDataAz.indexOf(compo)
                //     }
                
                // }
                // else if(this.dialogContext === "invalidComposition"){
                //     this.dialogHeading = "Invalid Composition!"
                //     this.dialogText = "Please specify a valid composition!"
                //     this.dialogBtn1 = ""
                //     this.dialogBtn2 = "OK"
                //     this.isDialog = true
                //     if(compo){
                //         this.activeIndex = this.compoDataAz.indexOf(compo)
                //     }
            
                // }
                // else if(this.dialogContext === "acidDPNotApplicable"){
                //     this.dialogHeading = "Acid Dew Point not Applicable!"
                //     this.dialogText = "The acid dew point is not applicable for this mixture!"
                //     this.dialogText2 = "The mixture shall have either sulfur dioxide/sulfur trioxide/hydrogen chloride/Nitrogen dioxide along with water in order to determine acid dew point."
                //     this.dialogBtn1 = ""
                //     this.dialogBtn2 = "OK"
                //     this.isDialog = true
                //     if(compo){
                //         this.activeIndex = this.compoDataAz.indexOf(compo)
                //     }
            
                // }
                // else if(this.dialogContext === "invalidAnalyte"){
                //     this.dialogHeading = "invalid Analyte!"
                //     this.dialogText = "Enter all the required fields for the analyte!"
                //     this.dialogText2 = ""
                //     this.dialogBtn1 = ""
                //     this.dialogBtn2 = "OK"
                //     this.isDialog = true
                // }  
                // else if(this.dialogContext === "roughness"){
                //     this.dialogTipsHeading = "Roughness Parameters of Transportation channel Materials"
                //     this.dialogTipsText = ""
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = true,
                //     this.isDialogTips = true
                // }
                // else if(this.dialogContext === "fluidPackage"){
                //     this.dialogTipsHeading = "Selecting Fluid Package for VLE"
                //     this.dialogTipsText = "The thermodynamic fluid package is used to solve vapor liquid equiibrium and estimate physical properties of the fluid. Peng-Robinson is the most widely (in both industrial and academic field ) used model. The Wilson correlation is  based on the empirical equation and the results are less accurate compared Peng Robinson and Soave Redlisch Kwang models."
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // } 
                // else if(this.dialogContext === "incompleteApplicationDetails"){
                //     this.dialogTipsHeading = "Incomplete Application Details"
                //     this.dialogTipsText = "Please enter all data in the 'Application Details' section. Anadez requires all the information to perform the calculation"
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // }
                // else if(this.dialogContext === "incompleteAreaClassAndCert"){
                //     this.dialogTipsHeading = "Incomplete Area Class And Cert"
                //     this.dialogTipsText = "Please enter all data in the 'Area Class And Cert' section. Anadez requires all the information to perform the calculation"
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // }
                // else if(this.dialogContext === "incompleteAmbientAndAnalyzer"){
                //     this.dialogTipsHeading = "Incomplete Ambient And Analyzer Details"
                //     this.dialogTipsText = "Please enter all data in the 'Ambient And Analyzer' section. Anadez requires all the information to perform the calculation"
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // }  
                // else if(this.dialogContext === "incompleteSampleProperties"){
                //     this.dialogTipsHeading = "Incomplete Sample Properties Data"
                //     this.dialogTipsText = "Please enter all data in the 'Sample Properties' section. Anadez requires all the information to perform the calculation"
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // }  
                // else if(this.dialogContext === "incompleteProbeDetails"){
                //     this.dialogTipsHeading = "Incomplete Probe Details"
                //     this.dialogTipsText = "Please enter all data in the 'Probe Details' section. Anadez requires all the information to perform the calculation"
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // }  
                // else if(this.dialogContext === "incompleteDistanceAndFlow"){
                //     this.dialogTipsHeading = "Incomplete Distance And Flow"
                //     this.dialogTipsText = "Please enter all data in the 'Distance And Flow' section. Anadez requires all the information to perform the calculation"
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // }    
                // else if(this.dialogContext === "incompleteTransportationDetails"){
                //     this.dialogTipsHeading = "Incomplete Transportation Details"
                //     this.dialogTipsText = "Please enter all data in the 'Transportation Details' section. Anadez requires all the information to perform the calculation"
                //     this.dialogTipsBtn1 = ""
                //     this.dialogTipsBtn2 = "OK"
                //     this.dialogTableOn = false,
                //     this.isDialogTips = true
                // }    

                // this.dialogResult = result
                // if(this.dialogContext === "resetAll"){
                //     this.resetAll()
                // }
                // else if(this.dialogContext === "deleteCompo"){
                //     this.deleteCompo()
                // }
                // else if(this.dialogContext === "deleteAnalyte"){
                //     this.deleteAnalyte()
                // }
                // else if(this.dialogContext === "resetAll"){
                //     this.resetAll()
                // }
                // else if(this.dialogContext === "clearAllCompo"){
                //     this.clearAllComponents()
                // }
                // else if(this.dialogContext === "clearAllAnalytes"){
                //     this.clearAllAnalytes()
                // }
                // else if(this.dialogContext === "invalidSchedule"){
                //     this.invalidSchedule()
                // }
                

                // this.dialogHeading =""
                // this.isDialog = false
                // this.dialogText = ""
                // this.dialogText2 = ""
                // this.dialogBtn1 = ""
                // this.dialogBtn2 = ""
                // this.isDialogTips = false,
                // this.dialogTipsHeading = "",
                // this.dialogTipsText = "",
                // this.dialogTipsText2 = "" ,
                // this.dialogTipsBtn1 = "",
                // this.dialogTipsBtn2 = "",
                // this.dialogContext = ""
                // this.dialogResult =""
                // this.activeIndex =""