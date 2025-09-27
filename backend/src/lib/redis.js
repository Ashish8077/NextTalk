import Redis from "ioredis";
import config from "../config/index.js";

export const redis = new Redis(config.UPSTASH_REDIS_URL);
