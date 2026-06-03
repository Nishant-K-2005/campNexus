import { delay } from "bullmq";
import { createPost, getPost } from "../repositories/post.repo.js";
import { addContentToQueue } from "../utils/addToQueue.js";
import uploadFile from "./storage.service.js";

export const start_discussion_service = async ({user_id, community_id, content, file}) => {
    const attachmentData = await uploadFile(file, "Discussion")
    const discussion = await createPost({user_id, community_id, content, type:"Discussion", attachmentData});
    await addContentToQueue(discussion[0].post_id)
    return discussion
}

export const get_discussions_service = async (community_id) => {
    return await getPost(community_id, "Discussion") 
}