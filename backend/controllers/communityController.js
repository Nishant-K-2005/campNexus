import { CommunityRole } from "@prisma/client";
import prisma from "../config/dbConnection.js";

export const createCommunity = async (req, res)=>{
    try{
        const { name, description, tags } = req.body;
        const user = req.user;
        const result = await prisma.$transaction(async (tx) => {
            const community = await tx.community.create({
                data:{
                    name,
                    description,
                    tags,
                    created_by_user_id: user.user_id,
                }
            })
            const communityMember = await tx.communityMember.create({
                data:{
                    user_id: user.user_id,
                    community_id: community.community_id,
                    role: "Moderator",
                }
            })
            return [community, communityMember];
        })
        const newCommunity = result[0];
        const newCommunityMember = result[1];
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
        const memberships = await prisma.communityMember.findMany({
            where:{user_id:user.user_id},
            select:{
                role:true,
                community:{
                    select:{
                        community_id: true,
                        name:true,
                        description: true,
                        tags:true,
                    }
                }
            }
        })
        const communities = memberships.map(membership=>({
            community_id:membership.community.community_id,
            name: membership.community.name,
            description: membership.community.description,
            tags: membership.community.tags,
            role: membership.role,
        }))
        return res.status(200).json({
            message:"Communities fetched successfully",
            communities: communities
        })
    }catch(err){
        console.log("Get Community Error: ",err);
        return res.status(500).json({error:"Cannot get Communities: Internal Server Error"});
    }
}