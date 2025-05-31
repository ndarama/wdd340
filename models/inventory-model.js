// models/inventory-model.js
const db = require('../database/dbConfig');

// Fetch all vehicles
async function getAllVehicles() {
  const result = await db.query(`SELECT * FROM inventory;`);
  return result.rows;
}

// Fetch vehicles by classification (make/model grouping)
async function getVehiclesByClassification(classification) {
  const sql = `
    SELECT inv_id, make, model, year, price, mileage, thumbnail
    FROM inventory
    WHERE classification = $1;
  `;
  const result = await db.query(sql, [classification]);
  return result.rows;
}

// Fetch a single vehicle by inventory ID
async function getVehicleById(invId) {
  const sql = `
    SELECT inv_id, make, model, year, price, mileage, description,
           image_full AS fullsize
    FROM inventory
    WHERE inv_id = $1;
  `;
  const result = await db.query(sql, [invId]);
  return result.rows[0];
}

module.exports = {
  getAllVehicles,
  getVehiclesByClassification,
  getVehicleById,
};

