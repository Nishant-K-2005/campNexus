import prisma from "../config/dbConnection.js";

export const sendReply = async (req,res) =>{
    try{
        const {postId, content} = req.body;
        const reply = await prisma.reply.create({
            data:{
                post_id:postId,
                user_id:req.user.user_id,
                content:content,
            }
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
        const postId = req.params.postId
        const replies = await prisma.reply.findMany({
            where:{
                post_id:postId
            },
            include:{
                user:{
                    select:{
                        user_id:true,
                        email:true,
                        full_name:true,
                        role:true,
                    }
                }
            },
            orderBy:{
                created_at:"desc",
            }
        })
        return res.status(200).json({
            message:"Successfully fetched Replies",
            replies:replies,
        })
    }catch(err){
        console.log("getReplies Error: ",err);
        return res.status(500).json({error:"Error fetching Replies: Internal Server Error"})
    }
} 