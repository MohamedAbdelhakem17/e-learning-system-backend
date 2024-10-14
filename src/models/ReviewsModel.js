const mongoose = require("mongoose");

const basicSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: [4, "Review content must be more than 4 characters"],
        trim: true,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User ID is required"],
    },
    rate: {
        type: Number,
        min: [1, "Rate must be at least 1"],
        max: [5, "Rate must be at most 5"],
        enum: [1, 2, 3, 4, 5],  
    },
}, { _id: false });  

const courseReviewSchema = new mongoose.Schema({
    review: basicSchema,  
    course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course ID is required"],
    },
}, { timestamps: true });

const instructorReviewSchema = new mongoose.Schema({
    review: basicSchema,  
    instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Instructor ID is required"],
    },
}, { timestamps: true });

module.exports = {
    InstructorReviewModel: mongoose.model("InstructorReview", instructorReviewSchema),
    CourseReviewModel: mongoose.model("CourseReview", courseReviewSchema),
};
