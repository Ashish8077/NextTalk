import express from "express";

import config from "./config/index.js";
import authRoutes from "./routes/auth.route.js";

const app = express();

app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log(`Server started at http://localhost:${config.PORT}`);
});
