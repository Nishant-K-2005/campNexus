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

export const fetchAllCommunities = () => {
    return prisma.community.findMany({
        where: { deleted_at: null },
        include: {
            created_by_user: {
                select: { user_id: true, full_name: true },
            },
            _count: {
                select: {
                    posts: { where: { deleted_at: null, status: 'Accepted' } },
                    members: { where: { left_at: null } },
                },
            },
        },
        orderBy: { created_at: 'desc' },
    })
}

export const getAllCommunitiesWithMembership = (user_id) => {
    return prisma.community.findMany({
        where: { deleted_at: null },
        include: {
            members: {
                where: { user_id, left_at: null },
                select: { role: true },
            },
            created_by_user: {
                select: {
                    user_id: true,
                    full_name: true,
                },
            },
            _count: {
                select: {
                    posts: {
                        where: { deleted_at: null, status: 'Accepted' },
                    },
                    members: {
                        where: { left_at: null },
                    },
                },
            },
        },
        orderBy: { created_at: 'desc' },
    })
}

export const getCommunityMember = (user_id, community_id) => {
    return prisma.communityMember.findUnique({
        where: {
            user_id_community_id: { user_id, community_id },
        },
    })
}

export const restoreCommunityMember = (user_id, community_id) => {
    return prisma.communityMember.update({
        where: {
            user_id_community_id: { user_id, community_id },
        },
        data: {
            left_at: null,
            role: 'Member',
            joined_at: new Date(),
        },
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