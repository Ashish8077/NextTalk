import { openSync } from "fs";
import User from "../models/user.model.js";

import Otp from "../models/otp.model.js";

export const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

export const createUser = async ({
  username,
  email,
  password,
  verificationToken,
  verificationTokenExpiry,
}) => {
  return await User.create({
    username: username.trim(),
    email: email.toLowerCase(),
    password,
    verificationToken,
    verificationTokenExpiry,
  });
};

export const findVerificationToken = async (email, hashedToken) => {
  return await User.findOne({
    email,
    verificationToken: hashedToken,
    verificationTokenExpiry: { $gt: Date.now() },
  });
};

export const findPasswordRestToken = async (email, passwordResetToken) => {
  return await User.findOne({
    email,
    passwordResetToken,
    passwordResetExpires: { $gt: new Date(Date.now()) },
  });
};

export const createOtpRecord = async (userId, otpHash, expiresAt, type) => {
  return await Otp.create({
    userId,
    otpHash,
    expiresAt,
    type,
  });
};

export const findLatestOtpRecord = async (userId) => {
  return await Otp.findOne({
    userId,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });
};

export const findRecentOtp = async (userId, OTP_RATE_LIMIT_MS) => {
  return await Otp.findOne({
    userId,
    createdAt: { $gt: new Date(Date.now() - OTP_RATE_LIMIT_MS) },
  })
    .select("_id createdAt")
    .sort({ createdAt: -1 });
};
