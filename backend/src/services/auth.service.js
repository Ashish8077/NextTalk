import config from "../config/index.js";
import {
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../emails/emailHandlers.js";
import {
  createUser,
  deleteUserById,
  findUserByEmail,
  findVerificationToken,
} from "../repositories/user.repository.js";

import crypto from "crypto";
import { hashToken } from "../utils/token.js";
import { AppError } from "../utils/AppError.js";

export const signupService = async ({ fullname, email, password }) => {
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AppError("Email already in use", 409);
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = hashToken(verificationToken);

  

  const verificationTokenExpiry = Date.now() + 60 * 60 * 1000; // 1 hour

  const newUser = await createUser({
    fullname,
    email,
    password,
    verificationToken: hashedToken,
    verificationTokenExpiry,
  });

  const verificationUrl = `${config.FRONTEND_URL}/api/auth/verify-email?email=${email}&token=${verificationToken}`;

  try {
    await sendVerificationEmail(
      fullname,
      email,
      verificationToken,
      verificationUrl
    );
  } catch (error) {
    // 1. Log the failure
    console.error(
      "Failed to send verification email for user:",
      newUser.email,
      error
    );

    //2. ROLLBACK: Delete the user from the database
    await deleteUserById(newUser._id);

    // Throw a controlled error to the client
    throw new AppError(
      "Signup successful, but the verification email could not be sent. Please try again",
      500
    );
  }

  return {
    id: newUser._id,
    fullname: newUser.fullname,
    email: newUser.email,
  };
};

export const verifyEmailService = async ({ email, token }) => {
  
  if (!token) {
    throw new AppError("Invalid or expired token", 400);
  }
  const hashedToken = hashToken(token);



  const user = await findVerificationToken(email, hashedToken);

  if (!user) {
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

export const sendWelcomeEmailService = async (fullname, email) => {
  try {
    await sendWelcomeEmail(fullname, email);
  } catch (error) {
    // Non-critical: just log and swallow the error
    console.error(`Failed to send welcome email to ${email}:`, error);
  }
};
