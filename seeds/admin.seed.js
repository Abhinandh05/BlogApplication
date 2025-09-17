import {User} from "../models/user.model.js";
import bcrypt from "bcryptjs";


export const seedAdmin = async (req, res) =>{
     try{
         // checking the admin is already existing or not

         const existingAdmin = await User.findOne({role:"admin"})

         if (existingAdmin){
             return res.status(409).json({
                 message:"admin already existing ",
                 email:existingAdmin.email
             })
         }

         const hashedPassed = await bcrypt.hash( process.env.ADMIN_PASS ,10 )

         const admin = await User.create({
             fullName:"Main Admin",
             email: process.env.ADMIN_EMAIL,
             password:hashedPassed,
             phoneNumber:89098787,
             role:"admin"
         });

         return res.status(201).json({
             message:"Admin logged successfully",
             email: admin.email,
         })

     } catch (err){
         console.log("Something went to wrong ")

         return res.status(400).json({
             message:"Something went to wrong while creating the admin seed ",
             success: false
         })
     }
}
