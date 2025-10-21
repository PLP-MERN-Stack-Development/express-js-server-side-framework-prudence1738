// middleware/validateProduct.js

export default (req, res, next) => {
  const { name, description, price, category, inStock } = req.body;

  // Check for missing required fields
  if (!name || !description || price === undefined || !category || inStock === undefined) {
    return res.status(400).json({ message: 'All product fields are required.' });
  }

  // Validate data types
  if (typeof name !== 'string' || typeof description !== 'string' || typeof category !== 'string') {
    return res.status(400).json({ message: 'Name, description, and category must be strings.' });
  }

  if (typeof price !== 'number' || price < 0) {
    return res.status(400).json({ message: 'Price must be a positive number.' });
  }

  if (typeof inStock !== 'boolean') {
    return res.status(400).json({ message: 'inStock must be true or false.' });
  }

  next(); // Everything is valid → continue to route handler
};
