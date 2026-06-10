import { createPost, getPostsByCommunityId } from "../repositories/post.repo.js";
import { addContentToEmbeddingQueue } from "../utils/addToQueue.js";
import uploadFile from "./storage.service.js";

export const upload_resource_service = async ({user_id, file, title, description, community_id}) => {
    const attachmentData = await uploadFile(file, "Resource")
    if(title){
        attachmentData.title = title
    }
    const resource = await createPost({user_id, community_id, content:description, type:"Resource", attachmentData});
    await addContentToEmbeddingQueue(resource[0].post_id, 'post');
    return resource
}

export const get_resources_service = async (community_id) => {
    return await getPostsByCommunityId(community_id, "Resource")
}
