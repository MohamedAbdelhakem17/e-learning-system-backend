const mongoose = require("mongoose");
const CoursesModel = require("./CoursesModel");
const UserModel = require("./UserModel");

// Basic schema for the review structure
const basicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            minlength: [4, "Review content must be more than 4 characters"],
            trim: true,
            required: [true, "Review title is required"],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        rate: {
            type: Number,
            min: [1, "Rate must be at least 1"],
            max: [5, "Rate must be at most 5"],
            required: [true, "Rating is required"],
            enum: [1, 2, 3, 4, 5],
        },
    },
    { _id: false }
);

// Course review schema
const courseReviewSchema = new mongoose.Schema(
    {
        review: basicSchema,
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: [true, "Course ID is required"],
        },
    },
    { timestamps: true }
);

// Instructor review schema
const instructorReviewSchema = new mongoose.Schema(
    {
        review: basicSchema,
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Instructor ID is required"],
        },
    },
    { timestamps: true }
);

// Pre-hook to populate user data
function populateData(next) {
    this.populate({
        path: "review.user",
        select: "name profile_pic",
    });
    next();
}

courseReviewSchema.pre(/^find/, populateData);
instructorReviewSchema.pre(/^find/, populateData);

// Function to calculate average ratings and quantity
const calcRate = async function (id, model, matchField, groupField) {
    const result = await this.aggregate([
        { $match: matchField },
        {
            $group: {
                _id: `$${groupField}`,
                avgRatings: { $avg: "$review.rate" },
                ratingsQuantity: { $sum: 1 },
            },
        },
    ]);

    try {
        if (result.length > 0) {
            await model.findByIdAndUpdate(id, {
                $set: {
                    ratingsAverage: result[0].avgRatings.toFixed(2),
                    ratingsQuantity: result[0].ratingsQuantity,
                },
            });
        } else {
            await model.findByIdAndUpdate(id, {
                $set: {
                    ratingsAverage: 0,
                    ratingsQuantity: 0,
                },
            });
        }
    } catch (err) {
        console.error("Error updating ratings:", err);
    }
};

// Method to calculate course ratings
courseReviewSchema.statics.calcAverageRatingsAndQuantity = function (courseId) {
    return calcRate.call(
        this,
        courseId,
        CoursesModel,
        { course: courseId },
        "course"
    );
};

// Method to calculate instructor ratings
instructorReviewSchema.statics.calcAverageRatingsAndQuantity = function (instructorId) {
    return calcRate.call(
        this,
        instructorId,
        UserModel,
        { instructor: instructorId },
        "instructor"
    );
};

// Post-save hooks to recalculate ratings after saving a review
courseReviewSchema.post("save", async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.course);
});

courseReviewSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await doc.constructor.calcAverageRatingsAndQuantity(doc.course);
    }
});

instructorReviewSchema.post("save", async function () {
    await this.constructor.calcAverageRatingsAndQuantity(this.instructor);
});

instructorReviewSchema.post("findOneAndDelete", async (doc) => {
    if (doc) {
        await doc.constructor.calcAverageRatingsAndQuantity(doc.instructor);
    }
});

module.exports = {
    InstructorReviewModel: mongoose.model("InstructorReview", instructorReviewSchema),
    CourseReviewModel: mongoose.model("CourseReview", courseReviewSchema),
};
