const invModel = require('../models/inventory-model');

async function getNav() {
  const data = await invModel.getClassifications();
  let nav = '<ul>';
  nav += `<li><a href="/" title="Home page">Home</a></li>`;
  data.forEach(row => {
    nav += `<li><a href="/inv/classification/${row.classification_name}" title="View our ${row.classification_name} vehicles">${row.classification_name}</a></li>`;
  });
  nav += '</ul>';
  return nav;
}

function buildVehicleDetailHTML(vehicle) {
  const price = Number(vehicle.inv_price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const miles = Number(vehicle.inv_miles).toLocaleString();

  return `
    <div class="vehicle-detail">
      <div class="vehicle-image">
        <img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" loading="lazy">
      </div>
      <div class="vehicle-info">
        <h2>${vehicle.inv_make} ${vehicle.inv_model} (${vehicle.inv_year})</h2>
        <p><strong>Price:</strong> ${price}</p>
        <p><strong>Mileage:</strong> ${miles} miles</p>
        <p><strong>Description:</strong> ${vehicle.inv_description}</p>
        <p><strong>Color:</strong> ${vehicle.inv_color}</p>
      </div>
    </div>
  `;
}

module.exports = {
  getNav,
  buildVehicleDetailHTML
};
