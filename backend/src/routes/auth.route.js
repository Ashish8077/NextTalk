import { Router } from "express";
import { signup, login, logout } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { signupSchema } from "../validation/auth.validation.js";
import { sanitizeRequest } from "../middlewares/sanitizeRequest.js";

const router = Router();

router.post("/signup", validate(signupSchema), sanitizeRequest, signup);

router.post("/login", login);

router.post("/logout", logout);

export default router;
