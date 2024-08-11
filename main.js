const Policyholder = require('./models/policyholder');
const Policy = require('./models/policy');
const Claim = require('./models/claim');



let claims = [];

const createClaim = (claimData) => {
  // Existing validations...

  // Additional validation: Claim amount cannot exceed policy amount
  const policy = policies.find(p => p.id === claimData.policyId);
  if (policy && claimData.claimAmount > policy.coverageDetails.limit) {
    throw new Error('Claim amount exceeds policy limit');
  }

  // Other business rules can be added here

  // ... rest of the function
};
