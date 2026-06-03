import prisma from "../config/dbConnection.js";
import { create_community_service, get_community_service, join_community_service } from "../services/community.service.js";

export const createCommunity = async (req, res)=>{
    try{
        const { name, description, tags } = req.body;
        const user = req.user;
        const [newCommunity,newCommunityMember] = await create_community_service({name, description, tags, user_id:user.user_id})
        return res.status(201).json({
            message:"successfully created Community",
            community: newCommunity,
            communityMember: newCommunityMember,
        })

    }catch(err){
        console.log("Create Community Error:",err);
        return res.status(500).json("Cannot create community: Internal Server Error");
    }
}

export const getCommunities = async (req, res) => {
    try{
        const user = req.user;
        const communities = await get_community_service(user.user_id)
        return res.status(200).json({
            message:"Communities fetched successfully",
            communities: communities
        })
    }catch(err){
        console.log("Get Community Error: ",err);
        return res.status(500).json({error:"Cannot get Communities: Internal Server Error"});
    }
}

export const joinCommunity = async (req,res) => {
    try{
        const {communityId} = req.body;
        const communityMember = await join_community_service(req.user.user_id, communityId)
        return res.status(201).json({
            message:"Successfully joined community",
            communityMember:communityMember
        })
    }catch(err){
        console.log("joinCommunity Error: ",err);
        return res.status(500).json({error:"Cannot join community: Internal Server Error"});
    }
}