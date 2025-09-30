import {
  sendOtpEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../emails/emailHandlers.js";
import {
  createOtpRecord,
  createUser,
  findUserByEmail,
  findVerificationToken,
} from "../repositories/user.repository.js";

import {
  generateVerificationTokenAndExpiry,
  createHash,
} from "../utils/token.js";
import { AppError } from "../utils/AppError.js";

import bcrypt from "bcrypt";
import crypto from "crypto";
import Otp from "../models/otp.model.js";

export const signupService = async ({ username, email, password }) => {
  // Check existing user
  const existingUser = await findUserByEmail(email);

  if (existingUser) throw new AppError("Email already in use", 409);

  // Generate verification token
  const { verificationToken, verificationTokenExpiry, verificationUrl } =
    generateVerificationTokenAndExpiry(email);

  const hashedToken = createHash(verificationToken);

  // Create user
  const newUser = await createUser({
    username,
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpiry,
  });

  // Attempt to send verification email (fire-and-forget)
  try {
    await sendVerificationEmail(
      username,
      email,
      verificationToken,
      verificationUrl
    );
  } catch (error) {
    console.error("Failed to send verification email for user:", email, error);
    // Do not rollback user creation; user can manually request resend
  }

  return {
    id: newUser._id,
    username: newUser.username,
    email: newUser.email,
  };
};

export const verifyEmailService = async ({ email, token }) => {
  const hashedToken = createHash(token);

  const user = await findVerificationToken(email, hashedToken);
  if (!user) {
    throw new AppError("Invalid or expired verification link", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();
  return {
    username: user.username,
    id: user._id,
    email: user.email,
    isVerified: user.isVerified,
  };
};

export const resendVerificationEmailService = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) return;

  const { verificationToken, verificationTokenExpiry, verificationUrl } =
    generateVerificationTokenAndExpiry(email);

  user.verificationToken = createHash(verificationToken);
  user.verificationTokenExpiry = verificationTokenExpiry;
  await user.save();

  try {
    await sendVerificationEmail(
      user.username,
      user.email,
      verificationToken,
      verificationUrl
    );
  } catch (error) {
    console.error("Failed to resend verification email:", email, error);
  }
};

export const sendWelcomeEmailService = async (username, email) => {
  try {
    await sendWelcomeEmail(username, email);
  } catch (error) {
    // Non-critical: just log and swallow the error
    console.error(`Failed to send welcome email to ${email}:`, error);
  }
};

export const loginService = async ({ email, password }) => {
  const user = await findUserByEmail(email);

  const isUserValid = user && user.comparePassword(password);

  if (!isUserValid) throw new AppError("Invalid credentials", 401);

  if (!user.isVerified)
    throw new AppError("Account not verified. Please check your email.", 403);

  const otpCode = crypto.randomInt(100000, 999999).toString();

  const saltRounds = 10;
  const otpHash = await bcrypt.hash(otpCode, saltRounds);

  const otpValidityMinutes = 5;
  const expiresAt = Date.now() + otpValidityMinutes * 60 * 1000;

  await createOtpRecord(user._id, otpHash, expiresAt);

  try {
    await sendOtpEmail(email, otpCode);
  } catch (error) {
    console.error("Error while sendig OTP", error.message);
  }
  return {
    email: user.email,
    otpExpiresIn: otpValidityMinutes * 60,
  };
};

export const verifyOtpService = async ({ email, otpCode }) => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("Invalid email or OTP", 400);

  const otpRecord = await Otp.findOne({
    userId: user._id,
    used: false,
    expiresAt: { $gt: new Date() },
  }).sort({ createdAt: -1 });

  if (!otpRecord) {
    throw new AppError("Invalid email or OTP", 400);
  }

  const isMatch = await bcrypt.compare(otpCode, otpRecord.otpHash);
  if (!isMatch) {
    throw new AppError("Invalid email or OTP", 400);
  }

  otpRecord.used = true;
  await otpRecord.save();

  return {
    id: user._id,
    fullname: user.fullname,
    email: user.email,
    profilePic: user.profilePic,
  };
};
