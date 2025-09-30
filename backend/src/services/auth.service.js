import {
  sendOtpEmail,
  sendRestEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../emails/emailHandlers.js";
import {
  createOtpRecord,
  createUser,
  findLatestOtpRecord,
  findRecentOtp,
  findUserByEmail,
  findVerificationToken,
} from "../repositories/user.repository.js";

import {
  generateVerificationTokenAndExpiry,
  createHash,
} from "../utils/token.js";
import { AppError } from "../utils/AppError.js";

import bcrypt from "bcrypt";
import { createOtpHashAndExpiryTime } from "../utils/otp.js";
import Otp from "../models/otp.model.js";
import config from "../config/index.js";

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
  const otpValidityMinutes = 5;
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Invalid credentials", 401);
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) throw new AppError("Invalid credentials", 401);

  if (!user.isVerified)
    throw new AppError("Account not verified. Please check your email.", 403);

  const { otpCode, otpHash, expiresAt } =
    await createOtpHashAndExpiryTime(otpValidityMinutes);

  await createOtpRecord(user._id, otpHash, expiresAt);

  try {
    await sendOtpEmail(email, otpCode);
  } catch (error) {
    console.error("Error while sendig OTP", error.message);
  }
  return {
    email: user.email,
    otpExpiresIn: 5 * 60,
  };
};

export const verifyOtpService = async ({ email, otpCode }) => {
  const user = await findUserByEmail(email);

  const otpRecord = user ? await findLatestOtpRecord(user._id) : null;

  if (!user || !otpRecord) {
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

export const resendVerificationOtpService = async ({ email }) => {
  const OTP_RATE_LIMIT_MS = 60 * 1000;
  const otpValidityMinutes = 5;

  const user = await findUserByEmail(email);

  if (!user || !user.isVerified) return;

  const recentOtp = await findRecentOtp(user._id, OTP_RATE_LIMIT_MS);

  if (recentOtp) {
    // HTTP 429: Too Many Requests
    const remainingMs =
      OTP_RATE_LIMIT_MS - (Date.now() - recentOtp.createdAt.getTime());
    throw new AppError(
      `Please wait ${Math.ceil(remainingMs / 1000)} seconds before requesting another OTP.`,
      429
    );
  }

  const { otpCode, otpHash, expiresAt } =
    await createOtpHashAndExpiryTime(otpValidityMinutes);

  console.log(otpCode, otpHash, expiresAt);
  await createOtpRecord(user._id, otpHash, expiresAt);
  try {
    await sendOtpEmail(email, otpCode);
  } catch (error) {
    onsole.error(
      "Error while sending OTP email for user:",
      user.email,
      error.message
    );
  }
};

export const requestPasswordResetService = async ({ email }) => {
  
  const user = await findUserByEmail(email);
  if (!user) return;

  const {
    verificationToken: passwordResetToken,
    verificationTokenExpiry: passwordResetExpires,
  } = generateVerificationTokenAndExpiry(email);

  const passwordResetUrl = `${config.FRONTEND_URL}/api/auth/reset-password?email=${email}&token=${passwordResetToken}`;

  const hashedToken = createHash(passwordResetToken);

  user.passwordResetToken = hashedToken;
  user.passwordResetExpires = passwordResetExpires;
  await user.save();

  try {
    await sendRestEmail(user.username, user.email, passwordResetUrl);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    console.error("Error while sending Rest Password Email");
  }
};
