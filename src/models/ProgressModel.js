const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },

        lesson_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lesson",
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


progressSchema.pre("save", function (next) {
    if (this.isModified("is_complete") && this.is_complete) {
        this.completion_date = new Date();
    }
    next();
});

module.exports = mongoose.model("Progress", progressSchema);
