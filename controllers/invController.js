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

// Build management view
async function buildManagement(req, res, next) {
  try {
    const nav = await utilities.getNav();
    res.render('inventory/management', {
      title: 'Vehicle Management',
      nav,
      errors: null
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
      title: 'Add New Classification',
      nav,
      errors: null,
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
      req.flash('notice', `The ${classification_name} classification was successfully added.`);
      const nav = await utilities.getNav(); // Rebuild nav with new classification
      res.render('inventory/management', {
        title: 'Vehicle Management',
        nav,
        errors: null
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
    const nav = await utilities.getNav();
    const classificationList = await utilities.buildClassificationList();
    res.render('inventory/add-inventory', {
      title: 'Add New Vehicle',
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
      req.flash('notice', `The ${inv_make} ${inv_model} was successfully added.`);
      const nav = await utilities.getNav();
      res.render('inventory/management', {
        title: 'Vehicle Management',
        nav,
        errors: null
      });
    } else {
      req.flash('notice', 'Sorry, the vehicle could not be added.');
      const nav = await utilities.getNav();
      const classificationList = await utilities.buildClassificationList(classification_id);
      res.render('inventory/add-inventory', {
        title: 'Add New Vehicle',
        nav,
        classificationList,
        errors: null,
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

module.exports = {
  buildByInventoryId,
  buildByClassificationId,
  buildManagement,
  buildAddClassification,
  addClassification,
  buildAddInventory,
  addInventory
};
