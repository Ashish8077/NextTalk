import { transporter } from "../lib/nodemailer.js";
import {
  createOtpEmailTemplate,
  createRestEmailTemplate,
  createVerificationEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (
  username,
  email,
  verificationToken,
  verificationUrl
) => {
  try {
    const response = await transporter.sendMail({
      from: '"VibeChat"<ashishpawar6522@gmail.com>',
      to: email,
      subject: "Verify Your Email Address",
      // text: "Verify Your Email Address",
      html: createVerificationEmailTemplate(
        username,
        verificationUrl,
        verificationToken
      ),
    });
    return response;
  } catch (error) {
    console.error("Error while sending verification email:", error);
    throw new Error(error.message || "Failed to send verification email");
  }
};

export const sendWelcomeEmail = async (username, email) => {
  await transporter.sendMail({
    from: '"VibeChat"<ashishpawar6522@gmail.com>',
    to: email,
    subject: "Welcome to VibeChat 🎉",
    text: `Hi ${username}, welcome to VibeChat!`,
    html: createWelcomeEmailTemplate(username),
  });
};

export const sendOtpEmail = async (email, otpCode) => {
  await transporter.sendMail({
    from: '"VibeChat"<ashishpawar6522@gmail.com>',
    to: email,
    subject: "Your VibeChat Account Verification Code (OTP)",
    html: createOtpEmailTemplate(otpCode),
  });
};

export const sendRestEmail = async (username, email, passwordResetUrl) => {
  await transporter.sendMail({
    from: '"VibeChat"<ashishpawar6522@gmail.com>',
    to: email,
    subject: "Reset Your VibeChat Password",
    html: createRestEmailTemplate(username, passwordResetUrl),
  });
};
