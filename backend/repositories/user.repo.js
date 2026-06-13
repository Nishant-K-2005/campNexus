import prisma from "../config/dbConnection.js";

export const findUserById = (user_id , includeProfile=false) => {
    return prisma.user.findFirst({
        where:{
            user_id,
            deleted_at: null
        },
        include:{
            profile:includeProfile
        }
    })
}

export const findUserByEmail = (email, includeProfile=false) => {
    return prisma.user.findFirst({
        where:{
            email,
            deleted_at:null
        },
        include:{
            profile:includeProfile
        }
    })
}

export const findUserProfile = (user_id) => {
    return prisma.profile.findUnique({
        where:{user_id}
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
        return {user, profile}
    })
}

export const deleteUserById = (user_id, email, deleted_at, purge_at) => {
    return prisma.user.update({
        where:{user_id},
        data:{
            deleted_at,
            purge_at,
            email: 'deleted_'+user_id+'_'+email,
            full_name: "DELETED USER"
        } 
    })
}