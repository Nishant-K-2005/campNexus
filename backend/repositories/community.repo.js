import prisma from "../config/dbConnection.js";

export const getCommunitiesJoinedByUser = (user_id) => {
    return prisma.communityMember.findMany({
        where:{user_id},
        select:{
            role:true,
            community:true,
        }
    })
}

export const createCommunityMember = (user_id, community_id) => {
    return prisma.communityMember.create({
        data:{
            user_id,
            community_id,
            role:"Member"
        }
    })
}

export const createCommunity = ({ name, description, tags, user_id }) => {
    return prisma.$transaction(async (tx) => {
        const community = await tx.community.create({
            data: {
                name,
                description,
                tags,
                created_by_user_id: user_id,
            }
        })
        const communityMember = await tx.communityMember.create({
            data: {
                user_id,
                community_id: community.community_id,
                role: "Moderator",
            }
        })
        return [community, communityMember];
    })
}