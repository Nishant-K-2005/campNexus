import prisma from "../config/dbConnection.js";
import { getPostById } from "../repositories/post.repo.js";
import { delete_resources_service, get_resources_service,upload_resource_service } from "../services/resources.service.js";
import {AppError} from '../errors/app.error.js'

export const uploadResource = async (req, res) => {
    try {
        const file = req.file
        const { title, description, communityId } = req.body;
        const user_id = req.user.user_id
        if (!file) {
            return res.status(404).json({ error: "Resource file not found." })
        }
        const [resource,attachment] = await upload_resource_service({user_id, file, title, description, community_id:communityId})
        return res.status(201).json({
            message:"Resource uploaded successfuly",
            resource,
            attachment
        })
    } catch (err) {
        console.log("Upload Resource Error: ", err);
        return res.status(500).json({ error: "Cannot upload Resource: Internal server error" })
    }
}

export const getResources = async (req,res) => {
    try{
        const {communityId} = req.params;
        const resources = await get_resources_service(communityId)
        return res.status(200).json({
            message:"Resources fetched successfuly",
            resources:resources
        })
    }catch(err){
        console.log("Get Resources Error: ",err.message);
        return res.status(500).json({error:"Cannot get Resources: Internal server error"})
    }
}

export const deleteResource = async (req,res) => {
    try{
        const {post_id} = req.params;
        const user = req.user;
        await delete_resources_service(post_id, user);
        return res.sendStatus(204);
    }catch(err){
        console.log(err.message);
        return res.status(err.status || 500).json({error: err.message || "Something went wrong"})
    }
}