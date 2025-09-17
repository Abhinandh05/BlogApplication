import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {createPost, deletePost, getAllPost, getPostById, updatePost} from "../controllers/post.controller.js";


const router = express.Router();

router.post('/create', isAuthenticated, createPost);
router.post('/update/:id', isAuthenticated, updatePost);
router.delete('/delete/:id', isAuthenticated, deletePost);
router.get('/', getAllPost);
router.get('/single/:id', getPostById);


export default router;
