import {Post} from "../models/post.model.js";


export  const createPost = async (req, res) =>{

    try{
        const {title, content } = req.body;
        if (!title || !content){
            res.status(400).json({
                message:"Title or the content are missing",
                success: false
            })
        }

        const post = new Post({
            title,
            content,
            author:req.user._id
        })

        await post.save(); // save the post


    } catch (err){
        console.log("Some thing went to wrong while creating the post");
        return res.status(500).json({
            message:"Some error when the posting creating time ",
            success: false
        })
    }
}

// update the post