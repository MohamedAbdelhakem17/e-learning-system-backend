// routes/orderRoutes.js

const express = require("express");

const { systemRoles } = require("../config/systemVariables");
const allowTo = require("../middleware/allowTomiddleware");
const protect = require("../middleware/protectMiddleware");

const OrderValidator = require("../utils/validator/OrderValidator");
const OrderController = require("../controller/OrderController");
const isInstructor = require("../middleware/isInstructorMiddleware");

const router = express.Router();

// Protect all routes

router.use(protect);

// Routes for orders
router.get("/userOrder",
  allowTo(systemRoles.USER),
  OrderController.filterOrderForLoggedUser,
  OrderController.findAllOrders
);

router
  .route("/")
  .post(allowTo(systemRoles.USER), OrderController.createOrder)
  .get(
    isInstructor,
    allowTo(systemRoles.ADMIN, systemRoles.INSTRUCTOR),
    OrderController.filterOrderForLoggedUser,
    OrderController.findAllOrders
  );

router
  .route("/:id")
  .get(
    allowTo(systemRoles.ADMIN, systemRoles.INSTRUCTOR),
    OrderValidator.getUserOrderdValidator,
    OrderController.getUserOrder
  );

module.exports = router;
