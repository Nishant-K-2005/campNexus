import express from "express"
import { createCommunity,getCommunities, joinCommunity } from "../controllers/communityController.js"
import protect from "../middleware/protect.js"
import validate from "../middleware/validate.js";
import { createCommunitySchema } from "../validations/community.validate.js";

const router = express.Router()

router.post('/createCommunity', validate(createCommunitySchema),protect,createCommunity);
router.get('/getCommunities',protect,getCommunities);
router.post('/joinCommunity',protect,joinCommunity);

export default router;