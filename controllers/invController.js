const invModel = require('../models/inventory-model');
const utilities = require('../utilities');

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
  } catch (error) {
    next(error);
  }
}

module.exports = {
  buildByInventoryId
};
