import { createPost, getPost } from "../repositories/post.repo.js";
import { addContentToQueue } from "../utils/addToQueue.js";
import uploadFile from "./storage.service.js";

export const upload_resource_service = async ({user_id, file, title, description, community_id}) => {
    const attachmentData = await uploadFile(file, "Resource")
    if(title){
        attachmentData.title = title
    }
    const resource = await createPost({user_id, community_id, content:description, type:"Resource", attachmentData});
    await addContentToQueue(resource[0].post_id);
    return resource
}

export const get_resources_service = async (community_id) => {
    return await getPost(community_id, "Resource")
}
