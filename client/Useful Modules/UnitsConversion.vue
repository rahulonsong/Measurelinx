<template>

    <div>
        <h2 class="ma-4">This is the resources page</h2>
    </div>   

</template>

<script>
export default {


    data(){
        return {

            pressureUnits: 
                ["Kg/cm2 g",
                "bar g",
                "psi g",
                "mm WC",
                "Kg/cm2 a",
                "bar a",
                "psi a",
                "atm"
            ],

            volFlowRateUnitsMatrix:[
                {unit:"liter/sec",value:60},
                {unit:"liter/min",value:1},
                {unit:"cc/min",value:0.001},
                {unit:"liter/h",value:0.0167},
                {unit:"m3/s",value:60000},
                {unit:"m3/min",value:1000},
                {unit:"m3/h",value:16.67},
                {unit:"US gpm",value:3.785},
                {unit:"cfm",value:28.32},
                {unit:"Imp gpm",value:4.55}
            ],

            volUnitsMatrix:[
                {unit:"liter",value:1},
                {unit:"cm3",value:0.001},
                {unit:"cubic foot",value:28.316846592},
                {unit:"cubic inch",value:0.016387064},
                {unit:"cubic meter",value:1000},
                {unit:"gallon(US)",value:3.785411784},
                {unit:"gallon(UK)",value:4.54609}
            ],
            
            densityUnitsMatrix:[
                {unit:"Kg/m3",value:1},
                {unit:"g/l",value:1},
                {unit:"g/cm3",value:0.001},
                {unit:"lb/ft3",value:0.06242797},
                {unit:"lb/gal(UK)",value:0.010022409999},
                {unit:"lb/ga(US)",value:0.008345406},
                {unit:"lb/in3",value:0.0000361273}
            ],

            timeUnitsMatrix:[
                {unit:"s",value:0.0166666666666667},
                {unit:"min",value:1},
                {unit:"hour",value:60}
            ],

            viscosityUnitsMatrix:[
                {unit:"cP",value:1},
                {unit:"P",value:100},
                {unit:"Pl",value:1000},
                {unit:"kg m-1 s-1",value:1000},
                {unit:"Pa s (N s m-2)",value:1000},
                {unit:"kgf s m-2",value:9806.65204821735},
                {unit:"lbf s ft-2",value:47880.2686849157},
                {unit:"lbf h ft-2",value:172369006.880454},
                {unit:"lb ft-1 s-1",value:1488.15990218623},
                {unit:"lb ft-1 h-1",value:0.413378926273042}
            ], 
            
            velocityUnitsMatrix:[
                {unit:"m/s",value:1},
                {unit:"ft/s",value:0.305},
                {unit:"ft/min",value:0.00508},
                {unit:"yards/min",value:0.0152},
                {unit:"mph",value:0.45},
                {unit:"knots",value:0.51},
                {unit:"km/h",value:0.278}
            ],

            lengthUnitsMatrix:[
                {unit:"mm",value:0.001},
                {unit:"cm",value:0.01},
                {unit:"inch",value:0.0254},
                {unit:"ft",value:0.3048},
                {unit:"m",value:1},
            ]

        }
    },

    computed: {
        
    // Converting to kg/cm2 g
        pressureCorrected() {

                    let correctedPressure
                    

                    switch (this.pressureUnitselect) {

                        case "Kg/cm2 g":

                            correctedPressure = parseFloat(this.pressure)
                            break

                        case "bar g":

                            correctedPressure = parseFloat(this.pressure) * 1.0197162129779
                            break

                        case "psi g":
                            correctedPressure = parseFloat(this.pressure) * 0.070306957829636
                            break

                        case "mm WC":
                            correctedPressure = parseFloat(this.pressure) * 0.0001
                            break

                        case "Kg/cm2 a":
                            correctedPressure = parseFloat(this.pressure) - 1.0332275547715
                            break

                        case "bar a":
                            correctedPressure = parseFloat(this.pressure) * 1.0197162129779 - 1.0332275547715
                            break

                        case "psi a":
                            correctedPressure = parseFloat(this.pressure) * 0.070306957829636 - 1.0332275547715
                            break

                        case "atm":
                            correctedPressure = parseFloat(this.pressure) * 1.0332275547715 - 1.0332275547715
                            break

                    }
                    return correctedPressure
        },

    // Converting to liter/min
        volFlowRateCorrected() {

            let correctedVolFlowRate
            correctedVolFlowRate = parseFloat(this.volFlowRate) * (this.volFlowRateUnitsMatrix.find((el)=>{
                return (el.unit === this.volFlowRateUnitSelect)
            })).value

            return correctedVolFlowRate
        },

    // Converting to liter
        volCorrected() {

            let correctedVol

            correctedVol = parseFloat(this.vol) * (this.volUnitsMatrix.find((el)=>{
                return (el.unit === this.volUnitSelect)
            })).value

            // switch (this.VolUnitSelect) {

                //     case "liter":

                //         correctedVol = parseFloat(this.vol) * 1
                //         break

                //     case "cm3":

                //         correctedVol = parseFloat(this.vol) * 0.001
                //         break

                //     case "cubic foot":
                //         correctedVol = parseFloat(this.vol) * 28.31684659
                //         break

                //     case "cubic inch":
                //         correctedVol = parseFloat(this.vol) * 0.016387064
                //         break

                //     case "cubic meter":
                //         correctedVol = parseFloat(this.vol) * 1000
                //         break

                //     case "gallon(US)":
                //         correctedVol = parseFloat(this.vol) * 3.785411784
                //         break

                //     case "gallon(UK)":
                //         correctedVol = parseFloat(this.vol) * 4.54609
                //         break

            // }
            return correctedVol
        },

    // Converting to kg/m3
        densityCorrected() {

            let correctedDensity

            correctedDensity = parseFloat(this.density) * (this.densityUnitsMatrix.find((el)=>{
                return (el.unit === this.densityUnitSelect)
            })).value

            return correctedDensity
        },

    // Converting to min
        timeCorrected() {

            let correctedTime

            correctedTime = parseFloat(this.time) * (this.timeUnitsMatrix.find((el)=>{
                return (el.unit === this.timeUnitSelect)
            })).value

            // switch (this.timeUnitSelect) {

                //     case "Kg/m3":

                //         correctedTime = parseFloat(this.time) * 1
                //         break

                //     case "g/l":

                //         correctedTime = parseFloat(this.time) * 1
                //         break

                //     case "g/cm3":
                //         correctedTime = parseFloat(this.time) * 1000
            //         break

            return correctedTime
        },

    // Converting to cP
        viscosityCorrected() {

            let correctedViscosity

            correctedViscosity = parseFloat(this.viscosity) * (this.viscosityUnitsMatrix.find((el)=>{
                return (el.unit === this.viscosityUnitSelect)
            })).value

            // switch (this.densityUnitSelect) {

                    //     case "cP":

                    //         correctedDensity = parseFloat(this.density) * 1
                    //         break

                    //     case "P":

                    //         correctedDensity = parseFloat(this.density) * 100
                    //         break

                    //     case "Pl":
                    //         correctedDensity = parseFloat(this.density) * 1000
                    //         break

                    //     case "kg m-1 s-1":
                    //         correctedDensity = parseFloat(this.density) * 1000
                    //         break

                    //     case "Pa s (N s m-2)":
                    //         correctedDensity = parseFloat(this.density) * 1000
                    //         break

                    //     case "kgf s m-2":
                    //         correctedDensity = parseFloat(this.density) * 9806.652048
                    //         break

                    //     case "lbf s ft-2":
                    //         correctedDensity = parseFloat(this.density) * 47880.26868
                    //         break

                    //     case "lbf h ft-2":
                    //         correctedDensity = parseFloat(this.density) * 172369006.9
                    //         break

                    //     case "lb ft-1 s-1":
                    //         correctedDensity = parseFloat(this.density) * 1488.159902
                    //         break

                    //     case "lb ft-1 h-1":
                    //         correctedDensity = parseFloat(this.density) * 0.413378926
                    //         break

            // }
            return correctedViscosity
        },

        // Converting to m
        lengthCorrected() {

            let correctedLength

            correctedLength = parseFloat(this.length) * (this.lengthUnitsMatrix.find((el)=>{
                return (el.unit === this.lengthUnitSelect)
            })).value

            return correctedLength
        },

        viscosityUnits(){
            let unitsArray = []
            this.viscosityUnitsMatrix.forEach(element => {

                unitsArray.push(element.unit)
                
            })
            return unitsArray
        },
        
        velocityUnits(){
            let unitsArray = []
            this.velocityUnitsMatrix.forEach(element => {

                unitsArray.push(element.unit)
                
            })
            return unitsArray
        },

        timeUnits(){
            let unitsArray = []
            this.timeUnitsMatrix.forEach(element => {

                unitsArray.push(element.unit)
                
            })
            return unitsArray
        },

        densityUnits(){
            let unitsArray = []
            this.densityUnitsMatrix.forEach(element => {

                unitsArray.push(element.unit)
                
            })
            return unitsArray
        },

        volUnits(){
            let unitsArray = []
            this.volUnitsMatrix.forEach(element => {

                unitsArray.push(element.unit)
                
            })
            return unitsArray
        },

        volFlowRateUits(){
            let unitsArray = []
            this.volFlowRateUnitsMatrix.forEach(element => {

                unitsArray.push(element.unit)
                
            })
            return unitsArray

        },

        lengthUits(){
            let unitsArray = []
            this.lengthUnitsMatrix.forEach(element => {

                unitsArray.push(element.unit)
                
            })
            return unitsArray

        },


    },

    methods: {

        convertVolFlowRateUnit(volFlowRateResult, volFlowRateUnit) {

            let convertedVolFlowRate

            convertedVolFlowRate = parseFloat(volFlowRateResult)/(this.volFlowRateUnitsMatrix.find((el)=>{
                return (el.unit === volFlowRateUnit)
            })).value

            // switch (volFlowRateUnit) {

                //     case "liter/sec":

                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 0.016666667
                //         break

                //     case "liter/min":

                //         convertedVolFlowRate = parseFloat(volFlowRateResult) 
                //         break

                //     case "cc/min":
                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 1000
                //         break

                //     case "liter/h":
                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 59.88023952
                //         break

                //     case "m3/s":
                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 1.66667E-05
                //         break

                //     case "m3/min":
                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 0.001
                //         break

                //     case "m3/h":
                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 0.059988002
                //         break

                //     case "US gpm":
                //         correctedVolFlowRate = parseFloat(volFlowRateResult) * 0.264200793
                //         break

                //     case "Imp gpm":
                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 0.21978022
                //         break

                //     case "cfm":
                //         convertedVolFlowRate = parseFloat(volFlowRateResult) * 0.035310734
                //         break


            // }
            return convertedVolFlowRate
        },
        
    },
    
}
</script>


    