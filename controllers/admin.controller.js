import {User} from "../models/user.model.js";
import {Post} from "../models/post.model.js";


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

export const deleteUser = async (res, req) =>{
    try {
        const {id} = req.params;

        const user = await User.findByIdAndDelete(id)

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
      return res.status(200).json({
          message:"Get all the post ",
          success: true,
          posts
      })

    }catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}

export const updatePost = async (req, res) =>{
    try{

        const {id} = req.params;
        const updates = req.body;

        const post = await Post.findByIdAndUpdate(id, updates,{new: true});

        if (!post){
            return res.status(400).json({
                message:"Post not found",
                success: false
            })
        }
        return res.status(200).json({
            message:"Post updated successfully",
            success: false,
            post
        })

    } catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}

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
            success:true,
            post
        })

    }  catch (err){
        console.log("Something went to wrong ")
        return res.status(500).json({
            message:"Internal server error",
            success: false
        })
    }
}