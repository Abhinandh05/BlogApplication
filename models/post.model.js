import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim:true
        },
    content:{
        type:String,
        required: true,

    },
    image: {
        type: String,
        default: "",
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    likesCount: {
        type: Number,
        default: 0
    }


},{timestamps:true})

export const Post = mongoose.model("Post", postSchema);

