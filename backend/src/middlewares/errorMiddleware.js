const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error(err.stack);

  // Set HTTP status code
  const statusCode = err.statusCode || 500;
  res.status(statusCode);

  // Send JSON response
  res.json({
      message: err.message || 'An unexpected error occurred',
      // Include stack trace in development environment only
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;
