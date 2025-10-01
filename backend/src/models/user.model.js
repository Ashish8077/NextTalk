import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { toJSONPlugin } from "../plugins/toJSON.plugin.js";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Full name is required"],
      minlength: [3, "Full name must be at least 3 characters"],
      maxlength: [50, "Full name must not exceed 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      maxlength: [64, "Password must not exceed 64 characters"],
    },
    profilePic: {
      type: String,
      default: "",
    },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpiry: { type: Date },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
    passwordResetSentAt: { type: Date, default: null }, // last reset email timestamp
    passwordResetSendCount: { type: Number, default: 0 }, // count within time window
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.plugin(toJSONPlugin);

const User = mongoose.model("User", userSchema);

export default User;
