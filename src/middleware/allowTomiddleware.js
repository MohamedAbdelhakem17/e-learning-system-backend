const AppError = require("../utils/appError");
const httpStatus = require("../config/httpstatus");

const allowTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.user_role)) {
      throw new AppError(
        403,
        httpStatus.FAIL,
        "You are not allowed to access this route."
      );
    }
    next();
  };

module.exports = allowTo;
