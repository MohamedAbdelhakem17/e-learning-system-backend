const mongoose = require("mongoose");


const coursesSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please insert a course name"],
            unique: [true, "Course name must be unique"],
            trim: true,
            minlength: [8, "Course name must be at least 8 characters long"],
            maxlength: [100, "Course name must be less than 100 characters long"],
        },

        slug: {
            type: String,
            lowercase: true,
        },

        imageCover: {
            type: String,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Please insert an instructor ID"],
        },

        language: {
            type: [String],
            required: [true, "Please insert the course language"],
        },

        price: {
            type: Number,
            required: [true, "Please insert the course price"],
            min: [0, "Course price must be greater than 0"],
        },

        discounted_price: {
            type: Number,
            min: [0, "Discounted price must be greater than 0"],
            validate: {
                validator: function (value) { return value <= this.price; },
                message: "Discounted price must be less than or equal to the original price",
            },
        },

        is_finished: {
            type: Boolean,
            default: false,
        },

        is_active: {
            type: Boolean,
            default: false,
        },

        is_approved: {
            type: Boolean,
            default: false,
        },

        category_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: [true, "Please insert a category ID"],
        },

        audience: {
            type: [String],
            validate: {
                validator: function (value) { return value.length <= 8; },
                message: "Audience must not exceed 8 items",
            },
        },

        requirements: {
            type: [String],
            validate: {
                validator: function (value) { return value.length <= 8; },
                message: "Requirements must not exceed 8 items",
            },
        },

        will_teach: {
            type: [String],
            validate: {
                validator: function (value) { return value.length <= 8; },
                message: "Will teach must not exceed 8 items",
            },
        },

        introductory_video: {
            type: String,
        },

        duration: {
            type: {
                hours: Number,
                weeks: Number
            }
        },

        difficulty_level: {
            type: String,
            required: true
        }
        ,
        ratingsAverage: {
            type: Number,
            min: [1, "Rating must be above or equal 1.0"],
            max: [5, "Rating must be below or equal 5.0"],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        
        total_student_enrolled: Number

    },
    { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

coursesSchema.virtual("reviews", {
    ref: "CourseReview",
    localField: "_id",
    foreignField: "course",
    justOne: false,
});

module.exports = mongoose.model("Course", coursesSchema);
