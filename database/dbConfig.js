// database/dbConfig.js
// Configure and export a shared PG Pool instance for querying
require('dotenv').config();
const { Pool } = require('pg');

// Use a single DATABASE_URL or individual PG_* vars
const poolConfig = process.env.DATABASE_URL
  ? { connectionString: process.env.DATABASE_URL }
  : {
      host:     process.env.PGHOST,
      port:     parseInt(process.env.PGPORT, 10),
      database: process.env.PGDATABASE,
      user:     process.env.PGUSER,
      password: process.env.PGPASSWORD,
    };

// Enforce SSL in production
if (process.env.NODE_ENV === 'production') {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = new Pool(poolConfig);

module.exports = {
  /**
   * Execute a SQL query against the database.
   * @param {string} text - SQL statement
   * @param {Array<any>} params - Parameter values
   * @returns {Promise<object>} - Query result
   */
  query: (text, params) => pool.query(text, params),
};
