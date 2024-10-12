const AppError = require("../appError");

const createValidationError =
  (statusCode, status, message) =>
  (value, { req }) =>
    new AppError(statusCode, status, message);
module.exports = createValidationError;
