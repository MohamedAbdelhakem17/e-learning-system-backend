const express = require("express");

const protect = require("../middleware/protectMiddleware");
const AuthController = require("../controller/AuthController");
const AuthvVlidator = require("../utils/validator/authVlidator");

const router = express.Router();

router
  .route("/signup")
  .post(AuthvVlidator.signupValidator, AuthController.signup);

router
  .route("/signin")
  .post(AuthvVlidator.signinValidator, AuthController.signin);

router
  .route("/forgetPassword")
  .post(AuthvVlidator.forgotPasswordValidator, AuthController.forgotPassword);

router
  .route("/resetPassword")
  .put(AuthvVlidator.resetPasswordValidator, AuthController.resetPassword);


router
  .route("/editPassword")
  .put(protect, AuthvVlidator.editPasswordValidator, AuthController.editPassword);

router
  .route("/logout")
  .get(protect, AuthController.logout);

router
  .route("/refresh")
  .get(AuthController.generateNewAccsessToken);

module.exports = router;
