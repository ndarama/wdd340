const { body, validationResult } = require('express-validator');

// Validation rules for adding classification
const classificationValidationRules = () => {
  return [
    body('classification_name')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Classification name is required.')
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage('Classification name cannot contain spaces or special characters.')
  ];
};

// Validation rules for adding inventory
const inventoryValidationRules = () => {
  return [
    body('classification_id')
      .isInt({ min: 1 })
      .withMessage('Please select a valid classification.'),
    body('inv_make')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Make must be at least 3 characters long.'),
    body('inv_model')
      .trim()
      .isLength({ min: 3 })
      .withMessage('Model must be at least 3 characters long.'),
    body('inv_year')
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage('Year must be a valid 4-digit year.'),
    body('inv_description')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Description is required.'),
    body('inv_image')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Image path is required.'),
    body('inv_thumbnail')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Thumbnail path is required.'),
    body('inv_price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number.'),
    body('inv_miles')
      .isInt({ min: 0 })
      .withMessage('Miles must be a positive integer.'),
    body('inv_color')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Color is required.')
  ];
};

// Check validation result
const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    req.flash('errors', errors.array());
    
    // Determine which view to render based on the route
    if (req.path.includes('add-classification')) {
      return res.redirect('/inv/add-classification');
    } else if (req.path.includes('add-inventory')) {
      return res.redirect('/inv/add-inventory');
    }
    
    return res.redirect('back');
  }
  next();
};

module.exports = {
  classificationValidationRules,
  inventoryValidationRules,
  checkValidationResult
};