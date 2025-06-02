const inventoryModel = require('../models/inventory-model');
const {
  buildVehicleDetailHTML,
  buildClassificationHTML,
} = require('../utilities');

/**
 * Render all inventory vehicles
 */
async function viewAllInventory(req, res, next) {
  try {
    const allVehicles = await inventoryModel.getAllVehicles();
    res.render('inventory/index', {
      vehicles: allVehicles,
      title: 'All Vehicles Inventory',
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Render classification list view based on URL param
 */
async function viewByClassification(req, res, next) {
  try {
    const classification = req.params.classification;
    const vehicles = await inventoryModel.getVehiclesByClassification(classification);
    if (!vehicles.length) {
      return res.status(404).render('errors/404', {
        title: '404 — Page Not Found',
      });
    }
    const name = classification.charAt(0).toUpperCase() + classification.slice(1);
    const pageTitle = `${name} Inventory`;
    const html = buildClassificationHTML(vehicles, classification);
    res.render('inventory/classification', {
      classification,
      vehicles,
      html,
      title: pageTitle,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Render the detail page for a specific inventory vehicle
 */
async function viewInventoryItem(req, res, next) {
  try {
    const invId = parseInt(req.params.inv_id, 10);
    const vehicle = await inventoryModel.getVehicleById(invId);
    if (!vehicle) {
      return res.status(404).render('errors/404', {
        title: '404 — Page Not Found',
      });
    }
    const pageTitle = `${vehicle.make} ${vehicle.model}`;
    const html = buildVehicleDetailHTML(vehicle);
    res.render('inventory/detail', {
      vehicle,
      html,
      title: pageTitle,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  viewAllInventory,
  viewByClassification,
  viewInventoryItem,
};
