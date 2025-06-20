// utilities/index.js

const invModel           = require('../models/inventory-model');
const jwt                = require('jsonwebtoken');
require('dotenv').config();
const reviewValidation   = require('./review-validation');

// Build site navigation
async function getNav() {
  const data = await invModel.getClassifications();
  let nav = '<ul>';
  nav += `<li><a href="/">Home</a></li>`;
  data.forEach(row => {
    nav += `
      <li>
        <a href="/inv/classification/${row.classification_name}" title="View ${row.classification_name} vehicles">
          ${row.classification_name}
        </a>
      </li>`;
  });
  nav += '</ul>';
  return nav;
}

// Build single vehicle detail HTML (monolithic)
function buildVehicleDetailHTML(vehicle) {
  const price = Number(vehicle.inv_price).toLocaleString('en-US', {
    style:    'currency',
    currency: 'USD'
  });
  const miles = Number(vehicle.inv_miles).toLocaleString();

  const imagePath = vehicle.inv_image?.startsWith('/images')
    ? vehicle.inv_image
    : `/images/vehicles/${vehicle.inv_image || 'default.jpg'}`;

  const thumbs = [
    vehicle.inv_thumbnail1 || imagePath,
    vehicle.inv_thumbnail2 || imagePath,
    vehicle.inv_thumbnail3 || imagePath,
    vehicle.inv_thumbnail4 || imagePath,
    vehicle.inv_thumbnail5 || imagePath
  ];
  const thumbHTML = `
    <div class="vehicle-thumbs">
      ${thumbs.map(t =>
        `<img src="${t}"
              alt="Thumbnail of ${vehicle.inv_make} ${vehicle.inv_model}"
              class="thumb-img">`
      ).join('')}
    </div>`;

  return `
    <div class="vehicle-detail-split">
      <div class="vehicle-gallery">
        <h1>${vehicle.inv_make} ${vehicle.inv_model}</h1>
        <img src="${imagePath}"
             alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}"
             class="vehicle-main-img" />
        ${thumbHTML}
      </div>
      <div class="vehicle-right-col">
        <h2 class="vehicle-title">${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>
        <div class="vehicle-price">${price}</div>
        <ul class="vehicle-specs">
          <li><strong>Mileage:</strong> ${miles} miles</li>
          <li><strong>Color:</strong> ${vehicle.inv_color}</li>
          <li><strong>Description:</strong> ${vehicle.inv_description}</li>
        </ul>
        <div class="vehicle-buttons">
          <a href="#" class="btn green">Start My Purchase</a>
          <a href="#" class="btn gray">Contact Us</a>
          <a href="#" class="btn gray">Schedule Test Drive</a>
          <a href="#" class="btn gray">Apply for Financing</a>
        </div>
        <div class="vehicle-contact">
          <p><strong>Call Us:</strong>
            <a href="tel:+18013967886" class="phone">801-396-7886</a>
          </p>
          <p><strong>Visit Us</strong></p>
        </div>
      </div>
    </div>
  `;
}

// Build vehicle grid
function buildClassificationGrid(data) {
  let grid = '<ul class="inv-display">';
  data.forEach(vehicle => {
    const thumbnail = vehicle.inv_thumbnail?.startsWith('/images')
      ? vehicle.inv_thumbnail
      : `/images/vehicles/${vehicle.inv_thumbnail || 'default-thumb.jpg'}`;
    grid += `
      <li>
        <a href="/inv/detail/${vehicle.inv_id}">
          <img src="${thumbnail}"
               alt="${vehicle.inv_make} ${vehicle.inv_model}">
        </a>
        <div>
          <h2>${vehicle.inv_make} ${vehicle.inv_model}</h2>
          <span>$${Number(vehicle.inv_price).toLocaleString()}</span>
        </div>
      </li>`;
  });
  grid += '</ul>';
  return grid;
}

// Build classification select list
async function buildClassificationList(classification_id = null) {
  const data               = await invModel.getClassifications();
  let classificationList   =
    '<select name="classification_id" id="classificationList" required>';
  classificationList      += "<option value=''>Choose a Classification</option>";
  data.forEach(row => {
    classificationList += `<option value="${row.classification_id}"${
      classification_id === row.classification_id ? ' selected' : ''
    }>${row.classification_name}</option>`;
  });
  classificationList += '</select>';
  return classificationList;
}

// Error handler wrapper
function handleErrors(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// JWT check middleware
function checkJWT(req, res, next) {
  if (req.cookies.jwt) {
    jwt.verify(req.cookies.jwt,
               process.env.ACCESS_TOKEN_SECRET,
               (err, accountData) => {
      if (err) {
        req.flash('Please log in');
        res.clearCookie('jwt');
        return res.redirect('/account/login');
      }
      res.locals.accountData = accountData;
      res.locals.loggedIn    = true;
      next();
    });
  } else {
    next();
  }
}

// Require login for protected routes
function requireAuth(req, res, next) {
  if (res.locals.loggedIn) {
    return next();
  }
  req.flash('notice', 'Please log in to access this feature.');
  res.redirect('/account/login');
}

module.exports = {
  getNav,
  buildVehicleDetailHTML,
  buildClassificationGrid,
  buildClassificationList,
  handleErrors,
  checkJWT,
  requireAuth,
  reviewRules:     reviewValidation.reviewRules,
  checkReviewData: reviewValidation.checkReviewData
};
