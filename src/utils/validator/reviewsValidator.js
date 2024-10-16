const { check } = require("express-validator");
const { userRoles } = require("../../config/systemVariables");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const UserModel = require("../../models/UserModel");
const { CourseReviewModel, InstructorReviewModel } = require("../../models/ReviewsModel");


const createReviewValidator = (isCourseReview = true) => [
  // Title validation
  check("review.title")
    .optional()
    .notEmpty()
    .withMessage("Title must not be empty"),

  // Rating validation
  check("review.rate")
    .notEmpty()
    .withMessage("Rating value is required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating value must be between 1 to 5"),

  // User ID validation
  check("review.user")
    .isMongoId()
    .withMessage("Invalid User ID format")
    .custom(async (val, { req }) => {
      const user = await UserModel.findById(val);
      if (!user) throw new Error(`No user found for this ID: ${val}`);
      if (user._id.toString() !== req.user._id.toString())
        throw new Error(`You cannot post a review for another user.`);
      return true;
    }),

  // Course review validation (if isCourseReview is true)
  check("course")
    .if(() => isCourseReview)
    .isMongoId()
    .withMessage("Invalid Course ID format")
    .notEmpty()
    .withMessage("Course ID is required")
    .custom(async (val, { req }) => {
      const existingReview = await CourseReviewModel.findOne({
        course: val,
        "review.user": req.user._id,
      });
      if (existingReview) throw new Error("You have already reviewed this course.");
      return true;
    }),

  check("instructor")
    .if(() => !isCourseReview)
    .isMongoId()
    .withMessage("Invalid Instructor ID format")
    .notEmpty()
    .withMessage("Instructor ID is required")
    .custom(async (val, { req }) => {
      const isInstructor = await UserModel.findOne({
        is_instructor: true,
        _id: val
      });
      if (isInstructor) throw new Error("this is not an instructor.");
      return true;
    })

    .custom(async (val, { req }) => {
      const existingReview = await InstructorReviewModel.findOne({
        instructor: val,
        "review.user": req.user._id,
      });
      if (existingReview) throw new Error("You have already reviewed this instructor.");
      return true;
    }),

  // Validator middleware to handle errors
  validatorMiddleware,
];

module.exports = createReviewValidator;

const getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

const updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review ID format")
    .custom(async (val, { req }) => {
      const review = await CourseReviewModel.findById(val);
      if (!review) throw new Error(`No review found for this ID: ${val}`);

      if (req.user._id.toString() !== review.user._id.toString())
        throw new Error("You are not authorized to perform this action");

      if (req.body.user && req.body.user !== req.user._id.toString()) {
        const user = await UserModel.findById(req.body.user);
        if (!user) throw new Error(`No user found for this ID: ${req.body.user}`);

        if (user._id.toString() !== req.user._id.toString())
          throw new Error("You can't update a review with a different ID for another user.");
      }

      return true;
    }),

  validatorMiddleware,
];

const deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom(async (val, { req }) => {
      const review = await CourseReviewModel.findById(val);
      if (!review) throw new Error(`NO review For This Id ${val}`);

      if (req.user.role === userRoles.USER) {
        if (req.user._id.toString() !== review.user._id.toString())
          throw new Error("You are not authorized to perform this action");
      }

      return true;
    }),
  validatorMiddleware,
];

module.exports = {
  createReviewCourseValidator: createReviewValidator(),
  createReviewInstructorValidator: createReviewValidator(false),
  getReviewValidator,
  updateReviewValidator,
  deleteReviewValidator,
};
