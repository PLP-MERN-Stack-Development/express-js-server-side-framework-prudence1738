// middleware/auth.js
export default (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validKey = process.env.API_KEY || '12345'; // fallback if no .env

  if (!apiKey || apiKey !== validKey) {
    return res.status(401).json({ message: 'Unauthorized: Invalid API key' });
  }

  next(); // Allow request to continue if key is valid
};
