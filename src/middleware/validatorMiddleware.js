const { validationResult } = require("express-validator");

const AppError = require("../utils/appError");
const { FAIL } = require("../config/httpstatus");
const errorFormat = require("../utils/errorFormat")

const validatorMiddleware = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
      throw new AppError(400, FAIL, errorFormat(errors.array()))
  }
  next()
}

module.exports = validatorMiddleware;
