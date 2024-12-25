const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createConnection, executeQuery } = require('./db'); // Import connection and query functions

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

let connectionPool; // Store the database connection pool

// API to Connect to the Database
app.post('/api/connect', async (req, res) => {
  const { database } = req.body;

  if (!database || typeof database !== 'string' || !database.trim()) {
    return res.status(400).json({ success: false, error: 'Invalid or empty database name' });
  }

  try {
    // Create a connection pool for the specified database
    connectionPool = await createConnection(database);
    res.json({ success: true, message: `Connected to database: ${database}` });
  } catch (error) {
    res.status(500).json({ success: false, error: `Failed to connect to database: ${error.message}` });
  }
});

// API to Execute SQL Query
app.post('/api/run-query', async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== 'string' || !query.trim()) {
    return res.status(400).json({ success: false, error: 'Invalid or empty query' });
  }

  if (!connectionPool) {
    return res.status(400).json({ success: false, error: 'No database connection established. Please connect first.' });
  }

  try {
    const results = await executeQuery(query, [], connectionPool); // Use the connection pool
    res.json({ success: true, results });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
