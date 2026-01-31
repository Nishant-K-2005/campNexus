import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../config/dbConnection.js"

// -------------------SignUp--------------------
export const signup = async (req,res) => {
    try{
        const {email, pass, full_name, role} = req.body;
        const existingUser = await prisma.user.findUnique({
            where: {email},
        })
        if(existingUser){
            return res.status(400).json({message:"email already exist"})
        }
        const salt = await bcrypt.genSalt(10)
        const pass_hash = await bcrypt.hash(pass,salt)

        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data:{
                    email,
                    pass_hash,
                    full_name,
                    role
                }
            })

            const newProfile = await tx.profile.create({
                data:{
                    user_id: newUser.user_id,
                    interested_tags:[],
                }
            })

            return newUser
        })
        
        return res.status(201).json({
            message:"Signup Succesful", 
            user_id:result.user_id
        })

    }catch(err){
        console.log(err);
        res.status(500).json({message:"something went wrong"})
    }
}


// -------------------Login-----------------------
export const login = async (req,res) => {
    try{
        const {email, pass} = req.body;

        const user = await prisma.user.findUnique({
            where:{email},
        })

        if(!user){
            return req.status(401).json({message:"User not found"})
        }

        const isPassValid = await bcrypt.compare(pass,user.pass_hash)
        if(!isPassValid){
            return res.status(401).json({message:"Invalid email or password"})
        }

        const token = jwt.sign(
            {
                user_id:user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        return res.status(201).json({
            message:"Login successful",
            token,
            user:{
                user_id:user.user_id,
                email: email,
                full_name: user.full_name,
                role: user.role
            }
        })

    }catch(err){
        console.log(err);
        return res.status(500).json({message:"Something went wrong"})
    }
} 