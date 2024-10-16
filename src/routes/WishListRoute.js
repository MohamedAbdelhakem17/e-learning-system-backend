const express = require("express");

const {systemRoles} = require("../config/systemVariables");
const allowTo = require("../middleware/allowTomiddleware");
const protect  = require("../middleware/protectMiddleware");

const wishListValidator = require("../utils/validator/wishListValidator");
const WishlistController = require("../controller/WishlistController");

const router = express.Router();

router.use(protect, allowTo(systemRoles.USER));
router
  .route("/")
  .post(
    wishListValidator.addToWishListValidator,
    WishlistController.addToWishList
  )
  .get(WishlistController.getLoggedUserWishlist);
router.delete("/:productId", WishlistController.removeFromWishList);
module.exports = router;
