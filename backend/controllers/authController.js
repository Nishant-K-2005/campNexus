import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import prisma from "../config/dbConnection.js"

// -------------------SignUp--------------------
export const signup = async (req, res) => {
    try {
        const { email, pass, full_name, role } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        })
        if (existingUser) {
            return res.status(400).json({ message: "email already exist" })
        }
        const salt = await bcrypt.genSalt(10)
        const pass_hash = await bcrypt.hash(pass, salt)

        const result = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    email,
                    pass_hash,
                    full_name,
                    role
                }
            })

            const newProfile = await tx.profile.create({
                data: {
                    user_id: newUser.user_id,
                    interested_tags: [],
                }
            })

            return newUser
        })

        return res.status(201).json({
            message: "Signup Succesful",
            user_id: result.user_id
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "something went wrong" })
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
            return req.status(401).json({ message: "User not found" })
        }

        const isPassValid = await bcrypt.compare(pass, user.pass_hash)
        if (!isPassValid) {
            return res.status(401).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign(
            {
                user_id: user.user_id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        res.cookie('token', token, {
            httpOnly: true,    // PREVENTS JavaScript from stealing the token (Crucial for security!)
            secure: false,      // Set to TRUE in production (when using HTTPS)
            sameSite: 'lax',   // Helps prevent CSRF attacks
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        })
        return res.status(201).json({
            message: "Login successful",
            user: {
                user_id: user.user_id,
                email: email,
                full_name: user.full_name,
                role: user.role
            }
        })

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Something went wrong" })
    }
}

export const session = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.user_id },
            select: {
                user_id: true,
                email: true,
                full_name: true,
                role: true,
                reputation_points: true
            }
        })
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.json({ user })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong" })
    }
}