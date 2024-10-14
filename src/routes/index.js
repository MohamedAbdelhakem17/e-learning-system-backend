const AuthRouter = require("./authRoute");
const instructorsRoute = require("./instructorsRoute");
const EducationRoute = require("./educationRoute");
const LinksRoute = require("./LinksRoute");

const amountRoutes = (app) => {
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/instructors", instructorsRoute);
    app.use("/api/v1/education", EducationRoute);
    app.use("/api/v1/socialMediaLinks", LinksRoute);
}

module.exports = amountRoutes


