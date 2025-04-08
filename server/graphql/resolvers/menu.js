const { Menu } = require("../../models/menu");
const { User } = require("../../models/user");
const { getUserId } = require("../../utils/getUserId");
const { transformMenu } = require("./merge");

const menuResolver = {
  Query: {
    menus: async (_parent, _args, { req }, _info) => {
      let menus;
      try {
        let menuFilters = {
          disabled: false,
          published: true,
        };
        // For admin, remove the published and disabled iteems
        const userId = getUserId(req);
        if (userId) {
          const user = await User.findById(userId);
          if (user.admin || user.masterAdmin) {
            menuFilters = { disabled: false };
          }
        }
        menus = await Menu.find(menuFilters);
        const modifiedMenus = [
          ...menus.map((el) => {
            return transformMenu(el._doc);
          }),
        ];
        return modifiedMenus;
      } catch (error) {
        throw error;
      }
    },
    // singleMenuData: async (_parent, { routeParam }) => {
    //   try {
    //     const menu = await Menu.findOne({ routeParam });
    //     if (!menu) {
    //       throw new Error("Menu not found");
    //     }
    //     return menu;
    //   } catch (error) {
    //     throw error;
    //   }
    // },
  },
  Mutation: {
    addMenu: async (_parent, { menuInput }, { req }, _info) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!(user.masterAdmin || user.admin)) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }
      const newMenu = new Menu({
        ...menuInput,
        user: user._id,
      });
      try {
        const result = await newMenu.save();
        return result._doc;
      } catch (error) {
        throw error;
      }
    },
    updateMenu: async (_parent, { id, menuInput }, { req }, _info) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!(user.masterAdmin || user.admin)) {
        throw new Error(
          "Forbidden: You do not have permission to perform this action."
        );
      }
      try {
        const updatedMenu = await Menu.findByIdAndUpdate(
          id,
          { $set: { ...menuInput, user: user._id } },
          { new: true }
        );
        return updatedMenu._doc;
      } catch (error) {
        throw error;
      }
    },
    deleteMenu: async (_parent, { id }, { req }, _info) => {
      const userId = getUserId(req);

      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const user = await User.findById(userId);
      if (!(user.masterAdmin || user.admin)) {
        throw new Error(
          "Forbidden:          You do not have permission to perform this action."
        );
      }
      try {
        await Menu.findByIdAndRemove(id);
        return { message: "Menu deleted successfully" };
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { menuResolver };
