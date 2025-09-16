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
export const updatePost = async (req, res) =>{
    try {

        const { id } = req.params;
        const {title, content}= req.body;

        const post = await Post.findById(id);

        if (!post){
            return res.status(400).json({
                message:"Post not found",
                success: false,
            })
        }
        // check the current user is the author
        if (post.author.toString() !== req.user._id.toString()){
            return res.status(403).json({
                message:"Unauthorized",
                success:false
            })
        }

        post.title = title || post.title;
        post.content = content || post.content;

        await post.save();

        return res.status(200).json({
            message:"PostUpdated successfully",
            post,
        })

    } catch (err){
        console.log("Something went to wrong while updating the post ")

        return res.status(500).json({
            message:"Internal server error updatePost",
            success: false
        })
    }

}

// delete the post

export const deletePost = async (req, res) =>{
    try{
        const {id} = req.params;

        const post = await  Post.findById(id);

        if (!post){
            return  res.status(400).json({
                message:"Post not found ",
                success: false,
            })
        }

        //check the current user is
        if (post.author.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: "Unauthorized" ,
                success:false
            });
        }

        await post.deleteOne();

       res.status(201).json({
            message:"Post is deleted successfully "
        })




    } catch (err){
        console.log("Something went to wrong while deleting the post ")

        return res.status(500).json({
            message:"Internal server error"
        })
    }
}


// get all the post

export const getPost = async (req, res) =>{
    try {
        const posts = await Post.find()
            .populate("author", "fullName")
            .sort({createdAt: -1})

        res.json(posts);

    } catch (err){
        console.log("Some thing went to wrong while getThe post")
        return res.status(500).json({
            message:"Internal server Error",
            success: false,
        })
    }

}