import express from "express";
import { createUser, googleSignIn, signIn } from "../controllers/auth.js";

const router = express.Router();

router.post("/api/signup", createUser);
router.post("/api/signin", signIn);
router.post("/googlesignin", googleSignIn);
export default router;
