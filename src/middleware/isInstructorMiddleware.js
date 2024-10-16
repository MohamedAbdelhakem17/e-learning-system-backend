const AppError = require("../utils/appError");
const httpStatus = require("../config/httpstatus");
const { systemRoles } = require("../config/systemVariables")

const isInstructor = (req, res, next) => {
    if (req.user.user_role === systemRoles.ADMIN) return next()

    if (!req.user.is_instructor) {
        throw new AppError(
            403,
            httpStatus.FAIL,
            "You are not allowed to access this route."
        );
    }

    req.user.user_role = systemRoles.INSTRUCTOR
    next();
};

module.exports = isInstructor;
