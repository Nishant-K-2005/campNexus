import { createCommunity, createCommunityMember, getCommunitiesJoinedByUser } from "../repositories/community.repo.js"

export const create_community_service = async ({ name, description, tags, user_id }) => {
    return await createCommunity({name, description, tags, user_id})
}

export const get_community_service = async (user_id)=> {
    const data = await getCommunitiesJoinedByUser(user_id);
    return data.map(({role,community})=>({
        ...community,
        role
    }))
}   

export const join_community_service = async (user_id, community_id) => {
    return await createCommunityMember(user_id, community_id);
}