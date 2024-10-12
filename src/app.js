require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser")

const dbConnection = require("./config/databaseConection");
const AppError = require("./utils/appError");
const ErrorHandelMiddleware = require("./middleware/ErrorHandelMiddleware");
const amountRoutes = require("./routes")

// database connection
dbConnection();

const app = express();
app.use(express.json());
app.use(cookieParser())

amountRoutes(app)

// 404 Not Found error handling
app.use("*", (req, res) => {
  throw new AppError(
    404,
    "FAIL",
    `This route ${req.hostname} not found. Please try another one.`
  );
});

app.use(ErrorHandelMiddleware);

// Run server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error(`Unhandled Rejection: ${error.name} | ${error.message}`);
  server.close(() => {
    console.log("Server shutdown due to unhandled rejection");
    process.exit(1);
  });
});
