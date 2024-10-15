const express = require("express");

const {
  getSubcategoryValidator,
  createSubcategoryValidator,
  updateSubcategoryValidator,
  deletSubcategoryValidator,
} = require("../utils/validator/subCategoryValidator");

const { systemRoles } = require("../config/systemVariables");
const protect = require("../middleware/protectMiddleware")
const allowTo = require("../middleware/allowTomiddleware");

const SubCategoryController = require("../controller/SubCategoryController");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .post(
    protect,
    allowTo(systemRoles.ADMIN),
    SubCategoryController.setCategoryIdToBody,
    createSubcategoryValidator,
    SubCategoryController.createSubCategory
  )
  .get(
    SubCategoryController.createFilterObj,
    SubCategoryController.getSubCategorys
  );

router
  .route("/:id")
  .get(getSubcategoryValidator, SubCategoryController.getSubCategory)
  .put(
    protect,
    allowTo(systemRoles.ADMIN),
    updateSubcategoryValidator,
    SubCategoryController.updateSubCategory
  )
  .delete(
    protect,
    allowTo(systemRoles.ADMIN),
    deletSubcategoryValidator,
    SubCategoryController.deleteSubCategory
  );

module.exports = router;
