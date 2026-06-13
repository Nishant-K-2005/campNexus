import bcrypt from "bcryptjs"
import { createUserWithProfile, findUserByEmail, deleteUserById, findUserById } from "../repositories/user.repo.js"
import { AppError } from "../errors/app.error.js";

export const signup_service = async ({ email, pass, full_name, role }) => {
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new AppError("email already exists", 409);
    }
    const salt = await bcrypt.genSalt(10)
    const pass_hash = await bcrypt.hash(pass, salt)

    return await createUserWithProfile({ email, pass_hash, full_name, role });
}

export const login_service = async ({ email, pass }) => {
    const user = await findUserByEmail(email, true);
    if (!user) {
        throw new AppError("invalid email or password",401)
    }
    const isPassValid = await bcrypt.compare(pass, user.pass_hash)
    if (!isPassValid) {
        throw new AppError("invalid email or password",401)
    }
    return user;
}

export const delete_user_service = async (user_id,user) => {
    const delUser = await findUserById(user_id);
    if (user.role !== 'Admin' && user_id !== user.user_id) {
        throw new AppError("Unauthorized", 403)
    }
    const deleted_at = new Date();
    let purge_at = new Date();
    purge_at.setDate(purge_at.getDate() + 30)
    return await deleteUserById(user_id, delUser.email, deleted_at, purge_at);
}