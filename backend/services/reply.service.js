import { createReply, getReplies, getReply } from "../repositories/reply.repo.js"

export const send_reply_service = async ({ user_id,
    post_id,
    parent_id,
    content,
}) => {
    let depth = 0;
    if (parent_id) {
        const parent = await getReply(parent_id);
        if(!parent){
            throw new Error("parent reply not found")
        }
        if (parent.depth == 5) {
            throw new Error("Maximum reply depth reached");
        }
        depth = parent.depth+1;
    }
    return await createReply({
        user_id,
        post_id,
        parent_id,
        content,
        depth,
    });
}

export const get_replies_service = async (post_id, parent_id = null) => {
    return await getReplies(post_id, parent_id);
}