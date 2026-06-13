import prisma from "../config/dbConnection.js";

export const getCommunitiesJoinedByUser = (user_id) => {
    return prisma.communityMember.findMany({
        where: { 
            user_id,
            left_at: null,
        },
        select: {
            role: true,
            community: true,
        }
    })
}

export const getCommunityById = (community_id) => {
    return prisma.community.findFirst({
        where: { community_id, deleted_at:null }
    })
}

export const createCommunityMember = (user_id, community_id) => {
    return prisma.communityMember.create({
        data: {
            user_id,
            community_id,
            role: "Member"
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

export const updateCommunity = (community_id, changes) => {
    return prisma.community.update({
        where: { 
            community_id, 
            deleted_at:null 
        },
        data: changes,
    })
}

export const updateCommunityEmbedding = (id, embedding) => {
    return prisma.$executeRaw`
        UPDATE "Community"
        SET embedding_vector = ${`[${embedding.join(",")}]`}::vector
        WHERE community_id = ${id} AND deleted_at IS NULL
    `;
}

export const getCommunityEmbedding = (id) => {
    return prisma.$queryRaw`
        SELECT embedding_vector::text AS embedding_vector
        FROM "Community"
        WHERE community_id = ${id} AND deleted_at IS NULL
    `;
}

export const deleteCommunityById = (community_id) => {
    return prisma.community.update({
        where:{community_id},
        data:{
            deleted_at:new Date(),
        }
    })
}