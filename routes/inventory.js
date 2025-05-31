const express = require('express');
const router = express.Router();
const invController = require('../controllers/invController');

// Vehicle detail route (uses inv_id parameter)
router.get('/detail/:inv_id', invController.buildByInventoryId);

module.exports = router;
