import mongoose from "mongoose";
import config from "../config/index.js";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`MONGODB CONNECTED: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connection to MONGODB: ${error}`);
    process.exit(1);
  }
};
