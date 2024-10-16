const Factory = require("./handlersFactory");
const { InstructorReviewModel } = require("../models/ReviewsModel");

// Nested route
// GET /api/v1/instructor/:instructorId/reviews
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
const getAllReviews = Factory.getAll(InstructorReviewModel);

// @desc    get All Review
// @route   get api/v1/review
// @access  Public
const getReview = Factory.getOne(InstructorReviewModel);


// Nested route
// GET /api/v1/course/:InstructorId/reviews
const setInstructorIdToBody = (req, res, next) => {
  if (!req.body.instructor) req.body.instructor = req.params.InstructorId;
  next();
};

// @desc    Create New Review
// @route   Post api/v1/review
// @access  protect/user
const createReview = Factory.createOne(InstructorReviewModel);

// @desc    update Review
// @route   put api/v1/review/:id
// @access  protect/user
const updateReview = Factory.updateOne(InstructorReviewModel);

// @desc    delete Review
// @route   Post api/v1/review/:id
// @access  protect/user
const deleteReview = Factory.deleteOne(InstructorReviewModel);

module.exports = {
  getAllReviews,
  createFilterObject,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setInstructorIdToBody
};
