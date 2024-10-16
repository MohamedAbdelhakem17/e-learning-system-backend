const AuthRouter = require("./authRoute");
const instructorsRoute = require("./instructorsRoute");
const EducationRoute = require("./educationRoute");
const LinksRoute = require("./LinksRoute");
const CategoryRoute = require("./CategoryRoute");
const SubCategoryRoute = require("./SubCategoryRoute");
const CoursesRoute = require("./CoursesRoute");
const LessonRoute = require("./LessonRoute");
const ReviewCourseRoute = require("./ReviewCourseRoute");
const ReviewInstructorsRoute = require("./ReviewInstructorsRoute");
const WishListRoute = require("./WishListRoute");
const CartRoute = require("./CartRoute");
const OrderRoute = require("./OrderRoute");

const amountRoutes = (app) => {
    app.use("/api/v1/auth", AuthRouter);
    app.use("/api/v1/instructors", instructorsRoute);
    app.use("/api/v1/education", EducationRoute);
    app.use("/api/v1/socialMediaLinks", LinksRoute);
    app.use("/api/v1/category", CategoryRoute);
    app.use("/api/v1/subCategory", SubCategoryRoute);
    app.use("/api/v1/courses", CoursesRoute);
    app.use("/api/v1/lessons", LessonRoute);
    app.use("/api/v1/reviewCourse", ReviewCourseRoute);
    app.use("/api/v1/reviewInstructor", ReviewInstructorsRoute);
    app.use("/api/v1/wishlist", WishListRoute);
    app.use("/api/v1/cart", CartRoute);
    app.use("/api/v1/order", OrderRoute);
}

module.exports = amountRoutes


