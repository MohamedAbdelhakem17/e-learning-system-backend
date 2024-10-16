const express = require("express");

// const protect = require("../middleware/protectMiddleware");
const InstructorController = require("../controller/InstructorController");

const router = express.Router();
// Nested Route
const ReviewInstructorsRoute = require("./ReviewInstructorsRoute");

router.use("/:InstructorId/reviewInstructor", ReviewInstructorsRoute);


router
    .route("/")
    .get(InstructorController.createFilterObj, InstructorController.getInstructors);

router
    .route("/:id")
    .get(InstructorController.getInstructor);



module.exports = router;
