import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {isAdmin} from "../middleware/isAdmin.js";
import {
    deletePost,
    deleteUser,
    getAllPost,
    getAllUser,
    updatePost,
    updateUser
} from "../controllers/admin.controller.js";


const router = express.Router();

router.get('/user', isAuthenticated, isAdmin, getAllUser)
router.put('/user/:id', isAuthenticated, isAdmin, updateUser)
router.delete('/user/:id', isAuthenticated, isAdmin, deleteUser)

// post controller

router.get('/posts', isAuthenticated, isAdmin, getAllPost)
router.put('/posts/:id', isAuthenticated, isAdmin, updatePost)
router.delete('/posts/:id', isAuthenticated, isAdmin, deletePost)

export default router;


