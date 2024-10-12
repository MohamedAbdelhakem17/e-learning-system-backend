const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const roles = require("../config/systemRoles")

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
      required: [true, "User email is required"],
      trim: true,
      unique: [true, "This email already exists"],
      validate: [validator.isEmail, "Please provide a valid email"],
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
      enum: [...Object.values(roles)],
      default: roles.USER
    }
  },

  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        delete ret.id;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.virtual("full_name").get(function () {
  return `${this.first_name} ${this.last_name}`;
});

module.exports = mongoose.model("User", userSchema);
