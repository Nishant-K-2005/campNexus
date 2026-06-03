import { get_discussions_service, start_discussion_service } from "../services/discussion.service.js";

export const startDiscussion = async (req, res) => {
    try {
        const file = req.file
        const { communityId, content } = req.body;
        
        const [discussion,attachment] = await start_discussion_service({user_id:req.user.user_id, community_id:communityId, content, file})

        return res.status(201).json({
            message: "Discussion created successfully",
            discussion,
            attachment
        })
    } catch (err) {
        console.log("startDiscussion Error: ", err);
        return res.status(500).json({ error: "Cannot start Discussion: Internal Server error." })
    }
}

export const getDiscussions = async (req,res) => {
    try{
        const communityId = req.params.communityId
        const discussions = await get_discussions_service(communityId)
        return res.status(200).json({
            message:"Discussions fetched successfully",
            discussions:discussions,
        })
    }catch(err){
        console.log("getDiscussion Error: ",err)
        return res.status(500).json({error:"Cannot fetch error: Internal Server Error"})
    }
}