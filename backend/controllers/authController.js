import bcrypt from "bcryptjs"
import prisma from "../config/dbConnection.js"
import signToken from "../utils/generateToken.js"

// -------------------SignUp--------------------
export const signup = async (req, res) => {
    try {
        const { email, pass, full_name, role } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (existingUser) {
            return res.status(400).json({ error: "email already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        const pass_hash = await bcrypt.hash(pass, salt)

        const result = await prisma.$transaction(async (tx) => {
            const user = await tx.user.create({
                data: {
                    email,
                    pass_hash,
                    full_name,
                    role
                }
            })
            const profile = await tx.profile.create({
                data: {
                    user_id: user.user_id,
                    interested_tags: [],
                }
            })

            return [user,profile]
            
        })

        const newUser = result[0]
        const newProfile = result[1]

        signToken(newUser.user_id,res);

        return res.status(200).json({
            messaege: "Sign-up successful",
            user: {
                user_id: newUser.user_id,
                email: newUser.email,
                full_name: newUser.full_name,
                role: newUser.role
            },
            profile: newProfile,
        })


    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Sign-up error: something went wrong" })
    }
}


// -------------------Login-----------------------
export const login = async (req, res) => {
    try {
        const { email, pass } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user) {
            return res.status(401).json({ error: "Login error: Invalid email or password" })
        }

        const isPassValid = await bcrypt.compare(pass, user.pass_hash)
        if (!isPassValid) {
            return res.status(401).json({ error: "Login error: Invalid email or password" })
        }
        const userId = user.user_id;

        const profile = await prisma.profile.findFirst({
            where:{ user_id:userId }
        })

        signToken(user.user_id, res);

        return res.status(200).json({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                email: email,
                full_name: user.full_name,
                role: user.role
            },
            profile: profile,
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: "Something went wrong" })
    }
}


// -------------------Log-out----------------------
export const logout = async (req,res) => {
    try{
        res.cookie("jwt","",{
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV!=='dev',
            sameSite:'strict',
        })
        res.status(200).json({message:"Logout successful"})
    }catch(err){
        console.log("Logout error: ",err.message);
        res.status(500).json({error:"Logout error: Something went wrong"});
    }
}


// --------------------Session---------------------
export const session = async (req, res) => {
    try{
        const user = req.user
        const profile = req.profile
        res.status(200).json(user,profile);
    }catch(err){
        console.log("Session error: ",err.message);
        res.status(500).json({error: "Session error: Internal server error"});
    }
}