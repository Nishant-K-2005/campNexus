import prisma from "../config/dbConnection.js";
import { supabase } from "../config/supabaseClient.js";
import { addContentToQueue } from "../utils/addToQueue.js";

export const startDiscussion = async (req, res) => {
    try {
        const file = req.file
        const { communityId, content } = req.body;

        let attachmentData = null;

        if (file) {
            const extension = file.originalname.split('.').pop();
            const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
            const filePath = `discussions/${uniqueFileName}`
            const mime = file.mimetype
            const type = mime.startsWith("image/") ? "Image" : "Doc";

            const { error: uploadError } = await supabase.storage
                .from("campnexus-resources")
                .upload(filePath, file.buffer, { contentType: mime })
            if (uploadError) {
                throw new Error("Image upload failed")
            }
            const { data: publicUrlData } = supabase.storage
                .from("campnexus-resources")
                .getPublicUrl(filePath)
            
            attachmentData = {
                type: type,
                url: publicUrlData.publicUrl,
                title: file.originalname
            }
        }

        const result = await prisma.$transaction(async (tx) => {
            const discussion = await tx.post.create({
                data: {
                    user_id: req.user.user_id,
                    community_id: communityId,
                    content: content,
                    type: "Discussion",
                }
            })
            let discussionAttachment = null;
            if (attachmentData) {
                discussionAttachment = await tx.postAttachment.create({
                    data: {
                        post_id: discussion.post_id,
                        type: attachmentData.type,
                        url: attachmentData.url,
                        title: attachmentData.title,
                    }
                })
            }
            return [discussion, discussionAttachment]
        })
        
        await addContentToQueue(result[0].post_id) // Adding uploaded discussions to the moderation Queue.
        return res.status(201).json({
            message: "Discussion created successfully",
            discussion: result[0],
            attachment: result[1]
        })

    } catch (err) {
        console.log("startDiscussion Error: ", err);
        return res.status(500).json({ error: "Cannot start Discussion: Internal Server error." })
    }
}


export const getDiscussions = async (req,res) => {
    try{
        const communityId = req.params.communityId
        const discussions = await prisma.post.findMany({
            where:{
                community_id:communityId,
                type:"Discussion",
                status: "Accepted",
            },
            include:{
                attachments:true,
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
            message:"Discussions fetched successfully",
            discussions:discussions,
        })
    }catch(err){
        console.log("getDiscussion Error: ",err)
        return res.status(500).json({error:"Cannot fetch error: Internal Server Error"})
    }
}