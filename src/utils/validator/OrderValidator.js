const { check } = require("express-validator");
const validatorMiddleware = require("../../middleware/validatorMiddleware");

const getUserOrderdValidator = [
  check("id").isMongoId().withMessage("Invalid MongoDB ID provided."),
  validatorMiddleware,
];


module.exports = {
  getUserOrderdValidator,
};
