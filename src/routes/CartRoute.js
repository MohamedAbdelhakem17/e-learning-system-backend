const express = require("express");

const { systemRoles } = require("../config/systemVariables");
const protect = require("../middleware/protectMiddleware");
const allowTo = require("../middleware/allowTomiddleware");

const CartValidator = require("../utils/validator/cartValidator");
const CartController = require("../controller/CartController");

const router = express.Router();

router.use(protect, allowTo(systemRoles.USER));

router
  .route("/")
  .get(CartController.getUserCart)
  .post(
    CartValidator.addcourseToCartValidator,
    CartController.addCourseToCart
  );

router
  .route("/item/:itemId")
  .delete(CartController.removeItemFromCart);

router.delete("/:cartId", CartController.deleteUserCart);

// router.put("/applyCoupon", CartController.applyCouponToUserCart);
module.exports = router;
