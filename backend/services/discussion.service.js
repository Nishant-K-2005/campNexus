import { delay } from "bullmq";
import { createPost, getPostsByCommunityId } from "../repositories/post.repo.js";
import { addContentToEmbeddingQueue } from "../utils/addToQueue.js";
import uploadFile from "./storage.service.js";

export const start_discussion_service = async ({user_id, community_id, content, file}) => {
    let attachmentData = null;
    if(file) attachmentData = await uploadFile(file, "Discussion")
    const discussion = await createPost({user_id, community_id, content, type:"Discussion", attachmentData});
    await addContentToEmbeddingQueue(discussion[0].post_id, 'post')
    return discussion
}

export const get_discussions_service = async (community_id) => {
    return await getPostsByCommunityId(community_id, "Discussion") 
}