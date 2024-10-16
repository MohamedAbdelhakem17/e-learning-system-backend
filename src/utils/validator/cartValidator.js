const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const CoursesModel = require("../../models/CoursesModel");
const EnrolledCourses = require("../../models/EnrolledCourses")

const addcourseToCartValidator = [
  check("course")
    .trim()
    .notEmpty()
    .withMessage("course ID is required.")
    .isMongoId()
    .withMessage("Invalid course ID format.")
    .custom(async (id, { req }) => {
      const course = await CoursesModel.findById(id);
      if (!course) throw new Error("course does not exist.");
      req.course = course;
      return true;
    })
    .custom(async (id, { req }) => {
      const course = await EnrolledCourses.findOne({user_id:req.user._id , courses_id:id});
      if (course) throw new Error("you Enrolled in this Courses");
      req.course = course;
      return true;
    }),

  validatorMiddleware,
];



module.exports = {
  addcourseToCartValidator,

};
