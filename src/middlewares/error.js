const mongoose = require("mongoose");
const httpStatus = require("http-status");
const config = require("../config/config");
const logger = require("../config/logger");
const ApiError = require("../utils/ApiError");

// Ensures the status code is valid, defaults to 500 if not
const ensureValidStatusCode = (code) => {
  if (typeof code === "number" && code >= 100 && code <= 599) {
    return code;
  }
  return httpStatus.INTERNAL_SERVER_ERROR;
};

const errorConverter = (err, req, res, next) => {
  let error = err || new Error("Unknown error occurred");

  if (!(error instanceof ApiError)) {
    let statusCode =
      error.statusCode ||
      (error instanceof mongoose.Error
        ? httpStatus.BAD_REQUEST
        : httpStatus.INTERNAL_SERVER_ERROR);

    statusCode = ensureValidStatusCode(statusCode);

    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  error.statusCode = ensureValidStatusCode(error.statusCode);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const { statusCode, message, stack, isOperational } = err;

  const response = {
    code: statusCode,
    message:
      config.env === "development"
        ? message
        : isOperational
        ? message
        : httpStatus[httpStatus.INTERNAL_SERVER_ERROR],
    ...(config.env === "development" && { stack }),
  };

  logger.error(err);
  res.status(statusCode).json(response);
};

module.exports = {
  errorConverter,
  errorHandler,
};
