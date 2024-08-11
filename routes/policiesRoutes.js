const express = require('express');
const router = express.Router();
const policyService = require('../services/policyService');

// Route to display all policies
router.get('/', async (req, res) => {
    try {
        const policies = await policyService.getAllPolicies();
        res.render('policies', { policies }); // Render policies view
    } catch (error) {
        res.status(500).json({ message: 'Error fetching policies', error: error.message });
    }
});

module.exports = router;