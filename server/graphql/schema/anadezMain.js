const { gql } = require("apollo-server-express");

const anadezMainTypeDefs = gql`
  type AnadezMain {
    pumpDifferentialPressure: Float
    isPrimaryPRRecommended: Boolean
    primaryPRAzRecommended: Float
    isPumpAz: Boolean
    manualPSHS: Boolean
    isTappingToPrimaryHT: Boolean
    isTappingToPrimaryCooler: Boolean
    isPrimaryOrTappingToSecondaryHT: Boolean
    isPrimaryOrTappingToSecondaryCooler: Boolean
    isPSHSCabinetHeater: Boolean
    isSSHSCabinetHeater: Boolean
    isSSHSCabinetCooler: Boolean
    isAnalyzerCabinetCooler: Boolean
    isAnalyzerCabinetHeater: Boolean
    analyzerCabinetCoolerSetTemp: Float
    analyzerCabinetHeaterSetTemp: Float
    PSHSCabinetHeaterSetTemp: Float
    mWeight: Float
    phaseEnvelopeData: PhaseEnvelopeData
    densityCalcAzTapping: Float
    dewPointAzTapping: Float
    bubblePointAzTapping: Float
    viscosityAzTapping: Float
    isProbeDesignOkay: Boolean!
    ltpdParameters: LtpdParameters
    wfcParameters: WfcParameters
  }

  type PhaseEnvelopeData {
    pressureRange: [Float!]!
    dewPointRange: [Float!]!
    bubblePointRange: [Float!]!
  }

  type WfcParameters {
    probeDensity: Float
    yieldStrength: Float
    modulusOfElasticity: Float
    shieldLength: Float
    insertionLength: Float
    unsupportedLength: Float
    actualProbeLength: Float
    strouhalNumber: Float
    fluidMassFactor: Float
    maxAllowedProbeLength: Float
    bendingStressFromFlow: Float
    bendingStressFromWeight: Float
    bendingStressTotal: Float
    isProbeDesignOkay: Boolean
    velocity: Float
  }

  type LtpdParameters {
    # Part 1
    pressureLTPDPart1: Float
    temperatureLTPDPart1: Float
    distanceLTPDPart1: Float
    flowRateLTPDPart1: Float
    velocityLTPDPart1: Float
    densityLTPDPart1: Float
    viscosityLTPDPart1: Float
    channelIDLTPDPart1: Float
    reynoldsNoLTPDPart1: Float
    fanningFrictionFactorLTPDPart1: Float
    pressureDropLTPDPart1: Float
    lagTimeLTPDPart1: Float

    # Part 2
    pressureLTPDPart2: Float
    temperatureLTPDPart2: Float
    distanceLTPDPart2: Float
    flowRateLTPDPart2: Float
    velocityLTPDPart2: Float
    densityLTPDPart2: Float
    viscosityLTPDPart2: Float
    channelIDLTPDPart2: Float
    reynoldsNoLTPDPart2: Float
    fanningFrictionFactorLTPDPart2: Float
    pressureDropLTPDPart2: Float
    lagTimeLTPDPart2: Float

    # Part 3
    pressureLTPDPart3: Float
    temperatureLTPDPart3: Float
    distanceLTPDPart3: Float
    flowRateLTPDPart3: Float
    velocityLTPDPart3: Float
    densityLTPDPart3: Float
    viscosityLTPDPart3: Float
    channelIDLTPDPart3: Float
    reynoldsNoLTPDPart3: Float
    fanningFrictionFactorLTPDPart3: Float
    pressureDropLTPDPart3: Float
    lagTimeLTPDPart3: Float

    # Part 4
    pressureLTPDPart4: Float
    temperatureLTPDPart4: Float
    distanceLTPDPart4: Float
    flowRateLTPDPart4: Float
    velocityLTPDPart4: Float
    densityLTPDPart4: Float
    viscosityLTPDPart4: Float
    channelIDLTPDPart4: Float
    reynoldsNoLTPDPart4: Float
    fanningFrictionFactorLTPDPart4: Float
    pressureDropLTPDPart4: Float
    lagTimeLTPDPart4: Float

    # Part 5
    pressureLTPDPart5: Float
    temperatureLTPDPart5: Float
    distanceLTPDPart5: Float
    flowRateLTPDPart5: Float
    velocityLTPDPart5: Float
    densityLTPDPart5: Float
    viscosityLTPDPart5: Float
    channelIDLTPDPart5: Float
    reynoldsNoLTPDPart5: Float
    fanningFrictionFactorLTPDPart5: Float
    pressureDropLTPDPart5: Float
    lagTimeLTPDPart5: Float
    totalLagTimeAz: Float
    totalPressureDropAz: Float
  }

  input AnadezMainInput {
    # Application Details

    # compoData_cloud - Removed
    compoBasis_cloud: String!
    tappingPressure: Float!
    thermoDynamicModelSelect: String!
    tappingTemperature: Float!
    SO2DewValid: Boolean
    NO2DewValid: Boolean
    SO3DewValid: Boolean
    HClDewValid: Boolean

    # Area Class and Cert
    # Ambient and Analyzer
    tempControlledEnvironment: Boolean!
    minAmbientTemp: Float!
    maxAmbientTemp: Float!
    avgAmbientTemp: Float!
    minAmbientAnalyzerTemp: Float!
    maxAmbientAnalyzerTemp: Float!
    analyzerFlowRate: Float!

    # Sample Properties

    sampleTappingPhaseSelect: String!
    sampleTransportationPhaseSelect: String!
    sampleMwtGiven: Boolean!
    sampleDensityGiven: Boolean!
    sampleMwtGivenValue: Float!
    sampleViscosityGiven: Boolean!
    sampleDensityGivenValue: Float!
    sampleViscosityGivenValue: Float!
    processLineVelocity: Float!

    # Probe Details

    probeMaterialSelect: String!
    extentOfProbeInsertionSelect: String!
    nozzleLength: Float!
    isolationValveLength: Float!
    processLineSize: Float!
    processLineSizeType: String!
    explicitProbeInsertion: Boolean!
    explicitProbeInsertionLength: Float
    processLineThickness: Float!
    probeChannelInnerDia: Float!
    probeChannelOuterDia: Float!

    # Distance and Flow

    roughnessParameter: Float!
    totalDistanceTappingToCabinetShelter: Float!
    bypassFlowMain: Float!
    sampleReturnLineDistance: Float!
    isSampleReturned: Boolean!
    sampleReturnPressure: Float!
    sampleReturnTubeInnerDia: Float!

    # Transportation

    isPSHS: Boolean!
    isPrimaryPR: Boolean!
    isSecondaryPR: Boolean!
    primaryTransportDistance: Float!
    primaryPRSetPressure: Float!
    secondaryTransportDistance: Float!
    secondaryPRSetPressure: Float!
    primaryElevationInTubing: Float
    secondaryElevationInTubing: Float
    tertiaryTransportDistance: Float!
    primaryTransportTubeInnerDia: Float!
    secondaryTransportTubeInnerDia: Float!
    tertiaryTransportTubeInnerDia: Float!
    isTimeLagCompPart2: Boolean!
    isTimeLagCompPart3: Boolean!
    isTimeLagCompPart4: Boolean!
    timeLagCompVolumePart2Corrected: Float
    timeLagCompVolumePart3Corrected: Float
    timeLagCompVolumePart4Corrected: Float
  }
  type Query {
    calculateAnadez(
      anadezMainInput: AnadezMainInput!
      compoDataInput: [CompoDataInput!]!
    ): AnadezMain!
  }
`;

module.exports = { anadezMainTypeDefs };
