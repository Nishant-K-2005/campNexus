import { delay } from "bullmq";
import { createPost, deletePostById, getPostsByCommunityId, getPostById } from "../repositories/post.repo.js";
import { addContentToAiQueue } from "../utils/addToQueue.js";
import uploadFile from "./storage.service.js";
import { AppError } from "../errors/app.error.js";

export const start_discussion_service = async ({ user_id, community_id, content, file }) => {
    let attachmentData = null;
    if (file) attachmentData = await uploadFile(file, "Discussion")
    const discussion = await createPost({ user_id, community_id, content, type: "Discussion", attachmentData });
    await addContentToAiQueue(discussion[0].post_id, 'post')
    return discussion
}

export const get_discussions_service = async (community_id) => {
    return await getPostsByCommunityId(community_id, "Discussion")
}

export const delete_discussion_service = async (post_id, user) => {
    const discussion = await getPostById(post_id);
    if (!discussion) {
        throw new AppError("Discussion not found", 404);
    }
    if (user.role !== 'Admin' && user.user_id !== discussion.user_id) {
        throw new AppError("Unauthorized", 403)
    }
    return await deletePostById(post_id);
}