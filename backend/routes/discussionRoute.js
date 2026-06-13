import express from 'express'
import { getDiscussions, startDiscussion, deleteDiscussion } from '../controllers/discussionController.js'
import protect from '../middleware/protect.js'
import { upload } from '../middleware/uploadMiddleware.js'

const router = express.Router()

router.post('/discussions', protect,upload.single('file'), startDiscussion);
router.get('/discussions/:communityId',protect,getDiscussions);
router.delete('/discussions/:post_id',protect,deleteDiscussion);

export default router;