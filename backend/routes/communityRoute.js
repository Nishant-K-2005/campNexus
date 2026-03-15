import express from "express"
import { createCommunity,getCommunities, joinCommunity } from "../controllers/communityController.js"
import protect from "../middleware/protect.js"

const router = express.Router()

router.post('/createCommunity',protect,createCommunity);
router.get('/getCommunities',protect,getCommunities);
router.post('/joinCommunity',protect,joinCommunity)

export default router;