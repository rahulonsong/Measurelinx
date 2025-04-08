const { Organization } = require("../../models/organization.js");

const { User } = require("../../models/user");

const { transformOrganization } = require("./merge");

const { getUserId } = require("../../utils/getUserId");

const organizationResolver = {
  Query: {
    organizations: async (_parent, {}, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const organizations = await Organization.find();
        return organizations.map((organization) => {
          return transformOrganization(organization);
        });
      } catch (error) {
        throw error;
      }
    },
    singleOrganization: async (_parent, { organizationId }, { req }, _info) => {
      // Authenticating
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      try {
        const organization = await Organization.findById(organizationId);
        return transformOrganization(organization);
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    addOrganizationData: async (
      _parent,
      { organizationInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }
      const organization = new Organization({
        organizationName: organizationInput.organizationName,
        user: userId,
      });

      let createdOrganization;

      try {
        const result = await organization.save();
        createdOrganization = transformOrganization(result);
        const user = await User.findById(userId);
        if (!user) {
          throw new Error("User not found!");
        }
        user.organization = organization;
        await user.save();
        return createdOrganization;
      } catch (error) {
        throw error;
      }
    },
    //updating organization
    updateOrganizationData: async (
      _parent,
      { organizationId, organizationInput },
      { req },
      _info
    ) => {
      const userId = getUserId(req);
      // console.log("userId:", userId);
      if (!userId) {
        throw new Error("Unauthenticated!");
      }

      const updates = {};
      if (organizationInput !== undefined) {
        updates.organizationName = organizationInput.organizationName;
      } else {
        throw new Error("Invalid Data!");
      }
      // Adding data to MongoDb
      try {
        const organization = await Organization.findByIdAndUpdate(
          organizationId,
          {
            $set: updates,
          },
          { new: true }
        );

        return organization;
      } catch (error) {
        throw error;
      }
    },
  },
};

module.exports = { organizationResolver };
