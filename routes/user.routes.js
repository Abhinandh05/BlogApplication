import express from "express";
import { getUserProfile, login, logout, register } from "../controllers/user.controller.js";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {seedAdmin} from "../seeds/admin.seed.js";

const router = express.Router();


router.post("/register", register);
router.post("/login", login);
router.post("/admin", seedAdmin)


router.get("/profile", isAuthenticated, getUserProfile);
router.get("/logout", isAuthenticated, logout);

export default router;
