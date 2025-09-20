import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import {
    createPost,
    deletePost,
    getAllPost, getLikedStatus,
    getPostById, likeToggle,
    renderUpdateForm,
    updatePost
} from "../controllers/post.controller.js";
import {upload} from "../middleware/uploadMiddleware.js";


const router = express.Router();

router.post('/create',upload.single("image"), isAuthenticated, createPost);
router.post('/update/:id',upload.single("image"), isAuthenticated, updatePost);

router.get('/update/:id', upload.single("image"),isAuthenticated, renderUpdateForm);
router.delete('/delete/:id', isAuthenticated, deletePost);
router.get('/', getAllPost);
router.get('/single/:id', getPostById);

router.get("/:id/status", getLikedStatus);

// Toggle like (auth required)
router.post("/:id/like", isAuthenticated, likeToggle);


export default router;
