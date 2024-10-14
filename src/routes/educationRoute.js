const express = require("express");

const protect = require("../middleware/protectMiddleware");
const EducationController = require("../controller/EducationController");

const router = express.Router();

router
    .route("/")
    .get(protect, EducationController.getLoggedUserEducation);

router
    .route("/:educationId")
    .post(protect, EducationController.addEducation)
    .put(protect , EducationController.updateEducation)
    .delete (protect, EducationController.removeEducation);

module.exports = router;
