const express = require("express");

const allowTo = require("../middleware/allowTomiddleware");
const { systemRoles } = require("../config/systemVariables");

const protect = require("../middleware/protectMiddleware");
const ReviewsValidator = require("../utils/validator/reviewsValidator");
const ReviewsController = require("../controller/ReviewsCoursesController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(ReviewsController.createFilterObject, ReviewsController.getAllReviews)
  .post(
    protect,
    allowTo(systemRoles.USER),
    ReviewsController.setCourseIdToBody,
    ReviewsValidator.createReviewCourseValidator,
    ReviewsController.createReview
  );

router
  .route("/:id")
  .get(ReviewsController.getReview)
  .put(
    protect,
    allowTo(systemRoles.USER),
    ReviewsValidator.updateReviewValidator,
    ReviewsController.updateReview
  )
  .delete(
    protect,
    allowTo(systemRoles.USER, systemRoles.ADMIN, systemRoles.INSTRUCTOR),
    ReviewsValidator.deleteReviewValidator,
    ReviewsController.deleteReview
  );

module.exports = router;
