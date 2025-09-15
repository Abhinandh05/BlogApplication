import express from "express";
import {getUserProfile, login, logout, register} from "../controllers/user.controller.js";
import {isAuthenticated} from "../middleware/ isAuthenticated.js";


const router = express.Router();

router.route('/register').post(register);
router.route('/login').post( login);
router.route('/profile').post(isAuthenticated, getUserProfile);
router.route('/logout').post(logout);


export default router;