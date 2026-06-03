import bcrypt from "bcryptjs"
import { createUserWithProfile, findUserByEmail } from "../repositories/user.repo.js"

export const signup_service = async ({email, pass, full_name, role}) => {
    const existingUser = await findUserByEmail(email);
    if(existingUser){
        const err = new Error("email already exist.")
        err.statusCode = 409
        throw err;
    }
    const salt = await bcrypt.genSalt(10)
    const pass_hash = await bcrypt.hash(pass, salt)

    return createUserWithProfile({email,pass_hash,full_name,role});
}

export const login_service = async ({email, pass}) => {
    const user = await findUserByEmail(email,true);
    const authErr = new Error("invalid email or password")
    authErr.statusCode = 401
    if(!user){
        throw authErr;
    }
    const isPassValid = await bcrypt.compare(pass,user.pass_hash)
    if(!isPassValid){
        throw authErr;
    }
    return user
}
