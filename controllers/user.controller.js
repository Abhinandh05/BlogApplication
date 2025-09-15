import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs"

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