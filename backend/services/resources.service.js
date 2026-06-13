import { createPost, deletePostById, getPostsByCommunityId, getPostById } from "../repositories/post.repo.js";
import { addContentToAiQueue } from "../utils/addToQueue.js";
import { AppError } from "../errors/app.error.js";
import uploadFile from "./storage.service.js";

export const upload_resource_service = async ({ user_id, file, title, description, community_id }) => {
    const attachmentData = await uploadFile(file, "Resource")
    if (title) {
        attachmentData.title = title
    }
    const resource = await createPost({ user_id, community_id, content: description, type: "Resource", attachmentData });
    await addContentToAiQueue(resource[0].post_id, 'post');
    return resource
}

export const get_resources_service = async (community_id) => {
    return await getPostsByCommunityId(community_id, "Resource")
}

export const delete_resources_service = async (post_id,user) => {
    const resource = await getPostById(post_id);
    if (!resource) {
        throw new AppError("Resource not found", 404);
    }
    if (user.role !== 'Admin' && user.user_id !== post_id.user_id) {
        throw new AppError("Unauthorized", 403);
    }
    return await deletePostById(post_id);
}