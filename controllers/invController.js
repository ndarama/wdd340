// controllers/invController.js

const invModel    = require('../models/inventory-model');
const reviewModel = require('../models/review-model');
const utilities   = require('../utilities');

// Detail View Controller
async function buildByInventoryId(req, res, next) {
  const invId = parseInt(req.params.inv_id, 10);
  try {
    const vehicle = await invModel.getInventoryById(invId);
    if (!vehicle) {
      return res.status(404).render('errors/404', { title: 'Vehicle Not Found' });
    }

    // Navigation bar
    const nav = await utilities.getNav();

    // Build the monolithic detail HTML
    const detailView = utilities.buildVehicleDetailHTML(vehicle);

    // Fetch reviews
    const reviews     = await reviewModel.getReviewsByVehicle(invId);
    const accountData = res.locals.accountData || null;

    // Render detail.ejs with vehicle + reviews
    res.render('inventory/detail', {
      title:       `${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      detailView,
      vehicle,
      reviews,
      accountData
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
    const nav      = await utilities.getNav();
    const grid     = utilities.buildClassificationGrid(vehicles);
    res.render('inventory/classification', {
      title: classificationName,
      nav,
      grid
    });
  } catch (err) {
    next(err);
  }
}

// Build management view
async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/management', {
      title:    'Vehicle Management',
      nav,
      errors:   null,
      messages: {}
    });
  } catch (err) {
    next(err);
  }
}

// Build add classification view
async function buildAddClassification(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/add-classification', {
      title:               'Add New Classification',
      nav,
      errors:              null,
      classification_name: ''
    });
  } catch (err) {
    next(err);
  }
}

// Process add classification
async function addClassification(req, res, next) {
  const { classification_name } = req.body;
  try {
    const result = await invModel.addClassification(classification_name);
    if (result.rows) {
      const nav = await utilities.getNav();
      res.render('inventory/management', {
        title:    'Vehicle Management',
        nav,
        errors:   null,
        messages: { notice: `The ${classification_name} classification was successfully added.` }
      });
    } else {
      req.flash('notice', 'Sorry, the classification could not be added.');
      res.redirect('/inv/add-classification');
    }
  } catch (err) {
    next(err);
  }
}

// Build add inventory view
async function buildAddInventory(req, res, next) {
  try {
    const nav                = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title,
      nav,
      classificationList,
      errors: null
    });
  } catch (err) {
    next(err);
  }
}

// Process add inventory
async function addInventory(req, res, next) {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  try {
    const result = await invModel.addInventory(
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    );

    if (result.rows) {
      const nav = await utilities.getNav();
      res.render('inventory/management', {
        title:    'Vehicle Management',
        nav,
        errors:   null,
        messages: { notice: `The ${inv_make} ${inv_model} was successfully added.` }
      });
    } else {
      req.flash('notice', 'Sorry, the vehicle could not be added.');
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList(classification_id);
      res.render('inventory/add-inventory', {
        title,
        nav,
        classificationList,
        errors:            null,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color
      });
    }
  } catch (err) {
    next(err);
  }
}

// Return Inventory by Classification as JSON
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id, 10);
  try {
    const invData = await invModel.getInventoryByClassificationName(classification_id);
    if (invData.length) {
      return res.json(invData);
    }
    next(new Error('No data returned'));
  } catch (err) {
    next(err);
  }
}

// Build edit inventory view
async function buildEditInventory(req, res, next) {
  const inv_id = parseInt(req.params.inv_id, 10);
  try {
    const nav                = await utilities.getNav();
    const itemData           = await invModel.getInventoryById(inv_id);
    const classificationList = await utilities.buildClassificationList(itemData.classification_id);
    const itemName           = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render('inventory/edit-inventory', {
      title:             'Edit ' + itemName,
      nav,
      classificationList,
      errors:            null,
      inv_id:            itemData.inv_id,
      inv_make:          itemData.inv_make,
      inv_model:         itemData.inv_model,
      inv_year:          itemData.inv_year,
      inv_description:   itemData.inv_description,
      inv_image:         itemData.inv_image,
      inv_thumbnail:     itemData.inv_thumbnail,
      inv_price:         itemData.inv_price,
      inv_miles:         itemData.inv_miles,
      inv_color:         itemData.inv_color,
      classification_id: itemData.classification_id
    });
  } catch (err) {
    next(err);
  }
}

// Update Inventory Data
async function updateInventory(req, res, next) {
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  } = req.body;

  try {
    const updateResult = await invModel.updateInventory(
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id
    );

    if (updateResult) {
      const itemName = `${updateResult.inv_make} ${updateResult.inv_model}`;
      req.flash('notice', `The ${itemName} was successfully updated.`);
      res.redirect('/inv/');
    } else {
      throw new Error('Update failed');
    }
  } catch (err) {
    const nav                = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList(classification_id);
    const itemName           = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the update failed.');
    res.status(501).render('inventory/edit-inventory', {
      title:             'Edit ' + itemName,
      nav,
      classificationList,
      errors:            null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
}

// Build delete inventory view
async function buildDeleteInventory(req, res, next) {
  const inv_id = parseInt(req.params.inv_id, 10);
  try {
    const nav      = await utilities.getNav();
    const itemData = await invModel.getInventoryById(inv_id);
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

    res.render('inventory/delete-confirm', {
      title:    'Delete ' + itemName,
      nav,
      errors:   null,
      inv_id:   itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model:itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price:itemData.inv_price
    });
  } catch (err) {
    next(err);
  }
}

// Delete Inventory Data
async function deleteInventory(req, res, next) {
  const { inv_id, inv_make, inv_model, inv_year, inv_price } = req.body;
  try {
    const deleteResult = await invModel.deleteInventory(inv_id);
    if (deleteResult) {
      req.flash('notice', `The ${inv_make} ${inv_model} was successfully deleted.`);
      return res.redirect('/inv/');
    }
    throw new Error('Delete failed');
  } catch (err) {
    const nav      = await utilities.getNav();
    const itemName = `${inv_make} ${inv_model}`;
    req.flash('notice', 'Sorry, the delete failed.');
    res.status(501).render('inventory/delete-confirm', {
      title:    'Delete ' + itemName,
      nav,
      errors:   null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_price
    });
  }
}

module.exports = {
  buildByInventoryId,
  buildByClassificationId,
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory,
  getInventoryJSON,
  buildEditInventory,
  updateInventory,
  buildDeleteInventory,
  deleteInventory
};
