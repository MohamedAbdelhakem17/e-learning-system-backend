const asyncHandler = require("express-async-handler");

const httpStatus = require("../config/httpstatus");
const AppError = require("../utils/appError");

const UserModel = require("../models/UserModel");

//  @desc   get Logged User Wish list
//  @route  grt  api/v1/wishlist
//  @access Protet/user
const getLoggedUserWishlist = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.user._id).populate({
    path: "wishlist",
    select:"name imageCover slug description price ratingsAverage ratingsQuantity"
  });
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.wishlist });
});

//  @desc   Add Product To Wish list
//  @route  post  api/v1/wishlist
//  @access Protet/user
const addToWishList = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: courseId } },
    { new: true }
  );
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.wishlist });
});

//  @desc   delete Product From Wish list
//  @route  Get  api/v1/wishlis:productId
//  @access Protet/user
const removeFromWishList = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = await UserModel.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: productId } },
    { new: true }
  );
  if (!user) throw new AppError(404, httpStatus.FAIL, "This User Not Found");
  res.status(201).json({ status: httpStatus.SUCCESS, data: user.wishlist });
});

module.exports = { getLoggedUserWishlist, addToWishList, removeFromWishList };
