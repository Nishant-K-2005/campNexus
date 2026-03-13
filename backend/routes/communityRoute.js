import express from "express"
import { createCommunity,getCommunities } from "../controllers/communityController.js"
import protect from "../middleware/protect.js"

const router = express.Router()

router.post('/createCommunity',protect,createCommunity);
router.get('/getCommunities',protect,getCommunities);

export default router;