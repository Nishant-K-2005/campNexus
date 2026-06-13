import { createCommunity, createCommunityMember, getCommunitiesJoinedByUser, deleteCommunityById ,getCommunityById } from "../repositories/community.repo.js"
import { addContentToAiQueue } from "../utils/addToQueue.js";
import { AppError } from "../errors/app.error.js";

export const create_community_service = async ({ name, description, tags, user_id }) => {
    const data = await createCommunity({ name, description, tags, user_id })
    await addContentToAiQueue(data[0].community_id, 'community');
    return data;
}

export const get_community_service = async (user_id) => {
    const data = await getCommunitiesJoinedByUser(user_id);
    return data.map(({ role, community }) => ({
        ...community,
        role
    }))
}

export const join_community_service = async (user_id, community_id) => {
    const community = getCommunityById(community_id);
    if(!community){
        throw new AppError("Community not found",404);
    }
    return await createCommunityMember(user_id, community_id);
}

export const delete_community_service = async (community_id,user) => {
    const community = await getCommunityById(community_id);
    if (!community) {
        throw new AppError("Community not found", 404);
    }
    if (user.role !== 'Admin' && user.user_id !== community.created_by_user_id) {
        throw new AppError("Unauthorized", 403)
    }
    return await deleteCommunityById(community_id);
}