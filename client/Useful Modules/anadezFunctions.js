// Cubic equation solver for finding roots of the equation 0 = Z^3-Z^2+Z(A-B-B^2)-AB 
            function cubicSolve(a, b, c, d) {
               // eslint-disable-next-line 
                var f, g, h, k, m, m2, n, n2, x1, x2, x3, r, rc, dans, x2a, x2b, x2c, x2d, theta, sign
                // <!--EVALUATING THE 'f'TERM -->
                f = eval(((3 * c) / a) - (((b * b) / (a * a)))) / 3
                // <!--EVALUATING THE 'g'TERM -->
                g = eval((2 * ((b * b * b) / (a * a * a)) - (9 * b * c / (a * a)) + ((27 * (d / a))))) / 27
                // <!--EVALUATING THE 'h'TERM -->
                h = eval(((g * g) / 4) + ((f * f * f) / 27))
                if (h > 0)
                {
                    m = eval(-(g / 2) + (Math.sqrt(h)))
                    // <!-- K is used because math.pow cannot nameu"te negative cube roots -->
                    k = 1
                    if (m < 0) k = -1
                    else k = 1
                    m2 = eval(Math.pow((m * k), (1 / 3)))
                    m2 = m2 * k
                    k = 1
                    n = eval(-(g / 2) - (Math.sqrt(h)))
                    if (n < 0) k = -1
                    else k = 1
                    n2 = eval(Math.pow((n * k), (1 / 3)))
                    n2 = n2 * k
                    k = 1
                    x1 = eval((m2 + n2) - (b / (3 * a)))
                    // <!--                      ((S+U)     - (b/(3*a)))-->
                    x2 = (-1 * (m2 + n2) / 2 - (b / (3 * a)) + " + i* " + ((m2 - n2) / 2) * Math.pow(3, .5))

                    // <!--                      -(S + U)/2  - (b/3a) + i*(S-U)*(3)^.5-->
                    x3 = (-1 * (m2 + n2) / 2 - (b / (3 * a)) + " - i* " + ((m2 - n2) / 2) * Math.pow(3, .5))
                }
                // <!--                      -(S + U)/2  - (b/3a) - i*(S-U)*(3)^.5-->

                if (h <= 0)
                {
                    r = (eval(Math.sqrt((g * g / 4) - h)))
                    k = 1
                    if (r < 0) k = -1
                    // <!-- rc is the cube root of 'r' -->
                    rc = Math.pow((r * k), (1 / 3)) * k
                    k = 1
                    theta = Math.acos((-g / (2 * r)))
                    x1 = eval(2 * (rc * Math.cos(theta / 3)) - (b / (3 * a)))
                    x2a = rc * -1
                    x2b = Math.cos(theta / 3)
                    x2c = Math.sqrt(3) * (Math.sin(theta / 3))
                    x2d = (b / 3 * a) * -1
                    x2 = eval(x2a * (x2b + x2c)) - (b / (3 * a))
                    x3 = eval(x2a * (x2b - x2c)) - (b / (3 * a))

                    x1 = x1 * 1E+14
                    x1 = Math.round(x1)
                    x1 = (x1 / 1E+14)

                    x2 = x2 * 1E+14
                    x2 = Math.round(x2)
                    x2 = (x2 / 1E+14)

                    x3 = x3 * 1E+14
                    x3 = Math.round(x3)
                    x3 = (x3 / 1E+14)

                }
                if ((f + g + h) == 0)

                {
                    if (d < 0) {
                        sign = -1
                    }
                    if (d >= 0) {
                        sign = 1
                    }

                    if (sign > 0) {
                        dans = Math.pow((d / a), (1 / 3))
                        dans = dans * -1
                    }

                    if (sign < 0) {
                        d = d * -1
                        dans = Math.pow((d / a), (1 / 3))
                    }
                    x1 = dans
                    x2 = dans
                    x3 = dans
                }
                var roots = []

                roots[0] = x1
                roots[1] = x2
                roots[2] = x3

                return roots
            }
            // Evaluating conpressibility factor, mainly for estimating real gas density
            function evalCompFactor(T, compoDataFull_cloud, pressure_cloud, solver) {
                // Declaring variables
                // let F = [] //Fugacity Ratio
                let acentric = []
                let Zv // Vapor Comp.Factor
                let z = []
                let Pr = []
                let Tr = []
                let Ap = [] // Indiviudal term for each component - as array
                let Bp = [] // Indiviudal term for each component - as array
                let Av // Final value for a mixture - vapor
                let Bv // Final value for a mixture - vapor
                // Specific terms used for Peng Robinson and SRK equation
                let m = [] // Factor which is a function of acentric factor, m = 0.48 +1.574ω – 0.176ω2
                let alpha = [] // Factor which is a function of m
                let AbSumVapor = 0
                let BbSumVapor = 0
                let ZvRoots = []
                let ZvrootsRefined = []
                // Eliminiating component with zero compoValue
                compoDataFull_cloud = compoDataFull_cloud.filter((el) => {
                    return el.compoValue > 0
                })
                // Populating arrays of z, acentric factor, Reduced Temperature(Tr), Redued Pressure(Pr)
                for (let i = 0; i < compoDataFull_cloud.length; i++) {
                    let comp = compoDataFull_cloud[i]
                    acentric[i] = comp.acentric
                    z[i] = comp.compoValue
                    Tr[i] = T / comp.tc
                    Pr[i] = pressure_cloud / (comp.pc * Math.pow(10, 5))
                }
                // Evaluating SRK Equation Parameters 
                if(solver == "SRK"){
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        m[i] = 0.48 + 1.574 * acentric[i] - 0.176 * Math.pow(acentric[i], 2)
                        alpha[i] = Math.pow((1 + m[i] * (1 - Math.sqrt(Tr[i]))), 2)
                        Ap[i] = 0.42747 * alpha[i] * Pr[i] / (Math.pow(Tr[i], 2))
                        Bp[i] = 0.08664 * Pr[i] / Tr[i]
                    }
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        for (let l = 0; l < compoDataFull_cloud.length; l++) {
                            AbSumVapor += Math.sqrt(Ap[i] * Ap[l]) * z[i] * z[l]
                        }
                        BbSumVapor += z[i] * Bp[i]
                    }
                }  
                // Evaluating Peng Robinson Equation Parameters
                else{
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        if(acentric[i] <= 0.491){
                            m[i] = 0.37464 + 1.54226 * acentric[i] - 0.26992 * Math.pow(acentric[i],2)
                        }
                        else{
                            m[i] = 0.379642 + 1.48503 * acentric[i] - 0.164423 * Math.pow(acentric[i],2) + 0.016666 * Math.pow(acentric[i],3)
                        }
                        alpha[i] = Math.pow((1 + m[i] * (1 - Math.sqrt(Tr[i]))), 2)
                        Ap[i] = 0.45724 * alpha[i] * Pr[i] / (Math.pow(Tr[i], 2))
                        Bp[i] = 0.07780 * Pr[i] / Tr[i]
                    }
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        for (let j = 0; j < compoDataFull_cloud.length; j++) {
                            AbSumVapor += Math.sqrt(Ap[i] * Ap[j]) * z[i] * z[j]
                        }
                        BbSumVapor += z[i] * Bp[i]
                    }
                }
                Av = AbSumVapor
                Bv = BbSumVapor
                // Solving cubic equation for compressibility factor - vapor  - SRK
                if(solver == "SRK"){
                    ZvRoots = cubicSolve(1, -1, (Av - Bv - Math.pow(Bv, 2)), -1 * (Av * Bv))
                }
                // Solving cubic equation for compressibility factor - vapor  - Peng Robinson
                else{
                    ZvRoots = cubicSolve(1, -1 * (1-Bv), (Av - 3 * Math.pow(Bv,2) - 2*Bv), -1 * ((Av * Bv) -Math.pow(Bv,2)-Math.pow(Bv,3)))
                }
                ZvrootsRefined = []
                // Eliminating Complex roots of the cubic equation for Vapor
                ZvRoots.forEach(el => {

                    if (!isNaN(el)) {
                        if (el > 0) {
                            ZvrootsRefined.push(el)
                        }
                    }
                })
                // Selecting the maximum real root for compressibilty factor of Vapor
                if (ZvrootsRefined) {
                    Zv = Math.max(...ZvrootsRefined)
                }
                else{
                    Zv = 1
                }
                return Zv

            }
            // Evaluating pressure drop for the LTPD sheet
            function evalPressureDrop(flowRateOfSampe, innerDia, densityOfSample, viscosityOfSample, length,roughnessFactor){
                let fluidChannelID=innerDia
                let lengthOfChannel=length
                let flowRate=flowRateOfSampe
                let density	= densityOfSample
                let viscosity = viscosityOfSample
                let roughnessParameter = roughnessFactor
                let velocity	
                let NRe	
                let fanningFrictionFactor	
                let pressureDrop
                let relativeRoughness
                velocity =(flowRate*0.001/60)/((Math.PI/4)*Math.pow((fluidChannelID),2))
                NRe =(density*velocity*(fluidChannelID))/(viscosity*0.001)
                // Checking whether the flow is laminar
                if(NRe < 2100){
                    fanningFrictionFactor = 16/NRe
                    pressureDrop =32*(viscosity*0.001)*velocity*lengthOfChannel/Math.pow((fluidChannelID),   2)
                }
                // When It is turbulent regime
                else{
                    relativeRoughness = roughnessParameter/(fluidChannelID*1000)
                    const A = Math.pow(-2.457*Math.log((Math.pow((7/NRe),0.9)+(0.27*(relativeRoughness)))),16)
                    const B =Math.pow((37530/NRe),16)
                    fanningFrictionFactor = 8*Math.pow((Math.pow((8/NRe),12)+Math.pow((A+B),(-1.5))),(1/12))
                    pressureDrop = fanningFrictionFactor*(lengthOfChannel/(fluidChannelID))*(Math.pow(velocity,2)/2)*density
                }
                // Returning pressure drop in kg/cm2, velocity in m/s, Reynold No, fanning Friction Factor
                return {
                    pressureDrop:(pressureDrop * 0.0000101971621297792),
                    velocity:velocity,
                    reynoldsNo:NRe,
                    fanningFrictionFactor:fanningFrictionFactor
                }
            }
            // Evaluating Viscoity for the liquid vaporization and when the viscosity is not specified
            function evalViscosity(compoDataFullCloud, temperature, phaseOfSample){
                // Declaring  2-Dimensional array
                function create2DArray(numRows, numColumns) {
                    let array = new Array(numRows); 
                    for(let i = 0; i < numColumns; i++) {
                        array[i] = new Array(numColumns); 
                    }
                    return array; 
                }
                // Declaring the variables
                let compoDataFull_cloud= compoDataFullCloud
                let temperature_cloud = temperature + 273.15
                let phase = phaseOfSample
                let avgViscosity
                let viscosityComp = []
                var Q = create2DArray(compoDataFull_cloud.length,compoDataFull_cloud.length)
                // Vapor mixture Viscosity by the method of Stiel and Thodos
                if(phase=="Gas"){
                    // Calculating individual viscosity
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        let  compo = compoDataFull_cloud[i]
                        let Tr = temperature_cloud / compo.tc
                        let N
                        if(Tr <=1.5){
                            N = 0.00034 * Math.pow(Tr, 0.94)
                        }
                        else{
                            N = 0.0001778 * Math.pow((4.58 * Tr - 1.67), 0.625)
                        }
                        viscosityComp[i] = 0.00046 * N * Math.pow(compo.mwt, 0.5) * Math.pow((compo.pc * 1.01325 * Math.pow(10,5)), (2 / 3)) / Math.pow(compo.tc, (1 / 6))
                    }
                    // Evaluating Q values (Perry's Handbook the method of Bromley and Wilke  Calculation)
                    // Populating the 2 dimensional array of Q 
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        let  compoi = compoDataFull_cloud[i]
                        for (let j = 0; j < compoDataFull_cloud.length; j++) {
                            let  compoj = compoDataFull_cloud[j]
                            Q[i][j] = Math.pow(1 + Math.pow(viscosityComp[i] / viscosityComp[j], 0.5) * Math.pow(compoj.mwt / compoi.mwt, 0.25), 2) / ((4/Math.pow(2, 0.5)) * Math.pow((1 + compoi.mwt / compoj.mwt) , 0.5))
                        }
                    }
                    // Evaluating the average vapor mixture viscosity 
                    avgViscosity = 0
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        let  compoi = compoDataFull_cloud[i]
                        let Qsum = 0
                        for (let j = 0; j < compoDataFull_cloud.length; j++) {
                            let  compoj = compoDataFull_cloud[j]
                            if(j != i){
                                Qsum = Qsum + Q[i][j] * (compoj.compoValue / compoi.compoValue)
                            }
                        }
                        avgViscosity +=  (viscosityComp[i] / (1 + Qsum)) // Viscosity is evalyated in cP
                    }
                }
                // Estimating Liquid Viscosity by the method of Letsou and Stiel
                else{
                    // Calculating individual viscosity
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        let  compo = compoDataFull_cloud[i]
                        let Tr = temperature_cloud / compo.tc
                        const viscZero  = 1.5174 * Math.pow(10,-5) - 2.135 * Math.pow(10,-5) * Tr + 7.5 * Math.pow(10,-6) * Math.pow(Tr,2)
                        const viscOne  = 4.2552 * Math.pow(10,-5) - 7.674 * Math.pow(10,-5) * Tr + 3.4 * Math.pow(10,-5) * Math.pow(Tr,2)
                        const visConstant = 2173.424 * (Math.pow(compo.tc,(1/6))/(Math.pow(compo.mwt,(1/2)) * Math.pow((compo.pc * 1.01325 * Math.pow(10,5)),(2/3))))
                        // Calculating component viscosity
                        viscosityComp[i] = (viscZero + compo.acentric * viscOne) /visConstant
                    }
                    // Evaluating the average Liquid mixture viscosity by  Kendall and Monroe
                    avgViscosity = 0
                    for (let i = 0; i < compoDataFull_cloud.length; i++) {
                        let  compo = compoDataFull_cloud[i]
                        avgViscosity +=  compo.compoValue * Math.pow(viscosityComp[i],(1/3))
                    }
                    avgViscosity  = Math.pow(avgViscosity,3) * 1000 // Viscosity is evaluated in cP
                }
                return avgViscosity
            }
            // A term that is required for solving Rachford-Rice Equation 
            function phiSum(x, K, z) {
                let rrSum = 0
                for (let i = 0; i < z.length; i++) {
                    // Rachford–Rice equation  to determine Vapor fraction phi
                    rrSum += (z[i] * (K[i] - 1)) / (1 + (x * (K[i] - 1)))
                }
                return rrSum
            }
            // Brents method to determing phi
            function brentsPhi(K, z, x0, x1, max_iter, tolerance){
                let fx0 = phiSum(x0, K, z)
                let fx1 = phiSum(x1, K, z)
                if ((fx0 * fx1) >= 0) {
                    return //"Root not bracketed"
                }
                if (Math.abs(fx0) < Math.abs(fx1)) {
                    x1 = [x0, x0 = x1][0]
                    fx1 = [fx0, fx0 = fx1][0]
                    // x0, x1 = x1, x0
                    // fx0, fx1 = fx1, fx0
                }
                let x2, fx2
                let newx, d
                let fnew
                x2 = x0
                fx2 = fx0
                // x2, fx2 = x0, fx0
                let mflag = true
                let steps_taken = 0
                while ((steps_taken < max_iter) && (Math.abs(x1 - x0) > tolerance)) {
                    fx0 = phiSum(x0, K, z)
                    fx1 = phiSum(x1, K, z)
                    fx2 = phiSum(x2, K, z)

                    if (fx0 != fx2 && fx1 != fx2) {
                        const L0 = (x0 * fx1 * fx2) / ((fx0 - fx1) * (fx0 - fx2))
                        const L1 = (x1 * fx0 * fx2) / ((fx1 - fx0) * (fx1 - fx2))
                        const L2 = (x2 * fx1 * fx0) / ((fx2 - fx0) * (fx2 - fx1))
                        newx = L0 + L1 + L2
                    } else {
                        newx = x1 - ((fx1 * (x1 - x0)) / (fx1 - fx0))
                    }
                    if (
                        (newx > ((3 * x0 + x1) / 4) && newx < x1) ||
                        (mflag == true && (Math.abs(newx - x1)) >= (Math.abs(x1 - x2) / 2)) ||
                        (mflag == false && (Math.abs(newx - x1)) >= (Math.abs(x2 - d) / 2)) ||
                        (mflag == true && (Math.abs(x1 - x2)) < tolerance) ||
                        (mflag == false && (Math.abs(x2 - d)) < tolerance)
                    ) {
                        newx = (x0 + x1) / 2
                        mflag = true
                    } else {
                        mflag = false
                    }


                    fnew = phiSum(newx, K, z)
                    d = x2
                    x2 = x1
                    // d, x2 = x2, x1

                    if ((fx0 * fnew) < 0) {
                        x1 = newx
                    } else {
                        x0 = newx
                    }

                    if (Math.abs(fx0) < Math.abs(fx1)) {
                        x1 = [x0, x0 = x1][0]
                        // x0, x1 = x1, x0
                    }

                    steps_taken += 1
                }
                // console.log(steps_taken)
                return x1
            }
            //Solving VLE with Wilson Correlation
            function dbSum(T, compoDataFull_cloud, pressure_cloud, context) {
                let K = []
                compoDataFull_cloud.forEach(element => {
                    const kValue = ((element.pc * 1.01325 * Math.pow(10, 5)) / pressure_cloud) * Math.exp(5.37 * (1 + element.acentric) * (1 - element.tc / T))
                    K.push(kValue)
                })
                let dewSum = 0
                let bubbleSum = 0
                for (let i = 0; i < compoDataFull_cloud.length; i++) {
                    let comp = compoDataFull_cloud[i]
                    if (context == "dew") {
                        if(K[i] == 0){
                            dewSum += comp.compoValue / (1e-300)
                        }
                        else{
                            dewSum += comp.compoValue / K[i]
                        }
                    }
                    else{
                        bubbleSum += comp.compoValue * K[i]
                    }
                }
                if (context == "dew") {
                    dewSum -= 1
                    return dewSum
                }
                else{
                    bubbleSum -= 1
                    return bubbleSum
                }
            }
            //Solving VLE with PR / SRK  
            function dbSumCorrect(T, compoDataFull_cloud, pressure_cloud, context, solver) {
                // Declaring variables
                let K = []
                // let F = [] //Fugacity Ratio
                let acentric = []
                let Zv // Vapor Comp.Factor
                let Zl // Liquid Comp.Factor
                let x = []
                let y = []
                let z = []
                let unorderedK = [] // to compare the old unsorted K value
                let Pr = []
                let Tr = []
                let max_iter = 50
                let tolerance = 1e-5
                let fugCoeffVapor = []
                let fugCoeffLiquid = []
                let Ap = [] // Indiviudal term for each component - as array
                let Bp = [] // Indiviudal term for each component - as array
                let Av // Final value for a mixture - vapor
                let Bv // Final value for a mixture - vapor
                let Al // Final value for a mixture - liquid
                let Bl // Final value for a mixture - liquid

                // Specific terms used for Peng Robinson equation
                let AprSumVapor
                let AprSumLiquid
                let AprV = []
                let AprL = []
                let phiSelect // Calculated Vapor Fraction
                let m = [] // Factor which is a function of acentric factor, m = 0.48 +1.574ω – 0.176ω2
                let alpha = [] // Factor which is a function of m
                let compoCorrectionIndexes = []
                let compoDataFull_cloud_Ordered = [] //stores the compo data in the descending order of K

                // let a
                // let b 
                let xValue
                let AbSumVapor = 0
                let BbSumVapor = 0
                let AbSumLiquid = 0
                let BbSumLiquid = 0
                let ZvRoots = []
                let ZlRoots = []
                let ZvrootsRefined = []
                let ZlrootsRefined = []
                let dewSum = 0
                let bubbleSum = 0
                // Eliminiating component with zero compoValue
                compoDataFull_cloud = compoDataFull_cloud.filter((el) => {
                    return el.compoValue > 0
                })
                // Estimating intial estimates for equilibrium constants
                compoDataFull_cloud.forEach(element => {
                    const kValue = ((element.pc * 1.01325 *  Math.pow(10, 5)) / pressure_cloud) * Math.exp(5.37 * (1 + element.acentric) * (1 - element.tc / T))
                    K.push(kValue)
                })
                // Generating unordered array of K for storing
                K.forEach(element => {
                    unorderedK.push(element)
                })
                // Ordering K in the descending order
                K.sort(function (a, b) {
                    return b - a
                })
                // Generating indexes of array of unordered K
                K.forEach(el => {
                    compoCorrectionIndexes.push(unorderedK.indexOf(el))
                })
                // Generating ordered Compo data with K values in the descending order
                for (let i = 0; i < compoDataFull_cloud.length; i++) {
                    let comp = compoDataFull_cloud[i]
                    compoDataFull_cloud_Ordered[compoCorrectionIndexes[i]] = comp
                }
                // Populating arrays of z, acentric factor, Reduced Temperature(Tr), Redued Pressure(Pr)
                for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
                    let comp = compoDataFull_cloud_Ordered[i]
                    acentric[i] = comp.acentric
                    z[i] = comp.compoValue
                    Tr[i] = T / comp.tc
                    Pr[i] = pressure_cloud / (comp.pc * Math.pow(10, 5))
                }
                if ((phiSum(0, K, z) > 0 && phiSum(1, K, z)) < 0) {
                    phiSelect = brentsPhi(K, z, 0, 1, max_iter, tolerance)
                    
                } 
                else if(phiSum(0, K, z) <0){
                    phiSelect = 0
                }
                else if(phiSum(1, K, z) >0){
                    phiSelect = 1
                }
                else {
                    phiSelect = 0.5
                }
                // Evaluating SRK Equation Parameters 
                if(solver == "SRK"){
                    for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
                        // Evaluating x and y for liquid and vapor from z based on vapor fraction
                        xValue = z[i] / (1 + phiSelect * (K[i] - 1))
                        x[i] = xValue
                        y[i] = x[i] * K[i]
                        m[i] = 0.48 + 1.574 * acentric[i] - 0.176 * Math.pow(acentric[i], 2)
                        alpha[i] = Math.pow((1 + m[i] * (1 - Math.sqrt(Tr[i]))), 2)
                        Ap[i] = 0.42747 * alpha[i] * Pr[i] / (Math.pow(Tr[i], 2))
                        Bp[i] = 0.08664 * Pr[i] / Tr[i]
                    }
                    for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {

                        for (let l = 0; l < compoDataFull_cloud_Ordered.length; l++) {
                            AbSumVapor += Math.sqrt(Ap[i] * Ap[l]) * y[i] * y[l]
                            AbSumLiquid += Math.sqrt(Ap[i] * Ap[l]) * x[i] * x[l]
                        }
                        BbSumVapor += y[i] * Bp[i]
                        BbSumLiquid += x[i] * Bp[i]
                    }
                }  
                // Evaluating Peng Robinson Equation Parameters
                else{
                    for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
                    // Evaluating x and y for liquid and vapor from z based on vapor fraction
                        xValue = z[i] / (1 + phiSelect * (K[i] - 1))
                        x[i] = xValue
                        y[i] = x[i] * K[i]
                        if(acentric[i] <= 0.491){
                            m[i] = 0.37464 + 1.54226 * acentric[i] - 0.26992 * Math.pow(acentric[i],2)
                        }
                        else{
                            m[i] = 0.379642 + 1.48503 * acentric[i] - 0.164423 * Math.pow(acentric[i],2) + 0.016666 * Math.pow(acentric[i],3)
                        }
                        alpha[i] = Math.pow((1 + m[i] * (1 - Math.sqrt(Tr[i]))), 2)
                        Ap[i] = 0.45724 * alpha[i] * Pr[i] / (Math.pow(Tr[i], 2))
                        Bp[i] = 0.07780 * Pr[i] / Tr[i]
                    }
                    for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {

                        for (let j = 0; j < compoDataFull_cloud_Ordered.length; j++) {

                            AbSumVapor += Math.sqrt(Ap[i] * Ap[j]) * y[i] * y[j]
                            AbSumLiquid += Math.sqrt(Ap[i] * Ap[j]) * x[i] * x[j]
                        }
                        BbSumVapor += y[i] * Bp[i]
                        BbSumLiquid += x[i] * Bp[i]
                    }
                }
                Av = AbSumVapor
                Bv = BbSumVapor
                Al = AbSumLiquid
                Bl = BbSumLiquid
                // Solving cubic equation for compressibility factor - vapor  - SRK
                if(solver == "SRK"){
                    ZvRoots = cubicSolve(1, -1, (Av - Bv - Math.pow(Bv, 2)), -1 * (Av * Bv))
                    ZlRoots = cubicSolve(1, -1, (Al - Bl - Math.pow(Bl, 2)), -1 * (Al * Bl))
                }
                // Solving cubic equation for compressibility factor - vapor  - Peng Robinson
                else{
                    ZvRoots = cubicSolve(1, -1 * (1-Bv), (Av - 3 * Math.pow(Bv,2) - 2*Bv), -1 * ((Av * Bv) -Math.pow(Bv,2)-Math.pow(Bv,3)))
                    ZlRoots = cubicSolve(1, -1 * (1-Bl), (Al - 3 * Math.pow(Bl,2) - 2*Bl), -1 * ((Al * Bl) -Math.pow(Bl,2)-Math.pow(Bl,3)))
                }
                ZvrootsRefined = []
                ZlrootsRefined = []
                // Eliminating Complex roots of the cubic equation for Vapor
                ZvRoots.forEach(el => {

                    if (!isNaN(el)) {
                        if (el > 0) {
                            ZvrootsRefined.push(el)
                        }
                    }
                })
                // Eliminating Complex roots of the cubic equation for Liquid
                ZlRoots.forEach(el => {

                    if (!isNaN(el)) {
                        if (el > 0) {
                            ZlrootsRefined.push(el)
                        }
                    }
                })
                // Selecting the maximum real root for compressibilty factor of Vapor
                if (ZvrootsRefined) {
                    Zv = Math.max(...ZvrootsRefined)
                }
                // Selecting the minimum real root for compressibilty factor of Liquid
                if (ZlrootsRefined) {
                    Zl = Math.min(...ZlrootsRefined)
                }
                // Correcting K by phi-phi method SRK
                if(solver == "SRK"){
                    
                    for (let i = 0; i < z.length; i++) {

                        const fVapor = Math.exp((Zv - 1) * (Bp[i] / Bv) - Math.log(Zv - Bv) - (Av / Bv) * (2 * Math.sqrt(Ap[i] / Av) - (Bp[i] / Bv)) * Math.log((Zv + Bv) / Zv))
                        const fLiquid = Math.exp((Zl - 1) * (Bp[i] / Bl) - Math.log(Zl - Bl) - (Al / Bl) * (2 * Math.sqrt(Ap[i] / Al) - (Bp[i] / Bl)) * Math.log((Zl + Bl) / Zl))

                        if (isNaN(fVapor)) {
                            fugCoeffVapor[i] = 1
                        } else {
                            fugCoeffVapor[i] = fVapor
                        }

                        if (isNaN(fLiquid)) {
                            fugCoeffLiquid[i] = 1
                        } else {
                            fugCoeffLiquid[i] = fLiquid
                        }

                        // Evaluating corrected equilibrium constant K = øl/øv
                        K[i] = (fugCoeffLiquid[i] / fugCoeffVapor[i])
                        // F[i] = ((fugCoeffLiquid[i] / fugCoeffVapor[i]))
                    }
                }
                // Correcting K by phi-phi method Peng Robinson
                else{
                    for (let i = 0; i < z.length; i++) {
                    
                        AprSumVapor = 0
                        AprSumLiquid = 0
                        for (let j = 0; j < z.length; j++) {
                            AprSumVapor += Math.sqrt(Ap[i] * Ap[j]) *  y[j]
                            AprSumLiquid += Math.sqrt(Ap[i] * Ap[j]) * x[j]
                        }

                        AprV[i] = AprSumVapor
                        AprL[i] = AprSumLiquid

                        const fVapor = Math.exp((Zv - 1) * (Bp[i] / Bv) - Math.log(Zv - Bv) - (Av / (2 * (Math.sqrt(2)*Bv))) * ((2*AprV[i] / Av) - (Bp[i] / Bv)) * Math.log((Zv +(1+Math.sqrt(2))* Bv) / (Zv +(1-Math.sqrt(2))* Bv)))
                        const fLiquid = Math.exp((Zl - 1) * (Bp[i] / Bl) - Math.log(Zl - Bl) - (Al / (2 * (Math.sqrt(2)*Bl))) * ((2*AprL[i] / Al) - (Bp[i] / Bl)) * Math.log((Zl +(1+Math.sqrt(2))* Bl) / (Zl +(1-Math.sqrt(2))* Bl)))

                        // const fVapor = Math.exp(((Bv/(Zv - Bv)) - ((Av * Zv)/(Math.pow(Zv,2)+(2*Bv*Zv)-Math.pow(Bv,2)))) * (Bp[i] / Bv) - Math.log(Zv - Bv) - (Av / (2 * (Math.sqrt(2)*Bv))) * ((2*AprV[i] / Av) - (Bp[i] / Bv)) * Math.log((Zv +(1+Math.sqrt(2))* Bv) / (Zv +(1-Math.sqrt(2))* Bv)))
                        // const fLiquid = Math.exp(((Bl/(Zl - Bl)) - ((Al * Zl)/(Math.pow(Zl,2)+(2*Bl*Zl)-Math.pow(Bl,2)))) * (Bp[i] / Bl) - Math.log(Zl - Bl) - (Al / (2 * (Math.sqrt(2)*Bl))) * ((2*AprL[i] / Al) - (Bp[i] / Bl)) * Math.log((Zl +(1+Math.sqrt(2))* Bl) / (Zl +(1-Math.sqrt(2))* Bl)))

                        if (isNaN(fVapor)) {
                            fugCoeffVapor[i] = 1
                        } else {
                            fugCoeffVapor[i] = fVapor
                        }

                        if (isNaN(fLiquid)) {
                            fugCoeffLiquid[i] = 1
                        } else {
                            fugCoeffLiquid[i] = fLiquid
                        }
                        // Evaluating corrected equilibrium constant K = øl/øv
                        K[i] = (fugCoeffLiquid[i] / fugCoeffVapor[i])
                        // F[i] = ((fugCoeffLiquid[i] / fugCoeffVapor[i]))
                    }
                }
                // Calculating dewSum and BubbleSum after correcting K
                for (let i = 0; i < compoDataFull_cloud_Ordered.length; i++) {
                    // let comp = compoDataFull_cloud_Ordered[i]
                    if (context == "dew") {
                        dewSum += z[i] / K[i]
                    } else {
                        bubbleSum += z[i] * K[i]
                    }
                }
                // Returning the result based on context
                if (context == "dew") {
                    dewSum -= 1
                    return dewSum
                } else {
                    bubbleSum -= 1
                    return bubbleSum
                }
            }
            // Brents method to estimate dew point and bubble point
            function brentsDewBubble(dbSum, x0, x1, max_iter, tolerance, compoDataFull_cloud, pressure_cloud, context, solver) {
                let fx0 = dbSum(x0,compoDataFull_cloud, pressure_cloud, context, solver)
                let fx1 = dbSum(x1,compoDataFull_cloud, pressure_cloud, context, solver)
                if((fx0 * fx1) >= 0){
                    return //"Root not bracketed"
                }
                if (Math.abs(fx0) < Math.abs(fx1)){
                    x1 = [x0, x0 = x1 ][0]
                    fx1 = [fx0, fx0 = fx1][0]
                    // x0, x1 = x1, x0
                    // fx0, fx1 = fx1, fx0
                }
                let x2, fx2
                let newx, d
                let fnew 
                x2 = x0
                fx2 = fx0
                // x2, fx2 = x0, fx0
                let mflag = true
                let steps_taken = 0
                while ((steps_taken < max_iter ) && (Math.abs(x1 - x0) > tolerance)){
                    fx0 = dbSum(x0,compoDataFull_cloud, pressure_cloud, context, solver)
                    fx1 = dbSum(x1,compoDataFull_cloud, pressure_cloud, context, solver)
                    fx2 = dbSum(x2,compoDataFull_cloud, pressure_cloud, context, solver)
                    if(fx0 != fx2 && fx1 != fx2){
                        const L0 = (x0 * fx1 * fx2) / ((fx0 - fx1) * (fx0 - fx2))
                        const L1 = (x1 * fx0 * fx2) / ((fx1 - fx0) * (fx1 - fx2))
                        const L2 = (x2 * fx1 * fx0) / ((fx2 - fx0) * (fx2 - fx1))
                        newx = L0 + L1 + L2
                    }
                    else{
                        newx = x1 - ((fx1 * (x1 - x0)) / (fx1 - fx0))
                    }
                    if (
                        (newx > ((3 * x0 + x1) / 4) && newx < x1) || 
                        (mflag == true &&(Math.abs(newx - x1)) >= (Math.abs(x1 - x2) / 2)) || 
                        (mflag == false && (Math.abs(newx - x1)) >= (Math.abs(x2 - d) / 2)) ||
                        (mflag == true && (Math.abs(x1 - x2)) < tolerance) ||
                        (mflag == false && (Math.abs(x2 - d)) < tolerance)
                        )
                    {
                        newx = (x0 + x1) / 2
                        mflag = true
                    }
                    else{
                        mflag = false
                    }
                    fnew = dbSum(newx,compoDataFull_cloud, pressure_cloud, context, solver)
                    d = x2
                    x2 = x1
                    // d, x2 = x2, x1

                    if((fx0 * fnew) < 0){
                        x1 = newx
                    }
                    else{
                        x0 = newx
                    }
                    if(Math.abs(fx0) < Math.abs(fx1)){
                        x1 = [x0, x0 = x1][0]
                        // x0, x1 = x1, x0
                    }
                    steps_taken += 1
                }
                // console.log(steps_taken)
                return x1
            }
            // The main function that initiates the evaluation of dew and bubble points
            function evalDewBubble(pressure_cloud, compoDataFull_cloud, NO2DewValid, HClDewValid, SO3DewValid, SO2DewValid, solver) {
                // Declaring the variables
                let dewEstimate
                let bubbleEstimate
                let dewPoint
                let bubblePoint
                let epsilon = 1e-5//Tolerance in finding roots
                let max_iter = 50
                let dpbpMargin = 100
                // Initializing , pressure and fraction for Dew Bubble 
                // Converting Pressure from Kg/cm2 g to Pa
                pressure_cloud = (( pressure_cloud / 1.033) + 1 ) * 1.01325 * Math.pow(10,5)
                // Calculating initial estimate for dew point and buble point using Wilson Correlation
                dewEstimate = brentsDewBubble(dbSum, 0.1, 600, max_iter, epsilon,compoDataFull_cloud, pressure_cloud, "dew", solver)
                bubbleEstimate = brentsDewBubble(dbSum, 0.1, 600, max_iter, epsilon,compoDataFull_cloud, pressure_cloud, "bubble", solver)
                // Checkin the Thermodynamic model selected and deciding the results
                // when Wilson Correlation is selected
                if(solver === "Wilson Correlation"){
                    dewPoint = dewEstimate
                    bubblePoint = bubbleEstimate   
                }
                // When PR or SRK is selected
                else{
                    dewPoint = brentsDewBubble(dbSumCorrect, bubbleEstimate-dpbpMargin, dewEstimate+dpbpMargin, max_iter, epsilon,compoDataFull_cloud, pressure_cloud, "dew", solver)
                    bubblePoint = brentsDewBubble(dbSumCorrect, bubbleEstimate-dpbpMargin, dewEstimate+dpbpMargin, max_iter, epsilon,compoDataFull_cloud, pressure_cloud, "bubble", solver)
                }
                // console.log(diffDewUnsigned,diffBubbleUnsigned)
                // Evaluating Acid Dew point
                var SO2DewPoint
                var SO3DewPoint
                var HClDewPoint
                var NO2DewPoint
                //  Checking and Calculating acid dew point
                //.....Checking SO2 Dew point
                if(SO2DewValid){

                    const SO2PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'sulfur dioxide')).compoValue * pressure_cloud * 0.00750062
                    const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

                    SO2DewPoint = 1000 / (3.9526 - 0.1863 * Math.log(WaterPartialPressure) + 0.000867 * Math.log(SO2PartialPressure) + 0.000913 * Math.log(WaterPartialPressure) * Math.log(SO2PartialPressure)) - 273.15

                }
                else{
                    SO2DewPoint = ""
                }
                //.....Checking SO3 Dew point
                if (SO3DewValid || SO2DewValid) {
                    let SO3PartialPressure
                    if(SO3DewValid){
                        SO3PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'sulfur trioxide')).compoValue * pressure_cloud * 0.00750062
                    }
                    else{
                        SO3PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'sulfur dioxide')).compoValue * pressure_cloud * 0.00750062 * 0.05
                    }
                    const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

                    SO3DewPoint = 1000 / (2.276 - 0.02943 * Math.log(WaterPartialPressure) - 0.0858 * Math.log(SO3PartialPressure) + 0.0062 * Math.log(WaterPartialPressure) * Math.log(SO3PartialPressure)) - 273.15

                } else {
                    SO3DewPoint = ""
                }
                //.....Checking HCl Dew point
                if (HClDewValid) {

                    const HClPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'hydrogen chloride')).compoValue * pressure_cloud * 0.00750062
                    const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

                    HClDewPoint = 1000 / (3.7368 - 0.1591 * Math.log(WaterPartialPressure) - 0.0326 * Math.log(HClPartialPressure) + 0.00269 * Math.log(WaterPartialPressure) * Math.log(HClPartialPressure)) - 273.15
                } else {
                    HClDewPoint = ""
                }
                //.....Checking NO2 Dew point
                if (NO2DewValid) {

                    const NO2PartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'nitrogen dioxide')).compoValue * pressure_cloud * 0.00750062
                    const WaterPartialPressure = (compoDataFull_cloud.find(compo => compo.Name === 'water')).compoValue * pressure_cloud * 0.00750062

                    NO2DewPoint = 1000 / (3.664 - 0.1446 * Math.log(WaterPartialPressure) - 0.0827 * Math.log(NO2PartialPressure) + 0.00756 * Math.log(WaterPartialPressure) * Math.log(NO2PartialPressure)) - 273.15
                } else {
                    NO2DewPoint = ""
                }
                
                bubblePoint =  (bubblePoint - 273.15)
                dewPoint = (dewPoint - 273.15)
                dewPoint = Math.max(dewPoint, SO2DewPoint, SO3DewPoint, HClDewPoint, NO2DewPoint).toFixed(2)

                return {
                    dew:dewPoint, 
                    bubble:bubblePoint
                }
            }
            // Evaluating Molecular weight of the fluid mixture
            function evalMolecularWeight(compoDataFull_cloud){
                let mwt = 0
                compoDataFull_cloud.forEach(compo => {
                    mwt += compo.mwt *compo.compoValue
                })
                return mwt
            }
            // Evaluating Density of the fluid mixture
            function evalDensity(pressure, temperature, thermodynamicModel, compoDataFull,mWeight){
                let compFactor = evalCompFactor(temperature, compoDataFull, pressure, thermodynamicModel)
                pressure = pressure/1.033 + 1
                let density  = pressure * mWeight /(compFactor * 0.0821 * (temperature +273.15))
                return density
            }
            // Checking the wake frequency calculation
            function evalProbeVibration(probeMaterial, probeID, probeOD, extentOfInsertion, nozzleLength, valveLength, processLineSize,processLineSizeType, processLineThickness, sampleDensity, velocity, samplePhase){
                let probeDensity
                let yieldStrength
                let modulusOfElasticity
                const probeMaterialRef = db.collection("appData").doc("probeMaterialDataBase").collection("ProbeMaterialData").doc(probeMaterial)
                return probeMaterialRef.get().then((doc)=>{
                    probeDensity = doc.data().density
                    yieldStrength = doc.data().yieldStrength
                    modulusOfElasticity = doc.data().modulusOfElasticity
                    }) // Starting the main calculation of probe vibration
                    .then(()=>{
                        let shieldLength
                        let insertionLength
                        let unsupportedLength
                        let actualProbeLength
                        let strouhalNumber
                        let fluidMassFactor
                        let maxAllowedProbeLength
                        let bendingStressFromFlow
                        let bendingStressFromWeight
                        let zFactor
                        let wFactor
                        let wFFactor
                        let zFFactor   
                        // Converting length to inch units
                        probeID = probeID * 1000/25.4
                        probeOD = probeOD * 1000/25.4
                        nozzleLength = nozzleLength * 1000/25.4
                        valveLength = valveLength * 1000/25.4
                        // Converting velocity to ft/s unit
                        velocity = velocity * 3.28
                        // Converting density to lb/ft3
                        sampleDensity = sampleDensity * 0.062428
                        // Calculating the Insertion Lnegth of probe Pipe/Tube into the Process Line
                        // Inner Dia of Process Line Specified
                        if(processLineSizeType == "Process Line size, Inner Diameter"){
                            if(extentOfInsertion =="One Third Insertion,(1/3)"){
                                insertionLength = ((processLineSize + 2* processLineThickness)/3) * 1000/25.4
                            }
                            else{
                                insertionLength = ((processLineSize + 2* processLineThickness)/2) * 1000/25.4
                            }
                        }
                        // Outer Dia of Process Line Specified
                        else{
                            if(extentOfInsertion =="One Third Insertion,(1/3)"){
                                insertionLength = (processLineSize/3) * 1000/25.4
                            }
                            else{
                                insertionLength = (processLineSize/2) * 1000/25.4
                            }
                        }
                        shieldLength = nozzleLength + valveLength
                        unsupportedLength = shieldLength + insertionLength
                        actualProbeLength = unsupportedLength
                        if(samplePhase == "Vapor"){
                            fluidMassFactor = 0.9
                        }
                        else{
                            fluidMassFactor = 1.0
                        }
                        //S = Strouhal number, constant, S = 0.4 Worst case, S = 0.2 best case
                        strouhalNumber = 0.2
                        maxAllowedProbeLength = Math.sqrt(0.9 * 0.23 * (fluidMassFactor*probeOD/(strouhalNumber*velocity))*Math.sqrt((modulusOfElasticity/probeDensity)*(Math.pow(probeOD,2)+Math.pow(probeID,2))))
                        // Calculating bendingStressFromWeight
                        zFactor = 0.78 *(Math.pow(probeOD/2,4)- Math.pow(probeID/2,4))/(probeOD/2)
                        wFactor = (0.785*(Math.pow(probeOD,2)-Math.pow(probeID,2))*unsupportedLength*probeDensity*32.174049)/unsupportedLength
                        bendingStressFromWeight = wFactor*unsupportedLength^2/(2*zFactor)
                        wFFactor =(0.785*(probeID^2)*insertionLength*sampleDensity*32.174049)/insertionLength
                        zFFactor = 0.78*Math.pow(probeID,3)
                        bendingStressFromFlow = wFFactor*Math.pow(insertionLength,2)/(2*zFFactor)

                        return {
                            probeDensity:probeDensity,
                            yieldStrength:yieldStrength,
                            modulusOfElasticity:modulusOfElasticity,
                            shieldLength:shieldLength,
                            insertionLength:insertionLength,
                            unsupportedLength:unsupportedLength,
                            actualProbeLength:actualProbeLength,
                            strouhalNumber:strouhalNumber,
                            fluidMassFactor:fluidMassFactor,
                            maxAllowedProbeLength:maxAllowedProbeLength,
                            bendingStressFromFlow:bendingStressFromFlow,
                            bendingStressFromWeight:bendingStressFromWeight,
                        }
                    })
            }   
            // Rounding up to next multiple of 10 for the dew point
            function round10(x){
                if(((x/10) - Math.floor(x/10)) > 0.4){
                    return Math.ceil(x/10)*10
                }
                else{
                    return Math.floor(x/10)*10
                } 
            }
            // Rounding down by 5 for bubble point 
            function round5(x){
                return Math.floor(x/5)*5
            }