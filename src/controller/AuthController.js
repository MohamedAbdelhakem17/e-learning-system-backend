const asyncHandler = require("express-async-handler")
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generateToken = require("../utils/createToken");
const httpstatus = require("../config/httpstatus");
const sendEmail = require("../utils/sendEmail");
const AppError = require("../utils/appError");
const emailBody = require("../utils/emailBody");
const UserModel = require("../models/UserModel");

/**
 * Generate authentication tokens (access and refresh).
 * Stores the refresh token in an HTTP-only cookie and returns the access token.
 */
const authToken = (res, user) => {
  const accessToken = generateToken(
    { userid: user._id },
    process.env.JWT_ACCESS_SECRET_KEY,
    "8h"
  );

  const refreshToken = generateToken(
    { userid: user._id },
    process.env.JWT_REFRESH_SECRET_KEY,
    "5d"
  );

  res.cookie("token", refreshToken, {
    maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });

  return accessToken;
};

/**
 * @route POST /api/v1/signup
 * @access Public
 */
const signup = asyncHandler(async (req, res) => {
  const user = await UserModel.create(req.body);
  const accessToken = authToken(res, user);
  delete user._doc.password;
  res.status(201).json({ status: httpstatus.SUCCESS, data: user, accessToken });
});

/**
 * @route POST /api/signin
 * @access Public
 */
const signin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email }, { __v: 0 });

  if (!user) {
    throw new AppError(401, httpstatus.FAIL, "Invalid email or password.");
  }


  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    throw new AppError(401, httpstatus.FAIL, "Invalid email or password.");
  }

  const accessToken = authToken(res, user);
  res.status(200).json({ status: httpstatus.SUCCESS, data: user, accessToken });
});

/**
 * @route POST /api/v1/forgot-password
 * @access Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email }).exec();

  const token = generateToken(
    { userid: user._id },
    process.env.JWT_RESET_PASSWORD_KEY,
    "5m"
  );

  const mailOption = {
    mailTo: user.email,
    subject: "Password Reset Request",
    html: emailBody(user.full_name, token),
  };

  try {
    await sendEmail(mailOption);
    res.status(200).json({ status: httpstatus.SUCCESS, data: "Email sent successfully" });
  } catch (error) {
    console.log(error);
    throw new AppError(500, httpstatus.FAIL, "Email Could Not Be Sent");
  }
});

/**
 * @route put /api/reset-password
 * @access Public
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;

  const decoded = jsonwebtoken.verify(
    token,
    process.env.JWT_RESET_PASSWORD_KEY
  );

  const user = await UserModel.findById({ _id: decoded.userid });
  user.password = password;
  await user.save();

  const accessToken = authToken(res, user);

  res.status(201).json({
    status: httpstatus.SUCCESS,
    data: "Password changed successfully",
    accessToken,
  });
});

/**

 * @route put /api/v1/edit-password
 * @access Private
 */
const editPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const user = await UserModel.findById(req.user._id);


  user.password = password;
  await user.save();

  const accessToken = authToken(res, user);

  res.status(201).json({
    status: httpstatus.SUCCESS,
    data: "Password changed successfully",
    accessToken,
  });
});

/**
 * @route git/api/v1/logout
 * @access Private
 */
const logout = asyncHandler(async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ status: httpstatus.SUCCESS, data: "Successfully logged out." });
});

/**
 * @route POST /api/token
 * @access Private
 */
const generateNewAccsessToken = asyncHandler(async (req, res) => {
  const authorizationHeader = req.header('authorization') || req.header('Authorization');


  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    throw new AppError(401, httpstatus.ERROR, "You are not logged in. Please log in to access this route.");
  }
  const refreshToken = req.cookies.token;

  if (!refreshToken) {
    throw new AppError(403, httpstatus.ERROR, "No refresh token provided.");
  }

  const decodedRefreshToken = await jsonwebtoken.verify(refreshToken, process.env.JWT_REFRESH_SECRET_KEY);

  const accessToken = generateToken(
    { userid: decodedRefreshToken.userid },
    process.env.JWT_ACCESS_SECRET_KEY,
    "8h"
  );
  res.json({ accessToken });
});

module.exports = { signup, signin, forgotPassword, resetPassword, logout, editPassword, generateNewAccsessToken };
