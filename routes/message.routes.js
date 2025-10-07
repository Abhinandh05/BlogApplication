import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
    getAllMessages, getAllUsersWithStatus,
    getOnlineUsers,
    getUserMessages,
    sendMessage, setUserOffline,
    setUserOnline
} from "../controllers/chat.controller.js";


const router = express.Router();

router.get("/all", isAuthenticated, getAllMessages);
router.get("/user/:userId", isAuthenticated, getUserMessages);
router.post("/send", isAuthenticated, sendMessage);
router.get("/users", isAuthenticated, getAllUsersWithStatus);

// offline and online route

router.get("/online", isAuthenticated, getOnlineUsers);
router.post("/online", isAuthenticated, setUserOnline);
router.post("/offline", isAuthenticated, setUserOffline);


export default router;

