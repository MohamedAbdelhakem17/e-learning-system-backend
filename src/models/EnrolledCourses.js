const mongoose = require("mongoose");

const enrolledCoursesSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },

    courses_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course ID is required"],
    },

    is_complete: {
      type: Boolean,
      default: false,
    },

    completion_date: {
      type: Date,
    },
  },
  { timestamps: true }
);


// Set completion date when course is marked complete
enrolledCoursesSchema.pre("save", function (next) {
  if (this.isModified("is_complete") && this.is_complete) {
    this.completion_date = new Date();
  }
  next();
});

module.exports = mongoose.model("EnrolledCourse", enrolledCoursesSchema);
