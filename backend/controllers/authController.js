import bcrypt from "bcryptjs"
import prisma from "../config/dbConnection.js"
import signToken from "../utils/generateToken.js"
import { login_service, signup_service, delete_user_service } from "../services/auth.service.js";
import { findUserById, findUserProfile } from "../repositories/user.repo.js";

export const signup = async (req, res) => {
    try {
        const { email, pass, full_name, role } = req.body;
        const { user, profile } = await signup_service({ email, pass, full_name, role })
        signToken(user.user_id, res);

        delete user.pass_hash
        return res.status(201).json({
            message: "Sign-up successful",
            user,
            profile
        })
    } catch (err) {
        console.log(err.message);
        return res.status(
            err.statusCode || 500
        ).json({
            error: err.message || "Sign-up error: something went wrong"
        })
    }
}

export const login = async (req, res) => {
    try {
        const { email, pass } = req.body;
        const userData = await login_service({ email, pass })
        const { profile, ...user } = userData
        delete user.pass_hash
        signToken(user.user_id, res);
        return res.status(200).json({
            message: "Login successful",
            user,
            profile
        })
    } catch (err) {
        console.log(err.message);
        return res.status(
            err.statusCode || 500
        ).json({
            error: err.message || "Login error: something went wrong"
        })
    }
}

export const logout = async (req, res) => {
    res.cookie("jwt", "", {
        maxAge: 0,
        expires: new Date(0),
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'dev',
        sameSite: 'strict',
    })
    res.status(200).json({ message: "Logout successful" })
}

export const session = async (req, res) => {
    const profile = await findUserProfile(req.user.user_id)
    res.status(200).json({
        user: req.user,
        profile: profile,
    });
}

export const deleteUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const user = req.user;
        await delete_user_service(user_id, user);
        return res.sendStatus(204)
    } catch (err) {
        console.error(err);
        return res.status(err.status || 500).json({ error: err.message })
    }
}