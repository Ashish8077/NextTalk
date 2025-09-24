import express from "express";
import path from "path";

import config from "./config/index.js";
import authRoutes from "./routes/auth.route.js";

const app = express();
const __dirname = path.resolve();
console.log(__dirname);

app.use("/api/auth", authRoutes);

console.log(path.join(__dirname, "../frontend", "dist"));

if (config.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend", "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.listen(config.PORT, () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});
