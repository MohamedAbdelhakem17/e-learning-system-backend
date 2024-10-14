const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
    course_ID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: [true, "Course ID is required"]
    },
    title: {
        type: String,
        required: [true, "Title is required"],
        minlength: [3, "Title must be at least 3 characters long"],
        maxlength: [100, "Title must not exceed 100 characters"]
    },
    objectives: {
        type: String,
        required: [true, "Objectives are required"],
        minlength: [10, "Objectives must be at least 10 characters long"],
        maxlength: [1000, "Objectives must not exceed 1000 characters"]
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        minlength: [20, "Description must be at least 20 characters long"],
        maxlength: [2000, "Description must not exceed 2000 characters"]
    },
    duration: {
        type: Number,
        required: [true, "Duration is required"],
        min: [1, "Duration must be at least 1 minute"],
        max: [600, "Duration must not exceed 600 minutes"]
    },
    cover_image: {
        type: String,
        required: [true, "image is required"],
    },
    video: {
        type: String,
        required: [true, "Video is required"],
    },
    written_summary: {
        type: String,
        required: false,
        enum: ["pdf", "word"],
    },
    order: {
        type: Number,
        required: [true, "Order is required"],
        min: [1, "Order must be at least 1"]
    },
    quiz_link: {
        type: String,
        required: true,
    },
    is_active: {
        type: Boolean,
        required: true,
        default: true,
    }
}, { timestamps: true });

module.exports = mongoose.model("Lesson", lessonSchema);
