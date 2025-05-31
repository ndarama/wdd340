const pool = require('../database/dbConfig');

async function getInventoryById(invId) {
  try {
    const result = await pool.query(
      'SELECT * FROM inventory WHERE inv_id = $1',
      [invId]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getInventoryById
};
