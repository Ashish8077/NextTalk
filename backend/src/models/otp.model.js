import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otpHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    type: {
      type: Boolean,
      enums: ["LOGIN", "RESET_PASSWORD"],
      require: true,
    },
  },
  { timestamps: true }
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Compound index to make queries fast
otpSchema.index({ userId: 1, createdAt: -1 });

const Otp = mongoose.model("OTP", otpSchema);

export default Otp;
