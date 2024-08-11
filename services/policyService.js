const Policy = require('../models/policy'); 
const User = require("../models/user");

const policyService = {
  getAllPolicies: async () => {
    try {
      console.log('Fetching all policies from database');
      const policies = await Policy.find({});
      console.log(`Found ${policies.length} policies`);
      console.log('Policies:', JSON.stringify(policies, null, 2));
      return policies;
    } catch (error) {
      console.error('Error fetching policies:', error);
      throw error;
    }
  },

  addNewPolicy: async (policyData) => {
    try {
      const newPolicy = new Policy(policyData);
      const savedPolicy = await newPolicy.save();
      return savedPolicy;
    } catch (error) {
      console.error('Error adding new policy:', error);
      throw error;
    }
  },

  assignPolicyToUser: async (policyId, userId) => {
    try {
      // Find the policy and user by their IDs
      const policy = await Policy.findById(policyId);
      const user = await User.findById(userId);

      if (!policy) {
        console.error(`Policy with ID ${policyId} not found.`);
        throw new Error('Policy not found');
      }

      if (!user) {
        console.error(`User with ID ${userId} not found.`);
        throw new Error('User not found');
      }

      // Check if the policy is already assigned to the user
      if (user.policies.some(p => p.policyId.toString() === policyId.toString())) {
        console.log(`Policy ${policyId} is already assigned to user ${userId}.`);
        throw new Error('Policy already assigned to user');
      }

      // Add policy to the user
      const embeddedPolicy = {
        policyId: policy._id,
        policyName: policy.policyName,
        policyAmount: policy.policyAmount,
        policyExpiryDate: policy.policyExpiryDate
      };

      user.policies.push(embeddedPolicy);
      await user.save();

      // Add user to the policy
      policy.users.push(userId);
      await policy.save();

      console.log(`Successfully assigned policy ${policyId} to user ${userId}.`);
      return { policy, user };
    } catch (error) {
      console.error('Error assigning policy to user:', error);
      throw error; // Rethrow the error to be handled by the caller
    }
  },

  // Optional: Method to remove a policy from a user
  removePolicyFromUser: async (policyId, userId) => {
    try {
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Find the policy in the user's embedded policies array
        const policyIndex = user.policies.findIndex(p => p.policyId.toString() === policyId.toString());
        if (policyIndex === -1) {
            throw new Error('Policy not found in user\'s policies');
        }

        // Remove the policy from the user's policies array
        user.policies.splice(policyIndex, 1);
        await user.save();

        // Find the policy by its ID
        const policy = await Policy.findById(policyId);
        if (!policy) {
            throw new Error('Policy not found');
        }

        // Remove the user from the policy's users array
        policy.users = policy.users.filter(id => id.toString() !== userId.toString());
        await policy.save();

        return { policy, user };
    } catch (error) {
        console.error('Error removing policy from user:', error);
        throw error;
    }
},

  getUserPolicies: async (userId) => {
    try {
      console.log(userId);
      const user = await User.findById(userId).populate("policies");
      if (!user) {
        throw new Error('User not found');
      }

      console.log(user.policies);
      return user.policies;
    } catch (error) {
      console.error('Error fetching user policies:', error);
      throw error;
    }
  },
};

module.exports = policyService;