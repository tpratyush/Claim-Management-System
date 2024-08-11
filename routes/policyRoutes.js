const express = require('express');
const router = express.Router();
const policyService = require('../services/policyService'); // Adjust the path as needed

// GET all policies
router.get('/', async (req, res) => {
  console.log('GET /api/policies request received');
  try {
    const policies = await policyService.getAllPolicies();
    console.log('Policies fetched successfully, sending response:', JSON.stringify(policies));
    res.json(policies);
  } catch (error) {
    console.error('Error in GET /api/policies:', error);
    res.status(500).json({ message: 'Error fetching policies', error: error.message });
  }
});

// POST a new policy
router.post('/', async (req, res) => {
  try {
    const newPolicy = await policyService.addNewPolicy(req.body);
    res.status(201).json(newPolicy);
  } catch (error) {
    res.status(400).json({ message: 'Error creating new policy', error: error.message });
  }
});

router.post('/assign', async (req, res) => {
  try {
    const { policyId, userId } = req.body;
    
    // Call the service function to assign the policy to the user
    const result = await policyService.assignPolicyToUser(policyId, userId);
    
    // Send a successful response with the result
    res.status(200).json(result);
  } catch (error) {
    // Check for specific error messages and return them
    if (error.message === 'Policy already assigned to user' || error.message === 'User already associated with policy') {
      res.status(400).json({ message: error.message });
    } else {
      // For other errors, return a generic error message
      res.status(400).json({ message: 'Error assigning policy to user', error: error.message });
    }
  }
});

// Optional: POST to remove a policy from a user
router.post('/remove', async (req, res) => {
  try {
    const { policyId, userId } = req.body;
    const result = await policyService.removePolicyFromUser(policyId, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Error removing policy from user', error: error.message });
  }
});

// NEW ROUTE: GET user policies
router.post('/user-policies', async (req, res) => {
  try {
    // Assuming you have user authentication and the user ID is stored in req.user.id
    const userId = req.body.userId;
    console.log(userId)
    const policies = await policyService.getUserPolicies(userId);
    res.json(policies);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user policies' });
  }
});

module.exports = router;