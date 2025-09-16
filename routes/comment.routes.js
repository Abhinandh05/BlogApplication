import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {addComment, getCommentByPost} from "../controllers/comment.controller.js";


const router = express.Router();
router.post("/:id/comments/add", isAuthenticated, addComment);
router.get("/:id/comments", getCommentByPost);

export default router;