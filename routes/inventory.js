const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const { classificationValidationRules, inventoryValidationRules, checkValidationResult } = require('../utilities/validation');

// Route for a specific inventory item detail view
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInventoryId));

// Route for viewing inventory by classification
router.get('/classification/:classification_name', utilities.handleErrors(invController.buildByClassificationId));

// Route for management view
router.get('/', utilities.handleErrors(invController.buildManagement));

// Route for add classification view
router.get('/add-classification', utilities.handleErrors(invController.buildAddClassification));

// Route for processing add classification
router.post('/add-classification',
  classificationValidationRules(),
  checkValidationResult,
  utilities.handleErrors(invController.addClassification)
);

// Route for add inventory view
router.get('/add-inventory', utilities.handleErrors(invController.buildAddInventory));

// Route for processing add inventory
router.post('/add-inventory',
  inventoryValidationRules(),
  checkValidationResult,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router;
