// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('./errors/NotFoundError');
const ValidationError = require('./errors/ValidationError');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());

// Sample in-memory products database
let products = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the Product API! Go to /api/products to see all products.');
});

// TODO: Implement the following routes:
// // -------------------- CRUD ROUTES --------------------

// GET all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// GET a specific product by ID
app.get('/api/products/:id', (req, res, next) => {
  try {
    const product = products.find(p => p.id === req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// POST create a new product
app.post('/api/products', (req, res, next) => {
  try {
    const { name, description, price, category, inStock } = req.body;

    if (!name || !description || price === undefined || !category || inStock === undefined) {
      throw new ValidationError('All product fields are required');
    }

    const newProduct = {
      id: uuidv4(),
      name,
      description,
      price,
      category,
      inStock
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

// PUT update an existing product
app.put('/api/products/:id', (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');

    const { name, description, price, category, inStock } = req.body;

    if (!name || !description || price === undefined || !category || inStock === undefined) {
      throw new ValidationError('All product fields are required');
    }

    products[index] = { id: req.params.id, name, description, price, category, inStock };
    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE a product
app.delete('/api/products/:id', (req, res, next) => {
  try {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) throw new NotFoundError('Product not found');

    const deletedProduct = products.splice(index, 1);
    res.json({ message: 'Product deleted successfully', deletedProduct });
  } catch (err) {
    next(err);
  }
});

// Example route implementation for GET /api/products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// TODO: Implement custom middleware for:
// - Request logging
// - Authentication
// - Error handling

// Import the error handler middleware
const errorHandler = require('./middleware/errorHandler');

// Use the error handler after all routes
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for testing purposes
module.exports = app; 
