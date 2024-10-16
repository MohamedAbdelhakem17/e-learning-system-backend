// const asyncHandler = require("express-async-handler");
// const httpstatus = require("../config/httpstatus");
// const AppError = require("../utils/appError");
const Factory = require("./handlersFactory");
const UserModel = require("../models/UserModel");
/**
 * Fetch all instructors from the database.
 * @route GET /api/v1/instructors
 * @access Public
 */

const createFilterObj = (req, res, next) => {
    const filterObject = { is_instructor: true };
    req.body.filterObj = filterObject;
    next();
};

const getInstructors = Factory.getAll(UserModel, {
    name: 1,
    numberOfStudent: 1,
    rate: 1,
    specialization: 1,
    profile_pic: 1,
    first_name: 1,
    last_name: 1,
});

/**
 * Fetch a specific instructor by ID.
 * @route GET /api/v1/instructors/:id
 * @access Public
 * @param {string} id - The ID of the instructor to retrieve
 */
const getInstructor = Factory.getOne(UserModel)

module.exports = {
    createFilterObj,
    getInstructors,
    getInstructor,
};
