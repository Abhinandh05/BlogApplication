import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {isAdmin} from "../middleware/isAdmin.js";
import {
    deletePost,
    deleteUser, getAdminDashboard,
    getAllPost,
    getAllUser, getUserById, renderEditPost,
    updatePost,
    updateUser
} from "../controllers/admin.controller.js";
import {seedAdmin} from "../seeds/admin.seed.js";
import {upload} from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAdminDashboard);
router.post("/seed", seedAdmin)

router.get('/user', isAuthenticated, isAdmin, getAllUser)
router.post('/user/:id', isAuthenticated, isAdmin, updateUser)
router.get('/user/:id/edit', isAuthenticated, isAdmin, getUserById)
router.delete('/user/:id', isAuthenticated, isAdmin, deleteUser)

// post controller

router.get('/posts', isAuthenticated, isAdmin, getAllPost)
router.get('/posts/:id/edit', upload.single("image"), isAuthenticated, isAdmin, renderEditPost);
router.post('/posts/:id/update', upload.single("image"),isAuthenticated, isAdmin, updatePost);


router.delete('/delete/:id', isAuthenticated, isAdmin, deletePost)

export default router;


