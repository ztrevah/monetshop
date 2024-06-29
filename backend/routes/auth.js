import express from "express"
import { register_step1, register_step2, login, logout, checkSignupEmail, verify } from "../controllers/auth.js";

const router = express.Router();

router.post("/signups1",register_step1);
router.post("/signups2",register_step2);
router.post("/checkmailsignup",checkSignupEmail);
router.post("/login",login);
router.post("/logout",logout);
router.post("/verify",verify);

export default router