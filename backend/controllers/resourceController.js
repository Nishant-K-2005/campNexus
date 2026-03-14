import prisma from "../config/dbConnection.js";
import { supabase } from "../config/supabaseClient.js"

export const uploadResource = async (req, res) => {
    try {
        const file = req.file
        const { title, description, communityId } = req.body;
        const userId = req.user.user_id
        if (!file) {
            return res.status(404).json({ error: "Resource file not found." })
        }
        const extension = file.originalname.split('.').pop();
        const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`
        const filePath = `resources/${uniqueFileName}`
        const mime = file.mimetype
        let type;

        if (mime.startsWith("image/")) {
            type = "Image";
        }else{
            type = "Doc";
        }

        const { data: uploadData, error: uploadError } = await supabase.storage
            .from("campnexus-resources")
            .upload(filePath, file.buffer, {
                contentType: mime,
                upsert: false
            });

        if (uploadError) {
            console.log("Resource Upload Error: ", uploadError);
            return res.status(500).json({ error: "Resource Upload Error: Something went wrong" });
        }

        const { data: publicUrlData } = supabase.storage
            .from("campnexus-resources")
            .getPublicUrl(filePath)

        const fileUrl = publicUrlData.publicUrl
        const result = await prisma.$transaction(async (tx) => {
            const newResource = await tx.post.create({
                data: {
                    user_id: userId,
                    community_id: communityId,
                    content: description || "",
                    type: "Resource",
                }
            })
            const resourceAttachment = await tx.postAttachment.create({
                data:{
                    post_id: newResource.post_id,
                    type: type,
                    url: fileUrl,
                    title: title || file.originalname,
                }
            })
            return [newResource,resourceAttachment]
        })

        const newResource = result[0]
        const resourceAttachment = result[1]

        return res.status(201).json({
            message:"Resource uploaded successfuly",
            resource: newResource,
            attachment: resourceAttachment,
        })
        
    } catch (err) {
        console.log("Upload Resource Error: ", err);
        return res.status(500).json({ error: "Cannot upload Resource: Internal server error" })
    }
}

export const getResources = async (req,res) => {
    try{
        const communityId = req.params.communityId;
        const resources = await prisma.post.findMany({
            where:{
                community_id:communityId,
                type: "Resource"
            },
            include:{
                attachments: true,
                user:{
                    select:{
                        user_id:true,
                        email:true,
                        full_name:true,
                        role:true,
                    }
                },
            },
            orderBy:{
                created_at:"desc"
            }
        })
        return res.status(200).json({
            message:"Resources fetched successfuly",
            resources:resources
        })
    }catch(err){
        console.log("Get Resources Error: ",err);
        return res.status(500).json({error:"Cannot get Resources: Internal server error"})
    }
}