import express from "express"
import { createCommunity,getCommunities, joinCommunity } from "../controllers/communityController.js"
import protect from "../middleware/protect.js"
import validate from "../middleware/validate.js";
import { createCommunitySchema } from "../validations/community.validate.js";

const router = express.Router()

router.post('/communities', validate(createCommunitySchema),protect,createCommunity);
router.get('/communities',protect,getCommunities);
router.post('/communities/:communityId/members',protect,joinCommunity);

export default router;