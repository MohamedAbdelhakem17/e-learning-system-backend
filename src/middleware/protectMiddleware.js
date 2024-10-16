const asyncHandler = require("express-async-handler");
const jsonwebtoken = require("jsonwebtoken");

const httpstatus = require("../config/httpstatus");
const AppError = require("../utils/appError");
const UserModel = require("../models/UserModel");

const protect = asyncHandler(async (req, res, next) => {
    const authorizationHeader = req.header('authorization') || req.header('Authorization');

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
        throw new AppError(401, httpstatus.ERROR, "You are not logged in. Please log in to access this route.");
    }

    const accessToken = authorizationHeader.split(" ")[1];
    const accessTokenDecoded = await jsonwebtoken.verify(accessToken, process.env.JWT_ACCESS_SECRET_KEY);


    const user = await UserModel.findById(accessTokenDecoded.userid);
    if (!user) throw new AppError(404, httpstatus.ERROR, "The user that belongs to this token no longer exists.");


    // const passChangedTimestamp = Math.floor(user.updatedAt.getTime() / 1000);

    // if (passChangedTimestamp > accessTokenDecoded.iat) throw new AppError(401, httpstatus.ERROR, "User recently changed their password. Please log in again.");


    req.user = user;
    next();
});

module.exports = protect
