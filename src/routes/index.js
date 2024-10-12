const AuthRouter = require("./authRoute");

const amountRoutes = (app) => {
    app.use("api/v1/auth", AuthRouter);
}

module.exports = amountRoutes