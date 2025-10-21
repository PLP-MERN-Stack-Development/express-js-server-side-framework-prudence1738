// server.js - Starter Express server for Week 2 assignment

// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const NotFoundError = require('./errors/NotFoundError');
const ValidationError = require('./errors/ValidationError');
const validateProduct = require('./middleware/validateProduct');

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


// GET all products with filtering, pagination, and search
app.get('/api/products', (req, res) => {
  let results = [...products]; // clone the products array

  // 🔍 Search by name (case-insensitive)
  if (req.query.search) {
    const search = req.query.search.toLowerCase();
    results = results.filter(p => p.name.toLowerCase().includes(search));
  }

  // 🏷️ Filter by category
  if (req.query.category) {
    results = results.filter(p => p.category === req.query.category.toLowerCase());
  }

  // 📄 Pagination
  const page = parseInt(req.query.page) || 1;      // default page 1
  const limit = parseInt(req.query.limit) || 2;    // default 2 products per page
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedResults = results.slice(startIndex, endIndex);

  res.json({
    page,
    limit,
    total: results.length,
    results: paginatedResults
  });
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

//  POST create a new product
app.post('/api/products', validateProduct, (req, res) => {
  const { name, description, price, category, inStock } = req.body;

  const newProduct = {
    id: uuidv4(), // generates unique ID
    name,
    description,
    price,
    category,
    inStock
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
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


//  Product statistics (count by category)
app.get('/api/products/stats', (req, res) => {
  const stats = {};
  products.forEach(p => {
    const category = p.category.toLowerCase();
    stats[category] = (stats[category] || 0) + 1;
  });

  res.json({
    totalProducts: products.length,
    countByCategory: stats
  });
});

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
