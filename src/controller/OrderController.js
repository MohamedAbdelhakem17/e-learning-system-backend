// controller/OrderController.js

const asyncHandler = require("express-async-handler");
const Factory = require("./handlersFactory");
const httpStatus = require("../config/httpstatus");
const { systemRoles } = require("../config/systemVariables");
const AppError = require("../utils/appError");

const CoursesModel = require("../models/CoursesModel");
const CartModel = require("../models/CartModel");
const EnrolledCourses = require("../models/EnrolledCourses");
const OrderModel = require("../models/OrdersModel");

const filterOrderForLoggedUser = async (req, res, next) => {
  try {
    // User Filter
    if (req.user.user_role === systemRoles.USER) {
      console.log(req.user.user_role);
      req.body.filterObj = { user: req.user._id };
      return next();
    }

    // Instructor Filter
    if (req.user.is_instructor) {
      const instructorCourses = await CoursesModel.find({ instructor: req.user._id }).select('_id');

      if (instructorCourses.length === 0) {
        req.body.filterObj = { "cartItem": { $size: 0 } };
        return next();
      }

      const courseIds = instructorCourses.map(course => course._id);
      req.body.filterObj = { "cartItem.course": { $in: courseIds } };
      return next();
    }

    // If no conditions matched
    next();
  } catch (error) {
    console.error(error);
    next(new AppError(500, httpStatus.FAIL, 'Internal Server Error'));
  }
};

// @desc get all orders
// @route GET api/v1/order
// @access protect/admin-manager-user
// const findAllOrders = Factory.getAll(OrderModel);
// @desc get All orders for the logged user
// @route GET api/v1/order
// @access protect/admin-manger-user
const findAllOrders = asyncHandler(async (req, res, next) => {
  try {
    const orders = await OrderModel.find(req.body.filterObj || {})
      .populate({
        path: 'cartItem', // This should match the field in your Order schema
        // select: 'title price description', // The fields you want from CourseModel
      });

    res.status(200).json({
      status: httpStatus.SUCCESS,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});


// @desc get a specific order by ID
// @route GET api/v1/order/:id
// @access protect/admin-manager
const getUserOrder = Factory.getOne(OrderModel);

// @desc Create New order
// @route POST api/v1/order
// @access protect/user
const createOrder = asyncHandler(async (req, res, next) => {
  try {
    const user = req.user._id;
    const cart = await CartModel.findOne({ user });

    if (!cart) {
      throw new AppError(404, httpStatus.FAIL, "This user does not have a cart");
    }

    if (!cart.cartItem || cart.cartItem.length === 0) {
      throw new AppError(400, httpStatus.FAIL, "Your cart is empty");
    }

    const totalPrice = cart.discounted_price || cart.total_price;


    const order = await OrderModel.create({
      user,
      totalPrice,
      cartItem: cart.cartItem,
    });

    if (order) {
      // Update courses' enrollment count
      const bulkOptionsForCourses = cart.cartItem.map((item) => ({
        updateOne: {
          filter: { _id: item.course },
          update: {
            $inc: {
              total_student_enrolled: 1,
            },
          },
        },
      }));

      await CoursesModel.bulkWrite(bulkOptionsForCourses);

      // Enroll user in the courses they purchased
      const bulkOptionsForEnrollments = cart.cartItem.map((item) => ({
        insertOne: {
          document: {
            user_id: user,
            courses_id: item.course,
            is_complete: false,
          },
        },
      }));

      await EnrolledCourses.bulkWrite(bulkOptionsForEnrollments);

      // Clear the user's cart after order is placed
      await CartModel.findOneAndDelete({ user });
    }

    res.status(201).json({ status: httpStatus.SUCCESS, data: order });
  } catch (error) {
    next(error);
  }
});

module.exports = {
  createOrder,
  getUserOrder,
  findAllOrders,
  filterOrderForLoggedUser,
};
