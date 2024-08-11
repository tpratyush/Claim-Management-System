// claimRoutes.js
const express = require('express');
const claimServices = require('../services/claimService');

const router = express.Router();

router.post('/claim', async (req, res) => {
  try {
    const { policyId, userId, claimAmount } = req.body;
    const result = await claimServices.claimPolicy(policyId, userId, claimAmount);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ message: 'Error claiming policy', error: error.message });
  }
});

module.exports = router;
