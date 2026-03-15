import express from 'express'
import { getDiscussions, startDiscussion } from '../controllers/discussionController.js'
import protect from '../middleware/protect.js'
import { upload } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/startDiscussion', protect,upload.single('file'), startDiscussion);
router.get('/getDiscussions/:communityId',protect,getDiscussions);

export default router;