const Policy = require('../models/policy');
const User = require('../models/user');

const claimServices = {
  claimPolicy: async (policyId, userId, claimAmount) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const policyIndex = user.policies.findIndex(p => p._id.toString() === policyId.toString());
      if (policyIndex === -1) {
          throw new Error('Policy not found in user\'s policies');
      }

      const userPolicy = user.policies[policyIndex];
      if (!userPolicy) {
        throw new Error('User does not own this policy');
      }

      if (claimAmount > userPolicy.policyAmount) {
        throw new Error('Claim amount exceeds total policy amount');
      }

      // Handle the claim and update the policy amount
      if (claimAmount === userPolicy.policyAmount) {
        // Policy fully claimed and should be removed from user's policies
        user.policies.splice(policyIndex, 1);
        await user.save();
        return { message: 'Policy fully claimed and removed' };
      } else {
        // Policy partially claimed, update the policy amount in the user's policies
        userPolicy.policyAmount -= claimAmount;
        await user.save();
        return { message: 'Policy partially claimed' };
      }
    } catch (error) {
      console.error('Error claiming policy:', error);
      throw error;
    }
  }
};

module.exports = claimServices;