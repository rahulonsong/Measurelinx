// // Calculating RR equation term
// function phiSum(x, K, z) {
//     let rrSum = 0
//     for (let i = 0; i < z.length; i++) {
//         // Rachford–Rice equation  to determine Vapor fraction phi
//         rrSum += (z[i] * (K[i] - 1)) / (1 + (x * (K[i] - 1)))
//     }

//     return rrSum
// }

// function brentsPhi(K, z, x0, x1, max_iter, tolerance) {
//     let fx0 = phiSum(x0, K, z)
//     let fx1 = phiSum(x1, K, z)

//     if ((fx0 * fx1) >= 0) {
//         return //"Root not bracketed"
//     }

//     if (Math.abs(fx0) < Math.abs(fx1)) {
//         x1 = [x0, x0 = x1][0]
//         fx1 = [fx0, fx0 = fx1][0]
//         // x0, x1 = x1, x0
//         // fx0, fx1 = fx1, fx0
//     }

//     let x2, fx2
//     let newx, d
//     let fnew

//     x2 = x0
//     fx2 = fx0

//     // x2, fx2 = x0, fx0

//     let mflag = true
//     let steps_taken = 0

//     while ((steps_taken < max_iter) && (Math.abs(x1 - x0) > tolerance)) {
//         fx0 = phiSum(x0, K, z)
//         fx1 = phiSum(x1, K, z)
//         fx2 = phiSum(x2, K, z)

//         if (fx0 != fx2 && fx1 != fx2) {
//             const L0 = (x0 * fx1 * fx2) / ((fx0 - fx1) * (fx0 - fx2))
//             const L1 = (x1 * fx0 * fx2) / ((fx1 - fx0) * (fx1 - fx2))
//             const L2 = (x2 * fx1 * fx0) / ((fx2 - fx0) * (fx2 - fx1))
//             newx = L0 + L1 + L2
//         } else {
//             newx = x1 - ((fx1 * (x1 - x0)) / (fx1 - fx0))
//         }

//         if (
//             (newx > ((3 * x0 + x1) / 4) && newx < x1) ||
//             (mflag == true && (Math.abs(newx - x1)) >= (Math.abs(x1 - x2) / 2)) ||
//             (mflag == false && (Math.abs(newx - x1)) >= (Math.abs(x2 - d) / 2)) ||
//             (mflag == true && (Math.abs(x1 - x2)) < tolerance) ||
//             (mflag == false && (Math.abs(x2 - d)) < tolerance)
//         ) {
//             newx = (x0 + x1) / 2
//             mflag = true
//         } else {
//             mflag = false
//         }


//         fnew = phiSum(newx, K, z)
//         d = x2
//         x2 = x1
//         // d, x2 = x2, x1

//         if ((fx0 * fnew) < 0) {
//             x1 = newx
//         } else {
//             x0 = newx
//         }

//         if (Math.abs(fx0) < Math.abs(fx1)) {
//             x1 = [x0, x0 = x1][0]
//             // x0, x1 = x1, x0
//         }

//         steps_taken += 1
//     }
//     console.log(steps_taken)

//     return x1

// }

// function crudeEvalPhi(K,z) {
//     let phi = 0
//     let phiRange = [] // spans the values of phi from 0 to 1
//     let phiSelect // Calculated Vapor Fraction
//     let rrsum = 0 // Sum of the individuall Rachford–Rice equation terms for each iteration of phi
//     let RRSum = []
//     for (phi = 0; phi <= 1; phi += 0.001) {

//         rrsum = 0
//         for (let i = 0; i < z.length; i++) {
//             // Rachford–Rice equation  to determine Vapor fraction phi
//             rrsum += (z[i] * (K[i] - 1)) / (1 + (phi * (K[i] - 1)))
//         }

//         phiRange.push(phi)
//         RRSum.push(Math.abs(rrsum))
//         // phi += 0.001
//     }

//     const RRSumMin = Math.min(...RRSum)
//     const RRSumMinIndex = RRSum.indexOf(RRSumMin)
//     phiSelect = phiRange[RRSumMinIndex]

//     return phiSelect
// }

// function isFugRatioInvalid(F) {
//     let epsilon = 1e-8
//     let invalidFugRatio = false
//     for (let i = 0; i < F.length; i++) {
//         const element = F[i]
//         if ((Math.pow(element, 2) - 1) > epsilon) {
//             invalidFugRatio = true
//             return invalidFugRatio
//         }
//     }
    
// }


// // Dew Bubble Function for Initial Estimate
// function dbSum(T, compoDataFull_cloud, pressure_cloud, context) {
//     let K = []
//     compoDataFull_cloud.forEach(element => {
//         const kValue = ((element.pc * Math.pow(10, 5)) / pressure_cloud) * Math.exp(5.37 * (1 + element.acentric) * (1 - element.tc / T))
//         K.push(kValue)
//     })

