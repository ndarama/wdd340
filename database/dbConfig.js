const { Pool } = require('pg');

// Create a connection pool with improved configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 10000, // Increased timeout to 10 seconds
  idleTimeoutMillis: 30000, // How long a client is allowed to remain idle before being closed
  max: 10, // Maximum number of clients in the pool
});

// Add event listeners for connection pool events
pool.on('connect', () => {
  console.log('Database connection established');
});

pool.on('error', (err) => {
  console.error('Unexpected database error:', err);
  // If this is a connection error, we might want to attempt reconnection
  if (err.code === 'ECONNREFUSED' || err.code === 'ETIMEDOUT') {
    console.log('Connection error detected, will retry on next query');
  }
});

// Add connection acquisition error handling
pool.on('acquire', (client) => {
  console.log('Client acquired from pool');
});

pool.on('remove', () => {
  console.log('Client removed from pool');
});

// Add a wrapper function to execute queries with better error handling and retry logic
const query = async (text, params, retries = 2) => {
  console.log('Executing query:', { text, params });
  const start = Date.now();
  
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('Query executed in', duration, 'ms');
      return res;
    } catch (err) {
      const isRetryableError =
        err.code === 'ECONNREFUSED' ||
        err.code === 'ETIMEDOUT' ||
        err.message.includes('Connection terminated') ||
        err.message.includes('connection timeout');
      
      if (isRetryableError && attempt < retries) {
        const retryDelay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Retryable error encountered, retrying in ${retryDelay}ms (attempt ${attempt + 1}/${retries})`, err.message);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        continue;
      }
      
      console.error('Query error:', err);
      throw err;
    }
  }
};

module.exports = {
  query,
  pool
};
