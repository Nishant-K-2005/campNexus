import { createCommunity, createCommunityMember, getCommunitiesJoinedByUser } from "../repositories/community.repo.js"
import { addContentToEmbeddingQueue } from "../utils/addToQueue.js";

export const create_community_service = async ({ name, description, tags, user_id }) => {
    const data = await createCommunity({name, description, tags, user_id})
    console.log("community id = ", data[0].community_id);
    await addContentToEmbeddingQueue(data[0].community_id,'community');
    return data;
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
