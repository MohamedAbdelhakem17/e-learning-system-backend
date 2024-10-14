const asyncHandler = require("express-async-handler");

const httpStatus = require("../config/httpstatus");
const AppError = require("../utils/appError");
const UserModel = require("../models/UserModel");

//  @desc   get Logged User education
//  @route  grt  api/v1/education
//  @access Protet/user
const getLoggedUserEducation = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id);
    if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
    res.status(201).json({ status: httpStatus.SUCCESS, data: user.education });
});

//  @desc   Add user education
//  @route  post  api/v1/education
//  @access Protet/user
const addEducation = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { education: req.body } },
        { new: true }
    );
    if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
    res.status(201).json({ status: httpStatus.SUCCESS, data: user.education });
});

//  @desc   update User education
//  @route  put  api/v1/education/:educationId
//  @access Protet/user
const updateEducation = asyncHandler(async (req, res) => {
    const { educationId } = req.params;
    const updatedEducation = req.body;

    const user = await UserModel.findOneAndUpdate(
        { _id: req.user._id, "education._id": educationId },
        { $set: { "education.$": updatedEducation } },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(404, httpStatus.FAIL, "User or education Not Found");
    }

    res.status(200).json({ status: httpStatus.SUCCESS, data: user.education });
});

//  @desc   delete User education
//  @route  delete  api/v1/education/:educationId
//  @access Protet/user
const removeEducation = asyncHandler(async (req, res) => {
    const { educationId } = req.params;
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { education: { _id: educationId } } },
        { new: true }
    );
    if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
    res.status(200).json({ status: httpStatus.SUCCESS, data: user.education });
});

module.exports = {
    getLoggedUserEducation,
    addEducation,
    removeEducation,
    updateEducation,
};
