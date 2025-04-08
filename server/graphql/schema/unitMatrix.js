const { gql } = require("apollo-server-express");

const unitMatrixTypeDefs = gql`
  type UnitMatrixData {
    unit: String
    value: Float
  }
  input UnitMatrixDataInput {
    unit: String
    value: Float
  }

  type UnitMatrix {
    _id: ID!
    propertyName: String!
    type: String!
    defaultUnit: String!
    conversionMatrix: [UnitMatrixData]!
  }

  input UnitMatrixInput {
    propertyName: String!
    type: String!
    defaultUnit: String!
    conversionMatrix: [UnitMatrixDataInput]!
  }

  type Query {
    unitMatrices: [UnitMatrix!]!
    singleUnitMatrix(unitMatrixId: ID!): UnitMatrix!
  }

  type Mutation {
    addUnitMatrixData(unitMatrixInput: UnitMatrixInput): UnitMatrix!
    updateUnitMatrixData(
      unitMatrixId: ID!
      unitMatrixInput: UnitMatrixInput
    ): UnitMatrix!

    deleteUnitMatrixData(unitMatrixId: ID!): Message!
  }
`;

module.exports = { unitMatrixTypeDefs };
