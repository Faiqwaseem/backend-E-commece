const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  /*
   |--------------------------------------------------------------------------
   | MONGOOSE CAST ERROR
   |--------------------------------------------------------------------------
   | Invalid MongoDB ObjectId
   */

  if (err.name === "CastError") {
    statusCode = 400;

    message = `Invalid resource ID: ${err.path}`;
  }

  /*
   |--------------------------------------------------------------------------
   | MONGOOSE DUPLICATE KEY ERROR
   |--------------------------------------------------------------------------
   | Example:
   | Email already exists
   */

  if (err.code === 11000) {
    statusCode = 409;

    const field = Object.keys(err.keyValue)[0];

    message = `${field} already exists`;
  }

  /*
   |--------------------------------------------------------------------------
   | MONGOOSE VALIDATION ERROR
   |--------------------------------------------------------------------------
   | Schema validation errors
   */

  if (err.name === "ValidationError") {
    statusCode = 400;

    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  /*
   |--------------------------------------------------------------------------
   | JWT INVALID TOKEN
   |--------------------------------------------------------------------------
   */

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;

    message = "Invalid token";
  }

  /*
   |--------------------------------------------------------------------------
   | JWT EXPIRED TOKEN
   |--------------------------------------------------------------------------
   */

  if (err.name === "TokenExpiredError") {
    statusCode = 401;

    message = "Token expired";
  }

  /*
   |--------------------------------------------------------------------------
   | MULTER FILE UPLOAD ERRORS
   |--------------------------------------------------------------------------
   */

  if (err.name === "MulterError") {
    statusCode = 400;

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size too large";
    } else {
      message = err.message;
    }
  }

  /*
   |--------------------------------------------------------------------------
   | DEFAULT ERROR RESPONSE
   |--------------------------------------------------------------------------
   */

  res.status(statusCode).json({
    success: false,

    message,

    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorMiddleware;
