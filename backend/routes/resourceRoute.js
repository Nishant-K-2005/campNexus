import express from "express"
import { getResources, uploadResource } from "../controllers/resourceController.js"
import protect from "../middleware/protect.js"
import { upload } from "../middleware/uploadMiddleware.js"

const router = express.Router()

router.post('/uploadResource',protect,upload.single('file'),uploadResource);
router.get('/getResources/:communityId',protect,getResources)

export default router