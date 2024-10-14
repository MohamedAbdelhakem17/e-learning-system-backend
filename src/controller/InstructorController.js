const asyncHandler = require("express-async-handler");
const httpstatus = require("../config/httpstatus");
const AppError = require("../utils/appError");
const UserModel = require("../models/UserModel");

/**
 * Fetch all instructors from the database.
 * @route GET /api/v1/instructors
 * @access Public
 */
const getInstructors = asyncHandler(async (req, res) => {
    const instructors = await UserModel.find(
        { is_instructor: true },
        { name: 1, numberOfStudent: 1, rate: 1, specialization: 1, profile_pic: 1 }
    );

    res.status(200).json({
        status: httpstatus.SUCCESS,
        data: instructors
    });
});

/**
 * Fetch a specific instructor by ID.
 * @route GET /api/v1/instructors/:id
 * @access Public
 * @param {string} id - The ID of the instructor to retrieve
 */
const getInstructor = asyncHandler(async (req, res) => {
    const instructorId = req.params.id;
    const instructor = await UserModel.findById(instructorId, { password: 0, __v: 0 });
    if (!instructor) {
        throw new AppError(404, httpstatus.FAIL, "Instructor not found");
    }
    res.status(200).json({
        status: httpstatus.SUCCESS,
        data: instructor
    });
});

module.exports = {
    getInstructors,
    getInstructor
};
