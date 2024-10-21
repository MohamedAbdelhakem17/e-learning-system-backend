const express = require("express");

const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deletCategoryValidator,
} = require("../utils/validator/categoryValidator");

const { systemRoles } = require("../config/systemVariables");
const protect = require("../middleware/protectMiddleware")
const allowTo = require("../middleware/allowTomiddleware");
const CategoryController = require("../controller/CategoryController");

const router = express.Router();

// Nested Route
const subcategoriesRoute = require("./SubCategoryRoute");
const CoursesRoute = require("./CoursesRoute");

router.use("/:categoryId/subcategories", subcategoriesRoute);
router.use("/:categoryId/courses", CoursesRoute);

router
  .route("/")
  .get(CategoryController.getCategorys)
  .post(
    protect,
    allowTo(systemRoles.ADMIN),
    CategoryController.imageCategoryUpload,
    CategoryController.imageManipulation,
    createCategoryValidator,
    CategoryController.createCategory
  );

router
  .route("/:id")
  .get(getCategoryValidator, CategoryController.getCategory)
  .put(
    protect,
    allowTo(systemRoles.ADMIN),
    CategoryController.imageCategoryUpload,
    CategoryController.imageManipulation,
    updateCategoryValidator,
    CategoryController.updateCategory
  )
  .delete(
    protect,
    allowTo(systemRoles.ADMIN),
    deletCategoryValidator,
    CategoryController.deleteCategory
  );

module.exports = router;
