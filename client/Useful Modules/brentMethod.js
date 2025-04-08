
// function phiSum(x, K, z) {
//     let rrSum = 0
//     for (let i = 0; i < z.length; i++) {
//         // Rachford–Rice equation  to determine Vapor fraction phi
//         rrSum += (z[i] * (K[i] - 1)) / (1 + (x * (K[i] - 1)))
//     }

//     return rrSum
// }


// function brentsDewBubble(dbSum, x0, x1, max_iter = 50, tolerance = 1e-5,compoDataFull_cloud, pressure_cloud, context) {
//     let fx0 = dbSum(x0, compoDataFull_cloud, pressure_cloud, context)
//     let fx1 = dbSum(x1, compoDataFull_cloud, pressure_cloud, context)

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
//         fx0 = dbSum(x0, compoDataFull_cloud, pressure_cloud, context)
//         fx1 = dbSum(x1, compoDataFull_cloud, pressure_cloud, context)
//         fx2 = dbSum(x2, compoDataFull_cloud, pressure_cloud, context)


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


//         fnew = dbSum(newx, compoDataFull_cloud, pressure_cloud, context)
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

// let tolerance = 10e-5
// let root = brentsDewBubble("dbSum", 0.1, 600, tolerance )

// console.log(root)


// // Brent method for vapor Fraction phi
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

    



// // print "root is:", root
// // print "steps taken:", steps