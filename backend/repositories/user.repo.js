import prisma from "../config/dbConnection.js";

export const findUserById = (id , includeProfile=false) => {
    return prisma.user.findUnique({
        where:{user_id:id},
        include:{
            profile:includeProfile
        }
    })
}

export const findUserByEmail = (email, includeProfile=false) => {
    return prisma.user.findUnique({
        where:{email},
        include:{
            profile:includeProfile
        }
    })
}

export const findUserProfile = (userId) => {
    return prisma.profile.findUnique({
        where:{user_id:userId}
    })
}

export const createUserWithProfile = ({email, pass_hash, full_name, role}) => {
    return prisma.$transaction(async (tx) => {
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
        return [user, profile]
    })
}