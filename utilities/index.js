function buildClassificationHTML(vehicles, classification) {
  const title = classification.charAt(0).toUpperCase() + classification.slice(1);
  const items = vehicles
    .map(v => `
      <div class="item-card">
        <a href="/detail/${v.inv_id}">
          <img src="${v.thumbnail}" alt="${v.make} ${v.model}" loading="lazy">
          <p>${v.make} ${v.model}</p>
        </a>
      </div>
    `)
    .join('');
  return `
  <section class="classification-view">
    <h1>${title}</h1>
    <div class="item-grid">
      ${items}
    </div>
  </section>
  `;
}

// Build detail HTML (unchanged)
function buildVehicleDetailHTML(vehicle) {
  const { make, model, year, price, mileage, description, fullsize } = vehicle;
  const fmtCurrency = num => num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  const fmtNumber = num => num.toLocaleString('en-US');

  return `
  <section class="vehicle-detail">
    <div class="detail-image">
      <img src="${fullsize}" alt="${make} ${model}" loading="lazy">
    </div>
    <div class="detail-info">
      <h1>${make} ${model}</h1>
      <h2>${year} — ${fmtCurrency(price)}</h2>
      <p><strong>Mileage:</strong> ${fmtNumber(mileage)} miles</p>
      <p>${description}</p>
    </div>
  </section>
  `;
}

module.exports = {
  buildClassificationHTML,
  buildVehicleDetailHTML,
};
