import express from "express";
import path from "path";

import config from "./config/index.js";
import authRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import { errorHandler } from "./utils/errorHandler.js";

const app = express();
const __dirname = path.resolve();

app.use(express.json());
app.use("/api/auth", authRoutes);

app.use(errorHandler);

if (config.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(config.PORT, () => {
      console.log(` Server running at http://localhost:${config.PORT}`);
    });

    const shutdown = (signal) => {
      console.log(`\n ${signal} received. Closing server...`);
      server.close(() => {
        console.log("HTTP server closed");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  console.error(`Unhandled Rejection: ${reason}`);
  process.exit(1);
});

process.on("uncaughtException", (error) => {
  console.error(`Uncaught Exception: ${error}`);
  process.exit(1);
});

startServer();
