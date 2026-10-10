import { createCommunity, createCommunityMember, getAllCommunitiesWithMembership, deleteCommunityById ,getCommunityById, getCommunityMember, restoreCommunityMember } from "../repositories/community.repo.js"
import { addContentToAiQueue } from "../utils/addToQueue.js";
import { AppError } from "../errors/app.error.js";

export const create_community_service = async ({ name, description, tags, user_id }) => {
    const data = await createCommunity({ name, description, tags, user_id })
    await addContentToAiQueue(data[0].community_id, 'community');
    return data;
}

export const get_community_service = async (user_id) => {
    const data = await getAllCommunitiesWithMembership(user_id);
    return data.map(({ members, _count, created_by_user, ...community }) => ({
        ...community,
        role: members[0]?.role ?? null,
        created_by: created_by_user,
        post_count: _count.posts,
        member_count: _count.members,
        // created_at is already spread in via ...community
    }))
}

export const join_community_service = async (user_id, community_id) => {
    const community = await getCommunityById(community_id);
    if(!community){
        throw new AppError("Community not found",404);
    }
    const existing = await getCommunityMember(user_id, community_id);
    if (existing && !existing.left_at) {
        return existing;
    }
    if (existing && existing.left_at) {
        return await restoreCommunityMember(user_id, community_id);
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