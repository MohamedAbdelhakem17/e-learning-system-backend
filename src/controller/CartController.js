const asyncHandler = require("express-async-handler");

const httpStatus = require("../config/httpstatus");
const AppError = require("../utils/appError");

const CoursesModel = require("../models/CoursesModel");
// const CouponModel = require("../models/CouponModel");
const CartModel = require("../models/CartModel");

const calculateCartTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItem.forEach(({ price }) => {
    totalPrice += price;
  });
  cart.total_price = totalPrice.toFixed(2);
  cart.discounted_price = undefined;
};



//  @desc    get user cart
//  @route   GET / api/v1/cart
//  @access  protect/user
const getUserCart = asyncHandler(async (req, res) => {
  const user = req.user._id;

  const userCart = await CartModel.findOne({ user }).populate({
    path: "cartItem.course",
    select: "name description slug imageCover ratingsAverage ratingsQuantity ",
  });

  if (!userCart) {
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: "This user doesn't have a cart.",
    });
  }

  if (userCart.cartItem.length === 0) {
    return res.status(200).json({
      status: httpStatus.SUCCESS,
      data: "You don't have any items in the cart.",
    });
  }

  const data = {
    ...userCart._doc,
    totalItemInCart: userCart.cartItem.length
  };

  res.status(200).json({ status: httpStatus.SUCCESS, data });
});

//  @desc    Add Course to cart
//  @route   post / api/v1/cart
//  @access  protect/user
const addCourseToCart = asyncHandler(async (req, res) => {
  const { course } = req.body;
  const user = req.user._id;

  let userCart = await CartModel.findOne({ user });
  const selectCourse = await CoursesModel.findById(course);

  if (!userCart) {
    userCart = await CartModel.create({
      cartItem: [
        {
          course,
          price: selectCourse.price,
        },
      ],
      total_price: selectCourse.price,
      user,
    });
  }

  else {
    const CourseIndex = userCart.cartItem.findIndex((currentValue) => currentValue.course.toString() === course);

    if (CourseIndex > -1) {
      throw new AppError(400, httpStatus.FAIL, "This Course alrady add to cart")

    } else {
      userCart.cartItem.push({
        course,
        price: selectCourse.price,
      });
    }
  }

  calculateCartTotalPrice(userCart);
  await userCart.save();
  res.status(201).json({ status: httpStatus.SUCCESS, data: userCart.cartItem });
});

//  @desc    delete  user cart
//  @route   delete / api/v1/cart:cartId
//  @access  protect/user
const deleteUserCart = asyncHandler(async (req, res) => {
  const { cartId } = req.params;
  const user = req.user._id;
  const userCart = await CartModel.findOneAndDelete({ _id: cartId, user });
  if (!userCart)
    throw new AppError(404, httpStatus.FAIL, "this User dont have cart ");
  res.status(200).json({ status: httpStatus.SUCCESS, data: null });
});

//  @desc    delete  user cart
//  @route   delete / api/v1/cart:itemId
//  @access  protect/user
const removeItemFromCart = asyncHandler(async (req, res) => {
  const { itemId } = req.params;
  const user = req.user._id;

  const userCart = await CartModel.findOneAndUpdate(
    { user },
    { $pull: { cartItem: { _id: itemId } } },
    { new: true }
  );

  if (!userCart) {
    throw new AppError(404, httpStatus.FAIL, "This user doesn't have a cart.");
  }

  calculateCartTotalPrice(userCart);

  const data = {
    ...userCart._doc,
  };

  res.status(200).json({ status: httpStatus.SUCCESS, data });
});




// //  @desc    update Cart Item Quantity
// //  @route   PUT /api/v1/cart/applyCoupon
// //  @access  protect/user
// const applyCouponToUserCart = asyncHandler(async (req, res) => {
//   const userId = req.user._id;
//   const currentDate = Date.now();

//   const coupon = await CouponModel.findOne({
//     name: req.body.coupon,
//     expired: { $gte: currentDate },
//   });

//   if (!coupon) {
//     throw new AppError(
//       400,
//       httpStatus.FAIL,
//       "Invalid or expired coupon. Please check your coupon details."
//     );
//   }

//   const userCart = await CartModel.findOne({ user: userId });

//   if (!userCart) {
//     throw new AppError(
//       404,
//       httpStatus.FAIL,
//       "User cart not found. Please make sure the cart exists."
//     );
//   }

//   userCart.totalPriceAfterDiscount = (
//     userCart.totalPrice -
//     (userCart.totalPrice * coupon.discount) / 100
//   ).toFixed(2);

//   await userCart.save();

//   const data = {
//     ...userCart._doc,
//     totalItemInCart: calculateCartTotalQuantity(userCart),
//   };

//   res.status(200).json({
//     status: httpStatus.SUCCESS,
//     data,
//   });
// });

module.exports = {
  getUserCart,
  addCourseToCart,
  deleteUserCart,
  removeItemFromCart,
  // applyCouponToUserCart,
};
