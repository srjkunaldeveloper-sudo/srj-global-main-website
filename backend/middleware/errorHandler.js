const AppError = require("../utils/AppError");

const handleJWTError = () =>
  new AppError("Invalid token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Token expired. Please log in again.", 401);

const handleMySQLError = (err) => {
  if (err.code === "ECONNREFUSED") {
    return new AppError("Database connection failed", 503);
  }

  if (err.code === "ER_DUP_ENTRY") {
    return new AppError("Duplicate entry. This record already exists.", 409);
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    return new AppError("Referenced record not found", 404);
  }

  return new AppError("Database error", 500);
};

const errorHandler = (err, req, res, next) => {
  let error = { ...err, message: err.message, stack: err.stack };

  // Default to 500 if no status code set
  error.statusCode = err.statusCode || 500;
  error.message = err.message || "Internal server error";

  // Handle specific error types
  if (err.name === "JsonWebTokenError") {
    error = handleJWTError();
  }

  if (err.name === "TokenExpiredError") {
    error = handleJWTExpiredError();
  }

  if (err.code === "ECONNREFUSED") {
    error = new AppError("Database connection failed", 503);
  } else if (err.code && err.code.startsWith("ER_")) {
    error = handleMySQLError(err);
  }

  if (err.name === "MulterError") {
    error = new AppError("File upload error: " + err.message, 400);
  }

  if (err.type === "entity.parse.failed") {
    error = new AppError("Invalid JSON in request body", 400);
  }

  // Sync error details
  error.statusCode = error.statusCode || 500;

  // Log the error
  if (error.statusCode >= 500) {
    console.error("[ERROR]", new Date().toISOString(), err.message);
    if (process.env.NODE_ENV !== "production") {
      console.error(err.stack);
    }
  }

  // Send response
  const response = {
    success: false,
    message: error.message,
  };

  if (error.statusCode === 500 && process.env.NODE_ENV === "production") {
    response.message = "Internal server error";
  }

  res.status(error.statusCode).json(response);
};

module.exports = errorHandler;
