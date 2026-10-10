import express from "express"
import { createCommunity,getCommunities, joinCommunity, deleteCommunity, getAllCommunities } from "../controllers/communityController.js"
import protect from "../middleware/protect.js"
import validate from "../middleware/validate.js";
import { createCommunitySchema } from "../validations/community.validate.js";

const router = express.Router()

router.post('/communities', validate(createCommunitySchema),protect,createCommunity);
router.get('/communities',protect,getCommunities);
router.get('/communities/all',getAllCommunities);
router.post('/communities/:community_id/members',protect,joinCommunity);
router.delete('/communities/:community_id',protect,deleteCommunity);
export default router;