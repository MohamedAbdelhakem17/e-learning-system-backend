const asyncHandler = require("express-async-handler");

const httpStatus = require("../config/httpstatus");
const AppError = require("../utils/appError");

const UserModel = require("../models/UserModel");

//  @desc   get Logged User social media links
//  @route  grt  api/v1/socialMediaLinks
//  @access Protet/user
const getLoggedUserSocialMediaLinks = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user._id);
    if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
    res.status(201).json({ status: httpStatus.SUCCESS, data: user.social_media_links });
});

//  @desc   Add user social media links
//  @route  post  api/v1/socialMediaLinks
//  @access Protet/user
const addSocialMediaLink = asyncHandler(async (req, res) => {
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $addToSet: { social_media_links: req.body } },
        { new: true }
    );
    if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
    res.status(201).json({ status: httpStatus.SUCCESS, data: user.social_media_links });
});

//  @desc   update User social media links
//  @route  put  api/v1/socialMediaLinks/:linkId
//  @access Protet/user
const updateSocialMediaLink = asyncHandler(async (req, res) => {
    const { linkId } = req.params;
    const updatedLink = req.body;

    const user = await UserModel.findOneAndUpdate(
        { _id: req.user._id, "social_media_links._id": linkId },
        { $set: { "social_media_links.$": updatedLink } },
        { new: true, runValidators: true }
    );

    if (!user) {
        throw new AppError(404, httpStatus.FAIL, "User or social media links Not Found");
    }

    res.status(200).json({ status: httpStatus.SUCCESS, data: user.social_media_links });
});

//  @desc   delete User socialMediaLinks
//  @route  delete  api/v1/socialMediaLinks/:linkId
//  @access Protet/user
const removeSocialMediaLink = asyncHandler(async (req, res) => {
    const { linkId } = req.params;
    const user = await UserModel.findByIdAndUpdate(
        req.user._id,
        { $pull: { social_media_links: { _id: linkId } } },
        { new: true }
    );
    if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
    res.status(201).json({ status: httpStatus.SUCCESS, data: user.social_media_links });
});

module.exports = {
    getLoggedUserSocialMediaLinks,
    addSocialMediaLink,
    removeSocialMediaLink,
    updateSocialMediaLink,
};
