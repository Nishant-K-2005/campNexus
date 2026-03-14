import express from "express"
import { createCommunity,getCommunities } from "../controllers/communityController.js"
import protect from "../middleware/protect.js"
import authorizeRole from "../middleware/authorizeRole.js"

const router = express.Router()

router.post('/createCommunity',protect,authorizeRole(["Student","Professor","ClubHead"]),createCommunity);
router.get('/getCommunities',protect,getCommunities);

export default router;