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
  findPasswordRestToken,
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
import User from "../models/user.model.js";

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

  //Avoid revealing whether the email exists prevents enumeration attacks
  if (!user) return;

  const now = Date.now();
  const TIME_WINDOW = 60 * 60 * 1000; // 1 hour
  const MIN_INTERVAL = 60 * 1000; // 1 minute
  const MAX_REQUESTS = 5;

  // Reset counter if time window expired
  if (now - user.passwordResetSentAt > TIME_WINDOW) {
    user.passwordResetSendCount = 0;
  }

  // Check cooldown interval
  if (now - user.passwordResetSentAt < MIN_INTERVAL) {
    const cooldown = Math.ceil(
      (MIN_INTERVAL - (now - user.passwordResetSentAt)) / 1000
    );
    throw new AppError(
      `Please wait ${cooldown} seconds before requesting another OTP.`,
      429
    );
  }

  // Check max requests
  if (user.passwordResetSendCount >= MAX_REQUESTS) {
    throw new AppError("Too many requests. Try again later", 429);
  }

  user.passwordResetSendCount += 1;
  user.passwordResetSentAt = now;

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

export const verifyAndrestPasswordService = async ({
  email,
  newPassword,
  confirmPassword,
  token,
}) => {
  const tokenHash = createHash(token);

 

  const user = await findPasswordRestToken(email, tokenHash);

 

  if (!user) throw new AppError("Invalid or expired  token");

  const isSameAsOld = await user.comparePassword(newPassword, user.password);
  if (isSameAsOld) {
    throw new AppError("New password must be different from old password", 400);
  }
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return {
    id: user._id,
    username: user.username,
  };
};
