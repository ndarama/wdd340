const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

// Detail View Controller
async function buildByInventoryId(req, res, next) {
  const invId = req.params.inv_id;
  try {
    const vehicle = await invModel.getInventoryById(invId);
    if (!vehicle) {
      return res.status(404).render('errors/404', { title: 'Vehicle Not Found' });
    }
    const nav = await utilities.getNav();
    const detailView = utilities.buildVehicleDetailHTML(vehicle);
    res.render('inventory/detail', {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailView
    });
  } catch (err) {
    next(err);
  }
}

// Classification View Controller
async function buildByClassificationId(req, res, next) {
  const classificationName = req.params.classification_name;
  try {
    const vehicles = await invModel.getInventoryByClassificationName(classificationName);
    const nav = await utilities.getNav();
    const grid = utilities.buildClassificationGrid(vehicles);
    res.render('inventory/classification', {
      title: classificationName,
      nav,
      grid
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  buildByInventoryId,
  buildByClassificationId
};
