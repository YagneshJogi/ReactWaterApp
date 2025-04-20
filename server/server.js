const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // React app's origin
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// Static ESP32 IP address
const ESP32_IP = '192.168.1.100'; // Replace with your ESP32's static IP

// Proxy endpoint for ESP32 data
app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get(`http://${ESP32_IP}/data`, {
      timeout: 5000 // 5 second timeout
    });
    
    // Validate the response data
    if (!response.data || typeof response.data !== 'object') {
      throw new Error('Invalid data format from ESP32');
    }

    // Ensure all required fields are present and are numbers
    const requiredFields = ['temp', 'tds', 'do', 'ntu', 'ntu_lin'];
    const data = {};
    
    requiredFields.forEach(field => {
      const value = parseFloat(response.data[field]);
      if (isNaN(value)) {
        throw new Error(`Invalid ${field} value from ESP32`);
      }
      data[field] = value;
    });

    res.json(data);
  } catch (error) {
    console.error('Error fetching data from ESP32:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch data from ESP32',
      details: error.message
    });
  }
});

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    details: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`ESP32 IP: ${ESP32_IP}`);
}); 