const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');

// Route for a specific inventory item detail view
router.get('/detail/:inv_id', invController.buildByInventoryId);

// Route for viewing inventory by classification
router.get('/classification/:classification_name', invController.buildByClassificationId);

module.exports = router;
