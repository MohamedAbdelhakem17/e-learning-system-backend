const Factory = require("./handlersFactory");
const { CourseReviewModel } = require("../models/ReviewsModel");

// Nested route
// GET /api/v1/course/:courseId/reviews
const createFilterObject = (req, res, next) => {
  const filterObject = req.params.productId
    ? { product: req.params.productId }
    : {};

  req.body.filterObj = filterObject;
  next();
};

// @desc    get All Reviews
// @route   get api/v1/reviews
// @access  Public
const getAllReviews = Factory.getAll(CourseReviewModel);

// @desc    get All Review
// @route   get api/v1/review
// @access  Public
const getReview = Factory.getOne(CourseReviewModel);

// Nested route
// GET /api/v1/course/:courseId/reviews
const setCourseIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.course = req.params.courseId;
  next();
};

// Nested route
// GET /api/v1/course/:courseId/reviews
const setInstructorIdToBody = (req, res, next) => {
  if (!req.body.product) req.body.instructor = req.params.InstructorId;
  next();
};

// @desc    Create New Review
// @route   Post api/v1/review
// @access  protect/user
const createReview = Factory.createOne(CourseReviewModel);

// @desc    update Review
// @route   put api/v1/review/:id
// @access  protect/user
const updateReview = Factory.updateOne(CourseReviewModel);

// @desc    delete Review
// @route   Post api/v1/review/:id
// @access  protect/user
const deleteReview = Factory.deleteOne(CourseReviewModel);

module.exports = {
  getAllReviews,
  createFilterObject,
  getReview,
  createReview,
  setCourseIdToBody,
  updateReview,
  deleteReview,
  setInstructorIdToBody
};
