const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');

// 1) List all inventory items (classification overview)
router.get('/', invController.viewAllInventory);

// 2) Show vehicles by classification (e.g., /sedan, /suv)
//    Note: this dynamic route must come *after* the root and before detail
router.get('/:classification', invController.viewByClassification);

// 3) Detail view for a single inventory item by ID
router.get('/detail/:inv_id', invController.viewInventoryItem);

module.exports = router;