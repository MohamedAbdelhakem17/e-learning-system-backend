const { check } = require("express-validator");
const bcrypt = require("bcrypt");

const validatorMiddleware = require("../../middleware/validatorMiddleware");
const createValidationError = require("./createValidationError");
const AppError = require("../appError");
const { FAIL } = require("../../config/httpstatus");
const userModel = require("../../models/UserModel");

const signupValidator = [
  check("first_name")
    .trim()
    .notEmpty()
    .withMessage(
      createValidationError(400, FAIL, "User first name is required.")
    )
    .isLength({ min: 3, max: 20 })
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "First name must be between 3 and 20 characters."
      )
    ),

  check("last_name")
    .trim()
    .notEmpty()
    .withMessage(
      createValidationError(400, FAIL, "User last name is required.")
    )
    .isLength({ min: 3, max: 20 })
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Last name must be between 3 and 20 characters."
      )
    ),

  check("email")
    .trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "User email is required."))
    .toLowerCase()
    .isEmail()
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Please insert a valid email, such as 'someone@example.com'."
      )
    )
    .custom(async (email) => {
      const user = await userModel.findOne({ email });
      if (user) {
        throw new AppError(400, FAIL, "This email is already registered.");
      }
      return true;
    }),

  check("password")
    .trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "Password is required."))
    .isLength({ min: 8 })
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Password must be more than 8 characters."
      )
    )
    .matches(/[a-zA-Z0-9_]{8,}/)
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Password must contain at least 8 characters with letters, numbers, or underscores."
      )
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new AppError(
          400,
          FAIL,
          "Password and confirm password do not match."
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage(
      createValidationError(400, FAIL, "Password confirmation is required.")
    ),

  check("phone")
    .optional()
    .trim()
    .isMobilePhone("ar-EG")
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Please insert a valid Egyptian phone number."
      )
    ),

  validatorMiddleware,
];

const signinValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "User email is required."))
    .isEmail()
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Please insert a valid email, such as 'someone@example.com'."
      )
    ),

  check("password")
    .trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "Password is required."))
  ,

  validatorMiddleware,
];

const forgotPasswordValidator = [
  check("email")
    .trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "User email is required."))
    .isEmail()
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Please insert a valid email, such as 'someone@example.com'."
      )
    )
    .custom(async (email) => {
      const user = await userModel.findOne({ email });
      if (!user) {
        throw new AppError(401, FAIL, "Invalid email or password.");
      }
      return true;
    }),
  validatorMiddleware,
];

const resetPasswordValidator = [
  check("password")
    .trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "Password is required."))
    .isLength({ min: 8 })
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Password must be more than 8 characters."
      )
    )
    .matches(/[a-zA-Z0-9_]{8,}/)
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Password must contain at least 8 characters with letters, numbers, or underscores."
      )
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new AppError(
          400,
          FAIL,
          "Password and confirm password do not match."
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage(
      createValidationError(400, FAIL, "Password confirmation is required.")
    ),
  validatorMiddleware,
];

const editPasswordValidator = [
  check("oldPassword").trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "Password is required."))
    .custom(async (password, { req }) => {
      const isCorrectPassword = await bcrypt.compare(password, req.user.password)
      if (!isCorrectPassword) throw new AppError(400, FAIL, "wrong old password")
      return true
    }),
  check("password")
    .trim()
    .notEmpty()
    .withMessage(createValidationError(400, FAIL, "Password is required."))
    .isLength({ min: 8 })
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Password must be more than 8 characters."
      )
    )
    .matches(/[a-zA-Z0-9_]{8,}/)
    .withMessage(
      createValidationError(
        400,
        FAIL,
        "Password must contain at least 8 characters with letters, numbers, or underscores."
      )
    )
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new AppError(
          400,
          FAIL,
          "Password and confirm password do not match."
        );
      }
      return true;
    }),

  check("passwordConfirm")
    .trim()
    .notEmpty()
    .withMessage(
      createValidationError(400, FAIL, "Password confirmation is required.")
    ),
  validatorMiddleware,
];

module.exports = {
  signupValidator,
  signinValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  editPasswordValidator
};
