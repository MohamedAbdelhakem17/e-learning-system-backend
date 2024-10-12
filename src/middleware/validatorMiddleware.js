const { validationResult } = require("express-validator");

const AppError = require("../utils/appError");
const { FAIL } = require("../config/httpstatus");

const validatorMiddleware = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().reduce((acc, error) => {
      acc[error.path] = (acc[error.path] || []).concat(error.msg);
      return acc;
    }, {});
    throw new AppError(400, FAIL, errors);
  }
  next();
};

module.exports = validatorMiddleware;
