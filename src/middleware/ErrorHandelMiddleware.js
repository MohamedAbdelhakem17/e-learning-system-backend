const ErrorHandelMiddleware = (error, req, res, next) => {
  const { statusCode, statusText, message } = error;

  if (error.name === "JsonWebTokenError") {
    error.message = "Invalid token, please login again..";
    error.statusCode = 401;
  }

  if (error.name === "TokenExpiredError") {
    error.message = "Expired token, please login again..";
    error.statusCode = 401;
  }

  if (process.env.ENVIRONMENT_MODE === "development") {
    res.status(statusCode || 500).json({
      status: statusText || "FAIL",
      data: message,
      stack: error.stack,
    });
  } else {
    res
      .status(statusCode || 500)
      .json({ status: statusText || "FAIL", data: message });
  }
};

module.exports = ErrorHandelMiddleware;
