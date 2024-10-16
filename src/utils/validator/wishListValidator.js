const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");
const CoursesModel = require("../../models/CoursesModel");


const addToWishListValidator = [
    check("courseId")
      .trim()
      .notEmpty()
      .withMessage("Course Id is required.")
      .isMongoId()
      .withMessage("This is not a valid ID.")
      .custom(async (val, { req }) => {
        const Course = await CoursesModel.findById(val);
        if (!Course) {
          throw new Error("This Course not found.");
        }
        return true;
      }),
    validatorMiddleware,
  ];

  module.exports = {
    addToWishListValidator
  }