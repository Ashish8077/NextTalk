import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../emails/emailHandlers.js";
import {
  createUser,
  findUserByEmail,
  findVerificationToken,
} from "../repositories/user.repository.js";

import crypto from "crypto";
import {
  generateVerificationTokenAndExpiry,
  createHash,
} from "../utils/token.js";
import { AppError } from "../utils/AppError.js";

export const signupService = async ({ fullname, email, password }) => {
  // Check existing user
  const existingUser = await findUserByEmail(email);

  if (existingUser) throw new AppError("Email already in use", 409);

  // Generate verification token
  const { verificationToken, verificationTokenExpiry, verificationUrl } =
    generateVerificationTokenAndExpiry(email);

  const hashedToken = createHash(verificationToken);

  // Create user
  const newUser = await createUser({
    fullname,
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpiry,
  });

  // Attempt to send verification email (fire-and-forget)
  try {
    await sendVerificationEmail(
      fullname,
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
    fullname: newUser.fullname,
    email: newUser.email,
  };
};

export const verifyEmailService = async ({ email, token }) => {
  if (!email || !token) {
    throw new AppError("Email or token missing.", 400);
  }

  const hashedToken = createHash(token);

  const user = await findVerificationToken(email, hashedToken);

  if (!user || user.verificationToken !== hashedToken) {
    throw new AppError("Invalid or expired verification link", 400);
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiry = undefined;
  await user.save();
  return {
    fullname: user.fullname,
    id: user._id,
    email: user.email,
    isVerified: user.isVerified,
  };
};

export const resendVerificationEmailService = async (email) => {
  const user = await findUserByEmail(email);
  if (!user) throw new AppError("User not found", 404);

  const { verificationToken, verificationTokenExpiry, verificationUrl } =
    generateVerificationTokenAndExpiry(email);

  user.verificationToken = createHash(verificationToken);
  user.verificationTokenExpiry = verificationTokenExpiry;
  await user.save();

  try {
    await sendVerificationEmail(
      user.fullname,
      user.email,
      verificationToken,
      verificationUrl
    );
  } catch (error) {
    console.error("Failed to resend verification email:", email, error);
  }
};

export const sendWelcomeEmailService = async (fullname, email) => {
  try {
    await sendWelcomeEmail(fullname, email);
  } catch (error) {
    // Non-critical: just log and swallow the error
    console.error(`Failed to send welcome email to ${email}:`, error);
  }
};
