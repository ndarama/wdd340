const pool = require('../database/dbConfig');

// Get vehicle by inv_id
async function getInventoryById(invId) {
  const result = await pool.query(
    'SELECT * FROM inventory WHERE inv_id = $1',
    [invId]
  );
  return result.rows[0];
}

// Get all vehicles by classification name
async function getInventoryByClassificationName(name) {
  const result = await pool.query(`
    SELECT * FROM inventory
    WHERE classification_id = (
      SELECT classification_id FROM classification
      WHERE LOWER(classification_name) = LOWER($1)
    )
  `, [name]);
  return result.rows;
}

// Get classifications list
async function getClassifications() {
  const result = await pool.query('SELECT * FROM classification ORDER BY classification_name');
  return result.rows;
}

// Add new classification
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await pool.query(sql, [classification_name]);
  } catch (error) {
    return error.message;
  }
}

// Add new inventory item
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
  } catch (error) {
    return error.message;
  }
}

module.exports = {
  getInventoryById,
  getInventoryByClassificationName,
  getClassifications,
  addClassification,
  addInventory
};
