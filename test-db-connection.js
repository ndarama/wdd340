require('dotenv').config();
const db = require('./database/dbConfig');

async function testConnection() {
  console.log('Testing database connection...');
  
  try {
    // Test a simple query
    const result = await db.query('SELECT NOW()');
    console.log('Database connection successful!');
    console.log('Current database time:', result.rows[0].now);
    
    // Test getting a vehicle by ID
    console.log('\nTesting getInventoryById...');
    const invModel = require('./models/inventory-model');
    const vehicle = await invModel.getInventoryById(1);
    
    if (vehicle) {
      console.log('Successfully retrieved vehicle:', `${vehicle.inv_make} ${vehicle.inv_model}`);
    } else {
      console.log('No vehicle found with ID 1, trying ID 2...');
      const vehicle2 = await invModel.getInventoryById(2);
      if (vehicle2) {
        console.log('Successfully retrieved vehicle:', `${vehicle2.inv_make} ${vehicle2.inv_model}`);
      } else {
        console.log('No vehicles found with IDs 1 or 2.');
      }
    }
  } catch (error) {
    console.error('Error testing database connection:', error.message);
  } finally {
    // Close the pool to end the process
    db.pool.end();
  }
}

testConnection();