const express = require('express');
const { json } = require('body-parser');
const { productRoute } = require('./routes/productsRoute');
const { verifyKey } = require('./routes/validation');

const app = express();

// Middleware
app.use(json());

// Routes
app.use(productRoute);

// Handle routes that are out of bounds.
app.all('*', verifyKey, (req, res) => {
  return res.status(400).send({ success: false, message: 'Route not found' });
});

module.exports = app;
