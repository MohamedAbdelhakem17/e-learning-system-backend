const express = require("express");


const { systemRoles } = require("../config/systemVariables");
const protect = require("../middleware/protectMiddleware")
const allowTo = require("../middleware/allowTomiddleware");
const isInstructor = require("../middleware/isInstructorMiddleware")
const LessonController = require("../controller/LessonController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(LessonController.createFilterObj, LessonController.getLessons)

  .post(
    protect,
    isInstructor,
    allowTo(systemRoles.INSTRUCTOR),
    LessonController.imageLessonUpload,
    LessonController.imageManipulation,
    LessonController.uploadVideo("video"),
    LessonController.handelVideoUpload,
    LessonController.setCourseIdToBody,
    LessonController.createLesson
  );

router
  .route("/:id")
  .get(LessonController.getLesson)

  .put(
    protect,
    isInstructor,
    allowTo(systemRoles.INSTRUCTOR),
    LessonController.imageLessonUpload,
    LessonController.imageManipulation,
    LessonController.updateLesson
  )

  .delete(
    protect,
    isInstructor,
    allowTo(systemRoles.INSTRUCTOR),
    LessonController.deleteLesson
  );

module.exports = router;
