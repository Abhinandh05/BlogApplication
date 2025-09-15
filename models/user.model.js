import mongoose  from 'mongoose';

const userShema = new mongoose.Schema({
    fullName:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required: true,
    },
    phoneNumber:{
        type:Number,
        required:true

    },
    role:{
        type:String,
        enum:["admin", "user"],
        default:"user",
    },
    profilePhoto:{
        type:String,
        default:""
    }
},{timestamps:true})

export const User = mongoose.model("User", userShema);

