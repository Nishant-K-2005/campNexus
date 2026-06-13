import { createReply, deleteReplyById, getRepliesByPostId, getReplyById } from "../repositories/reply.repo.js"
import {AppError} from '../errors/app.error.js'
import {getPostById} from '../repositories/post.repo.js'

export const send_reply_service = async ({ user_id,
    post_id,
    parent_id,
    content,
}) => {
    let depth = 0;
    if (parent_id) {
        const parent = await getReplyById(parent_id);
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
    return await getRepliesByPostId(post_id, parent_id);
}

export const delete_reply_service = async (reply_id, user) => {
    const reply = await getReplyById(reply_id);
    if(!reply){
        throw new AppError("Reply not found",404);
    }
    const post = await getPostById(reply.post_id);
    if(!post){
        throw new AppError("Post not found",404);
    }
    if(user.role!=='Admin' && user.user_id!==reply.user_id && user.user_id!==post.user_id){
        throw new AppError("Unauthorized",403);
    }
    return await deleteReplyById(reply_id);
}