const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');
const utilities = require('../utilities');
const validation = require('../utilities/validation');

// Route for a specific inventory item
router.get('/detail/:inv_id', utilities.handleErrors(invController.buildByInventoryId));

// Route to management view
router.get('/', utilities.checkAuthorization, utilities.handleErrors(invController.buildManagement));

// Route to add classification view
router.get('/add-classification', utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassification));

// Process the add classification data
router.post(
 '/add-classification',
 utilities.checkAuthorization,
 validation.classificationRules(),
 validation.checkClassificationData,
 utilities.handleErrors(invController.addClassification)
);

// Route to add inventory view
router.get('/add-inventory', utilities.checkAuthorization, utilities.handleErrors(invController.buildAddInventory));

// Process the add inventory data
router.post(
 '/add-inventory',
 utilities.checkAuthorization,
 validation.inventoryRules(),
 validation.checkInventoryData,
 utilities.handleErrors(invController.addInventory)
);

// Route to get inventory for AJAX
router.get('/getInventory/:classification_id', utilities.handleErrors(invController.getInventoryJSON));

// Route to edit inventory view
router.get('/edit/:inv_id', utilities.checkAuthorization, utilities.handleErrors(invController.buildEditInventory));

// Process the edit inventory data
router.post(
 '/update/',
 utilities.checkAuthorization,
 validation.inventoryRules(),
 validation.checkUpdateData,
 utilities.handleErrors(invController.updateInventory)
);

// Route to delete inventory view
router.get('/delete/:inv_id', utilities.checkAuthorization, utilities.handleErrors(invController.buildDeleteInventory));

// Process the delete inventory data
router.post('/delete', utilities.checkAuthorization, utilities.handleErrors(invController.deleteInventory));

module.exports = router;
