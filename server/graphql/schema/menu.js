const { gql } = require("apollo-server-express");

const menuTypeDefs = gql`
  type Menu {
    _id: ID!
    name: String!
    position: Int
    isSideMenu: Boolean!
    isTopMenu: Boolean!
    isBottomMenu: Boolean!
    description: String
    disabled: Boolean!
    published: Boolean!
    menuType: String!
    routeParam: String
    subMenus: [SubMenu]
  }

  type SubMenu {
    name: String!
    routeParam: String
    subTitles: [SubTitle]
  }

  type SubTitle {
    name: String!
    routeParam: String!
  }

  input MenuInput {
    name: String!
    description: String
    position: Int
    isSideMenu: Boolean!
    isTopMenu: Boolean!
    isBottomMenu: Boolean!
    disabled: Boolean!
    published: Boolean!
    menuType: String!
    routeParam: String!
    subMenus: [SubMenuInput]
  }

  input SubMenuInput {
    name: String!
    routeParam: String
    subTitles: [SubTitleInput]
  }

  input SubTitleInput {
    name: String!
    routeParam: String
  }

  type Query {
    menus: [Menu!]!
    # singleMenuData(routeParam: String!): Menu!
  }

  type Mutation {
    addMenu(menuInput: MenuInput): Menu!
    updateMenu(id: ID!, menuInput: MenuInput): Menu!
    deleteMenu(id: ID!): Message!
  }
`;

module.exports = { menuTypeDefs };
