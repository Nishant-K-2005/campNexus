import { getReplyById } from "../repositories/reply.repo.js";
import { delete_reply_service, get_replies_service, send_reply_service } from "../services/reply.service.js";

export const sendReply = async (req,res) =>{
    try{
        const {postId, content, parent_id} = req.body;
        
        const reply = await send_reply_service({
            user_id: req.user.user_id, 
            post_id: postId, 
            parent_id,
            content,
        })
        return res.status(201).json({
            message:"Reply sent successfully",
            reply: reply
        })
    }catch(err){
        console.log("sendReply error: ",err);
        return res.status(500).json({error:"Cannot send reply: Internal Server Error"})
    }
}

export const getReplies = async (req,res) =>{
    try{
        const {post_id} = req.params
        const {parent_id} = req.query
        const replies = await get_replies_service(post_id,parent_id)
        return res.status(200).json({
            message:"Successfully fetched Replies",
            replies:replies,
        })
    }catch(err){
        console.log("getReplies Error: ",err);
        return res.status(500).json({error:"Error fetching Replies: Internal Server Error"})
    }
} 

export const deleteReply = async (req,res) => {
    try{
        const {reply_id} = req.params;
        const user = req.user;
        await delete_reply_service(reply_id,user);
        return res.sendStatus(204)
    }catch(err){
        console.log(err.message);
        return res.status(err.status || 500).json({error:err.message || "Something went wrong"})
    }

}