import config from "../config/index.js";
import { redis } from "../lib/redis.js";
import { createHash } from "../utils/token.js";

export const setRefreshTokenInDB = async (userId, refreshToken) => {
  const hashedToken = createHash(refreshToken);

  return await redis.set(
    `VibeChatRefreshToken:${userId}`,
    hashedToken,
    "Ex",
    7 * 24 * 60 * 60
  );
};

export const setCookies = async (res, accessToken, refreshToken) => {
  const isProd = config.NODE_ENV === "production";
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: isProd,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
