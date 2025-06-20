const db = require('../database/dbConfig');

// Get vehicle by inv_id
async function getInventoryById(invId) {
  try {
    console.log(`Getting inventory item with ID: ${invId}`);
    const result = await db.query(
      'SELECT * FROM inventory WHERE inv_id = $1',
      [invId]
    );
    return result.rows[0];
  } catch (error) {
    console.error(`Error in getInventoryById: ${error.message}`);
    throw error;
  }
}

// Get all vehicles by classification name
async function getInventoryByClassificationName(name) {
  try {
    const result = await db.query(`
      SELECT * FROM inventory
      WHERE classification_id = (
        SELECT classification_id FROM classification
        WHERE LOWER(classification_name) = LOWER($1)
      )
    `, [name]);
    return result.rows;
  } catch (error) {
    console.error(`Error in getInventoryByClassificationName: ${error.message}`);
    throw error;
  }
}

// Get classifications list
async function getClassifications() {
  try {
    const result = await db.query('SELECT * FROM classification ORDER BY classification_name');
    return result.rows;
  } catch (error) {
    console.error(`Error in getClassifications: ${error.message}`);
    throw error;
  }
}

// Add new classification
async function addClassification(classification_name) {
  try {
    const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
    return await db.query(sql, [classification_name]);
  } catch (error) {
    console.error(`Error in addClassification: ${error.message}`);
    return error.message;
  }
}

// Add new inventory item
async function addInventory(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) {
  try {
    const sql = `INSERT INTO inventory
      (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    return await db.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
  } catch (error) {
    console.error(`Error in addInventory: ${error.message}`);
    return error.message;
  }
}

/* ***************************
*  Update Inventory Data
* ************************** */
async function updateInventory(
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
) {
 try {
   const sql =
     "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
   const data = await db.query(sql, [
     inv_make,
     inv_model,
     inv_description,
     inv_image,
     inv_thumbnail,
     inv_price,
     inv_year,
     inv_miles,
     inv_color,
     classification_id,
     inv_id
   ])
   return data.rows[0]
 } catch (error) {
   console.error(`Error in updateInventory: ${error.message}`)
   throw error
 }
}

/* ***************************
*  Delete Inventory Item
* ************************** */
async function deleteInventory(inv_id) {
 try {
   const sql = 'DELETE FROM inventory WHERE inv_id = $1'
   const data = await db.query(sql, [inv_id])
   return data
 } catch (error) {
   console.error(`Error in deleteInventory: ${error.message}`)
   throw new Error("Delete Inventory Error")
 }
}

async function getInventoryByClassificationId(classification_id) {
 try {
   const data = await db.query(
     `SELECT * FROM public.inventory AS i
     JOIN public.classification AS c
     ON i.classification_id = c.classification_id
     WHERE i.classification_id = $1`,
     [classification_id]
   )
   return data.rows
 } catch (error) {
   console.error(`Error in getInventoryByClassificationId: ${error.message}`)
   throw error
 }
}

module.exports = {
  getInventoryById,
  getInventoryByClassificationName,
  getClassifications,
  addClassification,
  addInventory,
  updateInventory,
  deleteInventory,
  getInventoryByClassificationId
};