//     let dewSum = 0
//     let bubbleSum = 0
//     for (let i = 0; i < compoDataFull_cloud.length; i++) {
//         let comp = compoDataFull_cloud[i]
//         if (context == "dew") {
//             if (K[i] == 0) {
//                 dewSum += comp.compoValue / (1e-300)
//             } else {
//                 dewSum += comp.compoValue / K[i]
//             }

//         } else {
//             bubbleSum += comp.compoValue * K[i]
//         }
//     }

//     if (context == "dew") {
//         dewSum -= 1
//         return dewSum
//     } else {
//         bubbleSum -= 1
//         return bubbleSum
//     }

// }
// console.log(dbSum())

// // Dew Bubble Function for Correction of Estimate value

// function dbSumCorrect(T, compoDataFull_cloud, pressure_cloud, context) {
//     let K = []
//     let F = [] //Fugacity Ratio
//     let acentric = []
//     let Zv // Vapor Comp.Factor
//     let Zl // Liquid Comp.Factor
//     let x = []
//     let y = []
//     let z = []
//     let unorderedK // to compare the old unsorted K value
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
//     let phiSelect // Calculated Vapor Fraction
//     let m = [] // Factor which is a function of acentric factor, m = 0.48 +1.574ω – 0.176ω2
//     let alpha = [] // Factor which is a function of m
//     let CompoCorrectionIndexes = []
//     let compoDataFull_cloud_Ordered = [] //stores the compo data in the descending order of K
//     let a
//     let b 
//     let xValue
//     let AbSumVapor = 0
//     let BbSumVapor = 0
//     let AbSumLiquid = 0
//     let BbSumLiquid = 0
//     let ZvRoots = []
//     let ZlRoots = []
//     let ZvrootsRefined = []
//     let ZlrootsRefined = []
//     let dewSum = 0
//     let bubbleSum = 0

//     // Estimating intial estimates for equilibrium constants
//     compoDataFull_cloud.forEach(element => {
//         const kValue = ((element.pc * Math.pow(10, 5)) / pressure_cloud) * Math.exp(5.37 * (1 + element.acentric) * (1 - element.tc / T))
//         K.push(kValue)
//     })

//     // Generating unordered array of K for storing
//     K.forEach(element => {
//         unorderedK.push(element)
//     })

//     // Ordering K in the descending order
//     K.sort(function (a, b) {
//         return b - a
//     })

//     // Generating indexes of array of unordered K
//     K.forEach(el => {
//         CompoCorrectionIndexes.push(unorderedK.indexOf(el))
//     })

//     // Generating ordered Compo data with K values in the descending order
//     for (let i = 0; i < compoDataFull_cloud.length; i++) {
//         let comp = compoDataFull_cloud[i]
//         compoDataFull_cloud_Ordered[CompoCorrectionIndexes[i]] = comp
//     }

//     // Populating arrays of z, acentric factor, Reduced Temperature(Tr), Redued Pressure(Pr)
//     for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//         let comp = compoDataFull_cloud_Ordered[i]
//         acentric.push(comp.acentric)
//         z.push(comp.compoValue)
//         Tr.push(T / comp.tc)
//         Pr.push(pressure_cloud / (comp.pc * Math.pow(10, 5)))
//     }

//     // a = (-1) * (1 / (K[0] - 1)) // Lower Limit for Bisection Method
//     // b = 1 / (1 - K[K.length - 1]) // Upper Limit for Bisection Method
//     do {
//         if ((phiSum(0, K, z) * phiSum(1, K, z)) >= 0) {
//             phiSelect = crudeEvalPhi(K, z)
//         } else {
//             phiSelect = brentsPhi(K, z, 0, 1, max_iter, tolerance)
//         }


//         // Evaluating SRK Equation Parameters 
//         for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
//             // Evaluating x and y for liquid and vapor from z based on vapor fraction
//             xValue = z[i] / (1 + phiSelect * (K[i] - 1))
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
//         ZvRoots = cubicSolve(1, -1, (Av - Bv - Math.pow(Bv, 2)), -1 * (Av * Bv))
//         ZlRoots = cubicSolve(1, -1, (Al - Bl - Math.pow(Bl, 2)), -1 * (Al * Bl))
//         ZvrootsRefined = []
//         ZlrootsRefined = []

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

//         // Calculating dew sum and bubble sum based on context
//         for (let i = 0; i < z.length; i++) {

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
//             K[i] = (fugCoeffLiquid[i] / fugCoeffVapor[i]) * (y[i] / x[i])
//             F.push((fugCoeffLiquid[i] / fugCoeffVapor[i]))
//         }
//     } while (isFugRatioInvalid(F))
    

//     for (let i = 0; i < compoDataFull_cloud.length; i++) {
//         let comp = compoDataFull_cloud[i]
//         if (context == "dew") {
//             dewSum += comp.compoValue / K[i]
//         } else {
//             bubbleSum += comp.compoValue * K[i]
//         }
//     }

//     if (context == "dew") {
//         dewSum -= 1
//         return dewSum
//     } else {
//         bubbleSum -= 1
//         return bubbleSum
//     }

// }

// console.log(dbSumCorrect())