//Server.js//
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const moment = require('moment-timezone');

const app = express();
const port = 5000;

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Vansh@123',
  database: 'root_server_traffic'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Connected to the database');
});

// Middleware
app.use(cors());
app.use(express.json());

// Function to fetch data from a single table
const fetchDataFromTable = (tableName) => {
  return new Promise((resolve, reject) => {
    const query = `SELECT date, country, town FROM ${tableName} ORDER BY date DESC`;
    db.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

// Endpoint to fetch timeline data for a specific table
app.get('/api/timeline/:table', async (req, res) => {
  const tableName = req.params.table;

  // Validate the table name to avoid SQL injection
  const validTables = ['differences_a', 'differences_b', 'differences_c', 'differences_d', 'differences_e',
                       'differences_f', 'differences_g', 'differences_h', 'differences_i', 'differences_j',
                       'differences_k', 'differences_l', 'differences_m'];

  if (!validTables.includes(tableName)) {
    return res.status(400).json({ error: 'Invalid table name' });
  }

  try {
    const results = await fetchDataFromTable(tableName);

    // Adjust dates to the desired time zone (e.g., 'Asia/Kolkata')
    results.forEach(row => {
      row.date = moment(row.date).tz('Asia/Kolkata').format('YYYY-MM-DD');
    });

    res.json(results);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
