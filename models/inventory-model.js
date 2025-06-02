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

// Get classifications (for navigation)
async function getClassifications() {
  const result = await pool.query('SELECT * FROM classification ORDER BY classification_name');
  return result.rows;
}

module.exports = {
  getInventoryById,
  getInventoryByClassificationName,
  getClassifications
};
