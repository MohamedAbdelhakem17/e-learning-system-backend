const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { systemRoles } = require("../config/systemVariables");


// User Schema Definition
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
      minlength: [3, "First name must be more than 3 characters"],
      maxlength: [20, "First name must be less than 20 characters"],
    },

    last_name: {
      type: String,
      trim: true,
      required: [true, "Last name is required"],
      minlength: [3, "Last name must be more than 3 characters"],
      maxlength: [20, "Last name must be less than 20 characters"],
    },

    email: {
      type: String,
      required: [true, "Please provide your email address"],
      trim: true,
      unique: [true, "This email is already registered"],
      validate: [validator.isEmail, "Please provide a valid email address"],
      lowercase: true,
    },

    password: {
      type: String,
      trim: true,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      validate: {
        validator: (value) => /[a-zA-Z0-9_]{8,}/.test(value),
        message:
          "Password must contain at least 8 characters with letters, numbers, or underscores",
      },
    },

    phone: {
      type: String,
      validate: {
        validator: (value) => validator.isMobilePhone(value, "ar-EG"),
        message: "Please provide a valid Egyptian phone number",
      },
    },

    user_role: {
      type: String,
      enum: [...Object.values(systemRoles)],
      default: systemRoles.USER,
    },

    is_instructor: {
      type: Boolean,
      default: false
    },
    profile_pic: String,
    about_me: String,
    Introductory_video: String,

    specialization: {
      type: String,
    },

    education: [{
      title: String,
      description: String,
      start_time: Date,
      end_time: Date,
    }],

    social_media_links: {
      type: [
        {
          title: String,
          link: {
            type: String,
            validate: [validator.isURL, "Please provide a valid URL"],
          },
        },
      ],
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be above or equal 1.0"],
      max: [5, "Rating must be below or equal 5.0"],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.id;
        delete ret.password;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret.id;
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving user
userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (err) {
    return next(err);
  }
});


// Virtual for full name
userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});


userSchema.virtual("reviews", {
  ref: "InstructorReview",
  localField: "_id",
  foreignField: "instructor",
  justOne: false,
});
userSchema.index({ email: 1 });

module.exports = mongoose.model("User", userSchema);
