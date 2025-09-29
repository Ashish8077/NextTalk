import { transporter } from "../lib/nodemailer.js";
import {
  createOtpEmailTemplate,
  createVerificationEmailTemplate,
  createWelcomeEmailTemplate,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (
  fullname,
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
        fullname,
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

export const sendWelcomeEmail = async (fullname, email) => {
  await transporter.sendMail({
    from: '"VibeChat"<ashishpawar6522@gmail.com>',
    to: email,
    subject: "Welcome to VibeChat 🎉",
    text: `Hi ${fullname}, welcome to VibeChat!`,
    html: createWelcomeEmailTemplate(fullname),
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
