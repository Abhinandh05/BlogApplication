import {User} from "../models/user.model.js";
import {Post} from "../models/post.model.js";
import {Comment} from "../models/comment.model.js";
import CommentRoutes from "../routes/comment.routes.js";


export const getAllUser = async (req, res) =>{
    try{
        const users =  await User.find().select("-password");
        return res.status(200).json({
            message:"get the user",
            success: true,
            users
        })
    } catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}

// update the user by the id

export const updateUser = async (req, res) =>{
    try{

        const {id} = req.params;
        const updates = req.body;
        const user = await User.findByIdAndUpdate(id, updates, {new: true}).select("-password")

        if (!user){
            return res.status(404).json({
                message:"User Not found ",
                success: false
            })
        }

        return res.status(200).json({
            message:"The user updated success fully",
            success: true,
            user
        })

    } catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}

// delete the user by id

export const deleteUser = async (req, res) =>{
    try {
        const {id} = req.params;

        const user = await User.findByIdAndDelete(id)

        if (!user){
            return res.status(400).json({
                message:"The user not found ",
                success: false
            })

        }
        return res.status(200).json({
            message:"The user deleted successfully",
            success: true,
            user
        })

    } catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}

// admin can handle the post

export const getAllPost = async (req,  res) =>{
    try{

        const posts = await Post.find().populate('author', 'fullName')
        if (!posts){
            return res.status(400).json({
                message:"Post not found ",
                success:false

            })
        }
      return res.render("admin/getall", { user: req.user, posts });

    }catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}

export const updatePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content } = req.body;

        const post = await Post.findByIdAndUpdate(
            id,
            { title, content },
            { new: true }
        );

        if (!post) {
            const originalPost = await Post.findById(id);
            return res.status(400).render("admin/editPost", {
                message: "Post not found",
                messageType: "error",
                post: originalPost || { title: '', content: '', _id: id }
            });
        }

        // Redirect to admin dashboard after successful update
        return res.redirect("/api/v1/admin");

    } catch (err) {
        console.log("Error updating post:", err);
        const originalPost = await Post.findById(req.params.id);
        return res.status(500).render("admin/editPost", {
            message: "Internal server error",
            messageType: "error",
            post: originalPost || req.body
        });
    }
};

export const renderEditPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.redirect("/admin");
        }
        res.render("admin/editPost", { post });
    } catch (err) {
        console.log("Error loading edit form:", err);
        res.redirect("/admin");
    }
};

export const deletePost = async (req, res) =>{
    try{
        const {id} = req.params;
        const post = await Post.findByIdAndDelete(id)

        if (!post){
            return res.status(400).json({
                message:"can not delete the post ",
                success: false
            })
        }

        return res.status(200).json({
            message:"The post deleted successfully",
            success:true

        })

    }  catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}

// controllers/admin.controller.js
export const getAdminDashboard = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const postCount = await Post.countDocuments();
        const commentCount = await Comment.countDocuments(); // Add this line

        res.render("admin/dashboard", {
            user: req.user,
            number: {
                users: userCount,
                posts: postCount,
                comments: commentCount
            }
        });
    } catch (err) {
        console.log("Error loading admin dashboard", err);
        return res.status(500).render("auth/login", { error: "Failed to load dashboard" });
    }
};