import crypto from "crypto";
import jwt from "jsonwebtoken";
import config from "../config/index.js";
import { setCookies, setRefreshTokenInDB } from "../helpers/cookie.js";
import { AppError } from "./AppError.js";

export const generateVerificationTokenAndExpiry = (email) => {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenExpiry = Date.now() + 60 * 60 + 1000;
  const verificationUrl = `${config.FRONTEND_URL}/api/auth/verify-email?email=${email}&token=${verificationToken}`;
  return { verificationToken, verificationTokenExpiry, verificationUrl };
};

export const createHash = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, config.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, config.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

export const generateTokenAndSetCookie = async (res, userId) => {
  const { accessToken, refreshToken } = generateTokens(userId);
  try {
    await setRefreshTokenInDB(userId, refreshToken);
  } catch (error) {
    console.error("Failed to store refresh token in Redis:", err);
    throw new AppError("Authentication failed. Please try again.", 500);
  }

  setCookies(res, accessToken, refreshToken);
};
