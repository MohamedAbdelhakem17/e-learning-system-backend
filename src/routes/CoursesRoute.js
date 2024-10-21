const express = require("express");


const { systemRoles } = require("../config/systemVariables");
const protect = require("../middleware/protectMiddleware")
const allowTo = require("../middleware/allowTomiddleware");
const isInstructor = require("../middleware/isInstructorMiddleware")
const CoursesController = require("../controller/CoursesController");

const router = express.Router({ mergeParams: true });

// Nested Route
const LessonRoute = require("./LessonRoute");
const ReviewCourseRoute = require("./ReviewCourseRoute");

router.use("/:courseId/lessons", LessonRoute);
router.use("/:courseId/reviewCourse", ReviewCourseRoute);


router
  .route("/")
  .get(CoursesController.createFilterObj, CoursesController.getCourses)

  .post(
    protect,
    isInstructor,
    allowTo(systemRoles.ADMIN, systemRoles.INSTRUCTOR),
    CoursesController.imageCourseUpload,
    CoursesController.imageManipulation,
    CoursesController.uploadVideo("introductory_video"),
    CoursesController.handelVideoUpload,
    CoursesController.setCategoryIdToBody,
    CoursesController.createCourse
  );

router
  .route("/:id")
  .get(CoursesController.getCourse)

  .put(
    protect,
    isInstructor,
    allowTo(systemRoles.ADMIN, systemRoles.INSTRUCTOR),
    CoursesController.imageCourseUpload,
    CoursesController.imageManipulation,
    CoursesController.updateCourse
  )

  .delete(
    protect,
    isInstructor,
    allowTo(systemRoles.ADMIN, systemRoles.INSTRUCTOR),
    CoursesController.deleteCourse
  );

module.exports = router;
