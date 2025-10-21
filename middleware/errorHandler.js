// middleware/errorHandler.js
export default (err, req, res, next) => {
  console.error('Error:', err.message);

  const status = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : 'Internal Server Error';

  res.status(status).json({ status, message });
};
