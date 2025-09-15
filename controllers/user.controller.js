import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs"
import jwt from 'jsonwebtoken';



export const register = async (req, res) =>{
    try {
         const {fullName, email, password, phoneNumber} = req.body;

          if (!fullName || !email || !password || !phoneNumber){
              return  res.status(400).json({
                  message:"Some filed is missing please  check the filed ",
                  success: false
              });

          }

          const existingUser =  await User.findOne({ email })
        if (existingUser){
            return res.status(400).json({
                message:"The email id or the account have already existing please check the mail once more ",
                success: false

            })
        }
        let profilePhoto = "";

        const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt value


        await User.create({
            fullName,
            email,
            phoneNumber,
            password:hashedPassword,
            profilePhoto


        })

        return res.status(200).json({
            message:"The account is created successfully",
            success:true
        })

    } catch (err){
        console.log("Some thing went to wrong", err )
        return res.status(500).json({
            message:"Something went to wrong while register time ",
            success: false
        })
    }
}

export const login = async (req,res) =>{
    try {

        const {email, password } = req.body;

        if (!email || !password){
            return res.status(400).json({
                message:"Some thing is missing !",
                success: false,
            });
        }
        let user = await User.findOne({ email })

        if (!user){
            return res.status(400).json({
                message:"Incorrect email or password",
                success:false,

            })
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched){
            return res.stat(200).json({
                message:"User name and the password in not matched please check",
                success: false,

            })
        }

         const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY,{
             expiresIn: '1d'
         });

        user= {
            _id: user._id,
            fullName:user.fullName,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profilePhoto:user.profilePhoto
        }

        return res.cookie("token", token,{
            httpOnly: true,
            secure: true,
            sameSite:"none",
            maxAge: 24 * 60 * 60 *100,
        }).status(200).json({
            message: `Welcome back ${user.fullName}`,
            user,
            success:true,

        })



    } catch (err){
        console.log("Some thing went to wrong", err )
        return res.status(500).json({
            message:"Something went to wrong while Login time ",
            success: false
        })
    }
}




export  const getUserProfile = async (req, res) =>{
    try {
        const userId = req.id;
        const user = await User.findById(userId).select("-password");
        if (!user){
            return res.status(404).json({
                message:"User profile not found ",
                success: false,

            })

        }
        return res.status(200).json({
            message:"The userProfile is getSuccessfully",
            success:true,
        })

    } catch (err){
        console.log("Some thing went to wrong", err )
        return res.status(500).json({
            message:"Something went to wrong while getUserProfile time ",
            success: false
        })
    }
}


export const logout = async (req, res) =>{
    try{
        return res
            .cookie("token", "", {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                expires: new Date(0)
            })
            .status(200)
            .json({
                message: "Logged out successfully.",
                success: true
            });

    }catch (err){
        console.log("Some thing went to wrong", err )
        return res.status(500).json({
            message:"Something went to wrong while Logout time ",
            success: false
        })
    }
}