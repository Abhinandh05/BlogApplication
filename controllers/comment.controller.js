import {Post} from "../models/post.model.js";
import {Comment} from "../models/comment.model.js";


export const addComment = async (req, res) =>{
    try {
        const {id} = req.params;
        const {content} = req.body;

        if (!content){
            return  res.status(400).json({
                message: "Need to add the content",
                success: false
            })
        }
         const post = await Post.findById(id);
        if (!post){
            return res.status(400).json({
                message:"Their is not post found ",
                success: false
            })
        }
        const comment = new Comment({
            content,
            author:req.user._id,
            post:id,

        })
        await comment.save()

        return res.status(201).json({
            message:"Add the comment successfully",
            success:true,
            comment,
        })


    } catch (err){
        console.log("Something went to wrong")
        return res.status(500).json({
            message:"Internal serer error",
            success:false
        })
    }
}


// get the comment

export const getCommentByPost = async (req, res) =>{
    try{
        const {id} = req.params;
        const comments = await Comment.find({post:id})
            .populate("author", "fullName")
            .sort({createdAt: -1 })

        return res.status(201).json({
            message:"get the comment",
            success:true,
            comments

        })


    } catch (err){
        console.log("Something went to wrong")
        return res.status(500).json({
            message:"Internal serer error",
            success:false
        })
    }
}