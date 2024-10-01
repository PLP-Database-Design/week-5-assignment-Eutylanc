// Load environment variables
require('dotenv').config();

// Import necessary modules
const express = require('express');
const mysql = require('mysql2');

// Create Express app
const app = express();

// Create a connection to the MySQL database using credentials from .env
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
    } else {
        console.log('Connected to the database successfully.');
    }
});

// Sample route
app.get('/', (req, res) => {
    res.send('Database connection established!');
});

// Question 1
// GET endpoint to retrieve all patients
app.get('/patients', (req, res) => {
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error retrieving patients data' });
            return;
        }
        res.status(200).json(results);
    });
});

// Question 2
// GET endpoint to retrieve all providers
app.get('/providers', (req, res) => {
    const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data:', err);
            res.status(500).json({ error: 'Error retrieving providers data' });
            return;
        }
        res.status(200).json(results);
    });
});

// Question 3
// GET endpoint to retrieve patients by their first name
app.get('/patients', (req, res) => {
    const { first_name } = req.query;
  
    if (!first_name) {
      return res.status(400).json({ error: 'Please provide a first name as a query parameter.' });
    }
  
    const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
    connection.query(query, [first_name], (error, results) => {
      if (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ error: 'An error occurred while retrieving data.' });
      }
  
      res.json(results);
    });
  });
  
//   Question 4
// Create GET endpoint to retrieve all providers by specialty
app.get('/providers', (req, res) => {
    const { specialty } = req.query;

    // Check if the specialty is provided
    if (!specialty) {
        return res.status(400).json({ message: 'Specialty is required' });
    }

    // Query to find providers by their specialty
    const query = 'SELECT * FROM providers WHERE specialty = ?';

    // Execute the MySQL query
    db.query(query, [specialty], (err, results) => {
        if (err) {
            // Handle any errors from the query
            return res.status(500).json({ message: 'Server error', error: err.message });
        }

        // If no providers found, return a 404
        if (results.length === 0) {
            return res.status(404).json({ message: `No providers found for specialty: ${specialty}` });
        }

        // Return the list of providers
        return res.status(200).json(results);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
