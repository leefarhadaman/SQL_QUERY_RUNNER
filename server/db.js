const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

// Function to create a database connection pool
const createConnection = async (database) => {
  return mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database, // Dynamically set database
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });
};

// Function to execute SQL queries
const executeQuery = async (query, params = [], connectionPool) => {
  try {
    const [results] = await connectionPool.execute(query, params); // Use parameterized queries
    return results;
  } catch (error) {
    throw new Error(error.sqlMessage || 'Database query failed');
  }
};

module.exports = { createConnection, executeQuery };
